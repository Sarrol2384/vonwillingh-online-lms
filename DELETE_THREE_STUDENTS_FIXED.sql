-- ========================================
-- DELETE THREE SPECIFIC STUDENTS (FIXED)
-- ========================================
-- Emails to delete:
-- 1. ceesproductions@gmail.com
-- 2. sarrol@vonwillingh.co.za  
-- 3. mandatetracker@mjgrealestate.co.za
-- ========================================
-- Run this in Supabase SQL Editor
-- ========================================

-- Step 1: Delete all related data FIRST (to avoid foreign key errors)

-- Delete certificates
DELETE FROM "Certificates" 
WHERE student_id IN (
  SELECT id FROM students 
  WHERE email IN (
    'ceesproductions@gmail.com',
    'sarrol@vonwillingh.co.za',
    'mandatetracker@mjgrealestate.co.za'
  )
);

-- Delete payment proofs
DELETE FROM "payment-proofs" 
WHERE student_id IN (
  SELECT id FROM students 
  WHERE email IN (
    'ceesproductions@gmail.com',
    'sarrol@vonwillingh.co.za',
    'mandatetracker@mjgrealestate.co.za'
  )
);

-- Delete payments
DELETE FROM payments 
WHERE student_id IN (
  SELECT id FROM students 
  WHERE email IN (
    'ceesproductions@gmail.com',
    'sarrol@vonwillingh.co.za',
    'mandatetracker@mjgrealestate.co.za'
  )
);

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

-- Delete module content completion
DELETE FROM module_content_completion 
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

-- Step 2: Finally delete the students themselves
DELETE FROM students 
WHERE email IN (
  'ceesproductions@gmail.com',
  'sarrol@vonwillingh.co.za',
  'mandatetracker@mjgrealestate.co.za'
);

-- Step 3: Verify deletion
SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ SUCCESS: All 3 students deleted completely'
    ELSE '⚠️ WARNING: ' || COUNT(*) || ' student(s) still exist in database'
  END AS deletion_status,
  COALESCE(STRING_AGG(email, ', '), 'None') AS remaining_emails
FROM students
WHERE email IN (
  'ceesproductions@gmail.com',
  'sarrol@vonwillingh.co.za',
  'mandatetracker@mjgrealestate.co.za'
);
