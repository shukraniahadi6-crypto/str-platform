-- See migration 005 for trigger installation.
CREATE OR REPLACE FUNCTION audit_log_row_changes() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log(table_name, record_id, operation, changed_data)
    VALUES (TG_TABLE_NAME, OLD.id, TG_OP, to_jsonb(OLD));
    RETURN OLD;
  END IF;

  INSERT INTO audit_log(table_name, record_id, operation, changed_data)
  VALUES (TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(NEW));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
