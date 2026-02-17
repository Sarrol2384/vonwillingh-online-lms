-- Delete all students EXCEPT James Von Willingh
-- Step 1: Preview who will be deleted (SAFE - just shows data)

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
WHERE s.full_name != 'James Von Willingh'
  AND s.email != 'james@vonwillingh.co.za'
GROUP BY s.id, s.full_name, s.email
ORDER BY s.full_name;

-- Step 2: DELETE all students except James Von Willingh
-- (Run this after verifying the preview above)

DELETE FROM student_progress 
WHERE student_id IN (
    SELECT id FROM students 
    WHERE full_name != 'James Von Willingh' 
      AND email != 'james@vonwillingh.co.za'
);

DELETE FROM quiz_attempts 
WHERE student_id IN (
    SELECT id FROM students 
    WHERE full_name != 'James Von Willingh' 
      AND email != 'james@vonwillingh.co.za'
);

DELETE FROM enrollments 
WHERE student_id IN (
    SELECT id FROM students 
    WHERE full_name != 'James Von Willingh' 
      AND email != 'james@vonwillingh.co.za'
);

DELETE FROM applications 
WHERE student_id IN (
    SELECT id FROM students 
    WHERE full_name != 'James Von Willingh' 
      AND email != 'james@vonwillingh.co.za'
);

DELETE FROM students 
WHERE full_name != 'James Von Willingh' 
  AND email != 'james@vonwillingh.co.za';

-- Step 3: Verify - should show only James Von Willingh
SELECT 
    s.id,
    s.full_name,
    s.email,
    s.created_at,
    COUNT(DISTINCT a.id) as applications,
    COUNT(DISTINCT e.id) as enrollments
FROM students s
LEFT JOIN applications a ON a.student_id = s.id
LEFT JOIN enrollments e ON e.student_id = s.id
GROUP BY s.id, s.full_name, s.email, s.created_at
ORDER BY s.full_name;
