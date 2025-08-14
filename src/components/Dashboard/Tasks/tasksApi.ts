const server = import.meta.env.VITE_SERVER_URL;
import { authFetch } from "../../../utils/authFetch";

export const allTasks = async (listId: number) =>
  authFetch(`${server}/api/lists/${listId}/tasks/`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => data.task);

export const deletedTasks = async (listId: number) =>
  authFetch(`${server}/api/lists/${listId}/tasks/trash`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => data.task);

export const selectedTask = async (listId: number, taskId: number) =>
  authFetch(`${server}/api/lists/${listId}/tasks/${taskId}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => data.task);

export const createTask = async (
  listId: number,
  task: { description: string; dueDate: Date; recurrence?: string }
) =>
  authFetch(`${server}/api/lists/${listId}/tasks`, {
    method: "POST",
    body: JSON.stringify(task),
  })
    .then((res) => res.json())
    .then((data) => data.task);

export const editTask = async (
  listId: number,
  taskId: number,
  updates: {
    newDescription?: string;
    newDueDate?: Date | null;
    newRecurrence?: string;
  }
) =>
  authFetch(`${server}/api/lists/${listId}/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  })
    .then((res) => res.json())
    .then((data) => data.task);

export const deleteTask = async (listId: number, taskId: number) =>
  authFetch(`${server}/api/lists/${listId}/tasks/${taskId}`, {
    method: "DELETE",
  });

export const completeTask = async (listId: number, taskId: number) =>
  authFetch(`${server}/api/lists/${listId}/tasks/${taskId}/complete`, {
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => data.task);

export const setTaskPending = async (listId: number, taskId: number) =>
  authFetch(`${server}/api/lists/${listId}/tasks/${taskId}/set-pending`, {
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => data.task);

export const duplicateTask = async (listId: number, taskId: number) =>
  authFetch(`${server}/api/lists/${listId}/tasks/${taskId}/duplicate`, {
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => data.task);

export const shareTaskToList = async (
  listId: number,
  taskId: number,
  targetListId: number
) =>
  authFetch(
    `${server}/api/lists/${listId}/tasks/${taskId}/share/${targetListId}`,
    {
      method: "POST",
    }
  ).then((res) => res.json());

export const unshareTaskFromList = async (
  listId: number,
  taskId: number,
  targetListId: number
) =>
  authFetch(
    `${server}/api/lists/${listId}/tasks/${taskId}/share/${targetListId}`,
    {
      method: "DELETE",
    }
  ).then((res) => res.json());
