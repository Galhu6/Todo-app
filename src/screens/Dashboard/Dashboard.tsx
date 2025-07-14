import { Lists } from "../../components/Dashboard/Lists/Lists.js";
import { Tasks } from "../../components/Dashboard/Tasks/Tasks.js";
import { Navbar } from "../../components/Navbar/Navbar.js";
import { Footer } from "../../components/Footer/Footer.js";
import { Chat } from "../../components/Chat/Chat.js";
import { useAppContext } from "../../context/AppContext.js";

export const Dashboard = () => {
    const { selectedListId, secondSelectedListId, selectedListName, selectedListGoal, lists } = useAppContext();
    const secondList = lists.find(l => l.id === secondSelectedListId);

    return (
        <>
            <Navbar />
            <div className="flex flex-col gap-4 p-4 md:flex-row">
                <div className="w-full md:w-1/3">
                    <Lists />
                </div>
                <div className="flex-1 w-full space-y-8">
                    {selectedListId && (
                        <div>
                            <h2 className="mb-2 text-lg font-semibold">{selectedListName}</h2>
                            {selectedListGoal && (
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-300">Goal: {selectedListGoal}</p>
                            )}
                            <Tasks listId={selectedListId} />
                        </div>
                    )}
                    {secondList && (
                        <div>
                            <h2 className="mb-2 text-lg font-semibold">{secondList.name}</h2>
                            {secondList.overall_goal && (
                                <p className="mb-2 text-sm text-gray-300"> Goal: {secondList.overall_goal}</p>
                            )}
                            <Tasks listId={secondList.id} />
                        </div>
                    )}
                </div>
            </div>
            <Chat />
            <Footer />
        </>
    );
}
