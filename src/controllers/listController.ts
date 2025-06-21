import type { RequestHandler, Request, Response } from "express"
import { createList, deleteList, editList, getAllLists, getList } from "../services/Lists/listService";

export const createListController: RequestHandler = async (req: Request, res: Response) => {
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
        console.error("failed to create list:", err);
        res.status(500).json({ success: false, error: "server error while creating list" });
        return;
    }
};

export const editListController: RequestHandler = async (req: Request, res: Response) => {
    const { newName } = req.body;
    const listId = parseInt(req.params.listId);
    const userId = (req as any).user?.id;

    if (!listId || !userId || !newName) {
        res.status(400).json({ success: false, error: "new List name and ids are required" });
        return;
    }

    try {
        const editedList = await editList(listId, userId, newName);
        res.status(200).json({ success: true, list: editedList });
        return;

    } catch (err) {
        console.error("failed to edit list:", err);
        res.status(500).json({ success: false, error: "server error while editing list" });
        return;
    }
};
export const deleteListController: RequestHandler = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const listId = parseInt(req.params.listId);

    if (!userId || !listId) {
        res.status(400).json({ success: false, error: "List and user id are required" });
        return;
    }

    try {
        const deletedList = await deleteList(listId, userId);
        res.status(200).json({ success: true, list: deletedList });
        return;

    } catch (err) {

        console.error("failed to delete list:", err);
        res.status(500).json({ success: false, error: "server error while deleting list" });
        return;
    }
};
export const getListController: RequestHandler = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const listId = parseInt(req.params.listId);

    if (!userId || !listId) {
        res.status(400).json({ success: false, error: "List and user id are required" });
        return;
    };

    try {
        const list = await getList(listId, userId);
        res.status(200).json({ success: true, list: list });
        return;


    } catch (err) {
        console.error("failed to get list:", err);
        res.status(500).json({ success: false, error: "server error while getting list" });
        return;

    }
};
export const getAllListsController: RequestHandler = async (req: Request, res: Response) => {
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
        console.error("failed to get list:", err);
        res.status(500).json({ success: false, error: "server error while getting list" });
        return;

    }
};