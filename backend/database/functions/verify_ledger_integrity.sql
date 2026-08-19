CREATE OR REPLACE FUNCTION verify_ledger_integrity()
RETURNS TABLE(total_debits NUMERIC, total_credits NUMERIC, is_balanced BOOLEAN) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(debit_amount),0),
    COALESCE(SUM(credit_amount),0),
    COALESCE(SUM(debit_amount),0) = COALESCE(SUM(credit_amount),0)
  FROM ledger_entries;
END;
$$ LANGUAGE plpgsql STABLE;
