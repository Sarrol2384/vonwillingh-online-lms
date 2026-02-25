-- ============================================================
-- FIX DUPLICATE ENROLLMENTS FOR AIFUND001 (Course ID: 35)
-- ============================================================
-- This script removes duplicate enrollments, keeping only 
-- the most recent enrollment per user.
--
-- RUN THIS IN YOUR SUPABASE SQL EDITOR:
-- https://supabase.com/dashboard/project/YOUR_PROJECT/editor
-- ============================================================

-- Step 1: View current duplicates
SELECT 
  u.email,
  e.id as enrollment_id,
  e.enrolled_at,
  ROW_NUMBER() OVER (PARTITION BY e.user_id ORDER BY e.enrolled_at DESC) as row_num
FROM enrollments e
JOIN users u ON u.id = e.user_id
WHERE e.course_id = 35
ORDER BY u.email, e.enrolled_at DESC;

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

-- Step 3: Verify - should show only 1 enrollment per user
SELECT 
  u.email,
  COUNT(*) as enrollment_count,
  MAX(e.enrolled_at) as latest_enrollment
FROM enrollments e
JOIN users u ON u.id = e.user_id
WHERE e.course_id = 35
GROUP BY u.email;

-- ============================================================
-- EXPECTED RESULT:
-- Each user (email) should have enrollment_count = 1
-- ============================================================
