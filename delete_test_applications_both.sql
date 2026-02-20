-- =====================================================
-- DELETE APPLICATIONS FOR TESTING
-- =====================================================
-- This script deletes applications and related data for:
-- 1. lmsepg@mjgrealestate.co.za
-- 2. vonwillinghc@gmail.com
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
    created_at
FROM students 
WHERE email IN ('lmsepg@mjgrealestate.co.za', 'vonwillinghc@gmail.com')
ORDER BY email;

-- Check applications
SELECT 
    'APPLICATIONS' as record_type,
    a.id,
    s.email,
    s.full_name,
    a.course_id,
    c.name as course_name,
    a.status,
    a.created_at
FROM applications a
LEFT JOIN students s ON a.student_id = s.id
LEFT JOIN courses c ON a.course_id = c.id
WHERE s.email IN ('lmsepg@mjgrealestate.co.za', 'vonwillinghc@gmail.com')
ORDER BY s.email, a.created_at DESC;

-- Check enrollments
SELECT 
    'ENROLLMENTS' as record_type,
    e.id,
    s.email,
    s.full_name,
    e.course_id,
    c.name as course_name,
    e.status,
    e.progress_percentage
FROM enrollments e
LEFT JOIN students s ON e.student_id = s.id
LEFT JOIN courses c ON e.course_id = c.id
WHERE s.email IN ('lmsepg@mjgrealestate.co.za', 'vonwillinghc@gmail.com')
ORDER BY s.email;

-- Check student progress
SELECT 
    'STUDENT_PROGRESS' as record_type,
    sp.id,
    s.email,
    sp.module_id,
    sp.completed
FROM student_progress sp
LEFT JOIN students s ON sp.student_id = s.id
WHERE s.email IN ('lmsepg@mjgrealestate.co.za', 'vonwillinghc@gmail.com')
ORDER BY s.email;

-- Check quiz attempts
SELECT 
    'QUIZ_ATTEMPTS' as record_type,
    qa.id,
    s.email,
    qa.quiz_id,
    qa.score,
    qa.passed
FROM quiz_attempts qa
LEFT JOIN students s ON qa.student_id = s.id
WHERE s.email IN ('lmsepg@mjgrealestate.co.za', 'vonwillinghc@gmail.com')
ORDER BY s.email;

-- =====================================================
-- STEP 2: Delete all related data (in correct order)
-- =====================================================
-- ONLY RUN THIS AFTER CONFIRMING STEP 1 RESULTS!

-- Delete student progress first
DELETE FROM student_progress
WHERE student_id IN (
    SELECT id FROM students 
    WHERE email IN ('lmsepg@mjgrealestate.co.za', 'vonwillinghc@gmail.com')
);

-- Delete quiz attempts
DELETE FROM quiz_attempts
WHERE student_id IN (
    SELECT id FROM students 
    WHERE email IN ('lmsepg@mjgrealestate.co.za', 'vonwillinghc@gmail.com')
);

-- Delete enrollments
DELETE FROM enrollments
WHERE student_id IN (
    SELECT id FROM students 
    WHERE email IN ('lmsepg@mjgrealestate.co.za', 'vonwillinghc@gmail.com')
);

-- Delete applications
DELETE FROM applications
WHERE student_id IN (
    SELECT id FROM students 
    WHERE email IN ('lmsepg@mjgrealestate.co.za', 'vonwillinghc@gmail.com')
);

-- Finally, delete the students
DELETE FROM students
WHERE email IN ('lmsepg@mjgrealestate.co.za', 'vonwillinghc@gmail.com');

-- =====================================================
-- STEP 3: Verify deletion
-- =====================================================
SELECT 'Verification - should return no rows:' as status;

SELECT * FROM students 
WHERE email IN ('lmsepg@mjgrealestate.co.za', 'vonwillinghc@gmail.com');

SELECT * FROM applications 
WHERE student_id IN (
    SELECT id FROM students 
    WHERE email IN ('lmsepg@mjgrealestate.co.za', 'vonwillinghc@gmail.com')
);

-- =====================================================
-- ✅ DONE!
-- =====================================================
-- Both test students have been deleted along with:
-- - All applications
-- - All enrollments
-- - All student progress
-- - All quiz attempts
-- =====================================================

-- READY FOR FRESH TESTING! 🎉
-- =====================================================
-- Now you can:
-- 1. Submit fresh applications
-- 2. Test the complete workflow
-- 3. Verify emails with correct URLs
-- 4. Confirm VonWillingh logo shows correctly
-- =====================================================
