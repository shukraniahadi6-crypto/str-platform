CREATE OR REPLACE FUNCTION find_nearby_jobs(
  courier_location geometry,
  radius_km NUMERIC
) RETURNS TABLE(job_id UUID, distance_km NUMERIC, status job_status_enum) AS $$
BEGIN
  RETURN QUERY
  SELECT j.id,
         (ST_DistanceSphere(jl.geom, courier_location) / 1000.0)::NUMERIC,
         j.status
  FROM jobs j
  JOIN job_locations jl ON jl.job_id = j.id
  WHERE jl.geom IS NOT NULL
    AND j.status IN ('PENDING','ASSIGNED')
    AND ST_DWithin(jl.geom::geography, courier_location::geography, radius_km * 1000)
  ORDER BY jl.geom <-> courier_location;
END;
$$ LANGUAGE plpgsql STABLE;
