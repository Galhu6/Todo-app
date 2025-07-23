import type { RequestHandler, Request, Response, NextFunction } from "express";
import { createMicroTask, deleteMicroTask, getMicroTasks, updateMicroTask } from "../services/MicroTasks/microTaskService.js";
import { HttpError } from "../middlewares/errorHandler.js";

export const getMicroTaskController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const taskId = parseInt(req.params.taskId);
    if (!taskId) { next(new HttpError(400, " task id required")); return; }
    try {
        const micro = await getMicroTasks(taskId);
        res.status(200).json({ success: true, microtasks: micro });
    } catch (err) { next(err); }
};

export const createMicroTaskController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const taskId = parseInt(req.params.taskId);
    const { description } = req.body;
    if (!taskId || !description) { next(new HttpError(400, 'description required')); return; }
    try {
        const mt = await createMicroTask(description, taskId);
        res.status(201).json({ success: true, microtask: mt });
    } catch (err) { next(err) };
};

export const updateMicroTaskController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const microTaskId = parseInt(req.params.microTaskId);
    const { completed, parentId, description } = req.body;
    if (!microTaskId || (completed === undefined && parentId === undefined && description === undefined)) {
        next(new HttpError(400, 'no updates provided')); return;
    }
    try {
        const mt = await updateMicroTask(microTaskId, { completed, parentId, description });
        if (!mt) { next(new HttpError(404, 'Micro task not found')); return; }
        res.status(200).json({ success: true, microtask: mt });
    } catch (err) { next(err); }
};

export const deleteMicroTaskController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const microTaskId = parseInt(req.params.microTaskId);
    if (!microTaskId) {
        next(new HttpError(400, 'micro task id required')); return;
    }
    try {
        const mt = await deleteMicroTask(microTaskId);
        if (!mt) { next(new HttpError(404, 'Micro task not found')); return; }
        res.status(200).json({ success: true, microtask: mt });
    } catch (err) { next(err); }
};