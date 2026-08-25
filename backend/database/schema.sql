-- Complete schema bootstrap for STR Platform
\i migrations/001_initial_schema.sql
\i migrations/002_add_postgis.sql
\i migrations/003_add_indexes.sql
\i migrations/004_add_fts.sql
\i migrations/005_add_audit_triggers.sql
\i functions/calculate_distance.sql
\i functions/find_nearby_couriers.sql
\i functions/find_nearby_jobs.sql
\i functions/verify_ledger_integrity.sql
\i functions/calculate_green_impact.sql
\i functions/process_batch_discount.sql
\i views/daily_revenue.sql
\i views/courier_earnings.sql
\i views/job_completion_stats.sql
\i views/vendor_spending.sql
\i views/green_impact_summary.sql
