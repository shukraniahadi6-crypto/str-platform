-- 007_seed_courses.sql
-- Purpose: Seed baseline academy courses and badges.

INSERT INTO courses(title, category, description, quiz_questions_json, difficulty)
VALUES
  ('Hazmat Essentials', 'Safety', 'Identify and isolate hazardous waste.', '[{"q":"Wear PPE?","a":"Yes"}]', 'ADVANCED'),
  ('Heavy Lifting 101', 'Safety', 'Safe lift and carry methods.', '[{"q":"Lift with your legs?","a":"Yes"}]', 'INTERMEDIATE'),
  ('Courier Safety Basics', 'Safety', 'Road and site safety fundamentals.', '[{"q":"Use hazard lights?","a":"Yes"}]', 'BEGINNER'),
  ('Route Efficiency', 'Operations', 'Batching and route planning.', '[{"q":"Cluster nearby jobs?","a":"Yes"}]', 'BEGINNER'),
  ('Eco Practices', 'Sustainability', 'Maximize recycling and donation outcomes.', '[{"q":"Sort recyclable streams?","a":"Yes"}]', 'INTERMEDIATE')
ON CONFLICT DO NOTHING;

INSERT INTO badges(name, icon_url, description, requirement_type, requirement_value)
VALUES
  ('Safety Starter', 'https://cdn.example.com/badges/1.png', 'Safety Starter achievement badge', 'COURSE_ID', 'course'),
  ('Hazmat Hero', 'https://cdn.example.com/badges/2.png', 'Hazmat Hero achievement badge', 'COURSE_ID', 'course'),
  ('Lift Master', 'https://cdn.example.com/badges/3.png', 'Lift Master achievement badge', 'COURSE_ID', 'course'),
  ('Route Ninja', 'https://cdn.example.com/badges/4.png', 'Route Ninja achievement badge', 'COURSE_ID', 'course'),
  ('Eco Champion', 'https://cdn.example.com/badges/5.png', 'Eco Champion achievement badge', 'COURSE_ID', 'course'),
  ('Donation Driver', 'https://cdn.example.com/badges/6.png', 'Donation Driver achievement badge', 'COURSE_ID', 'course'),
  ('Five Star Service', 'https://cdn.example.com/badges/7.png', 'Five Star Service achievement badge', 'RATING_THRESHOLD', '4.5'),
  ('Speed Runner', 'https://cdn.example.com/badges/8.png', 'Speed Runner achievement badge', 'RATING_THRESHOLD', '4.6'),
  ('Night Shift Pro', 'https://cdn.example.com/badges/9.png', 'Night Shift Pro achievement badge', 'RATING_THRESHOLD', '4.7'),
  ('Community Impact', 'https://cdn.example.com/badges/10.png', 'Community Impact achievement badge', 'RATING_THRESHOLD', '4.8')
ON CONFLICT DO NOTHING;
