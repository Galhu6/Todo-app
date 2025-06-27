
const server = import.meta.env.VITE_SERVER_URL;

export const allLists = async () => {
    const res = await fetch(`${server}/api/lists/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "X-User-ID": `${localStorage.getItem("userId")}`
        }
    });
    if (!res.ok) {
        throw new Error(`failed to fetch lists: ${res.statusText}`)
    };
    const data = await res.json();
    return data.list;
};

export const createList = async (newListName: string) => await fetch(`${server}/api/lists/new-list`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "X-User-ID": `${localStorage.getItem("userId")}`

    },
    body: JSON.stringify({ name: newListName })
}).then(res => res.json()).then(data => data.list);

export const selectedList = async (selectedListId: number) => await fetch(`${server}/api/lists/${selectedListId}`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "X-User-ID": `${localStorage.getItem("userId")}`

    }
}).then(res => res.json()).then(data => data.list);


export const deleteList = async (selectedListId: number) => await fetch(`${server}/api/lists/${selectedListId}`, {
    method: "DELETE",
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "X-User-ID": `${localStorage.getItem("userId")}`

    }
});

export const editList = async (selectedListId: number, editName: string) => await fetch(`${server}/api/lists/${selectedListId}`, {
    method: "PATCH",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "X-User-ID": `${localStorage.getItem("userId")}`

    },
    body: JSON.stringify({ name: editName }),
}).then(res => res.json()).then(data => data.list);
