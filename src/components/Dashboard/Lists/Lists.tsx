import { useState, useEffect, useRef } from "react";
import type { JSX } from "react";
import { createList, editList, deleteList, deletedLists, subLists } from "./listsApi.js";
import { allTasks } from "../Tasks/tasksApi.js";
import { useAppContext } from "../../../context/AppContext.js";
import { Toolbar } from "../../Toolbar";

export type List = {
    id: number;
    user_id: number;
    created_at?: Date;
    name: string;
    overall_goal?: string;
    parent_list_id?: number;
    isdeleted?: boolean;
};



export const Lists = () => {
    const { lists, setLists, selectedListId, setSelectedListId, secondSelectedListId, setSecondSelectedListId, setSelectedListName, setSelectedListGoal, refreshTasks, setDraggingListId, tasksRefreshToken, refreshLists } = useAppContext();
    const [draggingId, setDraggingId] = useState<number | null>(null);
    const [subListParent, setSubListParent] = useState<number | null>(null);
    const [trash, setTrash] = useState<List[]>([]);
    const [showTrash, setShowTrash] = useState(false);
    const [expandedMap, setExpandedMap] = useState<Record<number, boolean>>({});
    const [sublistMap, setSubListMap] = useState<Record<number, List[]>>({});
    const [newListName, setNewListName] = useState("");
    const [newListGoal, setNewListGoal] = useState("");
    const [subListName, setSubListName] = useState("");
    const [subListGoal, setSubListGoal] = useState("");
    const [editName, setEditName] = useState("");
    const [editingListId, setEditingListId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [progressMap, setProgressMap] = useState<Record<number, { completed: number; total: number }>>({});
    const [showCreateList, setShowCreateList] = useState(false);
    const createListRef = useRef<HTMLDivElement>(null)
    const subListFormRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ids = new Set<number>();
        lists.forEach(list => ids.add(list.id));
        Object.values(sublistMap).forEach(arr => arr.forEach(sublist => ids.add(sublist.id)));
        ids.forEach(id => {
            allTasks(id).then(tasks => {
                const total = tasks.length;
                const completed = tasks.filter((task: any) => task.status === 'completed').length;
                setProgressMap(prev => ({ ...prev, [id]: { completed, total } }));
            })
                .catch(err => console.error('failed to fetch tasks for progress', err));
        });
    }, [lists, sublistMap, tasksRefreshToken])

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (showCreateList && createListRef.current && !createListRef.current?.contains(e.target as Node)) {
                setShowCreateList(false);
            }
            if (subListParent !== null && subListFormRef.current && !subListFormRef.current.contains(e.target as Node)) {
                setSubListParent(null);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick)
    }, [showCreateList, subListParent]);

    const handleSelect = async (list: List) => {
        if (selectedListId === list.id) {
            if (secondSelectedListId) {
                const second = lists.find(l => l.id === secondSelectedListId);
                setSelectedListId(secondSelectedListId);
                setSelectedListName(second?.name || '');
                setSelectedListGoal(second?.overall_goal || '');
                setSecondSelectedListId(null);
            } else {
                setSelectedListId(null);
                setSelectedListName('')
                setSelectedListGoal('');
            }
            return;
        }
        if (secondSelectedListId === list.id) {
            setSecondSelectedListId(null);
            return;
        }
        if (!selectedListId) {
            setSelectedListId(list.id);
            setSelectedListName(list.name)
            setSelectedListGoal(list.overall_goal || '');
        } else if (!secondSelectedListId) {
            setSecondSelectedListId(list.id);
        } else {
            setSelectedListId(list.id);
            setSelectedListName(list.name);
            setSelectedListGoal(list.overall_goal || '');
        }
        setEditName('')
        toggleExpand(list.id);

    };

    const handleEdit = async () => {
        if (!editingListId || !editName.trim()) return;
        const updated = await editList(editingListId, editName)
        setLists(lists.map(list => list.id === editingListId ? updated : list));
        setEditName("");
        setEditingListId(null);
    };

    const handleDelete = async (listId: number, parentId?: number) => {
        await deleteList(listId);
        if (parentId) {
            setSubListMap(prev => ({ ...prev, [parentId]: (prev[parentId] || []).filter(l => l.id !== listId) }))
        } else {
            setLists(lists.filter(list => list.id !== listId));
            if (selectedListId === listId) {
                setSelectedListId(null);
                setSelectedListName('');
                setSelectedListGoal('');
            }
        }
        setProgressMap(prev => { const { [listId]: _removed, ...rest } = prev; return rest; });
    };

    const toggleTrash = async () => {
        if (!showTrash) {
            const deleted = await deletedLists();
            setTrash(deleted);
        }
        setShowTrash(!showTrash)
    }

    const handleCreate = async () => {
        if (!newListName.trim()) return;
        const created = await createList(newListName, newListGoal);
        setLists([...lists, created]);
        setProgressMap(prev => ({ ...prev, [created.id]: { completed: 0, total: 0 } }));
        setNewListName("");
        setNewListGoal("")
        setShowCreateList(false);
    };

    const handleDragStart = (id: number) => {
        setDraggingId(id);
        setDraggingListId(id);
    };

    const handleDragEnd = () => {
        setDraggingId(null);
        setDraggingListId(null);
    };

    const handleDropReorder = (targetIndex: number) => {
        if (draggingId === null) return;
        const draggedIndex = lists.findIndex(l => l.id === draggingId);
        if (draggedIndex === -1) return;
        const updated = [...lists];
        const [removed] = updated.splice(draggedIndex, 1);
        updated.splice(targetIndex, 0, removed);
        setLists(updated);
        setDraggingId(null);
    };

    const handleDropParent = async (targetId: number) => {
        if (draggingId === null || draggingId === targetId) return;
        await editList(draggingId, undefined, undefined, targetId);
        setLists(lists.filter(l => l.id !== draggingId));
        setDraggingId(null);
    };

    const handleRootDrop = async () => {
        if (draggingId === null) return;
        await editList(draggingId, undefined, undefined, undefined);
        setDraggingId(null);
        refreshLists();
    };

    const handleAddSubList = async (parentId: number) => {
        if (!subListName.trim()) return;
        const created = await createList(subListName, subListGoal, parentId);
        setSubListMap(prev => ({ ...prev, [parentId]: [...(prev[parentId] || []), created] }));
        setExpandedMap(prev => ({ ...prev, [parentId]: true }));
        setProgressMap(prev => ({ ...prev, [created.id]: { completed: 0, total: 0 } }));
        setSubListName("");
        setSubListGoal("");
        setSubListParent(null);
        refreshTasks();
    };

    const toggleExpand = async (id: number) => {
        const newVal = !expandedMap[id];
        setExpandedMap({ ...expandedMap, [id]: newVal });
        if (newVal) {
            setSubListParent(id);
        } else {
            setSubListParent(null);
        }
        if (newVal && !sublistMap[id]) {
            try {
                const subs = await subLists(id);
                setSubListMap(prev => ({ ...prev, [id]: subs }))
            } catch (err) {
                console.error('failed to fetch sub lists', err);
            }
        }
    };

    const renderListItem = (list: List, parentId?: number): JSX.Element => (
        <li key={list.id}
            draggable
            onDragStart={() => handleDragStart(list.id)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => parentId ? undefined : handleDropParent(list.id)}
            onClick={() => toggleExpand(list.id)}
            className={`relative group rounded px-2 py-1 transition hover:bg-gray-300 hover:text-gray-800 drak:hover:bg-gray-700/50 ${list.id === selectedListId || list.id === secondSelectedListId ? 'font-bold' : ''}`}>
            <div className="flex items-center gap-1">
                <button onClick={(e) => { e.stopPropagation(); toggleExpand(list.id); }} className="text-sx w-4">
                    {expandedMap[list.id] ? '▼' : '▶'}
                </button>
                <span onClick={(e) => { e.stopPropagation(); handleSelect(list); }} className="cursor-pointer flex-grow">
                    {list.name}
                </span>
            </div>
            <Toolbar
                onAdd={() => { setSubListParent(list.id); }}
                onEdit={() => { setEditingListId(list.id); }}
                onDelete={() => { handleDelete(list.id, parentId) }}
            />
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 rounded mt-1 overflow-hidden">
                <div
                    className="bg-indigo-500 h-full"
                    style={{ width: `${progressMap[list.id] ? (progressMap[list.id].total ? Math.round((progressMap[list.id].completed / progressMap[list.id].total) * 100) : 0) : 0}%` }}>

                </div>

            </div>
            {subListParent === list.id && (
                <div ref={subListFormRef} className="flex gap-1 mt-1 ml-4">
                    <input type="text"
                        value={subListName}
                        onChange={(e) => setSubListName(e.target.value)}
                        placeholder="Sub list name"
                        className="flex-grow rounded bg-gray-200 dark:bg-gray-700 p-1 text-sm dark:text-white"
                    />
                    <input
                        type="text"
                        value={subListGoal}
                        onChange={(e) => setSubListGoal(e.target.value)}
                        placeholder="Goal"
                        className="flex-grow rounded bg-gray-200 dark:bg-gray-700 p-1 text-sm dark:text-white"
                    />
                    <button onClick={() => handleAddSubList(list.id)} className="rounded bg-indigo-600 px-2 text-white text-sm">Add</button>
                </div>
            )}
            {expandedMap[list.id] && sublistMap[list.id] && (
                <ul className="ml-4 mt-1 space-y-1">
                    {sublistMap[list.id].map(sub => renderListItem(sub, list.id))}
                </ul>
            )}
            {editingListId === list.id && (
                <div className="flex gap-1 mt-1">
                    <input type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Edit name"
                        className="flex-grow rounded bg-gray-200 dark:bg-gray-700 p-1 text-sm dark:text-white"
                    />
                    <button onClick={handleEdit} className="rounded bg-indigo-600 px-2 text-white tex-sm">Update</button>
                </div>
            )}
        </li>
    );

    return (
        <div className="space-y-4 rounded bg-gray-100 dark:bg-gray-800/50 p-4 shadow-lg md:max-w-md w-full mx-auto">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">My Lists</h2>
                <button onClick={toggleTrash} className="text-sm hover:text-indigo-400">
                    {showTrash ? 'Hide Trash' : 'Show Trash'}
                </button>
            </div>
            {error &&
                <p className="text-red-400">{error}</p>
            }

            <ul className="space-y-2"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                    if (draggingId !== null) {
                        handleDropReorder(lists.length);
                        handleRootDrop();
                    }
                }}>
                {Array.isArray(lists) && lists.map(list => renderListItem(list))}
            </ul>
            {
                showTrash && (
                    <div className="mt-4">
                        <h3 className="text-sm text-gray mb-1">
                            Trash
                        </h3>
                        <ul className="space-y-1">
                            {trash.map(list => (
                                <li key={list.id} className="rounded bg-gray-200 dark:bg-gray-700 px-2 text-sm dark:text-white">
                                    {list.name}
                                </li>
                            ))}
                            {trash.length === 0 &&
                                <li className="text-xs text-gray-500">No Deleted Lists</li>
                            }
                        </ul>

                    </div>
                )
            }
            <div className="mt-4">
                <button onClick={() => setShowCreateList(s => !s)} className="rounded bg-indigo-600 px-3 py-2 text-white text-sm mb-2">{showCreateList ? 'Close' : 'New List'}</button>
                {showCreateList && (
                    <div ref={createListRef} className="flex flex-col gap-2 mt-2">
                        <input
                            type="text"
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            placeholder="New list name"
                            className="flex-grow rounded bg-gray-200 dark:bg-gray-700 p-2 dark:text-white focus:outline-none focus:ring focus:ring-indigo-500"
                        />
                        <input type="text" value={newListGoal}
                            onChange={(e) => setNewListGoal(e.target.value)}
                            placeholder="Overall Goal"
                            className="flex-grow rounded bg-gray-200 dark:bg-gray-700 p-2 dark:text-white focus:outline-none focus:ring focus:ring-indigo-500" />
                        <button
                            onClick={handleCreate}
                            className="rounded bg-indigo-600 px-3 py-2 text-white transition hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500"
                        >
                            +
                        </button>
                    </div>
                )}
            </div>

            {lists.length === 0 && (
                <h3 className="text-center text-gray-400">create a new list to add tasks!</h3>
            )}

        </div>
    );
}

