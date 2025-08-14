import { pool } from "../db";

async function main() {
  await pool.query("/* insert demo rows here with ON CONFLICT DO NOTHING */");
  console.log("Seed complete");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
