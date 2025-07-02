
const server = import.meta.env.VITE_SERVER_URL;

export const allLists = async () => {
    const res = await fetch(`${server}/api/lists/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,

            "X-User-ID": `${localStorage.getItem("userId")}`
        },
        credentials: "include"
    });
    if (!res.ok) {
        throw new Error(`failed to fetch lists: ${res.statusText}`)
    };
    const data = await res.json();
    return data.list;
};

export const createList = async (newListName: string, overallGoal: string) =>
    await fetch(`${server}/api/lists/new-list`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,

            "X-User-ID": `${localStorage.getItem("userId")}`

        },
        credentials: "include",
        body: JSON.stringify({ name: newListName, overallGoal })
    }).then(res => res.json()).then(data => data.list);

export const selectedList = async (selectedListId: number) =>
    await fetch(`${server}/api/lists/${selectedListId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,

            "X-User-ID": `${localStorage.getItem("userId")}`

        },
        credentials: "include",
    }).then(res => res.json()).then(data => data.list);


export const deleteList = async (selectedListId: number) => await fetch(`${server}/api/lists/${selectedListId}`, {
    method: "DELETE",
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "X-User-ID": `${localStorage.getItem("userId")}`

    },
    credentials: "include"
});

export const editList = async (selectedListId: number, editName: string, overallGoal?: string) => await fetch(`${server}/api/lists/${selectedListId}`, {
    method: "PATCH",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "X-User-ID": `${localStorage.getItem("userId")}`
    },
    credentials: "include",
    body: JSON.stringify({ name: editName, overallGoal }),
}).then(res => res.json()).then(data => data.list);

export const deletedLists = async () => {
    const res = await fetch(`${server}/api/lists/trash`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,

            "X-User-ID": `${localStorage.getItem("userId")}`
        },
        credentials: "include"
    });
    if (!res.ok) {
        throw new Error(`failed to fetch trash: ${res.statusText}`)
    };
    const data = await res.json();
    return data.list;
};