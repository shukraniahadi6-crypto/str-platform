import { MigrationInterface, QueryRunner } from "typeorm";
import fs from "node:fs";
import path from "node:path";

export class AddFts004 implements MigrationInterface {
  name = "AddFts004";

  async up(queryRunner: QueryRunner): Promise<void> {
    const sql = fs.readFileSync(path.join(__dirname, "004_add_fts.sql"), "utf8");
    await queryRunner.query(sql);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_jobs_search_vector ON jobs;
DROP FUNCTION IF EXISTS jobs_search_vector_update();
DROP INDEX IF EXISTS idx_jobs_search_vector;
ALTER TABLE jobs DROP COLUMN IF EXISTS search_vector;`);
  }
}
