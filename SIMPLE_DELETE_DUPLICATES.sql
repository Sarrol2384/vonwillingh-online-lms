-- ==========================================
-- SIMPLE FIX - Delete Duplicate Enrollments
-- ==========================================

-- First, let's see what we have:
SELECT 
    e.id as enrollment_id,
    u.email,
    e.enrolled_at
FROM enrollments e
JOIN users u ON u.id = e.user_id
WHERE e.course_id = 35
ORDER BY u.email, e.enrolled_at;

-- Now delete older enrollments, keeping only the newest one per user
-- This is the SIMPLEST approach:

DELETE FROM enrollments
WHERE id NOT IN (
    SELECT DISTINCT ON (user_id) id
    FROM enrollments
    WHERE course_id = 35
    ORDER BY user_id, enrolled_at DESC
);

-- Verify - should show only 1 enrollment per user:
SELECT 
    u.email,
    COUNT(*) as count
FROM enrollments e
JOIN users u ON u.id = e.user_id
WHERE e.course_id = 35
GROUP BY u.email;
