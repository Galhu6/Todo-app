import type { RequestHandler } from "express";
import { pool } from "../db.js";

export const verifyTaskOwnership: RequestHandler = async (req, res, next) => {
    const userId = (req as any).user?.id;
    const taskId = parseInt(req.params.taskId);

    if (!userId || isNaN(taskId)) {
        res.status(400).json({ success: false, error: "Missing user or task id" });
        return;
    }

    const result = await pool.query(
        `SELECT 1 FROM tasks t
        JOIN lists l on t.list_id = l.id
        WHERE t.id = $1 AND l.user_id = $2`,
        [taskId, userId]
    );

    if (result.rows.length === 0) {
        res.status(403).json({ success: false, error: "Not authorized for this task" })
        return;
    }

    next();
};

export const verifyListOwnership: RequestHandler = async (req, res, next) => {
    const userId = (req as any).user?.id;
    const listId = parseInt(req.params.listId);

    if (!userId || isNaN(listId)) {
        res.status(400).json({ success: false, error: "Missing user or list id" });
        return;
    }

    try {
        const result = await pool.query(
            `SELECT 1 FROM lists WHERE id = $1 AND user_id = $2`,
            [listId, userId]
        );

        if (result.rows.length === 0) {
            res.status(403).json({ success: false, error: "Not authorized for this list" });
            return;
        }

        next();
    } catch (err) {
        next(err);
    }
};