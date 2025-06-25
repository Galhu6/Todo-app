import type { RequestHandler, Request, Response } from "express"
import { completeTask, createTask, deleteTask, editTask, getAllTasks, getTask } from "../services/Tasks/tasksService.js";

export const createTaskController: RequestHandler = async (req: Request, res: Response) => {
    const { description, dueDate } = req.body
    const listId = parseInt(req.params.listId)
    if (!listId || !description || !dueDate) {
        res.status(400).json({ success: false, error: "List id and task description and due date are required" });
        return;
    }
    try {
        const newTask = await createTask(description, listId, dueDate);
        res.status(201).json({ success: true, task: newTask });
        return;
    } catch (err) {
        console.error("failed to create task:", err);
        res.status(500).json({ success: false, error: "server error while creating task" });
        return;

    }
};
export const editTaskController: RequestHandler = async (req: Request, res: Response) => {
    const { newDescription, newDueDate } = req.body;
    const listId = parseInt(req.params.listId);
    const taskId = parseInt(req.params.taskId)

    if (!listId || !taskId || (!newDescription && !newDueDate)) {
        res.status(400).json({ success: false, error: "new task updates and ids are required" });
        return;
    }

    try {
        const editedTask = await editTask(taskId, listId, newDescription, newDueDate);
        res.status(200).json({ success: true, task: editedTask });
        return;

    } catch (err) {
        console.error("failed to edit task:", err);
        res.status(500).json({ success: false, error: "server error while editing task" });
        return;
    }
};
export const completeTaskController: RequestHandler = async (req: Request, res: Response) => {
    const taskId = parseInt(req.params.taskId);
    if (!taskId) {
        res.status(400).json({ success: false, error: "task id required" });
        return;

    }
    try {
        const complition = await completeTask(taskId);
        res.status(200).json({ success: true, task: complition });
        return;


    } catch (err) {
        console.error("failed to complete task:", err);
        res.status(500).json({ success: false, error: "server error while completing task" });
        return;
    }
};
export const deleteTaskController: RequestHandler = async (req: Request, res: Response) => {
    const taskId = parseInt(req.params.taskId);
    if (!taskId) {
        res.status(400).json({ success: false, error: "task id required" });
        return;
    }

    try {
        const deletedTask = await deleteTask(taskId);
        res.status(200).json({ success: true, task: deletedTask });
        return;
    } catch (err) {
        console.error("failed to delete task:", err);
        res.status(500).json({ success: false, error: "server error while deleting task" });
        return;
    }
};
export const getTasksController: RequestHandler = async (req: Request, res: Response) => {
    const listId = parseInt(req.params.listId);
    const taskId = parseInt(req.params.taskId);

    if (!listId || !taskId) {
        res.status(400).json({ success: false, error: "list and task id are required" });
        return;
    }
    try {
        const task = await getTask(listId, taskId);
        res.status(200).json({ success: true, task });
        return;


    } catch (err) {
        console.error("failed to get task:", err);
        res.status(500).json({ success: false, error: "server error while getting task" });
        return;
    }
};

export const getAllTasksController: RequestHandler = async (req: Request, res: Response) => {
    const listId = parseInt(req.params.listId);
    if (!listId) {
        res.status(400).json({ success: false, error: "list id required" });
        return;
    }
    try {
        const tasksArr = await getAllTasks(listId);
        res.status(200).json({ success: true, task: tasksArr });
        return;


    } catch (err) {
        console.error("failed to get tasks:", err);
        res.status(500).json({ success: false, error: "server error while getting tasks" });
        return;
    }
};