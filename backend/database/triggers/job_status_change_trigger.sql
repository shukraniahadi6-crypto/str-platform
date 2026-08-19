CREATE OR REPLACE FUNCTION notify_job_status_change() RETURNS trigger AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO notification_logs(user_id, event_type, message)
    VALUES (COALESCE(NEW.courier_id, NEW.vendor_id), 'JOB_STATUS_CHANGED', format('Job %s moved to %s', NEW.id, NEW.status));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
