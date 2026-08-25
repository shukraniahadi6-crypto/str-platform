-- 003_add_indexes.sql
-- Purpose: Add foreign key, composite, partial, and analytics indexes.

CREATE INDEX IF NOT EXISTS idx_jobs_vendor_status ON jobs(vendor_id, status);
CREATE INDEX IF NOT EXISTS idx_jobs_courier_created_at ON jobs(courier_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_offer_pings_job_status ON offer_pings(job_id, status);
CREATE INDEX IF NOT EXISTS idx_offer_pings_courier_created_at ON offer_pings(courier_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_created_at ON notification_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_created_at ON ledger_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_job_id ON ledger_entries(job_id);
CREATE INDEX IF NOT EXISTS idx_payments_vendor_status ON payments(vendor_id, status);
CREATE INDEX IF NOT EXISTS idx_payouts_courier_status ON payouts(courier_id, status);
CREATE INDEX IF NOT EXISTS idx_neighborhood_groups_active_city ON neighborhood_groups(city) WHERE status = 'ACTIVE';
CREATE INDEX IF NOT EXISTS idx_jobs_status_active ON jobs(created_at DESC) WHERE status IN ('PENDING','ASSIGNED','IN_PROGRESS');

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'jobs_vendor_not_courier_ck'
  ) THEN
    ALTER TABLE jobs
      ADD CONSTRAINT jobs_vendor_not_courier_ck
      CHECK (vendor_id IS DISTINCT FROM courier_id);
  END IF;
END $$;
