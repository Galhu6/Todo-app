import { useState } from "react";
import { Tasks } from "./Tasks/Tasks";
import { Lists } from "./Lists/Lists";

export const Dashboard = () => {
    const [lists, setList] = useState([{}]);
    const [selectedListId, setSelectedListId] = useState(0);
    const [tasks, setTasks] = useState([{}]);



    return (
        <div className="flex flex-col items-center gap-6 p-4">
            <Lists onSelectList={(id: number) => setSelectedListId(id)} />
            {selectedListId && <Tasks listId={selectedListId} />}
        </div>
    );
}
