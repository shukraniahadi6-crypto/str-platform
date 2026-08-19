import { MigrationInterface, QueryRunner } from "typeorm";
import fs from "node:fs";
import path from "node:path";

export class AddIndexes003 implements MigrationInterface {
  name = "AddIndexes003";

  async up(queryRunner: QueryRunner): Promise<void> {
    const sql = fs.readFileSync(path.join(__dirname, "003_add_indexes.sql"), "utf8");
    await queryRunner.query(sql);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_jobs_status_active;
DROP INDEX IF EXISTS idx_neighborhood_groups_active_city;
DROP INDEX IF EXISTS idx_payouts_courier_status;
DROP INDEX IF EXISTS idx_payments_vendor_status;
DROP INDEX IF EXISTS idx_ledger_entries_job_id;
DROP INDEX IF EXISTS idx_ledger_entries_created_at;
DROP INDEX IF EXISTS idx_notifications_user_created_at;
DROP INDEX IF EXISTS idx_offer_pings_courier_created_at;
DROP INDEX IF EXISTS idx_offer_pings_job_status;
DROP INDEX IF EXISTS idx_jobs_courier_created_at;
DROP INDEX IF EXISTS idx_jobs_vendor_status;
ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_vendor_not_courier_ck;`);
  }
}
