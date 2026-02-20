-- =====================================================
-- DELETE STUDENT: lmsepg@mjgrealestate.co.za
-- =====================================================
-- This script safely deletes the test student and all related data
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/dgcobxtkzewzkrzpfcdr/sql/new
-- =====================================================

-- STEP 1: Preview what will be deleted
-- =====================================================
SELECT 
    'STUDENT TO DELETE' as record_type,
    id, 
    full_name, 
    email, 
    created_at
FROM students 
WHERE email = 'lmsepg@mjgrealestate.co.za';

-- Check related applications
SELECT 
    'APPLICATIONS TO DELETE' as record_type,
    a.id,
    a.course_id,
    c.name as course_name,
    a.status,
    a.created_at
FROM applications a
LEFT JOIN courses c ON a.course_id = c.id
WHERE a.student_id IN (
    SELECT id FROM students WHERE email = 'lmsepg@mjgrealestate.co.za'
);

-- Check related enrollments
SELECT 
    'ENROLLMENTS TO DELETE' as record_type,
    e.id,
    e.course_id,
    c.name as course_name,
    e.status,
    e.progress_percentage
FROM enrollments e
LEFT JOIN courses c ON e.course_id = c.id
WHERE e.student_id IN (
    SELECT id FROM students WHERE email = 'lmsepg@mjgrealestate.co.za'
);

-- =====================================================
-- STEP 2: Delete all related data (in correct order)
-- =====================================================
-- ONLY RUN THIS AFTER CONFIRMING STEP 1 RESULTS!

-- Delete student progress first
DELETE FROM student_progress
WHERE student_id IN (
    SELECT id FROM students WHERE email = 'lmsepg@mjgrealestate.co.za'
);

-- Delete quiz attempts
DELETE FROM quiz_attempts
WHERE student_id IN (
    SELECT id FROM students WHERE email = 'lmsepg@mjgrealestate.co.za'
);

-- Delete enrollments
DELETE FROM enrollments
WHERE student_id IN (
    SELECT id FROM students WHERE email = 'lmsepg@mjgrealestate.co.za'
);

-- Delete applications
DELETE FROM applications
WHERE student_id IN (
    SELECT id FROM students WHERE email = 'lmsepg@mjgrealestate.co.za'
);

-- Finally, delete the student
DELETE FROM students
WHERE email = 'lmsepg@mjgrealestate.co.za';

-- =====================================================
-- STEP 3: Verify deletion
-- =====================================================
SELECT 'Verification - should return no rows:' as status;

SELECT * FROM students WHERE email = 'lmsepg@mjgrealestate.co.za';

-- =====================================================
-- ✅ DONE!
-- =====================================================
-- The student lmsepg@mjgrealestate.co.za has been deleted
-- along with all related data (applications, enrollments, progress)
-- =====================================================
