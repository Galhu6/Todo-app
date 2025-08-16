import { pool } from "./db";

async function main() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `INSERT INTO users (id, email, name, password_hash)
       VALUES (1, 'demo@example.com', 'Demo User', '$2b$10$RMIfrOYlOeMAM3/kGIwmCOOuymWjH8x4o0yYdEMbdtEQ8JUyvKpo2')
       ON CONFLICT (id) DO NOTHING;`
    );

    await client.query(
      `INSERT INTO lists (id, user_id, name)
       VALUES (1, 1, 'Demo List')
       ON CONFLICT (id) DO NOTHING;`
    );

    await client.query(
      `INSERT INTO tasks (id, list_id, description, due_date, recurrence)
       VALUES (1, 1, 'Demo Task', NOW(), 'none')
       ON CONFLICT (id) DO NOTHING;`
    );

    await client.query(
      `SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));`
    );
    await client.query(
      `SELECT setval('lists_id_seq', (SELECT COALESCE(MAX(id), 1) FROM lists));`
    );
    await client.query(
      `SELECT setval('tasks_id_seq', (SELECT COALESCE(MAX(id), 1) FROM tasks));`
    );

    await client.query("COMMIT");
    console.log("Seed complete");
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("Seed failed", e);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
