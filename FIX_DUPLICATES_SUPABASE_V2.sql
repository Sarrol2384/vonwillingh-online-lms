-- ============================================================
-- FIX DUPLICATE ENROLLMENTS - VERSION 2 (SIMPLIFIED)
-- ============================================================
-- This version doesn't require the users table
-- Works directly with enrollments table only
-- ============================================================

-- Step 1: View current duplicates (WITHOUT users table)
SELECT 
  e.user_id,
  e.id as enrollment_id,
  e.enrolled_at,
  ROW_NUMBER() OVER (PARTITION BY e.user_id ORDER BY e.enrolled_at DESC) as row_num
FROM enrollments e
WHERE e.course_id = 35
ORDER BY e.user_id, e.enrolled_at DESC;

-- Step 2: Delete duplicates (keeps most recent per user)
DELETE FROM enrollments
WHERE id IN (
  SELECT e.id
  FROM (
    SELECT 
      id,
      ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY enrolled_at DESC) as row_num
    FROM enrollments
    WHERE course_id = 35
  ) e
  WHERE e.row_num > 1
);

-- Step 3: Verify - should show only 1 enrollment per user_id
SELECT 
  user_id,
  COUNT(*) as enrollment_count,
  MAX(enrolled_at) as latest_enrollment
FROM enrollments
WHERE course_id = 35
GROUP BY user_id;

-- ============================================================
-- EXPECTED RESULT:
-- Each user_id should have enrollment_count = 1
-- ============================================================
