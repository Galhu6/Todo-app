import { pool } from "../../db";

export async function getUserStats(userId: number) {
  const result = await pool.query(
    `SELECT COUNT(*) FILTER (WHERE t.status = 'completed') AS completed,
        COUNT(*) FILTER (WHERE t.status = 'pending') AS pending,
        COUNT(*) FILTER (WHERE t.status = 'overdue') AS overdue
        FROM tasks t
        JOIN lists l ON t.list_id = l.id
        WHERE l.user_id = $1 AND t.isdeleted = false`,
    [userId]
  );
  return result.rows[0];
}

export async function getRecommendations(userId: number) {
  const result = await pool.query(
    `SELECT t.* FROM tasks t
        JOIN lists l ON t.list_id = l.id
        WHERE l.user_id = $1 AND t.status <> 'completed' AND t.isdeleted = false
        ORDER BY t.due_date ASC LIMIT 5`,
    [userId]
  );
  return result.rows;
}

export async function getDailySummary(
  userId: number,
  part: "morning" | "evening"
) {
  const result = await pool.query(
    `SELECT t.* FROM tasks t
        JOIN lists l ON t.list_id = l.id
        WHERE l.user_id = $1 AND t.status <> 'completed' AND t.isdeleted = false
        AND t.due_date::date = CURRENT_DATE`,
    [userId]
  );
  return { part, tasks: result.rows };
}
