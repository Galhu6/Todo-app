import { useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import { createMicroTask, deleteMicroTask, updateMicroTask } from "../../../services/MicroTasks/microTaskService";
import type { JSX } from "react";

export type MicroTask = {
    id: number;
    parentId: number;
    description: string;
    completed?: boolean;
    subTasks?: MicroTask[];
};

interface MicroTasksProps {
    parentId: number;
    tasks: MicroTask[];
    setTasks: (t: MicroTask[]) => void;
    onClose: () => void;
    onDragStart?: (task: MicroTask) => void;
}

export const MicroTasks = ({ parentId, tasks, setTasks, onClose, onDragStart }: MicroTasksProps) => {
    const { lists, draggingListId, setDraggingListId } = useAppContext();
    const [newDesc, setNewDesc] = useState("");
    const [expandedMap, setExpandedMap] = useState<Record<number, boolean>>({});
    const [subInputMap, setSubInputMap] = useState<Record<number, string>>({});
    const addTask = async () => {
        if (!newDesc.trim()) return;
        const created = await createMicroTask(newDesc, parentId);
        setTasks([...tasks, created]);
        setNewDesc("");
    };

    const addSubTask = (id: number) => {
        const desc = subInputMap[id];
        if (!desc?.trim()) return;
        setTasks(tasks.map(t => t.id === id ? { ...t, subTasks: [...(t.subTasks || []), { id: Date.now(), parentId: id, description: desc, subTasks: [] }] } : t));
        setSubInputMap(prev => ({ ...prev, [id]: "" }));
        setExpandedMap(prev => ({ ...prev, [id]: true }));
    };

    const toggle = async (id: number) => {
        const current = tasks.find(t => t.id === id);
        if (!current) return;
        const updated = await updateMicroTask(id, { completed: !current.completed });
        setTasks(tasks.map(t => t.id === id ? updated : t));
    };

    const remove = async (id: number) => {
        await deleteMicroTask(id);
        setTasks(tasks.filter(t => t.id !== id));
    };

    const handleListDrop = (targetId?: number) => {
        if (draggingListId === null) return;
        const list = lists.find(l => l.id === draggingListId);
        if (!list) return;
        const micro: MicroTask = { id: Date.now(), parentId: targetId ?? parentId, description: list.name, subTasks: [] };
        if (targetId) {
            setTasks(tasks.map(t => t.id === targetId ? { ...t, subTasks: [...(t.subTasks || []), micro] } : t))
        } else {
            setTasks([...tasks, micro]);
        }
        setDraggingListId(null);

    };

    const updateSubTasks = (id: number, sub: MicroTask[]) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, subTasks: sub } : t));
    };

    const renderItem = (t: MicroTask): JSX.Element => (
        <li
            key={t.id}
            draggable
            onDragStart={() => onDragStart?.(t)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleListDrop(t.id)}
            className="space-y-1 rounded bg-white dark:bg-gray-700 p-1"
        >
            <div className="flex items-center gap-1">
                <button onClick={() => setExpandedMap(prev => ({ ...prev, [t.id]: !prev[t.id] }))}>
                    {expandedMap[t.id] ? '▼' : '▶'}
                </button>
                <input type="checkbox" checked={!!t.completed} onChange={() => toggle(t.id)} />
                <span className={`flex-grow text-sm ${t.completed ? 'line-through' : ''}`}>{t.description}</span>
                <button onClick={() => remove(t.id)} className="text-sx text-red-400">X</button>
            </div>
            {expandedMap[t.id] && (
                <div className="ml-4 space-y-1">
                    <MicroTasks
                        parentId={t.id}
                        tasks={t.subTasks || []}
                        setTasks={(sub) => updateSubTasks(t.id, sub)}
                        onClose={() => setExpandedMap(prev => ({ ...prev, [t.id]: false }))}
                        onDragStart={onDragStart}
                    />
                </div>
            )}
            <div className="flex gap-1 mt-1 ml-4">
                <input type="text"
                    value={subInputMap[t.id] || ''}
                    onChange={(e) => setSubInputMap(prev => ({ ...prev, [t.id]: e.target.value }))}
                    placeholder="Sub micro task"
                    className="flex-grow rounded bg-gray-200 dark:bg-gray-700 p-1 text-sm dark:text-white focus:outline-none focus:eing focus:ring-indigo-500"
                />
                <button onClick={() => addSubTask(t.id)} className="rounded bg-indigo-600 px-2 text-white text-xs">
                    Add
                </button>
            </div>
        </li>
    )
    return (
        <div className="space-y-2 rounded bg-gray-100 dark:bg-gray-800 p-2" onDragOver={(e) => e.preventDefault()} onDrop={() => handleListDrop()}>
            <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-sm">Subtasks</span>
                <button onClick={onClose} className="text-xs hover:text-red-400">X</button>
            </div>
            <ul className="space-y-1">
                {tasks.map(renderItem)}
            </ul>
            <div className="flex gap-1">
                <input type="text"
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    placeholder="New micro task"
                    className="flex-grow rounded bg-gray-200 dark:bg-gray-700 p-1 text-sm dark:text-white focus:outline-none focus:ring focus:ring-indigo-500" />
                <button onClick={addTask} className="rounded bg-indigo-600 px-2 text-white text-sm hover:bg-indigo-500">Add</button>
            </div>
        </div>
    );
};