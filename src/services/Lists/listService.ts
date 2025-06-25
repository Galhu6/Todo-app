import { pool } from "../../db.js";

export async function createList(name: string, userId: number) {
    const result = await pool.query(
        `
        INSERT INTO Lists (name, user_id) VALUES ($1, $2) RETURNING *;
        `, [name, userId]
    );
    return result.rows[0];
};

export async function editList(listId: number, userId: number, newName: string) {

    const result = await pool.query(
        `
        UPDATE Lists SET name = $3 WHERE user_id = $1 AND id = $2 RETURNING *;
        `, [userId, listId, newName]
    );
    return result.rows[0];

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
        SELECT * FROM Lists WHERE user_id = $1;
        `, [userId]
    );
    return result.rows;
};