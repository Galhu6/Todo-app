import { pool } from "../../db.js";

export async function createMicroTask(description: string, taskId: number) {
    const result = await pool.query(
        `INSERT INTO micro_tasks (description, task_id) VALUES ($1, $2) RETURNING *;`,
        [description, taskId]
    );
    return result.rows[0];
}

export async function getMicroTasks(taskId: number) {
    const result = await pool.query(
        `SELECT * FROM micro_tasls WHERE task_id = $1 and is_deleted=false;`,
        [taskId]
    );
    return result.rows;
}

export async function updateMicroTask(id: number, updates: { completed?: boolean; parentId?: number; description?: string; }) {
    const fields: string[] = [];
    const values: any[] = [id];
    if (updates.completed !== undefined) {
        fields.push(`completed =$${values.length + 1}`);
        values.push(updates.completed);
    }
    if (updates.parentId !== undefined) {
        fields.push(`task_id =$${values.length + 1}`);
        values.push(updates.parentId);
    }
    if (updates.description !== undefined) {
        fields.push(`description = $${values.length + 1}`);
        values.push(updates.description);
    }
    if (fields.length === 0) return null;
    const res = await pool.query(
        `UPDATE micro_tasks SET ${fields.join(', ')} WHERE id = $1 RETURNING *;`,
        [values]
    );
    return res.rows[0];
}

export async function completeMicroTask(id: number) {
    const result = await pool.query(
        `UPDATE micro_tasks SET is_complete = true WHERE id = $1 RETURNING *;`,
        [id]
    );
    return result.rows[0];
}

export async function deleteMicroTask(id: number) {
    const result = await pool.query(
        `UPDATE micro_tasks SET isdeleted=true WHERE RETURNING *;`,
        [id]
    );
    return result.rows[0];
}