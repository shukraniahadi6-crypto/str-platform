import { MigrationInterface, QueryRunner } from "typeorm";
import fs from "node:fs";
import path from "node:path";

export class SeedCourses007 implements MigrationInterface {
  name = "SeedCourses007";

  async up(queryRunner: QueryRunner): Promise<void> {
    const sql = fs.readFileSync(path.join(__dirname, "007_seed_courses.sql"), "utf8");
    await queryRunner.query(sql);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM badges WHERE name IN ('Safety Starter','Hazmat Hero','Lift Master','Route Ninja','Eco Champion','Donation Driver','Five Star Service','Speed Runner','Night Shift Pro','Community Impact');
DELETE FROM courses WHERE title IN ('Hazmat Essentials','Heavy Lifting 101','Courier Safety Basics','Route Efficiency','Eco Practices');`);
  }
}
