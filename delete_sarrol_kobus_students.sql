-- =====================================================
-- DELETE SPECIFIC STUDENTS BY ID
-- =====================================================
-- This script deletes two specific students:
-- 1. 8ca011fc-5d52-43b1-8fce-8f58f6f782f4 (Sarrol Von Willingh)
-- 2. edce4e2c-d810-4d31-9d13-fef94e7f17e9 (Kobus Von Willingh)
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/dgcobxtkzewzkrzpfcdr/sql/new
-- =====================================================

-- STEP 1: Preview what will be deleted
-- =====================================================

-- Check students
SELECT 
    'STUDENTS' as record_type,
    id, 
    full_name, 
    email, 
    phone,
    created_at
FROM students 
WHERE id IN (
    '8ca011fc-5d52-43b1-8fce-8f58f6f782f4',
    'edce4e2c-d810-4d31-9d13-fef94e7f17e9'
)
ORDER BY full_name;

-- Check applications
SELECT 
    'APPLICATIONS' as record_type,
    a.id,
    s.full_name,
    s.email,
    a.course_id,
    c.name as course_name,
    a.status,
    a.created_at
FROM applications a
LEFT JOIN students s ON a.student_id = s.id
LEFT JOIN courses c ON a.course_id = c.id
WHERE a.student_id IN (
    '8ca011fc-5d52-43b1-8fce-8f58f6f782f4',
    'edce4e2c-d810-4d31-9d13-fef94e7f17e9'
)
ORDER BY s.full_name, a.created_at DESC;

-- Check enrollments
SELECT 
    'ENROLLMENTS' as record_type,
    e.id,
    s.full_name,
    s.email,
    e.course_id,
    c.name as course_name,
    e.status,
    e.progress_percentage
FROM enrollments e
LEFT JOIN students s ON e.student_id = s.id
LEFT JOIN courses c ON e.course_id = c.id
WHERE e.student_id IN (
    '8ca011fc-5d52-43b1-8fce-8f58f6f782f4',
    'edce4e2c-d810-4d31-9d13-fef94e7f17e9'
)
ORDER BY s.full_name;

-- Check student progress
SELECT 
    'STUDENT_PROGRESS' as record_type,
    sp.id,
    s.full_name,
    s.email,
    sp.module_id,
    sp.completed
FROM student_progress sp
LEFT JOIN students s ON sp.student_id = s.id
WHERE sp.student_id IN (
    '8ca011fc-5d52-43b1-8fce-8f58f6f782f4',
    'edce4e2c-d810-4d31-9d13-fef94e7f17e9'
)
ORDER BY s.full_name;

-- Check quiz attempts
SELECT 
    'QUIZ_ATTEMPTS' as record_type,
    qa.id,
    s.full_name,
    s.email,
    qa.quiz_id,
    qa.score,
    qa.passed
FROM quiz_attempts qa
LEFT JOIN students s ON qa.student_id = s.id
WHERE qa.student_id IN (
    '8ca011fc-5d52-43b1-8fce-8f58f6f782f4',
    'edce4e2c-d810-4d31-9d13-fef94e7f17e9'
)
ORDER BY s.full_name;

-- =====================================================
-- STEP 2: Delete all related data (in correct order)
-- =====================================================
-- ONLY RUN THIS AFTER CONFIRMING STEP 1 RESULTS!

-- Delete student progress first
DELETE FROM student_progress
WHERE student_id IN (
    '8ca011fc-5d52-43b1-8fce-8f58f6f782f4',
    'edce4e2c-d810-4d31-9d13-fef94e7f17e9'
);

-- Delete quiz attempts
DELETE FROM quiz_attempts
WHERE student_id IN (
    '8ca011fc-5d52-43b1-8fce-8f58f6f782f4',
    'edce4e2c-d810-4d31-9d13-fef94e7f17e9'
);

-- Delete enrollments
DELETE FROM enrollments
WHERE student_id IN (
    '8ca011fc-5d52-43b1-8fce-8f58f6f782f4',
    'edce4e2c-d810-4d31-9d13-fef94e7f17e9'
);

-- Delete applications
DELETE FROM applications
WHERE student_id IN (
    '8ca011fc-5d52-43b1-8fce-8f58f6f782f4',
    'edce4e2c-d810-4d31-9d13-fef94e7f17e9'
);

-- Finally, delete the students
DELETE FROM students
WHERE id IN (
    '8ca011fc-5d52-43b1-8fce-8f58f6f782f4',
    'edce4e2c-d810-4d31-9d13-fef94e7f17e9'
);

-- =====================================================
-- STEP 3: Verify deletion
-- =====================================================
SELECT 'Verification - should return no rows:' as status;

SELECT * FROM students 
WHERE id IN (
    '8ca011fc-5d52-43b1-8fce-8f58f6f782f4',
    'edce4e2c-d810-4d31-9d13-fef94e7f17e9'
);

SELECT * FROM applications 
WHERE student_id IN (
    '8ca011fc-5d52-43b1-8fce-8f58f6f782f4',
    'edce4e2c-d810-4d31-9d13-fef94e7f17e9'
);

-- =====================================================
-- Check remaining students
-- =====================================================
SELECT 
    'REMAINING STUDENTS' as record_type,
    id,
    full_name,
    email,
    created_at
FROM students
ORDER BY created_at DESC;

-- =====================================================
-- ✅ DONE!
-- =====================================================
-- Deleted students:
-- 1. Sarrol Von Willingh (vonwillinghc@gmail.com)
-- 2. Kobus Von Willingh (mandatetracker@mjgrealestate.co.za)
-- Along with all their related data:
-- - Applications
-- - Enrollments
-- - Student progress
-- - Quiz attempts
-- =====================================================
