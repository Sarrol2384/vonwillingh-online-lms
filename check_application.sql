-- Check if the application was created
SELECT 
    a.id,
    a.status,
    a.created_at,
    s.full_name,
    s.email,
    c.name as course_name
FROM applications a
JOIN students s ON s.id = a.student_id
JOIN courses c ON c.id = a.course_id
WHERE s.email = 'vonwillinghc@gmail.com'
ORDER BY a.created_at DESC
LIMIT 5;
