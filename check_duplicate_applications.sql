-- Check for duplicate applications from the same email
SELECT 
    a.id,
    a.status,
    a.created_at,
    s.full_name,
    s.email,
    c.name as course_name,
    c.id as course_id
FROM applications a
JOIN students s ON s.id = a.student_id
JOIN courses c ON c.id = a.course_id
WHERE s.email = 'vonwillinghc@gmail.com'
ORDER BY a.created_at DESC;

-- Check if there's a unique constraint issue
-- This will show if multiple applications were created
SELECT 
    s.email,
    c.name,
    COUNT(*) as application_count,
    MAX(a.created_at) as latest_application
FROM applications a
JOIN students s ON s.id = a.student_id
JOIN courses c ON c.id = a.course_id
WHERE s.email = 'vonwillinghc@gmail.com'
GROUP BY s.email, c.name
HAVING COUNT(*) > 1;
