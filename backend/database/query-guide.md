# Query and Performance Guide

## Index strategy
- FK/composite indexes: jobs by `(vendor_id,status)`, offer pings by `(courier_id,created_at)`
- Partial indexes for active statuses and neighborhood groups where status is ACTIVE
- GiST indexes on all PostGIS geometry columns
- GIN index on jobs full-text search vector

## Partitioning strategy
- `jobs` and `ledger_entries` should be range-partitioned monthly by `created_at` in high-volume environments
- keep rolling 12 months hot partitions + archive older partitions

## Query guidance
- Prefer explicit JOINs over correlated subqueries for dispatch/routing lookups
- Use `ST_DWithin` with geography casts for radius queries in meters
- Use materialized views for heavy dashboards, refresh on schedule

## Connection pooling
- Suggested pool min/max: 5/30 API workers
- Use transaction timeouts and statement timeouts for long-running analytics

## Maintenance
- Run `VACUUM (ANALYZE)` daily for active tables
- Weekly `REINDEX CONCURRENTLY` on high-churn indexes (off-peak)
