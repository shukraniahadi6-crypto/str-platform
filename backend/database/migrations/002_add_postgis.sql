-- 002_add_postgis.sql
-- Purpose: Enable PostGIS and add spatial columns.

CREATE EXTENSION IF NOT EXISTS postgis;

ALTER TABLE job_locations ADD COLUMN IF NOT EXISTS geom geometry(Point, 4326);
ALTER TABLE courier_locations ADD COLUMN IF NOT EXISTS geom geometry(Point, 4326);
ALTER TABLE transfer_stations ADD COLUMN IF NOT EXISTS geom geometry(Point, 4326);
ALTER TABLE donation_partners ADD COLUMN IF NOT EXISTS geom geometry(Point, 4326);
ALTER TABLE neighborhood_groups ADD COLUMN IF NOT EXISTS geom geometry(Polygon, 4326);

UPDATE job_locations SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
WHERE geom IS NULL AND longitude IS NOT NULL AND latitude IS NOT NULL;
UPDATE courier_locations SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
WHERE geom IS NULL AND longitude IS NOT NULL AND latitude IS NOT NULL;
UPDATE transfer_stations SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
WHERE geom IS NULL AND longitude IS NOT NULL AND latitude IS NOT NULL;
UPDATE donation_partners SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
WHERE geom IS NULL AND longitude IS NOT NULL AND latitude IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_job_locations_geom ON job_locations USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_courier_locations_geom ON courier_locations USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_transfer_stations_geom ON transfer_stations USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_donation_partners_geom ON donation_partners USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_neighborhood_groups_geom ON neighborhood_groups USING GIST (geom);
