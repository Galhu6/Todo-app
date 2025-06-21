
export const allLists = async () => await fetch(`/api/lists/`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
}).then(res => res.json()).then(data => data.list);


export const createList = async (newListName: string) => await fetch(`/api/lists/new-list`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ name: newListName })
}).then(res => res.json()).then(data => data.list);

export const selectedList = async (selectedListId: number) => await fetch(`/api/lists/${selectedListId}`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
}).then(res => res.json()).then(data => data.list);


export const deleteList = async (selectedListId: number) => await fetch(`/api/lists/${selectedListId}`, {
    method: "DELETE",
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});

export const editList = async (selectedListId: number, editName: string) => await fetch(`/api/lists/${selectedListId}`, {
    method: "PATCH",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ name: editName })
}).then(res => res.json()).then(data => data.list);
