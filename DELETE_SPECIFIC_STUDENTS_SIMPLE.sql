-- ========================================
-- SIMPLE DELETE (No detailed logging)
-- ========================================
-- Deletes 3 student accounts and all related data
-- Run this in Supabase SQL Editor
-- ========================================

-- Delete student sessions
DELETE FROM student_sessions 
WHERE student_id IN (
  SELECT id FROM students 
  WHERE email IN (
    'ceesproductions@gmail.com',
    'sarrol@vonwillingh.co.za',
    'mandatetracker@mjgrealestate.co.za'
  )
);

-- Delete quiz attempts
DELETE FROM quiz_attempts 
WHERE student_id IN (
  SELECT id FROM students 
  WHERE email IN (
    'ceesproductions@gmail.com',
    'sarrol@vonwillingh.co.za',
    'mandatetracker@mjgrealestate.co.za'
  )
);

-- Delete student progress
DELETE FROM student_progress 
WHERE student_id IN (
  SELECT id FROM students 
  WHERE email IN (
    'ceesproductions@gmail.com',
    'sarrol@vonwillingh.co.za',
    'mandatetracker@mjgrealestate.co.za'
  )
);

-- Delete module progress
DELETE FROM module_progress 
WHERE student_id IN (
  SELECT id FROM students 
  WHERE email IN (
    'ceesproductions@gmail.com',
    'sarrol@vonwillingh.co.za',
    'mandatetracker@mjgrealestate.co.za'
  )
);

-- Delete enrollments
DELETE FROM enrollments 
WHERE student_id IN (
  SELECT id FROM students 
  WHERE email IN (
    'ceesproductions@gmail.com',
    'sarrol@vonwillingh.co.za',
    'mandatetracker@mjgrealestate.co.za'
  )
);

-- Delete applications
DELETE FROM applications 
WHERE student_id IN (
  SELECT id FROM students 
  WHERE email IN (
    'ceesproductions@gmail.com',
    'sarrol@vonwillingh.co.za',
    'mandatetracker@mjgrealestate.co.za'
  )
);

-- Delete students
DELETE FROM students 
WHERE email IN (
  'ceesproductions@gmail.com',
  'sarrol@vonwillingh.co.za',
  'mandatetracker@mjgrealestate.co.za'
);

-- Verify deletion
SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ All 3 students deleted successfully'
    ELSE '⚠️ ' || COUNT(*) || ' student(s) still exist - check for errors'
  END AS status
FROM students
WHERE email IN (
  'ceesproductions@gmail.com',
  'sarrol@vonwillingh.co.za',
  'mandatetracker@mjgrealestate.co.za'
);
