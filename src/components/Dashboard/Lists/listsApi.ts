const server = import.meta.env.VITE_SERVER_URL;
import { authFetch } from "../../../utils/authFetch.js";

export const allLists = async () => {
    const res = await authFetch(`${server}/api/lists/`, {
        method: "GET"
    });
    if (!res.ok) {
        throw new Error(`failed to fetch lists: ${res.statusText}`)
    };
    const data = await res.json();
    return data.list;
};

export const createList = async (newListName: string, overallGoal: string, parentListId?: number) =>
    authFetch(`${server}/api/lists/new-list`, {
        method: "POST",
        body: JSON.stringify({ name: newListName, overallGoal, parentListId })
    }).then(res => res.json()).then(data => data.list);

export const selectedList = async (selectedListId: number) =>
    authFetch(`${server}/api/lists/${selectedListId}`, {
        method: "GET",
    }).then(res => res.json()).then(data => data.list);

export const deleteList = async (selectedListId: number) => authFetch(`${server}/api/lists/${selectedListId}`, {
    method: "DELETE",
});

export const editList = async (selectedListId: number, editName: string, overallGoal?: string) => authFetch(`${server}/api/lists/${selectedListId}`, {
    method: "PATCH",
    body: JSON.stringify({ name: editName, overallGoal }),
}).then(res => res.json()).then(data => data.list);

export const deletedLists = async () => {
    const res = await authFetch(`${server}/api/lists/trash`, {
        method: "GET"
    });
    if (!res.ok) {
        throw new Error(`failed to fetch trash: ${res.statusText}`)
    };
    const data = await res.json();
    return data.list;
};

export const subLists = async (listId: number) =>
    authFetch(`${server}/api/lists/${listId}/sub-lists`, {
        method: "GET"
    }).then(res => res.json()).then(data => data.list);