import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { List } from "../components/Dashboard/Lists/Lists";
import { allLists } from "../components/Dashboard/Lists/listsApi";

export type User = {
  id: number;
  name: string;
  whatsappNumber?: string | null;
} | null;

interface AppContextValue {
  user: User;
  lists: List[];
  selectedListId: number | null;
  secondSelectedListId: number | null;
  selectedListName: string;
  selectedListGoal: string;
  tasksRefreshToken: number;
  theme: "light" | "dark";
  draggingListId: number | null;
  toggleTheme: () => void;
  setUser: (user: User) => void;
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
  setSelectedListId: React.Dispatch<React.SetStateAction<number | null>>;
  setSecondSelectedListId: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedListName: React.Dispatch<React.SetStateAction<string>>;
  setSelectedListGoal: React.Dispatch<React.SetStateAction<string>>;
  refreshLists: () => Promise<void>;
  refreshTasks: () => void;
  setDraggingListId: React.Dispatch<React.SetStateAction<number | null>>;
  logout: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [lists, setLists] = useState<List[]>([]);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [secondSelectedListId, setSecondSelectedListId] = useState<
    number | null
  >(null);
  const [selectedListName, setSelectedListName] = useState("");
  const [selectedListGoal, setSelectedListGoal] = useState("");
  const [tasksRefreshToken, setTaskRefreshToken] = useState(0);
  const [draggingListId, setDraggingListId] = useState<number | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("theme") as "light" | "dark") || "dark"
  );
  const server = import.meta.env.VITE_SERVER_URL;

  const refreshTasks = () => setTaskRefreshToken((t) => t + 1);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === "light" ? "dark" : "light")),
    []
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const active = document.activeElement as HTMLElement | null;
      const isInput =
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          active.getAttribute("contenteditable") === "true");
      if ((e.key === "d" || e.key === "D") && !isInput) {
        toggleTheme();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [toggleTheme]);
  const refreshLists = async () => {
    try {
      const fetched = await allLists();
      setLists(fetched);
    } catch {
      setLists([]);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userId");
    fetch(`${server}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => {});
  };

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch(`${server}/api/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user?.id && data.user?.name) {
            setUser({
              id: data.user.id,
              name: data.user.name,
              whatsappNumber: data.user.whatsappNumber,
            });
            localStorage.setItem("userId", String(data.user.id));
          }
        }
      } catch {
        setUser(null);
      }
    };
    init();
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
    draggingListId,
    toggleTheme,
    setUser,
    setLists,
    setSelectedListId,
    setSecondSelectedListId,
    setSelectedListName,
    setSelectedListGoal,
    refreshLists,
    refreshTasks,
    setDraggingListId,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
};
