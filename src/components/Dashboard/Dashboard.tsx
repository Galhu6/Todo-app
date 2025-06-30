import { useState } from "react";
import { Lists } from "./Lists/Lists.js";
import { Navbar } from "../Navbar/Navbar.js";
import { Footer } from "../Footer/Footer.js";

export const Dashboard = () => {
    const [selectedListId, setSelectedListId] = useState(0);



    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center gap-6 p-4">
                <Lists onSelectList={(id: number) => setSelectedListId(id)} />
            </div>

            <Footer />
        </>
    );
}
