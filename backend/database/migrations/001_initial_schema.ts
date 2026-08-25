import { MigrationInterface, QueryRunner } from "typeorm";
import fs from "node:fs";
import path from "node:path";

export class InitialSchema001 implements MigrationInterface {
  name = "InitialSchema001";

  async up(queryRunner: QueryRunner): Promise<void> {
    const sql = fs.readFileSync(path.join(__dirname, "001_initial_schema.sql"), "utf8");
    await queryRunner.query(sql);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
  }
}
