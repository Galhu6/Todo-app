import { pool } from "../db";

async function main() {
  await pool.query(`
    INSERT INTO users (id, email, name, password_hash) VALUES (1, 'demo@example.com', 'Demo User, 'hashed) ON CONFLICT (id) DO NOTHING;
    `);
  await pool.query(`
    INSERT INTO lists (id, user_id, name) VALUES(1, 1, 'Demo List') O CONFLICT (id) DO NOTHING;
    `);
  await pool.query(
    `INSERT INTO tasks (id, list_id, description, due_date, recurrence) VALUES (1, 1, 'Demo Task', NOW(), 'none) ON CONFLICT (id) DO NOTHING;`
  );
  console.log("Seed complete");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
