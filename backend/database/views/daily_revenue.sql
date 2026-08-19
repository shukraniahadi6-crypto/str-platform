CREATE OR REPLACE VIEW view_daily_revenue AS
SELECT
  DATE(created_at) AS date,
  SUM(amount) FILTER (WHERE status = 'COMPLETED') AS total_revenue,
  COUNT(*) FILTER (WHERE status = 'COMPLETED') AS total_jobs,
  AVG(amount) FILTER (WHERE status = 'COMPLETED') AS avg_job_value
FROM payments
GROUP BY DATE(created_at);
