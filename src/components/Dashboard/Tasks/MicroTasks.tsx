import { useState } from "react";

export type MicroTask = {
    id: number;
    parentId: number;
    description: string;
    completed?: boolean;
};

export const MicroTasks = ({ parentId, tasks, setTasks, onClose }: {
    parentId: number;
    tasks: MicroTask[];
    setTasks: (t: MicroTask[]) => void;
    onClose: () => void;
}) => {
    const [newDesc, setNewDesc] = useState("");
    const addTask = () => {
        if (!newDesc.trim()) return;
        const t: MicroTask = { id: Date.now(), parentId, description: newDesc };
        setTasks([...tasks, t]);
        setNewDesc("");
    };

    const toggle = (id: number) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const remove = (id: number) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    return (
        <div className="space-y-2">
            <button onClick={onClose} className="text-xs mb-2">close</button>
            <ul className="space-y-1">
                {tasks.map(t => (
                    <li key={t.id} className="flex justify-between bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        <span className={`flex-grow text-sm ${t.completed ? 'line-through' : ''}`}>{t.description}</span>
                        <button onClick={() => toggle(t.id)} className="text-sx">{t.completed ? 'undo' : 'done'}</button>
                        <button onClick={() => remove(t.id)} className="text-xs text-red-400">X</button>
                    </li>
                ))}
            </ul>
            <div className="flex gap-1">
                <input type="text"
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    className="flex-grow rounded bg-gray-200 dark:bg-gray-700 p-1 text-sm dark:text-white" />
                <button onClick={addTask} className="rounded bg-indigo-600 px-2 text-white text-sm">Add</button>
            </div>
        </div>
    );
};