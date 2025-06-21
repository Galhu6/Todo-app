import { useState, useEffect } from "react";
import { createTask, allTasks, /*selectedTask,*/ completeTask, editTask, deleteTask } from "./tasksApi";


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
    const [newDueDate, setNewDueDate] = useState<Date | null>(null);

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
        const diff = due.getTime() - now.getTime();

        if (diff <= 0) return "Past due"
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24)

        if (days === 0) {
            return `${hours} hours left`;
        } else {
            return `${days} days, ${hours % 24} hours left`
        }

    };

    const handleCreate = async () => {
        if (!newDescription.trim() || !newDueDate) return;
        const newTask = { description: newDescription, dueDate: newDueDate }
        const created = await createTask(listId, newTask);
        setTasks([...tasks, created])
        setNewDescription("");
        setNewDueDate(null);


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

    return (
        <div className="space-y-4">
            <div>
                <ul className="space-y-2">
                    {tasks.map((task) => (
                        <li key={task.id} className="flex items-center gap-2">
                            <strong className="flex-grow">{task.description} - {formatTimeLeft(task.due_date)}</strong>
                            <button onClick={() => handleEdit(task.id)} className="text-sm hover:text-neon transition-colors">edit</button>
                            <button onClick={() => handleTaskComplete(task.id)} className="text-sm hover:text-neon transition-colors">complete</button>
                            <button onClick={() => {/*duplicate logic */ }} className="text-sm hover:text-neon transition-colors">duplicate</button>
                            <button onClick={() => handleDelete(task.id)} className="text-sm hover:text-red-400 transition-colors">delete</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex items-end gap-2">
                <input
                    type="text"
                    placeholder="Description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="flex-grow px-2 py-1 rounded bg-gray-700 text-gray-100"
                />
                <input
                    type="datetime-local"
                    onChange={(e) => setNewDueDate(new Date(e.target.value))}
                    className="px-2 py-1 rounded bg-gray-700 text-gray-100"
                />
                <button onClick={handleCreate} className="px-3 py-1 rounded bg-neon text-black hover:opacity-80 transition">Add Task</button>
            </div>
            <div>
                a textbox to add a new task description,
                button to add due date and time,
                if due not provided have a popup window to ask for the due time.
            </div>
        </div>
    )
}
