CREATE OR REPLACE VIEW view_courier_earnings AS
SELECT
  ca.user_id AS courier_id,
  SUM(le.credit_amount - le.debit_amount) FILTER (WHERE le.created_at >= NOW() - INTERVAL '1 day') AS daily_earnings,
  SUM(le.credit_amount - le.debit_amount) FILTER (WHERE le.created_at >= NOW() - INTERVAL '7 day') AS weekly_earnings,
  COUNT(DISTINCT j.id) FILTER (WHERE j.status = 'COMPLETED') AS total_completed_jobs
FROM courier_accounts ca
LEFT JOIN ledger_entries le ON le.account_id = ca.id
LEFT JOIN jobs j ON j.courier_id = ca.user_id
GROUP BY ca.user_id;
