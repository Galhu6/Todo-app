import { useState, useEffect } from "react";
import { createTask, allTasks, /*selectedTask,*/ completeTask, editTask, deleteTask, duplicateTask } from "./tasksApi.js";


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

type TasksProps = {
    listId: number;
};

export const Tasks = ({ listId }: TasksProps) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newDescription, setNewDescription] = useState("");
    const [showEdit, setShowEdit] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<number>(0);
    const [newDueDate, setNewDueDate] = useState<Date>(new Date());

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await allTasks(listId)
                setTasks(data);
            } catch (error) {
                console.error("error fetching tasks:", error);

            }
        }

        fetchTasks();
    }, [listId]);

    const formatTimeLeft = (dueDate: Date) => {

        const now = new Date();
        const due = new Date(dueDate);

        const localNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
        const localDue = new Date(due.getTime() + due.getTimezoneOffset() * 60000);

        const diff = localDue.getTime() - localNow.getTime();
        console.log("local : ", new Date().toString());
        console.log("utc: ", new Date().toUTCString());


        if (diff <= 0) return "Past due";

        const totalMinutes = Math.floor(diff / (1000 * 60))
        const minutes = totalMinutes % 60
        const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
        const days = Math.floor(totalMinutes / (60 * 24));


        if (days > 0) {
            return `${days}d ${hours}h left`;
        } else if (hours > 0) {
            return `${hours}h, ${minutes}m  left`
        } else {
            return `${minutes}m left`;
        }

    };

    const handleCreate = async () => {
        if (!newDescription.trim() || !newDueDate) return;
        const newTask = { description: newDescription, dueDate: newDueDate }
        const created = await createTask(listId, newTask);
        setTasks([...tasks, created])
        setNewDescription("");
        setNewDueDate(new Date());


    };
    const handleDelete = async (taskId: number) => {
        await deleteTask(listId, taskId);
        setTasks(tasks.filter((task) => task.id !== taskId));
    };
    const handleEdit = async (taskId: number) => {
        if (!newDescription.trim() && !newDueDate) return;
        const updates = { newDescription, newDueDate };
        const updated = await editTask(listId, taskId, updates);
        setTasks(tasks.map(task => task.id === taskId ? updated : task))
    };

    const handleTaskComplete = async (taskId: number) => {
        const completed = await completeTask(listId, taskId);
        setTasks(tasks.map((task) => (task.id === taskId ? completed : task)))

    };

    const handleTaskDuplicate = async (taskId: number) => {
        const duplicated = await duplicateTask(listId, taskId);
        setTasks([...tasks, duplicated])

    }

    return (
        <div className="space-y-4">
            <div>
                <ul className="space-y-2">
                    {tasks.map((task) => (
                        <li
                            key={task.id}
                            onClick={() => setSelectedTaskId(task.id)}
                            className="flex items-center gap-2 rounded bg-gray-800 px-2 py-1 transition hover:shadow"
                        >
                            {(isCompleted) && (<span className="flex-grow text-sm">
                                {task.description} - {formatTimeLeft(task.due_date)}
                            </span>)}
                            <button onClick={() => setShowEdit(true)} className="text-xs hover:text-indigo-400">
                                edit
                            </button>

                            <button onClick={() => handleTaskComplete(task.id)} className="text-xs hover:text-indigo-400">
                                complete
                            </button>
                            <button onClick={() => handleTaskDuplicate(task.id)} className="text-xs hover:text-indigo-400">
                                duplicate
                            </button>
                            <button onClick={() => handleDelete(task.id)} className="text-xs hover:text-red-400">
                                delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            {(showEdit) && <div className="editing inputs">
                <input
                    type="text"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="edit task description"
                    className="flex-grow rounded bg-gray-700 p-2 text-white focus:outline-none focus:ring focus:ring-indigo-500"
                />
                <input
                    type="date"
                    value={newDueDate.toISOString().split("T")[0]}
                    onChange={(e) => setNewDueDate(new Date(e.target.value))}
                    placeholder="edit task description"
                    className="flex-grow rounded bg-gray-700 p-2 text-white focus:outline-none focus:ring focus:ring-indigo-500"
                />
                <button onClick={() => handleEdit(selectedTaskId)}>Submit Changes</button>

            </div>}
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-end">
                <input
                    type="text"
                    placeholder="Description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="flex-grow rounded bg-gray-700 p-2 text-white focus:outline-none focus:ring focus:ring-indigo-500"
                />
                <input
                    type="datetime-local"
                    onChange={(e) => setNewDueDate(new Date(e.target.value))}
                    className="rounded bg-gray-700 p-2 text-white focus:outline-none focus:ring focus:ring-indigo-500"
                />
                <button
                    onClick={handleCreate}
                    className="rounded bg-indigo-600 px-3 py-2 text-white transition hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500"
                >
                    Add Task
                </button>
            </div>
        </div>
    );
}

