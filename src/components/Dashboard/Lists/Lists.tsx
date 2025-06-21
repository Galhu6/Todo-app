import { useEffect, useState } from "react";
import {
    editList,
    createList,
    deleteList,
    getAllLists,
    getList
}
    from "../../../services/Lists/listService";
import "./Lists.css"

export type List = {
    id: number;
    user_id: number;
    created_at?: Date;
    name: string;
    isdeleted?: boolean;
};



type ListsProps = {
    onSelectList: (id: number) => void;
}
export const Lists = ({ onSelectList }: ListsProps) => {
    const [lists, setLists] = useState<List[]>([]);
    const [selectedListId, setSelectedListId] = useState<number | null>(null);
    const [newListName, setNewListName] = useState("");
    const [editName, setEditName] = useState("");
    const [isDeleted, setIsDeleted] = useState<List["isdeleted"]>();
    const [newList, setNewList] = useState<List>();
    const [listGridMode, setListGridMode] = useState(0);

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const userId = Number(localStorage.getItem("user_id"));
                const allLists = await getAllLists(userId);
                setLists(allLists);
            } catch (error) {
                console.error("Error fetching lists:", error);

            }
        };

        fetchLists();
    }, []);
    useEffect(() => {
        if (!selectedListId && lists.length > 0) {
            const firstId = lists[0].id;
            setSelectedListId(firstId);
            onSelectList(firstId);
        }
    }, [lists]);

    const handleSelect = async (listId: number) => {
        const userId = Number(localStorage.getItem("user_id"));
        setSelectedListId(listId);
        onSelectList(listId);
        getList(listId, userId)


    }

    const handleEdit = async () => {
        if (!selectedListId || !editName.trim()) return;
        const userId = Number(localStorage.getItem("user_id"));
        const updated = await editList(selectedListId, userId, editName);
        setLists(lists.map(list => list.id === selectedListId ? updated : list));
        setSelectedListId(null);
        setEditName("");


    };

    const handleDelete = async (listId: number) => {
        const userId = Number(localStorage.getItem("user_id"));
        await deleteList(listId, userId);
        setLists(lists.filter(list => list.id !== listId));

    };

    const handleCreate = async () => {
        const userId = Number(localStorage.getItem("user_id"));
        if (!newListName.trim()) return;
        const created = await createList(newListName, userId)
        setLists([...lists, created]);
        setNewListName("");
    };



    return (
        <div className="lists-container">
            <h2> My Lists</h2>
            <ul>
                {lists.map((list) => (
                    <li key={list.id} className={list.id === selectedListId ? "selected" : ""}>
                        <span onClick={() => handleSelect(list.id)}>{list.name}</span>
                        <button onClick={() => handleDelete(list.id)}>🗑</button>
                    </li>
                ))}
            </ul>

            <div className="craete-list">
                <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="New list name"
                />
                <button onClick={handleCreate}>+</button>
            </div>

            {selectedListId && (
                <div className="edit-list">
                    <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="edit list name"
                    />

                    <button onClick={handleEdit}>Update</button>

                </div>
            )}
        </div>
    )
}
