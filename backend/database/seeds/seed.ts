/* eslint-disable no-console */
const fs = require("node:fs");
const path = require("node:path");
const { Client } = require("pg");

const base = __dirname;
const enabled = process.env.SEED_OPTIONAL !== "false";

const readJson = (name) => JSON.parse(fs.readFileSync(path.join(base, name), "utf8"));

async function run() {
  if (!enabled) {
    console.log("Seed execution disabled by SEED_OPTIONAL=false");
    return;
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const users = readJson("test-users.json");
  const jobs = readJson("sample-jobs.json");
  const offers = readJson("sample-offers.json");
  const ledger = readJson("sample-ledger-entries.json");
  const metrics = readJson("sample-green-impact-metrics.json");
  const stations = readJson("transfer-stations.json");
  const partners = readJson("donation-partners.json");
  const courses = readJson("courses.json");
  const badges = readJson("badges.json");
  const neighborhoods = readJson("neighborhood-groups.json");

  await client.query("BEGIN");
  try {
    for (const u of users) {
      await client.query(
        `INSERT INTO users(email, phone, password_hash, auth_provider, role)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (email) DO UPDATE SET phone = EXCLUDED.phone, role = EXCLUDED.role`,
        [u.email, u.phone, u.password_hash, u.auth_provider, u.role]
      );
    }

    for (const s of stations) {
      await client.query(
        `INSERT INTO transfer_stations(name, latitude, longitude, capacity, hours_json, waste_classes_accepted)
         VALUES ($1,$2,$3,$4,$5::jsonb,$6)
         ON CONFLICT DO NOTHING`,
        [s.name, s.latitude, s.longitude, s.capacity, JSON.stringify(s.hours), s.waste_classes_accepted]
      );
    }

    for (const p of partners) {
      await client.query(
        `INSERT INTO donation_partners(name, latitude, longitude, upcyclable_categories, contact_info)
         VALUES ($1,$2,$3,$4,$5::jsonb)
         ON CONFLICT DO NOTHING`,
        [p.name, p.latitude, p.longitude, p.upcyclable_categories, JSON.stringify(p.contact_info)]
      );
    }

    for (const c of courses) {
      await client.query(
        `INSERT INTO courses(title, category, description, quiz_questions_json, difficulty)
         VALUES ($1,$2,$3,$4::jsonb,$5)
         ON CONFLICT DO NOTHING`,
        [c.title, c.category, c.description, JSON.stringify(c.quiz_questions_json), c.difficulty]
      );
    }

    for (const b of badges) {
      await client.query(
        `INSERT INTO badges(name, icon_url, description, requirement_type, requirement_value)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (name) DO NOTHING`,
        [b.name, b.icon_url, b.description, b.requirement_type, b.requirement_value]
      );
    }

    for (const n of neighborhoods) {
      await client.query(
        `INSERT INTO neighborhood_groups(polygon_coordinates, discount_rate, alert_radius_m, city, status)
         VALUES ($1::jsonb,$2,$3,$4,$5)
         ON CONFLICT DO NOTHING`,
        [JSON.stringify(n.coordinates), n.discount_rate, n.alert_radius_m, n.city, n.status]
      );
    }

    const vendorIds = (await client.query(`SELECT id FROM users WHERE role='VENDOR' ORDER BY created_at`)).rows.map((r) => r.id);
    const courierIds = (await client.query(`SELECT id FROM users WHERE role='COURIER' ORDER BY created_at`)).rows.map((r) => r.id);

    for (const id of vendorIds) {
      await client.query(
        `INSERT INTO vendor_accounts(user_id) VALUES($1)
         ON CONFLICT (user_id) DO NOTHING`,
        [id]
      );
    }

    for (const id of courierIds) {
      await client.query(
        `INSERT INTO courier_accounts(user_id) VALUES($1)
         ON CONFLICT (user_id) DO NOTHING`,
        [id]
      );
    }

    await client.query(`DELETE FROM offer_pings WHERE job_id IN (SELECT id FROM jobs WHERE address LIKE '%Green Ave%')`);
    await client.query(`DELETE FROM green_impact_metrics WHERE job_id IN (SELECT id FROM jobs WHERE address LIKE '%Green Ave%')`);
    await client.query(`DELETE FROM jobs WHERE address LIKE '%Green Ave%'`);

    const jobIds = [];
    for (let i = 0; i < jobs.length; i += 1) {
      const vendorId = vendorIds[i % vendorIds.length];
      const courierId = ["ASSIGNED", "IN_PROGRESS", "COMPLETED"].includes(jobs[i].status)
        ? courierIds[i % courierIds.length]
        : null;
      const inserted = await client.query(
        `INSERT INTO jobs(vendor_id, courier_id, address, items_json, estimated_volume, status, scheduled_at)
         VALUES ($1,$2,$3,$4::jsonb,$5,$6,$7)
         RETURNING id`,
        [vendorId, courierId, jobs[i].address, JSON.stringify(jobs[i].items_json), jobs[i].estimated_volume, jobs[i].status, jobs[i].scheduled_at]
      );
      jobIds.push(inserted.rows[0].id);
    }

    for (let i = 0; i < offers.length; i += 1) {
      await client.query(
        `INSERT INTO offer_pings(job_id, courier_id, upfront_pay, estimated_distance, expires_at, status)
         VALUES ($1,$2,$3,$4,NOW() + ($5::text || ' minutes')::interval,$6)`,
        [jobIds[i % jobIds.length], courierIds[i % courierIds.length], offers[i].upfront_pay, offers[i].estimated_distance, offers[i].expires_in_minutes, offers[i].status]
      );
    }

    await client.query(`DELETE FROM ledger_entries WHERE transaction_type LIKE 'SEED_%'`);
    const vendorAccountRows = await client.query(`SELECT id FROM vendor_accounts ORDER BY created_at`);
    const fallbackAccountId = vendorAccountRows.rows[0] ? vendorAccountRows.rows[0].id : null;

    for (const l of ledger) {
      await client.query(
        `INSERT INTO ledger_entries(account_id, debit_amount, credit_amount, transaction_type, job_id)
         VALUES (COALESCE($1, uuid_generate_v4()), $2, $3, $4, $5)`,
        [
          fallbackAccountId,
          l.debit_amount,
          l.credit_amount,
          `SEED_${l.transaction_type}`,
          jobIds[Math.floor(Math.random() * jobIds.length)]
        ]
      );
    }

    for (let i = 0; i < metrics.length; i += 1) {
      await client.query(
        `INSERT INTO green_impact_metrics(job_id, landfill_diversion_pct, co2_saved_kg, trees_equivalent)
         VALUES ($1,$2,$3,$4)
         ON CONFLICT (job_id) DO UPDATE SET
           landfill_diversion_pct = EXCLUDED.landfill_diversion_pct,
           co2_saved_kg = EXCLUDED.co2_saved_kg,
           trees_equivalent = EXCLUDED.trees_equivalent`,
        [jobIds[i % jobIds.length], metrics[i].landfill_diversion_pct, metrics[i].co2_saved_kg, metrics[i].trees_equivalent]
      );
    }

    await client.query("COMMIT");
    console.log("Seed completed successfully.");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
