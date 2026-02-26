-- ============================================================
-- CHECK DATABASE SCHEMA FIRST
-- ============================================================
-- Run this FIRST to see what tables you have
-- Then we can fix the duplicates properly
-- ============================================================

-- Check 1: List all tables in your database
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check 2: See the structure of enrollments table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'enrollments'
ORDER BY ordinal_position;

-- Check 3: Count enrollments for course_id 35
SELECT 
  user_id,
  COUNT(*) as enrollment_count
FROM enrollments
WHERE course_id = 35
GROUP BY user_id
HAVING COUNT(*) > 1
ORDER BY enrollment_count DESC;

-- ============================================================
-- This will show you:
-- 1. All tables in your database
-- 2. Structure of enrollments table
-- 3. Which user_ids have duplicate enrollments
-- ============================================================
