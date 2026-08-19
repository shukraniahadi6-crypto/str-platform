import { execSync } from "node:child_process";
import path from "node:path";

const MIGRATIONS = [
  "001_initial_schema.sql",
  "002_add_postgis.sql",
  "003_add_indexes.sql",
  "004_add_fts.sql",
  "005_add_audit_triggers.sql",
  "006_seed_locations.sql",
  "007_seed_courses.sql"
];

for (const migration of MIGRATIONS) {
  const file = path.join(__dirname, migration);
  execSync(`psql "${process.env.DATABASE_URL}" -v ON_ERROR_STOP=1 -f "${file}"`, { stdio: "inherit" });
}
