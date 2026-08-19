CREATE OR REPLACE VIEW view_job_completion_stats AS
SELECT
  ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'COMPLETED') / NULLIF(COUNT(*), 0), 2) AS completion_rate_pct,
  ROUND(AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 60) FILTER (WHERE status = 'COMPLETED'), 2) AS avg_completion_time_minutes,
  COUNT(*) AS total_jobs
FROM jobs;
