-- 004_add_fts.sql
-- Purpose: Full-text search on job address + items.

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS search_vector tsvector;

CREATE OR REPLACE FUNCTION jobs_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.address, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.items_json::text, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_jobs_search_vector ON jobs;
CREATE TRIGGER trg_jobs_search_vector
BEFORE INSERT OR UPDATE OF address, items_json ON jobs
FOR EACH ROW EXECUTE FUNCTION jobs_search_vector_update();

UPDATE jobs
SET search_vector =
  setweight(to_tsvector('english', COALESCE(address, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(items_json::text, '')), 'B')
WHERE search_vector IS NULL;

CREATE INDEX IF NOT EXISTS idx_jobs_search_vector ON jobs USING GIN (search_vector);
