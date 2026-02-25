-- ==========================================
-- FIX DUPLICATE ENROLLMENTS FOR AIFUND001
-- ==========================================

-- Step 1: View current duplicate enrollments
SELECT 
    e.id,
    u.email,
    u.full_name,
    c.code as course_code,
    c.name as course_name,
    e.enrolled_at,
    e.progress
FROM enrollments e
JOIN users u ON u.id = e.user_id
JOIN courses c ON c.id = e.course_id
WHERE c.code = 'AIFUND001'
ORDER BY u.email, e.enrolled_at DESC;

-- Step 2: Remove duplicate enrollments (keeps the most recent one per user)
WITH ranked_enrollments AS (
    SELECT 
        e.id,
        ROW_NUMBER() OVER (
            PARTITION BY e.user_id, e.course_id 
            ORDER BY e.enrolled_at DESC
        ) as rn
    FROM enrollments e
    JOIN courses c ON c.id = e.course_id
    WHERE c.code = 'AIFUND001'
)
DELETE FROM enrollments 
WHERE id IN (
    SELECT id FROM ranked_enrollments WHERE rn > 1
);

-- Step 3: Verify fix - should return 0 rows if duplicates are removed
SELECT 
    u.email,
    COUNT(*) as enrollment_count
FROM enrollments e
JOIN users u ON u.id = e.user_id
JOIN courses c ON c.id = e.course_id
WHERE c.code = 'AIFUND001'
GROUP BY u.email
HAVING COUNT(*) > 1;
