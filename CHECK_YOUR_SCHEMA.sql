-- =====================================================
-- SCHEMA DETECTION SCRIPT
-- =====================================================
-- Run this FIRST to see your actual data types
-- Copy the output and share it
-- =====================================================

-- Check all relevant tables and their ID types
SELECT 
    'courses' as table_name,
    column_name,
    data_type,
    udt_name
FROM information_schema.columns 
WHERE table_name = 'courses' AND column_name IN ('id', 'code')
UNION ALL
SELECT 
    'modules' as table_name,
    column_name,
    data_type,
    udt_name
FROM information_schema.columns 
WHERE table_name = 'modules' AND column_name IN ('id', 'course_id', 'title')
UNION ALL
SELECT 
    'students' as table_name,
    column_name,
    data_type,
    udt_name
FROM information_schema.columns 
WHERE table_name = 'students' AND column_name IN ('id', 'email')
UNION ALL
SELECT 
    'enrollments' as table_name,
    column_name,
    data_type,
    udt_name
FROM information_schema.columns 
WHERE table_name = 'enrollments' AND column_name IN ('id', 'student_id', 'course_id')
UNION ALL
SELECT 
    'quiz_questions' as table_name,
    column_name,
    data_type,
    udt_name
FROM information_schema.columns 
WHERE table_name = 'quiz_questions' AND column_name IN ('id', 'module_id')
ORDER BY table_name, column_name;
