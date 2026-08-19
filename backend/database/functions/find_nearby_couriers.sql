CREATE OR REPLACE FUNCTION find_nearby_couriers(
  job_location geometry,
  radius_km NUMERIC,
  result_limit INTEGER DEFAULT 20
) RETURNS TABLE(courier_id UUID, distance_km NUMERIC) AS $$
BEGIN
  RETURN QUERY
  SELECT cl.courier_id,
         (ST_DistanceSphere(cl.geom, job_location) / 1000.0)::NUMERIC AS distance_km
  FROM courier_locations cl
  WHERE cl.geom IS NOT NULL
    AND ST_DWithin(cl.geom::geography, job_location::geography, radius_km * 1000)
  ORDER BY cl.geom <-> job_location
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql STABLE;
