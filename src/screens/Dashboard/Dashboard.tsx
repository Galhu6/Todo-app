import { useState } from "react";
import { Lists } from "../../components/Dashboard/Lists/Lists.js";
import { Tasks } from "../../components/Dashboard/Tasks/Tasks.js";
import { Navbar } from "../../components/Navbar/Navbar.js";
import { Footer } from "../../components/Footer/Footer.js";
import { Chat } from "../../components/Chat/Chat.js";

export const Dashboard = () => {
    const [selectedListId, setSelectedListId] = useState<number | null>(null);
    const [selectedListName, setSelectedListName] = useState("")

    return (
        <>
            <Navbar />
            <div className="flex flex-col gap-4 p-4 md:flex-row">
                <div className="w-full md:w-1/3">
                    <Lists onSelectList={(id: number, name: string) => { setSelectedListId(id); setSelectedListName(name) }} />
                </div>
                <div className="flex-1 w-full">
                    {selectedListId && (
                        <>
                            <h2 className="mb-2 text-lg font-semibold">{selectedListName}</h2>
                            <Tasks listId={selectedListId} />
                        </>
                    )}
                </div>
            </div>
            <Chat />
            <Footer />
        </>
    );
}
