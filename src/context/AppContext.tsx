import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import type { List } from "../components/Dashboard/Lists/Lists";
import { allLists } from "../components/Dashboard/Lists/listsApi";

export type User = { id: number; name: string } | null;

interface AppContextValue {
    user: User;
    lists: List[];
    selectedListId: number | null;
    selectedListName: string;
    selectedListGoal: string;
    setLists: React.Dispatch<React.SetStateAction<List[]>>;
    setSelectedListId: React.Dispatch<React.SetStateAction<number | null>>;
    setSelectedListName: React.Dispatch<React.SetStateAction<string>>;
    setSelectedListGoal: React.Dispatch<React.SetStateAction<string>>;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>(null);
    const [lists, setLists] = useState<List[]>([]);
    const [selectedListId, setSelectedListId] = useState<number | null>(null);
    const [selectedListName, setSelectedListName] = useState("");
    const [selectedListGoal, setSelectedListGoal] = useState("")

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                const id = decoded.id || decoded.userId || decoded.user?.id;
                const name = decoded.name || decoded.username;
                if (id && name) {
                    setUser({ id: Number(id), name });
                }
            } catch {
                setUser(null);
            }
        }
    }, []);

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const fetched = await allLists();
                setLists(fetched);
            } catch {
                setLists([]);
            }
        };
        fetchLists();
    }, []);

    useEffect(() => {
        if (!selectedListId && lists.length > 0) {
            setSelectedListId(lists[0].id);
            setSelectedListName(lists[0].name);
            setSelectedListGoal(lists[0].overall_goal || "");
        }
    }, [lists]);

    const value: AppContextValue = {
        user,
        lists,
        selectedListId,
        selectedListName,
        selectedListGoal,
        setLists,
        setSelectedListId,
        setSelectedListName,
        setSelectedListGoal
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>

};

export const useAppContext = () => {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useAppContext must be used within AppProvider');
    return ctx;
};