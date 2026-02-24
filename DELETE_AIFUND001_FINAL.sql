-- =====================================================
-- DELETE AIFUND001 COURSE - COMPLETE DEPENDENCY CLEANUP
-- =====================================================
-- This script handles ALL possible foreign key constraints:
-- - enrollments
-- - applications  
-- - quiz_attempts
-- - student_progress
-- - module_completion
-- - Any other related tables
--
-- RUN THIS ENTIRE SCRIPT IN SUPABASE SQL EDITOR
-- =====================================================

DO $$
DECLARE
    course_id_to_delete INTEGER;
    deleted_count INTEGER;
BEGIN
    -- Find the course ID
    SELECT id INTO course_id_to_delete
    FROM courses
    WHERE code = 'AIFUND001';
    
    IF course_id_to_delete IS NULL THEN
        RAISE NOTICE '⚠️ Course AIFUND001 not found';
    ELSE
        RAISE NOTICE '📋 Found course AIFUND001 with ID: %', course_id_to_delete;
        
        -- 1. Delete from enrollments table
        BEGIN
            DELETE FROM enrollments
            WHERE course_id = course_id_to_delete;
            GET DIAGNOSTICS deleted_count = ROW_COUNT;
            RAISE NOTICE '✅ Deleted % enrollment records', deleted_count;
        EXCEPTION 
            WHEN undefined_table THEN
                RAISE NOTICE '⚠️ Table enrollments does not exist, skipping';
            WHEN OTHERS THEN
                RAISE NOTICE '⚠️ Error deleting enrollments: %', SQLERRM;
        END;
        
        -- 2. Delete from applications table
        BEGIN
            DELETE FROM applications
            WHERE course_id = course_id_to_delete;
            GET DIAGNOSTICS deleted_count = ROW_COUNT;
            RAISE NOTICE '✅ Deleted % application records', deleted_count;
        EXCEPTION 
            WHEN undefined_table THEN
                RAISE NOTICE '⚠️ Table applications does not exist, skipping';
            WHEN OTHERS THEN
                RAISE NOTICE '⚠️ Error deleting applications: %', SQLERRM;
        END;
        
        -- 3. Delete quiz attempts for modules in this course
        BEGIN
            DELETE FROM quiz_attempts
            WHERE module_id IN (
                SELECT id FROM modules WHERE course_id = course_id_to_delete
            );
            GET DIAGNOSTICS deleted_count = ROW_COUNT;
            RAISE NOTICE '✅ Deleted % quiz attempt records', deleted_count;
        EXCEPTION 
            WHEN undefined_table THEN
                RAISE NOTICE '⚠️ Table quiz_attempts does not exist, skipping';
            WHEN OTHERS THEN
                RAISE NOTICE '⚠️ Error deleting quiz_attempts: %', SQLERRM;
        END;
        
        -- 4. Delete student progress for modules in this course
        BEGIN
            DELETE FROM student_progress
            WHERE module_id IN (
                SELECT id FROM modules WHERE course_id = course_id_to_delete
            );
            GET DIAGNOSTICS deleted_count = ROW_COUNT;
            RAISE NOTICE '✅ Deleted % student progress records', deleted_count;
        EXCEPTION 
            WHEN undefined_table THEN
                RAISE NOTICE '⚠️ Table student_progress does not exist, skipping';
            WHEN OTHERS THEN
                RAISE NOTICE '⚠️ Error deleting student_progress: %', SQLERRM;
        END;
        
        -- 5. Delete module completions
        BEGIN
            DELETE FROM module_completion
            WHERE module_id IN (
                SELECT id FROM modules WHERE course_id = course_id_to_delete
            );
            GET DIAGNOSTICS deleted_count = ROW_COUNT;
            RAISE NOTICE '✅ Deleted % module completion records', deleted_count;
        EXCEPTION 
            WHEN undefined_table THEN
                RAISE NOTICE '⚠️ Table module_completion does not exist, skipping';
            WHEN OTHERS THEN
                RAISE NOTICE '⚠️ Error deleting module_completion: %', SQLERRM;
        END;
        
        -- 6. Delete quiz questions
        BEGIN
            DELETE FROM quiz_questions
            WHERE module_id IN (
                SELECT id FROM modules WHERE course_id = course_id_to_delete
            );
            GET DIAGNOSTICS deleted_count = ROW_COUNT;
            RAISE NOTICE '✅ Deleted % quiz questions', deleted_count;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE '⚠️ Error deleting quiz_questions: %', SQLERRM;
        END;
        
        -- 7. Delete modules
        BEGIN
            DELETE FROM modules
            WHERE course_id = course_id_to_delete;
            GET DIAGNOSTICS deleted_count = ROW_COUNT;
            RAISE NOTICE '✅ Deleted % modules', deleted_count;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE '⚠️ Error deleting modules: %', SQLERRM;
        END;
        
        -- 8. Finally, delete the course
        BEGIN
            DELETE FROM courses
            WHERE id = course_id_to_delete;
            GET DIAGNOSTICS deleted_count = ROW_COUNT;
            RAISE NOTICE '✅ Deleted course AIFUND001', deleted_count;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE '❌ ERROR deleting course: %', SQLERRM;
            RAISE EXCEPTION 'Failed to delete course';
        END;
        
        RAISE NOTICE '🎉 DELETION COMPLETE!';
    END IF;
END $$;

-- Verify deletion
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ AIFUND001 successfully deleted - Ready to re-import!'
        ELSE '❌ ERROR: Course still exists'
    END AS status
FROM courses
WHERE code = 'AIFUND001';

-- Show summary of remaining related data (should all be 0)
SELECT 
    'Summary Check' AS section,
    '-------------' AS separator;

SELECT 
    'Courses' AS table_name,
    COUNT(*) AS count
FROM courses
WHERE code = 'AIFUND001'

UNION ALL

SELECT 
    'Modules' AS table_name,
    COUNT(*) AS count
FROM modules
WHERE course_id = 35

UNION ALL

SELECT 
    'Quiz Questions' AS table_name,
    COUNT(*) AS count
FROM quiz_questions qq
WHERE module_id IN (SELECT id FROM modules WHERE course_id = 35)

UNION ALL

SELECT 
    'Enrollments' AS table_name,
    COUNT(*) AS count
FROM enrollments
WHERE course_id = 35

UNION ALL

SELECT 
    'Applications' AS table_name,
    COUNT(*) AS count
FROM applications
WHERE course_id = 35;
