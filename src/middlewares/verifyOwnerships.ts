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

