import { Lists } from "../../components/Dashboard/Lists/Lists.js";
import { Tasks } from "../../components/Dashboard/Tasks/Tasks.js";
import { Navbar } from "../../components/Navbar/Navbar.js";
import { Footer } from "../../components/Footer/Footer.js";
import { Chat } from "../../components/Chat/Chat.js";
import {HabitTracker } from "../../components/HabitTracker/index.js";
import { useAppContext } from "../../context/AppContext.js";
import { useState } from "react";

export const Dashboard = () => {
    const { selectedListId, secondSelectedListId, selectedListName, selectedListGoal, lists } = useAppContext();
    const secondList = lists.find(l => l.id === secondSelectedListId);
    const [collapsed, setCollapsed] = useState<Set<number>>(new Set());

    const toggleCollapse = (id: number) => {
        setCollapsed(prev => {
            const n = new Set(prev);
            if (n.has(id)) n.delete(id); else n.add(id);
            return n;
        });
    };

    return (
        <>
            <Navbar />
            <div className="mx-auto max-w-6xl p-4 grid gap-4 md:grid-cols-3">
                <aside className="md:col-span-1">
                    <Lists />
                </aside>
                <main className="md-col-span-2 space-y-8">
                    {selectedListId && (
                        <div>
                            <h2 onClick={() => toggleCollapse(selectedListId)} className="mb-2 text-lg font-semibold cursor-pointer">
                                {selectedListName}
                            </h2>
                            {!collapsed.has(selectedListId) && (
                                <>
                                    {selectedListGoal && (
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-300">Goal: {selectedListGoal}</p>
                                    )}
                                    <Tasks listId={selectedListId} />
                                    <HabitTracker />
                                </>
                            )}
                        </div>
                    )}
                    {secondList && (
                        <div>
                            <h2 onClick={() => toggleCollapse(secondList.id)} className="mb-2 text-lg font-semibold cursor-pointer">
                                {secondList.name}
                            </h2>
                            {!collapsed.has(secondList.id) && (
                                <>
                                    {secondList.overall_goal && (
                                        <p className="mb-2 text-sm text-gray-300"> Goal: {secondList.overall_goal}</p>
                                    )}
                                    <Tasks listId={secondList.id} />
                                </>
                            )}
                        </div>
                    )}
                </main>
            </div>
            <Chat />
            <Footer />
        </>
    );
}
