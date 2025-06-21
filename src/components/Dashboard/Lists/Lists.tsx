import { useEffect, useState } from "react";
import { createList, editList, deleteList, selectedList, allLists } from "./listsApi";
import "./Lists.css"
import { Tasks } from "../Tasks/Tasks";

export type List = {
    id: number;
    user_id: number;
    created_at?: Date;
    name: string;
    isdeleted?: boolean;
};



type ListsProps = {
    onSelectList: (id: number) => void;
};

export const Lists = ({ onSelectList }: ListsProps) => {
    const [lists, setLists] = useState<List[]>([]);
    const [selectedListId, setSelectedListId] = useState<number | null>(null);
    const [newListName, setNewListName] = useState("");
    const [editName, setEditName] = useState("");
    const [selectedListDetails, setSelectedListDetails] = useState<List | null>(null)


    // const [isDeleted, setIsDeleted] = useState<List["isdeleted"]>();
    // const [newList, setNewList] = useState<List>();
    // const [listGridMode, setListGridMode] = useState(0);


    // fetch all lists once on mount
    useEffect(() => {
        const fetchAllLists = async () => {
            const fetchedLists = await allLists();
            setLists(fetchedLists)
        };

        fetchAllLists();

    }, []);

    // automatically select the first list if non is selected
    useEffect(() => {
        if (!selectedListId && lists.length > 0) {
            const firstId = lists[0].id;
            setSelectedListId(firstId);
            onSelectList(firstId);
        }
    }, [lists]);



    const handleSelect = async (listId: number) => {
        setSelectedListId(listId);
        setEditName("");
        onSelectList(listId);
        const list = await selectedList(listId);
        setSelectedListDetails(list)

    };

    const handleEdit = async () => {
        if (!selectedListId || !editName.trim()) return;
        const updated = await editList(selectedListId, editName)
        setLists(lists.map(list => list.id === selectedListId ? updated : list));
        setSelectedListDetails(updated);
        setEditName("");


    };

    const handleDelete = async (listId: number) => {
        await deleteList(listId);
        setLists(lists.filter(list => list.id !== listId));

    };

    const handleCreate = async () => {
        if (!newListName.trim()) return;
        const created = await createList(newListName);
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

            <div className="create-list">
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

            {lists.length === 0 && (
                <h3>create a new list to add tasks!</h3>
            )}

            {lists.length > 0 && selectedListId && (
                <div className="openList">
                    <h2>{selectedListDetails?.name}</h2>
                    <Tasks listId={selectedListId!} />
                </div>
            )}
        </div>
    )
}
