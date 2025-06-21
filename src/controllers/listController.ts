import type { RequestHandler, Request, Response, NextFunction } from "express"
import { createList, deleteList, editList, getAllLists, getList } from "../services/Lists/listService";

export const createListController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    const userId = (req as any).user?.id;

    if (!name || !userId) {
        res.status(400).json({ success: false, error: "List name and user id are required" });
        return;
    }
    try {
        const newList = await createList(name, userId);
        res.status(201).json({ success: true, list: newList });
        return;
    } catch (err) {
        next(err)
    }
};

export const editListController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    const listId = Number(req.params.listId);
    const userId = (req as any).user?.id;

    if (isNaN(listId) || !userId || !name) {
        res.status(400).json({
            success: false,
            error: "new List name and ids are required",
            message: "Please provide valid name and list ID"
        });
        return;
    }

    try {
        const editedList = await editList(listId, userId, name);
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
        res.status(400).json({ success: false, error: "List and user id are required" });
        return;
    }

    try {
        const deletedList = await deleteList(listId, userId);
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
    };

    try {
        const list = await getList(listId, userId);
        res.status(200).json({ success: true, list: list });
        return;


    } catch (err) {
        next(err);

    }
};
export const getAllListsController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;

    if (!userId) {
        res.status(400).json({ success: false, error: " user id is required" });
        return;
    };
    try {
        const lists = await getAllLists(userId)
        res.status(200).json({ success: true, list: lists });
        return;

    } catch (err) {
        next(err)

    }
};