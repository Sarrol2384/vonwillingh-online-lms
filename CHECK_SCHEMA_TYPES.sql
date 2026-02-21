-- Check the actual data types in your database
-- Run this first to see what types we're working with

-- Check courses table
SELECT 'courses' as table_name, column_name, data_type, udt_name
FROM information_schema.columns 
WHERE table_name = 'courses' AND column_name IN ('id', 'code')
ORDER BY ordinal_position;

-- Check modules table
SELECT 'modules' as table_name, column_name, data_type, udt_name
FROM information_schema.columns 
WHERE table_name = 'modules' AND column_name IN ('id', 'course_id', 'title')
ORDER BY ordinal_position;

-- Check students table
SELECT 'students' as table_name, column_name, data_type, udt_name
FROM information_schema.columns 
WHERE table_name = 'students' AND column_name IN ('id', 'email')
ORDER BY ordinal_position;

-- Check enrollments table
SELECT 'enrollments' as table_name, column_name, data_type, udt_name
FROM information_schema.columns 
WHERE table_name = 'enrollments' AND column_name IN ('id', 'student_id', 'course_id')
ORDER BY ordinal_position;

-- Check quiz_questions table
SELECT 'quiz_questions' as table_name, column_name, data_type, udt_name
FROM information_schema.columns 
WHERE table_name = 'quiz_questions' AND column_name IN ('id', 'module_id')
ORDER BY ordinal_position;

-- Check quiz_attempts table (if exists)
SELECT 'quiz_attempts' as table_name, column_name, data_type, udt_name
FROM information_schema.columns 
WHERE table_name = 'quiz_attempts' AND column_name IN ('id', 'student_id', 'module_id')
ORDER BY ordinal_position;
