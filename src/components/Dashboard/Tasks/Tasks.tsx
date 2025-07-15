import { useState, useEffect, useRef } from "react";
import { createTask, allTasks, deletedTasks, completeTask, editTask, deleteTask, duplicateTask, setTaskPending } from "./tasksApi.js";
import { createList, subLists } from "../Lists/listsApi.js";
import type { MicroTask } from "./MicroTasks.js";
import { MicroTasks } from "./MicroTasks.js";
import type { List } from "../Lists/Lists.js";
import { useAppContext } from "../../../context/AppContext.js";
import { Toolbar } from "../../Toolbar/";

export class Task {
    id!: number;
    list_id!: number;
    description!: string;
    due_date!: Date;
    status?: string;
    created_at?: Date;
    isDeleted?: boolean;

    constructor(
        id: number,
        list_id: number,
        description: string,
        due_date: Date,
        status: string,
        created_at = new Date(),
        isDeleted = false

    ) {
        this.id = id;
        this.list_id = list_id;
        this.description = description;
        this.due_date = due_date;
        this.status = status;
        this.created_at = created_at;
        this.isDeleted = isDeleted;
    }

}

export const Tasks = ({ listId }: { listId: number }) => {
    const { tasksRefreshToken, selectedListId, setSelectedListId, setSelectedListName, setSelectedListGoal, lists, setLists, refreshTasks, draggingListId, setDraggingListId } = useAppContext();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [trash, setTrash] = useState<Task[]>([]);
    const [showTrash, setShowTrash] = useState(false);
    const [subListsState, setSubListsState] = useState<List[]>([])
    const [newDescription, setNewDescription] = useState("");
    const [descriptionEdit, setdescriptionEdit] = useState("");
    const [editTaskId, setEditTaskId] = useState<number | null>(null)
    const [newDueDate, setNewDueDate] = useState<Date>(new Date());
    const [editDueDate, seteditDueDate] = useState<Date>(new Date());
    const [newSubListName, setNewSubListName] = useState("");
    const [draggingTaskId, setDraggingTaskId] = useState<number | null>(null);
    const [microTasksMap, setMicroTasksMap] = useState<Record<number, MicroTask[]>>({});
    const [activeMicroParent, setActiveMicroParent] = useState<number | null>(null);
    const [draggingMicro, setDraggingMicro] = useState<{ taskId: number; micro: MicroTask } | null>(null);
    const [newSubListGoal, setNewSubListGoal] = useState("");
    const editInputRef = useRef<HTMLInputElement>(null);
    const editFormRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            if (!listId) return;
            try {
                const data = await allTasks(listId);
                setTasks(data);
                const sub = await subLists(selectedListId!);
                setSubListsState(sub);
            } catch (error) {
                console.error("error fetching tasks:", error);

            }
        };

        fetchTasks();
    }, [listId, tasksRefreshToken]);

    useEffect(() => {
        setActiveMicroParent(null);
    }, [listId]);

    useEffect(() => {
        if (editTaskId !== null) {
            editInputRef.current?.focus();
        }
    }, [editTaskId]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (editFormRef.current && !editFormRef.current.contains(e.target as Node)) {
                setEditTaskId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        };

    }, [tasks]);

    const formatTimeLeft = (dueDate: Date) => {
        const now = new Date();
        const due = new Date(dueDate);

        const diff = due.getTime() - now.getTime();
        if (diff <= 0) return "Past due";

        const totalMinutes = Math.floor(diff / (1000 * 60));
        const minutes = totalMinutes % 60;
        const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
        const days = Math.floor(totalMinutes / (60 * 24));

        if (days > 0) {
            return `${days}d ${hours}h left`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m  left`
        } else {
            return `${minutes}m left`;
        }
    };


    const startEdit = (task: Task) => {
        setEditTaskId(task.id);
        setdescriptionEdit(task.description);
        seteditDueDate(new Date(task.due_date));
    };

    const handleCreate = async () => {
        if (!newDescription.trim() || !newDueDate) return;
        if (!listId) return;
        const newTask = { description: newDescription, dueDate: newDueDate }
        const created = await createTask(listId, newTask);
        setTasks([...tasks, created])
        setNewDescription("");
        setNewDueDate(new Date());


    };

    const handleSubListCreate = async () => {
        if (!selectedListId || !newSubListName.trim()) return;
        const created = await createList(newSubListName, newSubListGoal, selectedListId);
        setSubListsState([...subListsState, created]);
        setLists([...lists, created]);
        refreshTasks();
        setNewSubListName("");
        setNewSubListGoal("");
    };

    const handleSelectSubList = (list: List) => {
        setSelectedListId(list.id);
        setSelectedListName(list.name);
        setSelectedListGoal(list.overall_goal || "");
    };

    const handleDelete = async (taskId: number) => {
        if (!listId) return;
        await deleteTask(listId, taskId);
        setTasks(tasks.filter((task) => task.id !== taskId));
    };
    const handleEdit = async (taskId: number) => {
        if (!listId) return;
        const updates: any = {}
        if (descriptionEdit.trim()) updates.newDescription = descriptionEdit;
        if (editDueDate) updates.newDueDate = editDueDate;
        if (Object.keys(updates).length === 0) return;

        const updated = await editTask(listId, taskId, updates);
        setTasks(tasks.map(task => task.id === taskId ? updated : task))
        setEditTaskId(null)
    };

    const handleTaskComplete = async (taskId: number) => {
        if (!listId) return;
        const completed = await completeTask(listId, taskId);
        setTasks(tasks.map((task) => (task.id === taskId ? completed : task)))

    };
    const handleTaskPending = async (taskId: number) => {
        if (!listId) return;
        const pending = await setTaskPending(listId, taskId);
        setTasks(tasks.map((task) => (task.id === taskId ? pending : task)))


    }

    const handleTaskDuplicate = async (taskId: number) => {
        if (!listId) return;
        const duplicated = await duplicateTask(listId, taskId);
        setTasks([...tasks, duplicated])

    };

    const openMicroTasks = (taskId: number) => {
        const newId = activeMicroParent === taskId ? null : taskId;
        setActiveMicroParent(newId);
        if (newId !== null && !microTasksMap[newId]) {
            setMicroTasksMap({ ...microTasksMap, [newId]: [] });
        }
    };

    const handleDropReorder = () => {
        if (draggingTaskId === null) return;
        const draggedIndex = tasks.findIndex(t => t.id === draggingTaskId);
        if (draggedIndex === -1) return;
        const updated = [...tasks];
        updated.splice(draggedIndex, 1);
        setTasks(updated);
        setDraggingTaskId(null);
    };

    const handleListDrop = (taskId: number) => {
        if (draggingListId === null) return;
        const list = lists.find(l => l.id === draggingListId);
        if (!list) return;
        const micro: MicroTask = {
            id: Date.now(),
            parentId: taskId,
            description: list.name,
        }
        setMicroTasksMap(prev => ({
            ...prev,
            [taskId]: [...(prev[taskId] || []), micro],
        }));
        setDraggingListId(null);
    };

    const handleMicroDrop = (taskId: number) => {
        if (!draggingMicro) return;
        setMicroTasksMap(prev => {
            const from = prev[draggingMicro.taskId]?.filter(m => m.id !== draggingMicro.micro.id || []);
            const to = [...(prev[taskId] || []), { ...draggingMicro.micro, parentId: taskId }];
            return { ...prev, [draggingMicro.taskId]: from, [taskId]: to };
        });
        setDraggingMicro(null);
    };

    const toggleTrash = async () => {
        if (!showTrash) {
            if (!listId) return;
            const deleted = await deletedTasks(listId);
            setTrash(deleted);

        };
        setShowTrash(!showTrash)
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button onClick={toggleTrash} className="text-xs hover:text-indigo-400">
                    {showTrash ? 'Hide Trash' : "View Trash"}
                </button>
            </div>
            {subListsState.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold mb-1">Sub Lists</h3>
                    <ul className="space-y-1 mb-4">
                        {subListsState.map(list => (
                            <li key={list.id} onClick={() => handleSelectSubList(list)} className="cursor-pointer rounded bg-gray-100 dark:bg-gray-700 px-2py-1 text-sm dark:text-white hover:bg-gary-200 dark:hover:bg-gray-600">
                                {list.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div>
                <ul className="space-y-2 divide-y divide-gray-200 dark:divide-gray-700">
                    {tasks.map((task, idx) => (
                        <li
                            key={task.id}
                            draggable
                            onDragStart={() => setDraggingTaskId(task.id)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => { handleDropReorder(); handleListDrop(task.id); handleMicroDrop(task.id); }}
                            className={` relative group flex items-center gap-2 rounded px-2 py-1 transition hover:shadow ${task.status === 'completed' ? 'bg-green-200 dark:bg-green-900 line-through' : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            <span className="flex-grow text-sm">
                                {task.description} - {task.status === 'completed' ? 'Completed' : formatTimeLeft(task.due_date)}
                            </span>

                            {(task.status === "completed" ? (
                                <button onClick={() => handleTaskPending(task.id)} className="text-xs hover:text-indigo-400">set to pending</button>
                            ) : (
                                <button onClick={() => handleTaskComplete(task.id)} className="text-sx hover:text-indigo-400">complete</button>
                            ))}
                            <button onClick={() => handleTaskDuplicate(task.id)} className="text-sx hover:text-indigo-400">duplicate</button>
                            <Toolbar
                                onAdd={() => openMicroTasks(task.id)}
                                onEdit={() => startEdit(task)}
                                onDelete={() => handleDelete(task.id)}
                            />

                            {(editTaskId === task.id) && (<div ref={editFormRef} className="flex flex-col gap-2 rounded bg-white dark:bg-gray-800 p-4">
                                <input
                                    type="text"
                                    ref={editInputRef}
                                    value={descriptionEdit}
                                    onChange={(e) => setdescriptionEdit(e.target.value)}
                                    placeholder="edit task description"
                                    className="flex-grow rounded bg-gray-200 dark:bg-gray-700 p-2 dark:text-white focus:outline-none focus:ring focus:ring-indigo-500"
                                />
                                <input
                                    type="datetime-local"
                                    onChange={(e) => seteditDueDate(new Date(e.target.value))}
                                    placeholder="edit task dueDate"
                                    className="flex-grow rounded bg-gray-200 dark:bg-gray-700 p-2 dark:text-white focus:outline-none focus:ring focus:ring-indigo-500"
                                />
                                <button onClick={() => handleEdit(task.id)}
                                    className="self-start rounded bg-indigo-600 px-3 py-2 text-white transition hover:bg-indigo-500"
                                >
                                    Submit Changes
                                </button>
                            </div>)}
                            {activeMicroParent === task.id && (
                                <div className="w-full ml-4 mt-2">
                                    <MicroTasks
                                        parentId={task.id}
                                        tasks={microTasksMap[task.id] || []}
                                        setTasks={(t) => setMicroTasksMap({ ...microTasksMap, [task.id]: t })}
                                        onClose={() => setActiveMicroParent(null)}
                                        onDragStart={(mt) => setDraggingMicro({ taskId: task.id, micro: mt })}
                                    />
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {showTrash && (
                <div className="mt-4">
                    <h3 className="text-sm text-gray-400 mb-1">Trash</h3>
                    <ul className="space-y-1 divide-t divide-gray-700">
                        {trash.map(task => (
                            <li key={task.id} className="px-2 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded dark:text-white">
                                {task.description}
                            </li>
                        ))}
                        {trash.length === 0 && <li className="text-xs text-gray-500">No deleted tasks</li>}
                    </ul>
                </div>
            )}
            <div className="flex flex-col items-stretch gap-2 rounded bg-gray-100 dark:bg-gray-900 p-4 sm:flex-row sm:items-end">
                <input
                    type="text"
                    placeholder="Description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="flex-grow rounded bg-gray-200 dark:bg-gray-700 p-2 dark:text-white focus:outline-none focus:ring focus:ring-indigo-500"
                />
                <input
                    type="datetime-local"
                    onChange={(e) => setNewDueDate(new Date(e.target.value))}
                    className="rounded bg-gray-200 dark:bg-gray-700 p-2 dark:text-white focus:outline-none focus:ring focus:ring-indigo-500"
                />
                <button
                    onClick={handleCreate}
                    className="rounded bg-indigo-600 px-3 py-2 text-white transition hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500"
                >
                    Add Task
                </button>
            </div>
            <div className="flex flex-col items-stretch gap-2 rounded bg-gray-100 dark:bg-gray-900 p-4 mt-4 sm:flex-row sm:items-end">
                <input type="text"
                    placeholder="sub list name"
                    value={newSubListName}
                    onChange={(e) => setNewSubListName(e.target.value)}
                    className="flex-grow rounded bg-gray-200 dark:bg-gray-700 p-2 dark:text-white focus:outline-none focus:ring focus:ring-indigo-500" />
                <input type="text"
                    placeholder="sub list goal"
                    value={newSubListGoal}
                    onChange={(e) => setNewSubListGoal(e.target.value)}
                    className="flex-grow rounded bg-gray-200 dark:bg-gray-700 p-2 dark:text-white focus:outline-none focus:ring focus:ring-indigo-500" />
                <button onClick={handleSubListCreate}
                    className="rounded bg-indigo-600 px-3 py-2 text-white transition hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500">
                    Add Sub List
                </button>
            </div>
        </div>
    );
}

