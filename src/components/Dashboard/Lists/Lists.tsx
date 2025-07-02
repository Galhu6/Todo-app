import { useState } from "react";
import { createList, editList, deleteList, deletedLists } from "./listsApi.js";
import { useAppContext } from "../../../context/AppContext.js";


export type List = {
    id: number;
    user_id: number;
    created_at?: Date;
    name: string;
    isdeleted?: boolean;
};



export const Lists = () => {
    const { lists, setLists, selectedListId, setSelectedListId, setSelectedListName } = useAppContext()
    const [trash, setTrash] = useState<List[]>([]);
    const [showTrash, setShowTrash] = useState(false);
    const [newListName, setNewListName] = useState("");
    const [editName, setEditName] = useState("");
    const [error, setError] = useState<string | null>(null);



    const handleSelect = async (list: List) => {
        setSelectedListId(list.id);
        setSelectedListName(list.name)
        setEditName("");

    };

    const handleEdit = async () => {
        if (!selectedListId || !editName.trim()) return;
        const updated = await editList(selectedListId, editName)
        setLists(lists.map(list => list.id === selectedListId ? updated : list));
        setEditName("");


    };

    const handleDelete = async (listId: number) => {
        await deleteList(listId);
        setLists(lists.filter(list => list.id !== listId));

    };

    const toggleTrash = async () => {
        if (!showTrash) {
            const deleted = await deletedLists();
            setTrash(deleted);
        }
        setShowTrash(!showTrash)
    }

    const handleCreate = async () => {
        if (!newListName.trim()) return;
        const created = await createList(newListName);
        setLists([...lists, created]);
        setNewListName("");
    };



    return (
        <div className="space-y-4 rounded bg-gray-800/50 p-4 shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">My Lists</h2>
                <button onClick={toggleTrash} className="text-sm hover:text-indigo-400">
                    {showTrash ? 'Hide Trash' : 'Show Trash'}
                </button>
            </div>
            {error &&
                <p className="text-red-400">{error}</p>
            }

            <ul className="space-y-2">
                {Array.isArray(lists) && lists.map((list) => (
                    <li
                        key={list.id}
                        className={`flex justify-between items-center rounded px-2 py-1 transition hover:bg-gray-700/50 ${list.id === selectedListId ? 'font-bold' : ''}`}
                    >
                        <span onClick={() => handleSelect(list)} className="cursor-pointer flex-grow">
                            {list.name}
                        </span>
                        <button onClick={() => handleDelete(list.id)} className="text-sm hover:text-indigo-400">
                            🗑
                        </button>
                    </li>
                ))}
            </ul>
            {
                showTrash && (
                    <div className="mt-4">
                        <h3 className="text-sm text-gray mb-1">
                            Trash
                        </h3>
                        <ul className="space-y-1">
                            {trash.map(list => (
                                <li key={list.id} className="rounded bg-gray-700 px-2 text-sm">
                                    {list.name}
                                </li>
                            ))}
                            {trash.length === 0 &&
                                <li className="text-xs text-gray-500">No Deleted Lists</li>
                            }
                        </ul>

                    </div>
                )
            }
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="New list name"
                    className="flex-grow rounded bg-gray-700 p-2 text-white focus:outline-none focus:ring focus:ring-indigo-500"
                />
                <button
                    onClick={handleCreate}
                    className="rounded bg-indigo-600 px-3 py-2 text-white transition hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500"
                >
                    +
                </button>
            </div>

            {selectedListId && (
                <div className="mt-2 flex gap-2">
                    <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="edit list name"
                        className="flex-grow rounded bg-gray-700 p-2 text-white focus:outline-none focus:ring focus:ring-indigo-500"
                    />

                    <button
                        onClick={handleEdit}
                        className="rounded bg-indigo-600 px-3 py-2 text-white transition hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500"
                    >
                        Update
                    </button>
                </div>
            )}

            {lists.length === 0 && (
                <h3 className="text-center text-gray-400">create a new list to add tasks!</h3>
            )}

        </div>
    );
}

