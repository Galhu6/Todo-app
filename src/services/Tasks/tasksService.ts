import { pool } from "../../db";
import { isValidRecurrence } from "../../utils/validation";

function toUtcTimestamp(date: Date): string {
  return new Date(date).toISOString().replace("T", " ").replace("Z", "");
}

export async function createTask(
  description: string,
  listId: number,
  dueDate: Date,
  recurrence?: "daily" | "weekly" | "monthly"
) {
  const utcDate = toUtcTimestamp(dueDate);
  try {
    const result = await pool.query(
      `
        INSERT INTO tasks (description, list_id, due_date, recurrence) VALUES ($1, $2, $3, $4) RETURNING *;
        `,
      [description, listId, utcDate, recurrence]
    );
    return result.rows[0];
  } catch (err: any) {
    if (err.code === "23505") {
      await pool.query(
        `SELECT setval('tasks_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM tasks));`
      );
      const retry = await pool.query(
        `
      INSERT INTO tasks (description, list_id, due_date, recurrence) VALUES ($1, $2, $3, $4) RETURNING *;`,
        [description, listId, utcDate, recurrence]
      );
      return retry.rows[0];
    }
    throw err;
  }
}

export async function editTask(
  taskId: number,
  listId: number,
  newDesc?: string,
  newDueDate?: Date,
  newRecurrence?: "daily" | "weekly" | "monthly"
) {
  const updates: string[] = [];
  const values: any[] = [taskId, listId];

  if (newDesc !== undefined) {
    updates.push(`description = $${values.length + 1}`);
    values.push(newDesc);
  }
  if (newDueDate !== undefined) {
    updates.push(`due_date = $${values.length + 1}`);
    values.push(toUtcTimestamp(newDueDate));
  }
  if (newRecurrence !== undefined) {
    updates.push(`recurrence = $${values.length + 1}`);
    values.push(newRecurrence);
  }

  if (updates.length === 0) return null;

  const query = `
    UPDATE tasks
    SET ${updates.join(", ")}
    WHERE id = $1 AND list_id = $2
    RETURNING *;
    `;

  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function completeTask(taskId: number) {
  const taskRes = await pool.query(`SELECT * FROM tasks WHERE id = $1`, [
    taskId,
  ]);
  const task = taskRes.rows[0];
  if (!task) return null;
  const nextDate = new Date(task.due_date);
  if (isValidRecurrence(task.recurrence) && !isNaN(nextDate.getTime())) {
    switch (task.recurrence) {
      case "daily":
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case "weekly":
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case "monthly":
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
    }
    const result = await pool.query(
      `UPDATE tasks SET due_date = $1, status = 'pending' WHERE id = $2 RETURNING *;`,
      [toUtcTimestamp(nextDate), taskId]
    );
    return result.rows[0];
  }
  const result = await pool.query(
    `
        UPDATE tasks SET status = 'completed' WHERE id = $1 RETURNING *;
      `,
    [taskId]
  );
  return result.rows[0];
}
export async function setTaskPending(taskId: number) {
  const result = await pool.query(
    `
        UPDATE tasks SET status = 'pending' WHERE id = $1 RETURNING *;
        `,
    [taskId]
  );
  return result.rows[0];
}

export async function deleteTask(taskId: number) {
  const result = await pool.query(
    `
        UPDATE tasks SET isDeleted = TRUE WHERE id = $1 RETURNING *;
        `,
    [taskId]
  );
  return result.rows[0];
}

export async function getTask(listId: number, taskId: number) {
  const result = await pool.query(
    `
        SELECT * FROM tasks WHERE list_id = $1 AND id = $2 ;
        `,
    [listId, taskId]
  );
  return result.rows[0];
}

export async function getAllTasks(listId: number) {
  const result = await pool.query(
    `
        SELECT t.* FROM tasks t
        LEFT JOIN task_list_links l ON t.id = l.task_id
        WHERE (t.list_id = $1 OR l.list_id = $1) AND t.isdeleted = false;
        `,
    [listId]
  );
  return result.rows;
}
export async function getDeletedTasks(listId: number) {
  const result = await pool.query(
    `
        SELECT * FROM tasks WHERE list_id = $1 and isdeleted = true;
        `,
    [listId]
  );
  return result.rows;
}

export async function duplicateTask(listId: number, taskId: number) {
  const currentTask = await getTask(listId, taskId);
  const result = await pool.query(
    `
        INSERT INTO tasks (
        description,
        list_id,
        due_date, recurrence) VALUES ($1, $2, $3, $4) RETURNING *;
        `,
    [
      currentTask.description,
      currentTask.list_id,
      toUtcTimestamp(currentTask.due_date),
      currentTask.recurrence,
    ]
  );
  return result.rows[0];
}

export async function addTaskToList(taskId: number, listId: number) {
  await pool.query(
    `INSERT INTO task_list_links (task_id, list_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;`,
    [taskId, listId]
  );
}

export async function removeTaskFromList(taskId: number, listId: number) {
  await pool.query(
    `DELETE FROM task_list_links WHERE task_id = $1 AND list_id = $2;`,
    [taskId, listId]
  );
}
