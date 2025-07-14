import { useState } from "react";
import { createList, editList, deleteList, deletedLists } from "./listsApi.js";
import { useAppContext } from "../../../context/AppContext.js";


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
    const { lists, setLists, selectedListId, setSelectedListId, secondSelectedListId, setSecondSelectedListId, setSelectedListName, setSelectedListGoal } = useAppContext();
    const [draggingId, setDraggingId] = useState<number | null>(null);
    const [subListParent, setSubListParent] = useState<number | null>(null);
    const [trash, setTrash] = useState<List[]>([]);
    const [showTrash, setShowTrash] = useState(false);
    const [newListName, setNewListName] = useState("");
    const [newListGoal, setNewListGoal] = useState("");
    const [subListName, setSubListName] = useState("");
    const [subListGoal, setSubListGoal] = useState("");
    const [editName, setEditName] = useState("");
    const [error, setError] = useState<string | null>(null);



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

    };

    const handleEdit = async () => {
        if (!selectedListId || !editName.trim()) return;
        const updated = await editList(selectedListId, editName)
        setLists(lists.map(list => list.id === selectedListId ? updated : list));
        setEditName("");


    };

    const handleDelete = async (listId: number) => {
        await deleteList(listId);
        setLists(lists.filter(list => list.id !== listId));

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
        setNewListName("");
        setNewListGoal("")
    };

    const handleDragStart = (id: number) => {
        setDraggingId(id);
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
        const updated = await editList(draggingId, undefined, undefined, targetId);
        setLists(lists.filter(l => l.id !== draggingId));
        setDraggingId(null);
    };

    const handleAddSubList = async (parentId: number) => {
        if (!subListName.trim()) return;
        const created = await createList(subListName, subListGoal, parentId);
        setLists([...lists, created]);
        setSubListName("");
        setSubListGoal("");
        setSubListParent(null);
    };

    return (
        <div className="space-y-4 rounded bg-white dark:bg-gray-800/50 p-4 shadow-lg max-w-md w-full">
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
                    }
                }}>
                {Array.isArray(lists) && lists.map((list) => (
                    <li
                        key={list.id}
                        draggable
                        onDragStart={() => handleDragStart(list.id)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDropParent(list.id)}
                        className={`flex justify-between items-center rounded px-2 py-1 transition ${list.id === selectedListId || list.id === secondSelectedListId ? 'font-bold' : ''} hover:bg-gray-100 dark:hover:bg-gray-700/50 `}
                    >
                        <div className="flex justify-between items-center">
                            <span onClick={() => handleSelect(list)} className="cursor-pointer flex-grow">
                                {list.name}
                            </span>
                            <div className="flex gap-1">
                                <button onClick={() => handleDelete(list.id)} className="text-sm hover:text-indigo-400">
                                    🗑
                                </button>
                            </div>
                            {subListParent === list.id && (
                                <div className="flex gap-1 mt-1">
                                    <input type="text"
                                        value={subListName}
                                        onChange={(e) => setSubListName(e.target.value)}
                                        placeholder="Sub list name"
                                        className="flex-grow rounded bg-gray-200 dark:bg-gray-700 p-1 text-sm dark:text-white"
                                    />
                                    <input type="text"
                                        value={subListGoal}
                                        onChange={(e) => setSubListGoal(e.target.value)}
                                        placeholder="Goal"
                                        className="flex-grow rounded bg-gray-200 dark:bg-gray-700 p-1 text-sm dark:text-white"
                                    />
                                    <button onClick={() => handleAddSubList(list.id)} className="rounded bg-indigo-600 px-2 text-white text-sm">Add</button>
                                </div>
                            )}
                        </div>
                    </li>
                ))}
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
            <div className="flex flex-col gap-2">
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

            {selectedListId && (
                <div className="mt-2 flex gap-2">
                    <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="edit list name"
                        className="flex-grow rounded bg-gray-200 dark:bg-gray-700 p-2 dark:text-white focus:outline-none focus:ring focus:ring-indigo-500"
                    />

                    <button
                        onClick={handleEdit}
                        className="rounded bg-indigo-600 px-3 py-2 text-white transition hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500"
                    >
                        Update
                    </button>
                </div>
            )}

            {lists.length === 0 && (
                <h3 className="text-center text-gray-400">create a new list to add tasks!</h3>
            )}

        </div>
    );
}

