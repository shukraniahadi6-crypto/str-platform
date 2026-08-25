import { MigrationInterface, QueryRunner } from "typeorm";
import fs from "node:fs";
import path from "node:path";

export class AddAuditTriggers005 implements MigrationInterface {
  name = "AddAuditTriggers005";

  async up(queryRunner: QueryRunner): Promise<void> {
    const sql = fs.readFileSync(path.join(__dirname, "005_add_audit_triggers.sql"), "utf8");
    await queryRunner.query(sql);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_jobs_status_notification ON jobs;
DROP TRIGGER IF EXISTS trg_ledger_entries_balance_consistency ON ledger_entries;
DROP FUNCTION IF EXISTS notify_job_status_change();
DROP FUNCTION IF EXISTS validate_ledger_balance_consistency();
DROP FUNCTION IF EXISTS audit_log_row_changes();
DROP FUNCTION IF EXISTS set_updated_at_timestamp();`);
  }
}
