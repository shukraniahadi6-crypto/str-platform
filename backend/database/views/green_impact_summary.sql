CREATE OR REPLACE VIEW view_green_impact_summary AS
SELECT
  SUM(co2_saved_kg) AS total_co2_saved,
  SUM(trees_equivalent) AS total_trees_equivalent,
  AVG(landfill_diversion_pct) AS landfill_diversion_pct
FROM green_impact_metrics;
