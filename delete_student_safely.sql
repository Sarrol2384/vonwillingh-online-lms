-- SAFE WAY: Delete a student and all their related records
-- This prevents foreign key constraint errors

-- Step 1: First, check what will be deleted
SELECT 
    'Student:' as type, s.id, s.full_name, s.email, NULL as status, NULL as course_name
FROM students s
WHERE s.email = 'vonwillinghc@gmail.com'

UNION ALL

SELECT 
    'Application:' as type, a.id, s.full_name, s.email, a.status, c.name as course_name
FROM applications a
JOIN students s ON s.id = a.student_id
JOIN courses c ON c.id = a.course_id
WHERE s.email = 'vonwillinghc@gmail.com'

UNION ALL

SELECT 
    'Enrollment:' as type, e.id, s.full_name, s.email, e.status, c.name as course_name
FROM enrollments e
JOIN students s ON s.id = e.student_id
JOIN courses c ON c.id = e.course_id
WHERE s.email = 'vonwillinghc@gmail.com'

UNION ALL

SELECT 
    'Progress:' as type, p.id::text, s.full_name, s.email, 
    CASE WHEN p.completed THEN 'completed' ELSE 'in_progress' END as status,
    m.title as course_name
FROM student_progress p
JOIN students s ON s.id = p.student_id
JOIN modules m ON m.id = p.module_id
WHERE s.email = 'vonwillinghc@gmail.com';

-- Step 2: DELETE in the correct order (to avoid foreign key errors)

-- Delete student progress first
DELETE FROM student_progress
WHERE student_id IN (
    SELECT id FROM students WHERE email = 'vonwillinghc@gmail.com'
);

-- Delete quiz attempts
DELETE FROM quiz_attempts
WHERE student_id IN (
    SELECT id FROM students WHERE email = 'vonwillinghc@gmail.com'
);

-- Delete enrollments
DELETE FROM enrollments
WHERE student_id IN (
    SELECT id FROM students WHERE email = 'vonwillinghc@gmail.com'
);

-- Delete applications
DELETE FROM applications
WHERE student_id IN (
    SELECT id FROM students WHERE email = 'vonwillinghc@gmail.com'
);

-- Finally, delete the student
DELETE FROM students
WHERE email = 'vonwillinghc@gmail.com';

-- Step 3: Verify deletion
SELECT COUNT(*) as remaining_records
FROM students
WHERE email = 'vonwillinghc@gmail.com';
-- Should return 0

-- ALTERNATIVE: Delete multiple students at once
-- DELETE FROM student_progress WHERE student_id IN (SELECT id FROM students WHERE email LIKE '%test%');
-- DELETE FROM quiz_attempts WHERE student_id IN (SELECT id FROM students WHERE email LIKE '%test%');
-- DELETE FROM enrollments WHERE student_id IN (SELECT id FROM students WHERE email LIKE '%test%');
-- DELETE FROM applications WHERE student_id IN (SELECT id FROM students WHERE email LIKE '%test%');
-- DELETE FROM students WHERE email LIKE '%test%';
