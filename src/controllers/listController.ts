import type { RequestHandler, Request, Response, NextFunction } from "express"
import { createList, deleteList, editList, getAllLists, getList, getDeletedLists, getSubLists } from "../services/Lists/listService.js";
import { HttpError } from "../middlewares/errorHandler.js";

export const createListController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { name, overallGoal, parentListId } = req.body;
    const userId = (req as any).user?.id;

    if (!name || !userId) {
        next(new HttpError(400, "List name and user id are required"));
        return;
    }
    try {
        const newList = await createList(name, userId, overallGoal, parentListId);
        res.status(201).json({ success: true, list: newList });
        return;
    } catch (err) {
        next(err)
    }
};

export const editListController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { name, overallGoal, parentListId } = req.body;
    const listId = Number(req.params.listId);
    const userId = (req as any).user?.id;

    if (isNaN(listId) || !userId || (!name && !overallGoal && parentListId === undefined)) {
        next(new HttpError(400, "new List values are required"));
        return;
    }

    try {
        const editedList = await editList(listId, userId, name, overallGoal, parentListId);
        if (!editedList) {
            next(new HttpError(404, "List not found"))
            return;
        }
        res.status(200).json({ success: true, list: editedList });
        return;

    } catch (err) {
        next(err)
    }
};
export const deleteListController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    const listId = Number(req.params.listId);

    if (!userId || isNaN(listId)) {
        next(new HttpError(400, "List and user id are required"));
        return;
    }

    try {
        const deletedList = await deleteList(listId, userId);
        if (!deletedList) {
            next(new HttpError(404, "List not found"));
            return;
        }
        res.status(200).json({ success: true, list: deletedList });
        return;

    } catch (err) {

        next(err)
    }
};
export const getListController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    const listId = Number(req.params.listId);

    if (!userId || isNaN(listId)) {
        res.status(400).json({ success: false, error: "List and user id are required" });
        return;
    }

    try {
        const list = await getList(listId, userId);
        if (!list) {
            next(new HttpError(400, "List and user id are required"));
            return;
        }
        res.status(200).json({ success: true, list: list });
        return;


    } catch (err) {
        next(err);

    }
};
export const getAllListsController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;

    if (!userId) {
        next(new HttpError(400, " user id is required"));
        return;
    }
    try {
        const lists = await getAllLists(userId)
        res.status(200).json({ success: true, list: lists });
        return;

    } catch (err) {
        next(err)

    }
};

export const getDeletedListController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    if (!userId) {
        next(new HttpError(400, "user id is required"));
        return;
    }
    try {
        const lists = await getDeletedLists(userId);
        res.status(200).json({ success: true, list: lists });
        return;
    } catch (err) {
        next(err);
    }
};

export const getSubListsController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    const listId = Number(req.params.listId);
    if (!userId || isNaN(listId)) {
        next(new HttpError(400, "list id and user id required"));
        return;
    }
    try {
        const lists = await getSubLists(userId, listId);
        res.status(200).json({ success: true, list: lists });
        return;
    } catch (err) {
        next(err)
    }
};