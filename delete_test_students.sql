-- Delete ALL test students (be careful!)
-- This removes any student with 'test' in their email or name

-- Step 1: Preview what will be deleted
SELECT 
    s.id,
    s.full_name,
    s.email,
    COUNT(DISTINCT a.id) as applications,
    COUNT(DISTINCT e.id) as enrollments,
    COUNT(DISTINCT p.id) as progress_records
FROM students s
LEFT JOIN applications a ON a.student_id = s.id
LEFT JOIN enrollments e ON e.student_id = s.id
LEFT JOIN student_progress p ON p.student_id = s.id
WHERE s.email LIKE '%test%' 
   OR s.full_name LIKE '%test%'
   OR s.email LIKE '%@example.com'
GROUP BY s.id, s.full_name, s.email;

-- Step 2: DELETE (uncomment to execute)
/*
DELETE FROM student_progress 
WHERE student_id IN (
    SELECT id FROM students 
    WHERE email LIKE '%test%' OR full_name LIKE '%test%' OR email LIKE '%@example.com'
);

DELETE FROM quiz_attempts 
WHERE student_id IN (
    SELECT id FROM students 
    WHERE email LIKE '%test%' OR full_name LIKE '%test%' OR email LIKE '%@example.com'
);

DELETE FROM enrollments 
WHERE student_id IN (
    SELECT id FROM students 
    WHERE email LIKE '%test%' OR full_name LIKE '%test%' OR email LIKE '%@example.com'
);

DELETE FROM applications 
WHERE student_id IN (
    SELECT id FROM students 
    WHERE email LIKE '%test%' OR full_name LIKE '%test%' OR email LIKE '%@example.com'
);

DELETE FROM students 
WHERE email LIKE '%test%' OR full_name LIKE '%test%' OR email LIKE '%@example.com';
*/

-- Step 3: Verify
SELECT 
    'Remaining test students:' as info,
    COUNT(*) as count
FROM students 
WHERE email LIKE '%test%' OR full_name LIKE '%test%' OR email LIKE '%@example.com';
