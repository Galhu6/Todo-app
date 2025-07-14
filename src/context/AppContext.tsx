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
    secondSelectedListId: number | null;
    selectedListName: string;
    selectedListGoal: string;
    tasksRefreshToken: number;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    setUser: (user: User) => void;
    setLists: React.Dispatch<React.SetStateAction<List[]>>;
    setSelectedListId: React.Dispatch<React.SetStateAction<number | null>>;
    setSecondSelectedListId: React.Dispatch<React.SetStateAction<number | null>>;
    setSelectedListName: React.Dispatch<React.SetStateAction<string>>;
    setSelectedListGoal: React.Dispatch<React.SetStateAction<string>>;
    refreshLists: () => Promise<void>;
    refreshTasks: () => void;
    logout: () => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>(null);
    const [lists, setLists] = useState<List[]>([]);
    const [selectedListId, setSelectedListId] = useState<number | null>(null);
    const [secondSelectedListId, setSecondSelectedListId] = useState<number | null>(null);
    const [selectedListName, setSelectedListName] = useState("");
    const [selectedListGoal, setSelectedListGoal] = useState("")
    const [tasksRefreshToken, setTaskRefreshToken] = useState(0);
    const [theme, setTheme] = useState<'light' | 'dark'>(() =>
        (localStorage.getItem('theme') as 'light' | 'dark' || 'dark')
    );

    const refreshTasks = () => setTaskRefreshToken((t) => t + 1);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'd' || e.key === 'D') {
                toggleTheme();
            }
        };
        window.addEventListener('keydown', handleKey);
    }, [toggleTheme]);
    const refreshLists = async () => {
        try {
            const fetched = await allLists();
            setLists(fetched);
        } catch {
            setLists([])
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
    };

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
        refreshLists();
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
        secondSelectedListId,
        selectedListName,
        selectedListGoal,
        tasksRefreshToken,
        theme,
        toggleTheme,
        setUser,
        setLists,
        setSelectedListId,
        setSecondSelectedListId,
        setSelectedListName,
        setSelectedListGoal,
        refreshLists,
        refreshTasks,
        logout
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>

};

export const useAppContext = () => {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useAppContext must be used within AppProvider');
    return ctx;
};