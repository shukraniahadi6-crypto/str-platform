CREATE OR REPLACE FUNCTION validate_ledger_balance_consistency() RETURNS trigger AS $$
BEGIN
  IF NEW.debit_amount < 0 OR NEW.credit_amount < 0 THEN
    RAISE EXCEPTION 'Invalid ledger entry amount';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
