import { useState, useEffect} from "react";

type Habit = {
    id: number;
    name: string;
    dates: string[];// yyyy-mm-dd
};

export const HabitTracker = () => {
    const [habits, setHabits] = useState<Habit[]>(() => {
        const stored = localStorage.getItem('habits');
        return stored ? JSON.parse(stored) as Habit[] : [];
    });
    const [newHabit, setNewHabit] = useState("");

    useEffect(() => {
        localStorage.setItem('habits', JSON.stringify(habits));
    }, [habits]);

    const toggleToday = (id: number) => {
        const today = new Date().toISOString().slice(0,10);
        setHabits(habits.map(h => {
            if (h.id !== id) return h;
            const has = h.dates.includes(today);
            return {...h, dates: has ? h.dates.filter(d => d !== today) : [...h.dates, today] };
        }));
    };

    const addHabit = () => {
        if (!newHabit.trim()) return;
        setHabits([...habits, {id: Date.now(), name: newHabit.trim(), dates: [] }]);
        setNewHabit("");
    };

    const streak = (dates: string[]) => {
        const sorted = dates.slice().sort();
        let count = 0;
        const day = new Date();
        while (sorted.includes(day.toISOString().slice(0,10))) {
            count++;
            day.setDate(day.getDate() - 1);
        }
        return count;
    };

    return (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
            <h3 className="font-semibold mb-2">Habit Tracker</h3>
            <div className="flex gap-2 mb-2">
                <input value={newHabit} onChange={e => setNewHabit(e.target.value)} placeholder="New habit" className="flex-grow rounded p-1" />
                <button onClick={addHabit} className="rounded bg-indigo-600 text-white px-2">Add</button>
            </div>
            <ul className="space-y-1">
                {habits.map(h => (
                    <li key={h.id} className="flex justify-between items-center bg-white dark:bg-gray-700 p-2 rounded">
                        <span>{h.name} (streak: {streak(h.dates)})</span>
                        <button onClick={() => toggleToday(h.id)} className="rounded px-2 py-1 text-sm bg-indigo-500 text-white">
                            {h.dates.includes(new Date().toISOString().slice(0,10)) ? "Done" : "Mark"}
                        </button> 
                    </li>
                ))}
            </ul>
        </div>
    );
};