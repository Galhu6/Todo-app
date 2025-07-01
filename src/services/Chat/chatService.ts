import { pool } from "../../db";

export async function getChatContext(userId: number) {
    const result = await pool.query(
        `SELECT context FROM chat_context WHERE user_id= $1`,
        [userId]
    );
    return result.rows[0]?.context || "";
};

export async function saveChatContext(userId: number, context: string) {
    await pool.query(
        `INSERT INTO chat_contexts (user_id, context, updated_at)
            VALUES ($1, $2, NOW())
            ON CONFLICT (user_id)
            DO UPDATE SET context = EXCLUDED.context, updated_at = NOW()`,
        [userId, context]
    );
};