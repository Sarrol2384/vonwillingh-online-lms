-- =====================================================
-- STEP 1: LIST ALL STUDENTS
-- =====================================================
-- Run this first to find the student you want to delete

SELECT 
  id,
  first_name,
  last_name,
  email,
  phone,
  id_number,
  account_status,
  created_at,
  -- Count related records
  (SELECT COUNT(*) FROM enrollments WHERE student_id = students.id) AS enrollment_count,
  (SELECT COUNT(*) FROM quiz_attempts WHERE student_id = students.id) AS quiz_attempt_count,
  (SELECT COUNT(*) FROM applications WHERE student_id = students.id) AS application_count
FROM students
ORDER BY created_at DESC;

-- =====================================================
-- STEP 2: DELETE SPECIFIC STUDENT
-- =====================================================
-- After finding the student, update the email below and run this block

DO $$
DECLARE
  target_email TEXT := 'CHANGE_THIS@example.com'; -- ⚠️ CHANGE THIS!
  target_student_id UUID;
  student_name TEXT;
  deleted_count INTEGER;
BEGIN
  -- Find the student
  SELECT id, first_name || ' ' || last_name INTO target_student_id, student_name
  FROM students 
  WHERE email = target_email;
  
  IF target_student_id IS NULL THEN
    RAISE NOTICE '❌ Student not found with email: %', target_email;
    RETURN;
  END IF;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE '🗑️  DELETING STUDENT ACCOUNT';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Student: %', student_name;
  RAISE NOTICE 'Email: %', target_email;
  RAISE NOTICE 'ID: %', target_student_id;
  RAISE NOTICE '========================================';
  
  -- Delete in correct order (children first, parent last)
  
  -- 1. Certificates
  BEGIN
    DELETE FROM "Certificates" WHERE student_id = target_student_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '✅ Certificates: % deleted', deleted_count;
  EXCEPTION 
    WHEN undefined_table THEN
      RAISE NOTICE 'ℹ️  Certificates table not found (skipped)';
    WHEN OTHERS THEN
      RAISE NOTICE '⚠️  Certificates error: %', SQLERRM;
  END;
  
  -- 2. Quiz attempts
  BEGIN
    DELETE FROM quiz_attempts WHERE student_id = target_student_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '✅ Quiz attempts: % deleted', deleted_count;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '⚠️  Quiz attempts error: %', SQLERRM;
  END;
  
  -- 3. Student progress
  BEGIN
    DELETE FROM student_progress WHERE student_id = target_student_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '✅ Student progress: % deleted', deleted_count;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '⚠️  Student progress error: %', SQLERRM;
  END;
  
  -- 4. Module progress
  BEGIN
    DELETE FROM module_progress WHERE student_id = target_student_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '✅ Module progress: % deleted', deleted_count;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '⚠️  Module progress error: %', SQLERRM;
  END;
  
  -- 5. Module content completion
  BEGIN
    DELETE FROM module_content_completion WHERE student_id = target_student_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '✅ Content completion: % deleted', deleted_count;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '⚠️  Content completion error: %', SQLERRM;
  END;
  
  -- 6. Student sessions
  BEGIN
    DELETE FROM student_sessions WHERE student_id = target_student_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '✅ Sessions: % deleted', deleted_count;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '⚠️  Sessions error: %', SQLERRM;
  END;
  
  -- 7. Payments (linked via applications)
  BEGIN
    DELETE FROM payments 
    WHERE application_id IN (
      SELECT id FROM applications WHERE student_id = target_student_id
    );
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '✅ Payments: % deleted', deleted_count;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '⚠️  Payments error: %', SQLERRM;
  END;
  
  -- 8. Applications
  BEGIN
    DELETE FROM applications WHERE student_id = target_student_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '✅ Applications: % deleted', deleted_count;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '⚠️  Applications error: %', SQLERRM;
  END;
  
  -- 9. Enrollments (must be last before student)
  BEGIN
    DELETE FROM enrollments WHERE student_id = target_student_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '✅ Enrollments: % deleted', deleted_count;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '⚠️  Enrollments error: %', SQLERRM;
  END;
  
  -- 10. Finally, delete the student
  BEGIN
    DELETE FROM students WHERE id = target_student_id;
    RAISE NOTICE '✅ Student account deleted';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Failed to delete student: %', SQLERRM;
    RAISE NOTICE 'Possible reason: Foreign key constraint from another table';
    RETURN;
  END;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE '🎉 DELETION COMPLETE!';
  RAISE NOTICE 'Student "%" has been removed', student_name;
  RAISE NOTICE '========================================';
END $$;

-- =====================================================
-- STEP 3: VERIFY DELETION
-- =====================================================
-- Run this to confirm the student is gone

SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ Student successfully deleted'
    ELSE '❌ Student still exists (' || COUNT(*) || ' records found)'
  END AS status
FROM students 
WHERE email = 'CHANGE_THIS@example.com'; -- ⚠️ CHANGE THIS!

-- =====================================================
-- ALTERNATIVE: DELETE ALL TEST STUDENTS
-- =====================================================
-- Uncomment and run this if you want to delete multiple test accounts
-- WARNING: This deletes ALL students with emails ending in @test.com

/*
DO $$
DECLARE
  student_record RECORD;
  total_deleted INTEGER := 0;
BEGIN
  FOR student_record IN 
    SELECT id, email, first_name || ' ' || last_name AS name
    FROM students 
    WHERE email LIKE '%@test.com'
  LOOP
    RAISE NOTICE 'Deleting test student: % (%)', student_record.name, student_record.email;
    
    -- Delete all related records (same order as above)
    DELETE FROM "Certificates" WHERE student_id = student_record.id;
    DELETE FROM quiz_attempts WHERE student_id = student_record.id;
    DELETE FROM student_progress WHERE student_id = student_record.id;
    DELETE FROM module_progress WHERE student_id = student_record.id;
    DELETE FROM module_content_completion WHERE student_id = student_record.id;
    DELETE FROM student_sessions WHERE student_id = student_record.id;
    DELETE FROM payments WHERE application_id IN (SELECT id FROM applications WHERE student_id = student_record.id);
    DELETE FROM applications WHERE student_id = student_record.id;
    DELETE FROM enrollments WHERE student_id = student_record.id;
    DELETE FROM students WHERE id = student_record.id;
    
    total_deleted := total_deleted + 1;
  END LOOP;
  
  RAISE NOTICE '✅ Deleted % test student(s)', total_deleted;
END $$;
*/
