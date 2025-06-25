import { useState } from "react";
import { Tasks } from "./Tasks/Tasks.js";
import { Lists } from "./Lists/Lists.js";

export const Dashboard = () => {
    const [selectedListId, setSelectedListId] = useState(0);



    return (
        <div className="flex flex-col items-center gap-6 p-4">
            <Lists onSelectList={(id: number) => setSelectedListId(id)} />
            {selectedListId && <Tasks listId={selectedListId} />}
        </div>
    );
}
