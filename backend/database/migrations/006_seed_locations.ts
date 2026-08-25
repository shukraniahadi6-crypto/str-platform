import { MigrationInterface, QueryRunner } from "typeorm";
import fs from "node:fs";
import path from "node:path";

export class SeedLocations006 implements MigrationInterface {
  name = "SeedLocations006";

  async up(queryRunner: QueryRunner): Promise<void> {
    const sql = fs.readFileSync(path.join(__dirname, "006_seed_locations.sql"), "utf8");
    await queryRunner.query(sql);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM donation_partners WHERE name LIKE 'Donation Partner %';
DELETE FROM transfer_stations WHERE name LIKE 'Transfer Station %';`);
  }
}
