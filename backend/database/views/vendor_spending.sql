CREATE OR REPLACE VIEW view_vendor_spending AS
SELECT
  vendor_id,
  SUM(amount) FILTER (WHERE status = 'COMPLETED') AS total_spent,
  COUNT(*) FILTER (WHERE status = 'COMPLETED') AS job_count,
  AVG(amount) FILTER (WHERE status = 'COMPLETED') AS avg_job_cost
FROM payments
GROUP BY vendor_id;
