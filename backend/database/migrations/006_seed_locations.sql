-- 006_seed_locations.sql
-- Purpose: Seed transfer stations, donation partners, neighborhood groups.

INSERT INTO transfer_stations(name, latitude, longitude, capacity, hours_json, waste_classes_accepted)
VALUES
  ('Transfer Station 1', 47.500, -122.350, 300, '{"open":"07:00","close":"18:00"}', ARRAY['general','recycle']),
  ('Transfer Station 2', 47.510, -122.340, 325, '{"open":"07:00","close":"18:00"}', ARRAY['general','recycle']),
  ('Transfer Station 3', 47.520, -122.330, 350, '{"open":"07:00","close":"18:00"}', ARRAY['general','recycle']),
  ('Transfer Station 4', 47.530, -122.320, 375, '{"open":"07:00","close":"18:00"}', ARRAY['general','hazmat']),
  ('Transfer Station 5', 47.540, -122.310, 400, '{"open":"07:00","close":"18:00"}', ARRAY['general','recycle']),
  ('Transfer Station 6', 47.550, -122.300, 425, '{"open":"07:00","close":"18:00"}', ARRAY['general','recycle']),
  ('Transfer Station 7', 47.560, -122.290, 450, '{"open":"07:00","close":"18:00"}', ARRAY['general','hazmat']),
  ('Transfer Station 8', 47.570, -122.280, 475, '{"open":"07:00","close":"18:00"}', ARRAY['general','recycle']),
  ('Transfer Station 9', 47.580, -122.270, 500, '{"open":"07:00","close":"18:00"}', ARRAY['general','recycle']),
  ('Transfer Station 10', 47.590, -122.260, 525, '{"open":"07:00","close":"18:00"}', ARRAY['general','recycle'])
ON CONFLICT DO NOTHING;

INSERT INTO donation_partners(name, latitude, longitude, upcyclable_categories, contact_info)
VALUES
  ('Donation Partner 1', 47.550, -122.310, ARRAY['furniture'], '{"phone":"+12065550100","email":"partner1@example.org"}'),
  ('Donation Partner 2', 47.558, -122.304, ARRAY['electronics'], '{"phone":"+12065550101","email":"partner2@example.org"}'),
  ('Donation Partner 3', 47.566, -122.298, ARRAY['textiles'], '{"phone":"+12065550102","email":"partner3@example.org"}'),
  ('Donation Partner 4', 47.574, -122.292, ARRAY['appliances'], '{"phone":"+12065550103","email":"partner4@example.org"}'),
  ('Donation Partner 5', 47.582, -122.286, ARRAY['wood'], '{"phone":"+12065550104","email":"partner5@example.org"}'),
  ('Donation Partner 6', 47.590, -122.280, ARRAY['furniture'], '{"phone":"+12065550105","email":"partner6@example.org"}'),
  ('Donation Partner 7', 47.598, -122.274, ARRAY['electronics'], '{"phone":"+12065550106","email":"partner7@example.org"}'),
  ('Donation Partner 8', 47.606, -122.268, ARRAY['textiles'], '{"phone":"+12065550107","email":"partner8@example.org"}'),
  ('Donation Partner 9', 47.614, -122.262, ARRAY['appliances'], '{"phone":"+12065550108","email":"partner9@example.org"}'),
  ('Donation Partner 10', 47.622, -122.256, ARRAY['wood'], '{"phone":"+12065550109","email":"partner10@example.org"}'),
  ('Donation Partner 11', 47.630, -122.250, ARRAY['furniture'], '{"phone":"+12065550110","email":"partner11@example.org"}'),
  ('Donation Partner 12', 47.638, -122.244, ARRAY['electronics'], '{"phone":"+12065550111","email":"partner12@example.org"}'),
  ('Donation Partner 13', 47.646, -122.238, ARRAY['textiles'], '{"phone":"+12065550112","email":"partner13@example.org"}'),
  ('Donation Partner 14', 47.654, -122.232, ARRAY['appliances'], '{"phone":"+12065550113","email":"partner14@example.org"}'),
  ('Donation Partner 15', 47.662, -122.226, ARRAY['wood'], '{"phone":"+12065550114","email":"partner15@example.org"}')
ON CONFLICT DO NOTHING;
