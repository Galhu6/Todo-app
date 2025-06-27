
const server = import.meta.env.VITE_SERVER_URL;

export const allTasks = async (listId: number) => await fetch(`${server}/api/lists/${listId}/tasks/`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "X-User-ID": `${localStorage.getItem("userId")}`

    }
}).then(res => res.json()).then(data => data.task);

export const selectedTask = async (listId: number, taskId: number) => await fetch(`${server}/api/lists/${listId}/tasks/${taskId}`, {
    method: 'GET',
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "X-User-ID": `${localStorage.getItem("userId")}`

    }
}).then(res => res.json()).then(data => data.task);


export const createTask = async (listId: number, task: { description: string, dueDate: Date }) =>
    await fetch(`${server}/api/lists/${listId}/new-task`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "X-User-ID": `${localStorage.getItem("userId")}`

        },
        body: JSON.stringify(task)

    }).then(res => res.json()).then(data => data.task)

export const editTask = async (
    listId: number,
    taskId: number,
    updates: { newDescription?: string, newDueDate?: Date | null }) =>
    await fetch(`${server}/api/lists/${listId}/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "X-User-ID": `${localStorage.getItem("userId")}`

        },
        body: JSON.stringify(updates)

    }).then(res => res.json()).then(data => data.task)

export const deleteTask = async (listId: number, taskId: number) => await fetch(`${server}/api/lists/${listId}/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "X-User-ID": `${localStorage.getItem("userId")}`

    }
});

export const completeTask = async (listId: number, taskId: number) => await fetch(`${server}/api/lists/${listId}/tasks/${taskId}/complete`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "X-User-ID": `${localStorage.getItem("userId")}`


    }
}).then(res => res.json()).then(data => data.task);

export const duplicateTask = async (listId: number, taskId: number) => await fetch(`${server}/api/lists/${listId}/tasks/${taskId}/duplicate`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "X-User-ID": `${localStorage.getItem("userId")}`
    }
}).then(res => res.json()).then(data => data.task)