-- =====================================================
-- DELETE AIFUND001 COURSE WITH ALL DEPENDENCIES
-- =====================================================
-- This script deletes the course and ALL related data in the correct order:
-- 1. Quiz attempts
-- 2. Student progress records
-- 3. Applications (enrollments)
-- 4. Quiz questions
-- 5. Modules
-- 6. Course
--
-- RUN THIS ENTIRE SCRIPT IN SUPABASE SQL EDITOR
-- =====================================================

-- Get the course ID first
DO $$
DECLARE
    course_id_to_delete INTEGER;
BEGIN
    -- Find the course ID
    SELECT id INTO course_id_to_delete
    FROM courses
    WHERE code = 'AIFUND001';
    
    IF course_id_to_delete IS NULL THEN
        RAISE NOTICE '⚠️ Course AIFUND001 not found';
    ELSE
        RAISE NOTICE '📋 Found course AIFUND001 with ID: %', course_id_to_delete;
        
        -- 1. Delete quiz attempts (if table exists)
        BEGIN
            DELETE FROM quiz_attempts
            WHERE module_id IN (
                SELECT id FROM modules WHERE course_id = course_id_to_delete
            );
            RAISE NOTICE '✅ Deleted quiz attempts';
        EXCEPTION WHEN undefined_table THEN
            RAISE NOTICE '⚠️ Table quiz_attempts does not exist, skipping';
        END;
        
        -- 2. Delete student progress (if table exists)
        BEGIN
            DELETE FROM student_progress
            WHERE module_id IN (
                SELECT id FROM modules WHERE course_id = course_id_to_delete
            );
            RAISE NOTICE '✅ Deleted student progress records';
        EXCEPTION WHEN undefined_table THEN
            RAISE NOTICE '⚠️ Table student_progress does not exist, skipping';
        END;
        
        -- 3. Delete applications (enrollments) - THIS IS THE KEY!
        DELETE FROM applications
        WHERE course_id = course_id_to_delete;
        RAISE NOTICE '✅ Deleted student enrollments (applications)';
        
        -- 4. Delete quiz questions
        DELETE FROM quiz_questions
        WHERE module_id IN (
            SELECT id FROM modules WHERE course_id = course_id_to_delete
        );
        RAISE NOTICE '✅ Deleted quiz questions';
        
        -- 5. Delete modules
        DELETE FROM modules
        WHERE course_id = course_id_to_delete;
        RAISE NOTICE '✅ Deleted modules';
        
        -- 6. Delete course
        DELETE FROM courses
        WHERE id = course_id_to_delete;
        RAISE NOTICE '✅ Deleted course AIFUND001';
    END IF;
END $$;

-- Verify deletion
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ AIFUND001 successfully deleted'
        ELSE '❌ ERROR: Course still exists'
    END AS status
FROM courses
WHERE code = 'AIFUND001';

-- Check for any remaining related data
SELECT 
    'Applications (enrollments)' AS check_type,
    COUNT(*) AS remaining_count
FROM applications
WHERE course_id = 35 -- Replace with actual course ID if different

UNION ALL

SELECT 
    'Modules' AS check_type,
    COUNT(*) AS remaining_count
FROM modules
WHERE course_id = 35

UNION ALL

SELECT 
    'Quiz questions' AS check_type,
    COUNT(*) AS remaining_count
FROM quiz_questions qq
WHERE module_id IN (SELECT id FROM modules WHERE course_id = 35);

-- Final summary
SELECT 
    '🎉 DELETION COMPLETE - Ready to re-import!' AS message;
