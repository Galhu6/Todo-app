import { useState, useEffect } from "react";
import { Tasks } from "./Tasks/Tasks";
import { Lists } from "./Lists/Lists";

export const Dashboard = () => {
    const [lists, setList] = useState([{}]);
    const [selectedListId, setSelectedListId] = useState(0);
    const [tasks, setTasks] = useState([{}]);



    return (
        <>
            <Lists onSelectList={(id: number) => setSelectedListId(id)} />
            {selectedListId && <Tasks listId={selectedListId} />}
        </>
    )
}
