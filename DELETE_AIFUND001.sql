-- =====================================================
-- DELETE AIFUND001 COURSE FOR CLEAN RE-IMPORT
-- =====================================================
-- This will delete the course and ALL related data:
-- - Modules
-- - Quiz questions
-- - Enrollments
-- - Student progress
-- - Quiz attempts
--
-- RUN THIS BEFORE RE-IMPORTING THE COURSE
-- =====================================================

-- 1. Delete quiz questions (via CASCADE from modules)
-- 2. Delete modules (via CASCADE from course)
-- 3. Delete course

DELETE FROM courses WHERE code = 'AIFUND001';

-- Verify deletion
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ AIFUND001 successfully deleted'
        ELSE '❌ ERROR: Course still exists'
    END AS status
FROM courses
WHERE code = 'AIFUND001';

-- Check for orphaned data (should return 0 rows)
SELECT 
    'Orphaned modules' AS check_type,
    COUNT(*) AS count
FROM modules m
LEFT JOIN courses c ON c.id = m.course_id
WHERE c.id IS NULL

UNION ALL

SELECT 
    'Orphaned quiz_questions' AS check_type,
    COUNT(*) AS count
FROM quiz_questions qq
LEFT JOIN modules m ON m.id = qq.module_id
WHERE m.id IS NULL;
