import { pool } from "../../db.js";

export async function createList(name: string, userId: number, overallGoal?: string) {
    const result = await pool.query(
        `
        INSERT INTO Lists (name, user_id, overall_goal) VALUES ($1, $2, $3) RETURNING *;
        `, [name, userId, overallGoal]
    );
    return result.rows[0];
};

export async function editList(listId: number, userId: number, newName: string, newGoal?: string) {

    const updates: string[] = [];
    const values: any[] = [userId, listId];
    if (newName !== undefined) {
        updates.push(`name = $${values.length + 1}`);
        values.push(newName);
    };
    if (newGoal !== undefined) {
        updates.push(`overall_goal = $${values.length + 1}`);
        values.push(newGoal);
    };
    if (updates.length === 0) return null;

    const query = `
    UPDATE List SET ${updates.join(', ')} WHERE user_id = $1 AND id = $2 RETURNING *;`;
    const result = await pool.query(query, values)

};

export async function deleteList(listId: number, userId: number) {
    const result = await pool.query(
        `
        UPDATE Lists SET isDeleted = TRUE WHERE user_id = $1 AND id = $2 RETURNING *;
        `, [userId, listId]
    );
    return result.rows[0];
};

export async function getList(listId: number, userId: number) {
    const result = await pool.query(
        `
        SELECT * FROM Lists WHERE user_id = $1 AND id = $2;
        `, [userId, listId]
    );
    return result.rows[0];
};

export async function getAllLists(userId: number) {
    const result = await pool.query(
        `
        SELECT * FROM Lists WHERE user_id = $1 and isdeleted = false;
        `, [userId]
    );
    return result.rows;
};
export async function getDeletedLists(userId: number) {
    const result = await pool.query(
        `
        SELECT * FROM Lists WHERE user_id = $1 and isdeleted = true;
        `, [userId]
    );
    return result.rows;
};