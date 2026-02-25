-- Find duplicate enrollments for user Kobus
SELECT 
    e.id,
    e.user_id,
    e.course_id,
    c.name as course_name,
    e.enrolled_at,
    e.progress
FROM enrollments e
JOIN courses c ON c.id = e.course_id
WHERE c.code = 'AIFUND001'
ORDER BY e.enrolled_at DESC;

-- Keep only the most recent enrollment, delete older duplicates
-- (Run this after verifying the SELECT results above)

-- DELETE FROM enrollments 
-- WHERE id IN (
--     SELECT id FROM (
--         SELECT id, 
--                ROW_NUMBER() OVER (PARTITION BY user_id, course_id ORDER BY enrolled_at DESC) as rn
--         FROM enrollments
--         WHERE course_id = 35
--     ) t WHERE rn > 1
-- );
