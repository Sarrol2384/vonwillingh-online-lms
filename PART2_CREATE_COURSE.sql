-- ============================================================
-- PART 2: CREATE COURSE
-- ============================================================

INSERT INTO courses (name, code, level, category, description, duration, price)
VALUES (
  'Test: Business Leadership Fundamentals',
  'TESTLEAD001',
  'Certificate',
  'Leadership',
  'A simple test course to verify the JSON structure for professional leadership content with proper formatting and quiz separation.',
  '2 weeks',
  0
);

-- Verify course created
SELECT 
  'Course created!' AS status,
  id AS course_id,
  name,
  code
FROM courses 
WHERE code = 'TESTLEAD001';
