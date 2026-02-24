-- =====================================================
-- DELETE SPECIFIC STUDENT ACCOUNT
-- =====================================================
-- This script safely deletes a student and all related data
-- Replace the email below with the student's email address

DO $$
DECLARE
  target_student_id UUID;
  deleted_count INTEGER;
BEGIN
  -- Step 1: Find the student by email
  SELECT id INTO target_student_id 
  FROM students 
  WHERE email = 'student@example.com'; -- CHANGE THIS EMAIL!
  
  IF target_student_id IS NULL THEN
    RAISE NOTICE '❌ Student not found with that email';
    RETURN;
  END IF;
  
  RAISE NOTICE '📋 Found student ID: %', target_student_id;
  
  -- Step 2: Delete enrollments (this will cascade to related tables)
  BEGIN
    DELETE FROM enrollments WHERE student_id = target_student_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '✅ Deleted % enrollments', deleted_count;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '⚠️ Enrollments: %', SQLERRM;
  END;
  
  -- Step 3: Delete applications
  BEGIN
    DELETE FROM applications WHERE student_id = target_student_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '✅ Deleted % applications', deleted_count;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '⚠️ Applications: %', SQLERRM;
  END;
  
  -- Step 4: Delete quiz attempts
  BEGIN
    DELETE FROM quiz_attempts WHERE student_id = target_student_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '✅ Deleted % quiz attempts', deleted_count;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '⚠️ Quiz attempts: %', SQLERRM;
  END;
  
  -- Step 5: Delete student progress
  BEGIN
    DELETE FROM student_progress WHERE student_id = target_student_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '✅ Deleted % progress records', deleted_count;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '⚠️ Progress: %', SQLERRM;
  END;
  
  -- Step 6: Delete module progress
  BEGIN
    DELETE FROM module_progress WHERE student_id = target_student_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '✅ Deleted % module progress records', deleted_count;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '⚠️ Module progress: %', SQLERRM;
  END;
  
  -- Step 7: Delete module content completion
  BEGIN
    DELETE FROM module_content_completion WHERE student_id = target_student_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '✅ Deleted % content completion records', deleted_count;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '⚠️ Content completion: %', SQLERRM;
  END;
  
  -- Step 8: Delete student sessions
  BEGIN
    DELETE FROM student_sessions WHERE student_id = target_student_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '✅ Deleted % sessions', deleted_count;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '⚠️ Sessions: %', SQLERRM;
  END;
  
  -- Step 9: Delete certificates (if table exists)
  BEGIN
    DELETE FROM "Certificates" WHERE student_id = target_student_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '✅ Deleted % certificates', deleted_count;
  EXCEPTION 
    WHEN undefined_table THEN
      RAISE NOTICE 'ℹ️ Certificates table does not exist (skipped)';
    WHEN OTHERS THEN
      RAISE NOTICE '⚠️ Certificates: %', SQLERRM;
  END;
  
  -- Step 10: Delete payment records
  BEGIN
    DELETE FROM payments 
    WHERE application_id IN (
      SELECT id FROM applications WHERE student_id = target_student_id
    );
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '✅ Deleted % payment records', deleted_count;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '⚠️ Payments: %', SQLERRM;
  END;
  
  -- Step 11: Finally, delete the student account
  BEGIN
    DELETE FROM students WHERE id = target_student_id;
    RAISE NOTICE '✅ Deleted student account';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Failed to delete student: %', SQLERRM;
    RETURN;
  END;
  
  RAISE NOTICE '🎉 STUDENT DELETION COMPLETE!';
END $$;

-- Verification query
SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ Student successfully deleted'
    ELSE '❌ Student still exists'
  END AS status
FROM students 
WHERE email = 'student@example.com'; -- CHANGE THIS EMAIL!
