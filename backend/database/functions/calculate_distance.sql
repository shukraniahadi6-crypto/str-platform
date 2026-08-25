CREATE OR REPLACE FUNCTION calculate_distance_between_coordinates(
  lat1 DOUBLE PRECISION,
  lon1 DOUBLE PRECISION,
  lat2 DOUBLE PRECISION,
  lon2 DOUBLE PRECISION
) RETURNS DOUBLE PRECISION AS $$
DECLARE
  distance_meters DOUBLE PRECISION;
BEGIN
  distance_meters := ST_DistanceSphere(
    ST_SetSRID(ST_MakePoint(lon1, lat1), 4326),
    ST_SetSRID(ST_MakePoint(lon2, lat2), 4326)
  );
  RETURN distance_meters / 1000.0;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
