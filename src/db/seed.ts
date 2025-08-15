import { pool } from "../db";

async function main() {
  // Seed a demo user
  await pool.query(`
    INSERT INTO users (id, email, name, password_hash)
    VALUES (1, 'demo@example.com', 'Demo User, 'hashed)
    ON CONFLICT (id) DO NOTHING;
    `);

  // Seed a demo list belonging to the user
  await pool.query(`
    INSERT INTO lists (id, user_id, name)
    VALUES (1, 1, 'Demo List')
    ON CONFLICT (id) DO NOTHING;
    `);

  //Seed a demo task in the list
  await pool.query(
    `INSERT INTO tasks (id, list_id, description, due_date, recurrence)
    VALUES (1, 1, 'Demo Task', NOW(), 'none)
    ON CONFLICT (id) DO NOTHING;`
  );

  //Align sequence values with the inserted ids to avoid duplicate key errors
  await pool.query(
    `SELECT setval('users_id_seq', SELECT COALESCE(MAX(id), 1) FROM users));`
  );
  await pool.query(
    `SELECT setval('lists_id_seq', SELECT COALESCE(MAX(id), 1) FROM users));`
  );
  await pool.query(
    `SELECT setval('tasks_id_seq', SELECT COALESCE(MAX(id), 1) FROM tasks));`
  );

  console.log("Seed complete");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
