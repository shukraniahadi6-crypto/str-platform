-- 005_add_audit_triggers.sql
-- Purpose: updated_at maintenance, audit logging, ledger and job status triggers.

CREATE OR REPLACE FUNCTION set_updated_at_timestamp() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION audit_log_row_changes() RETURNS trigger AS $$
DECLARE payload jsonb;
BEGIN
  IF TG_OP = 'DELETE' THEN
    payload := to_jsonb(OLD);
    INSERT INTO audit_log(table_name, record_id, operation, changed_data)
    VALUES (TG_TABLE_NAME, OLD.id, TG_OP, payload);
    RETURN OLD;
  ELSE
    payload := to_jsonb(NEW);
    INSERT INTO audit_log(table_name, record_id, operation, changed_data)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, payload);
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION validate_ledger_balance_consistency() RETURNS trigger AS $$
BEGIN
  IF NEW.debit_amount < 0 OR NEW.credit_amount < 0 THEN
    RAISE EXCEPTION 'Ledger amounts must be non-negative';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION notify_job_status_change() RETURNS trigger AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status AND NEW.courier_id IS NOT NULL THEN
    INSERT INTO notification_logs(user_id, event_type, message)
    VALUES (
      NEW.courier_id,
      'JOB_STATUS_CHANGED',
      format('Job %s status changed to %s', NEW.id, NEW.status::text)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT table_name FROM information_schema.columns
    WHERE table_schema='public'
      AND column_name='updated_at'
      AND table_name <> 'audit_log'
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%I_updated_at ON %I;', r.table_name, r.table_name);
    EXECUTE format('CREATE TRIGGER trg_%I_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();', r.table_name, r.table_name);

    EXECUTE format('DROP TRIGGER IF EXISTS trg_%I_audit ON %I;', r.table_name, r.table_name);
    EXECUTE format('CREATE TRIGGER trg_%I_audit AFTER INSERT OR UPDATE OR DELETE ON %I FOR EACH ROW EXECUTE FUNCTION audit_log_row_changes();', r.table_name, r.table_name);
  END LOOP;
END $$;

DROP TRIGGER IF EXISTS trg_ledger_entries_balance_consistency ON ledger_entries;
CREATE TRIGGER trg_ledger_entries_balance_consistency
BEFORE INSERT OR UPDATE ON ledger_entries
FOR EACH ROW EXECUTE FUNCTION validate_ledger_balance_consistency();

DROP TRIGGER IF EXISTS trg_jobs_status_notification ON jobs;
CREATE TRIGGER trg_jobs_status_notification
AFTER UPDATE OF status ON jobs
FOR EACH ROW EXECUTE FUNCTION notify_job_status_change();
