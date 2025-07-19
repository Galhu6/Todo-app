const server = import.meta.env.VITE_SERVER_URL;
import { authFetch } from "../../../utils/authFetch";

export const fetchMicroTasks = async (taskId: number) =>
    authFetch(`${server}/api/tasks/${taskId}/microtasks`, { method: "GET" })
        .then(res => res.json()).then(data => data.microtasks);

export const createMicroTask = async (taskId: number, description: string) =>
    authFetch(`${server}/api/tasks/${taskId}/microtasks`, {
        method: "POST",
        body: JSON.stringify({ description })
    }).then(res => res.json()).then(data => data.microtask);


export const updateMicroTask = async (microTaskId: number, updates: { completed?: boolean; parentId?: number; description?: string }) =>
    authFetch(`${server}/api/microtasks/${microTaskId}`, {
        method: "PATCH",
        body: JSON.stringify(updates)
    }).then(res => res.json()).then(data => data.microtask);

export const deleteMicroTask = async (microTaskId: number) =>
    authFetch(`${server}/api/microtasks/${microTaskId}`, { method: "DELETE" });