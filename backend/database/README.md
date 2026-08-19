# STR Platform Database

Production-oriented PostgreSQL 15 + PostGIS schema for STR Platform.

## Features
- UUID primary keys, enums, JSONB columns, and strict constraints
- Spatial support with PostGIS POINT/POLYGON columns and GiST indexes
- Full-text search for job address/items
- Audit log + updated_at triggers
- Ledger validation and domain functions
- Seed pipeline with idempotent upserts

## Structure
- `migrations/` SQL and TypeORM migration scaffolding
- `functions/` reusable SQL functions
- `triggers/` trigger functions
- `views/` analytics/reporting views
- `seeds/` JSON fixtures and `seed.ts` runner
- `schema.sql` full bootstrap entrypoint

## Quick start
```bash
export DATABASE_URL=******localhost:5432/str_platform
psql "$DATABASE_URL" -f backend/database/schema.sql
node backend/database/seeds/seed.ts
```

## Migration order
1. 001_initial_schema.sql
2. 002_add_postgis.sql
3. 003_add_indexes.sql
4. 004_add_fts.sql
5. 005_add_audit_triggers.sql
6. 006_seed_locations.sql
7. 007_seed_courses.sql

## Rollback guidance
Use transaction-wrapped down migration scripts in your migration framework; SQL files are idempotent for repeated runs.
