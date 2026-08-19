import { MigrationInterface, QueryRunner } from "typeorm";
import fs from "node:fs";
import path from "node:path";

export class AddPostgis002 implements MigrationInterface {
  name = "AddPostgis002";

  async up(queryRunner: QueryRunner): Promise<void> {
    const sql = fs.readFileSync(path.join(__dirname, "002_add_postgis.sql"), "utf8");
    await queryRunner.query(sql);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_neighborhood_groups_geom;
DROP INDEX IF EXISTS idx_donation_partners_geom;
DROP INDEX IF EXISTS idx_transfer_stations_geom;
DROP INDEX IF EXISTS idx_courier_locations_geom;
DROP INDEX IF EXISTS idx_job_locations_geom;
ALTER TABLE neighborhood_groups DROP COLUMN IF EXISTS geom;
ALTER TABLE donation_partners DROP COLUMN IF EXISTS geom;
ALTER TABLE transfer_stations DROP COLUMN IF EXISTS geom;
ALTER TABLE courier_locations DROP COLUMN IF EXISTS geom;
ALTER TABLE job_locations DROP COLUMN IF EXISTS geom;`);
  }
}
