CREATE OR REPLACE FUNCTION calculate_green_impact(target_job_id UUID)
RETURNS TABLE(landfill_diversion_pct NUMERIC, co2_saved_kg NUMERIC, trees_equivalent NUMERIC) AS $$
DECLARE
  volume NUMERIC;
BEGIN
  SELECT estimated_volume INTO volume FROM jobs WHERE id = target_job_id;
  IF volume IS NULL THEN
    RAISE EXCEPTION 'Job % not found', target_job_id;
  END IF;

  landfill_diversion_pct := LEAST(100, GREATEST(0, volume * 12));
  co2_saved_kg := ROUND(volume * 18.5, 2);
  trees_equivalent := ROUND(co2_saved_kg / 21.77, 2);

  INSERT INTO green_impact_metrics(job_id, landfill_diversion_pct, co2_saved_kg, trees_equivalent)
  VALUES(target_job_id, landfill_diversion_pct, co2_saved_kg, trees_equivalent)
  ON CONFLICT (job_id) DO UPDATE SET
    landfill_diversion_pct = EXCLUDED.landfill_diversion_pct,
    co2_saved_kg = EXCLUDED.co2_saved_kg,
    trees_equivalent = EXCLUDED.trees_equivalent,
    updated_at = NOW();

  RETURN QUERY SELECT landfill_diversion_pct, co2_saved_kg, trees_equivalent;
END;
$$ LANGUAGE plpgsql;
