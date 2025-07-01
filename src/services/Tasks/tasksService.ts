import { pool } from "../../db.js";

function toUtcTimestamp(date: Date) {
    return new Date(date).toISOString().replace('T', ' ').replace('Z', '');
}

export async function createTask(description: string, listId: number, dueDate: Date) {
    const utcDate = toUtcTimestamp(dueDate);
    const result = await pool.query(
        `
        INSERT INTO tasks (description, list_id, due_date) VALUES ($1, $2, $3) RETURNING *;
        `, [description, listId, utcDate]
    );
    return result.rows[0];
};

export async function editTask(taskId: number, listId: number, newDesc?: string, newDueDate?: Date) {
    const updates: string[] = [];
    const values: any[] = [taskId, listId];

    if (newDesc !== undefined) {
        updates.push(`description = $${values.length + 1}`);
        values.push(newDesc);

    }
    if (newDueDate !== undefined) {
        updates.push(`due_date = $${values.length + 1}`);
        values.push(toUtcTimestamp(newDueDate))

    }

    if (updates.length === 0) return null;

    const query = `
    UPDATE tasks
    SET ${updates.join(', ')}
    WHERE id = $1 AND list_id = $2
    RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
};

export async function completeTask(taskId: number) {
    const result = await pool.query(
        `
        UPDATE tasks SET status = 'completed' WHERE id = $1 RETURNING *;
        `, [taskId]
    );
    return result.rows[0];

};
export async function setTaskPending(taskId: number) {
    const result = await pool.query(
        `
        UPDATE tasks SET status = 'pending' WHERE id = $1 RETURNING *;
        `, [taskId]
    );
    return result.rows[0];

};

export async function deleteTask(taskId: number) {
    const result = await pool.query(
        `
        UPDATE tasks SET isDeleted = TRUE WHERE id = $1 RETURNING *;
        `, [taskId]
    );
    return result.rows[0];
};

export async function getTask(listId: number, taskId: number) {
    const result = await pool.query(
        `
        SELECT * FROM tasks WHERE list_id = $1 AND id = $2 ;
        `, [listId, taskId]
    );
    return result.rows[0];
};

export async function getAllTasks(listId: number) {
    const result = await pool.query(
        `
        SELECT * FROM tasks WHERE list_id = $1 and isdeleted = false;
        `, [listId]
    );
    return result.rows;
};
export async function getDeletedTasks(listId: number) {
    const result = await pool.query(
        `
        SELECT * FROM tasks WHERE list_id = $1 and isdeleted = true;
        `, [listId]
    );
    return result.rows;
};

export async function duplicateTask(listId: number, taskId: number) {
    const currentTask = await getTask(listId, taskId)
    const result = await pool.query(
        `
        INSERT INTO tasks (
        description,
        list_id,
        due_date) VALUES ($1, $2, $3) RETURNING *;
        `, [currentTask.description, currentTask.list_id, toUtcTimestamp(currentTask.due_date)]

    );
    return result.rows[0]
}