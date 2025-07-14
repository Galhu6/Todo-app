import type { RequestHandler } from "express";
import { pool } from "../db.js";
import { HttpError } from "./errorHandler.js";

export const verifyTaskOwnership: RequestHandler = async (req, res, next) => {
    const userId = (req as any).user?.id;
    const taskId = parseInt(req.params.taskId);

    if (!userId || isNaN(taskId)) {
        next(new HttpError(400, "Missing user or task id"));
        return;
    }

    const result = await pool.query(
        `SELECT 1 FROM tasks t
        JOIN lists l on t.list_id = l.id
        WHERE t.id = $1 AND l.user_id = $2`,
        [taskId, userId]
    );

    if (result.rows.length === 0) {
        next(new HttpError(403, "Not authorized for this task")); return;
    }

    next();
};

export const verifyListOwnership: RequestHandler = async (req, res, next) => {
    const userId = (req as any).user?.id;
    const listId = parseInt(req.params.listId);

    if (!userId || isNaN(listId)) {
        next(new HttpError(400, "Missing user or list id"))
        return;
    }

    try {
        const result = await pool.query(
            `SELECT 1 FROM lists WHERE id = $1 AND user_id = $2`,
            [listId, userId]
        );

        if (result.rows.length === 0) {
            next(new HttpError(403, "Not authorized for this list"));
            return;
        }

        next();
    } catch (err) {
        next(err);
    }
};