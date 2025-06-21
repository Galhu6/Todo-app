import { useEffect, useState } from "react";
import { createList, editList, deleteList, selectedList, allLists } from "./listsApi";

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
        <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg shadow-md backdrop-blur-md">
            <h2 className="text-xl font-semibold"> My Lists</h2>
            <ul className="list-none space-y-2">
                {lists.map((list) => (
                    <li key={list.id} className={`flex items-center justify-between ${list.id === selectedListId ? 'font-bold text-neon' : ''}`}>
                        <span onClick={() => handleSelect(list.id)} className="cursor-pointer">{list.name}</span>
                        <button onClick={() => handleDelete(list.id)} className="hover:text-red-400 transition-colors">🗑</button>
                    </li>
                ))}
            </ul>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="New list name"
                    className="flex-grow px-2 py-1 rounded bg-gray-700 text-gray-100"
                />
                <button onClick={handleCreate} className="px-3 py-1 rounded bg-neon text-black hover:opacity-80 transition">+</button>
            </div>

            {selectedListId && (
                <div className="flex gap-2 mt-2">
                    <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="edit list name"
                        className="flex-grow px-2 py-1 rounded bg-gray-700 text-gray-100"
                    />

                    <button onClick={handleEdit} className="px-3 py-1 rounded bg-neon text-black hover:opacity-80 transition">Update</button>

                </div>

            )}

            {lists.length === 0 && (
                <h3 className="text-center">create a new list to add tasks!</h3>
            )}

            {lists.length > 0 && selectedListId && (
                <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-2">{selectedListDetails?.name}</h2>
                    <Tasks listId={selectedListId!} />
                </div>
            )}
        </div>
    )
}
