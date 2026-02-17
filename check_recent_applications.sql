-- Check recent applications to verify they were created
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
WHERE s.email IN ('vonwillinghc@gmail.com', 'mandatetracker@mjgrealestate.co.za')
ORDER BY a.created_at DESC
LIMIT 10;

-- Check if student records were created
SELECT 
    id,
    full_name,
    email,
    created_at
FROM students
WHERE email IN ('vonwillinghc@gmail.com', 'mandatetracker@mjgrealestate.co.za')
ORDER BY created_at DESC;
