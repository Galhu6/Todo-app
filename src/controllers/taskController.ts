import type { RequestHandler, Request, Response, NextFunction } from "express";
import {
  completeTask,
  createTask,
  deleteTask,
  duplicateTask,
  editTask,
  getAllTasks,
  getTask,
  setTaskPending,
  getDeletedTasks,
  addTaskToList,
  removeTaskFromList,
} from "../services/Tasks/tasksService";
import { HttpError } from "../middlewares/errorHandler";
import { logger } from "../logger";

export const createTaskController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { description, dueDate, recurrence } = req.body;
  const listId = parseInt(req.params.listId);
  if (!listId || !description || !dueDate) {
    next(
      new HttpError(
        400,
        "List id and task description and due date are required"
      )
    );
    return;
  }
  try {
    const newTask = await createTask(description, listId, dueDate, recurrence);
    if (!newTask) {
      next(new HttpError(500, "failed to create task"));
      return;
    }
    res.status(201).json({ success: true, task: newTask });
    return;
  } catch (err) {
    logger.error({ err }, "failed to create task");
    next(err);
    return;
  }
};
export const editTaskController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { newDescription, newDueDate, newRecurrence } = req.body;
  const listId = parseInt(req.params.listId);
  const taskId = parseInt(req.params.taskId);

  if (!listId || !taskId || (!newDescription && !newDueDate)) {
    next(new HttpError(400, "new task updates and ids are required"));
    return;
  }

  try {
    const editedTask = await editTask(
      taskId,
      listId,
      newDescription,
      newDueDate,
      newRecurrence
    );
    if (!editedTask) {
      next(new HttpError(404, "Task not found"));
      return;
    }
    res.status(200).json({ success: true, task: editedTask });
    return;
  } catch (err) {
    next(err);
    return;
  }
};
export const completeTaskController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const taskId = parseInt(req.params.taskId);
  if (!taskId) {
    next(new HttpError(400, "task id required"));
    return;
  }
  try {
    const complition = await completeTask(taskId);
    if (!complition) {
      next(new HttpError(404, "Task not found"));
      return;
    }
    res.status(200).json({ success: true, task: complition });
    return;
  } catch (err) {
    next(err);
    return;
  }
};
export const setTaskPendingController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const taskId = parseInt(req.params.taskId);
  if (!taskId) {
    next(new HttpError(400, "task id required"));
    return;
  }
  try {
    const pending = await setTaskPending(taskId);
    if (!pending) {
      next(new HttpError(404, "Task not found"));
      return;
    }
    res.status(200).json({ success: true, task: pending });
    return;
  } catch (err) {
    next(err);
    return;
  }
};
export const deleteTaskController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const taskId = parseInt(req.params.taskId);
  if (!taskId) {
    next(new HttpError(400, "task id required"));
    return;
  }

  try {
    const deletedTask = await deleteTask(taskId);
    if (!deletedTask) {
      next(new HttpError(404, "Task not found"));
      return;
    }
    res.status(200).json({ success: true, task: deletedTask });
    return;
  } catch (err) {
    next(err);
    return;
  }
};
export const getTasksController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const listId = parseInt(req.params.listId);
  const taskId = parseInt(req.params.taskId);

  if (!listId || !taskId) {
    next(new HttpError(400, "list and task id are required"));
    return;
  }
  try {
    const task = await getTask(listId, taskId);
    if (!task) {
      next(new HttpError(404, "Task not found"));
      return;
    }
    res.status(200).json({ success: true, task });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

export const getAllTasksController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const listId = parseInt(req.params.listId);
  if (!listId) {
    next(new HttpError(400, "list id required"));
    return;
  }
  try {
    const tasksArr = await getAllTasks(listId);
    res.status(200).json({ success: true, task: tasksArr });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

export const getDeletedTasksController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const listId = parseInt(req.params.listId);
  if (!listId) {
    next(new HttpError(400, "list id is required"));
    return;
  }
  try {
    const taskArr = await getDeletedTasks(listId);
    res.status(200).json({ success: true, task: taskArr });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

export const duplicateTaskController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const listId = parseInt(req.params.listId);
  const taskId = parseInt(req.params.taskId);

  if (!listId || !taskId) {
    next(new HttpError(400, "missing list id or task id"));
    return;
  }

  try {
    const duplicate = await duplicateTask(listId, taskId);
    res.status(200).json({ success: true, task: duplicate });
    return;
  } catch (err) {
    next(err);
  }
};

export const addTaskToListController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const taskId = parseInt(req.params.taskId);
  const targetListId = parseInt(req.params.targetListId);
  if (!taskId || !targetListId) {
    next(new HttpError(400, " missing task id or list id"));
    return;
  }
  try {
    await addTaskToList(taskId, targetListId);
    res.status(200).json({ success: true });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

export const removeTaskFromListController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const taskId = parseInt(req.params.taskId);
  const targetListId = parseInt(req.params.targetListId);
  if (!taskId || !targetListId) {
    next(new HttpError(400, "missing task id or list id"));
    return;
  }
  try {
    await removeTaskFromList(taskId, targetListId);
    res.status(200).json({ success: true });
    return;
  } catch (err) {
    next(err);
    return;
  }
};
