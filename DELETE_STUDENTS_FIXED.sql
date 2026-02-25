-- ========================================
-- DELETE SPECIFIC STUDENTS (FIXED VERSION)
-- ========================================
-- This version handles tables that may not exist
-- Students to delete:
-- 1. ceesproductions@gmail.com
-- 2. sarrol@vonwillingh.co.za
-- 3. mandatetracker@mjgrealestate.co.za
-- ========================================

DO $$
DECLARE
  student_record RECORD;
  deleted_count INTEGER;
  total_deleted INTEGER := 0;
BEGIN
  RAISE NOTICE '🗑️  Starting student deletion process...';
  RAISE NOTICE '================================================';
  
  -- Loop through each email to delete
  FOR student_record IN 
    SELECT 
      id, 
      email, 
      first_name, 
      last_name
    FROM students 
    WHERE email IN (
      'ceesproductions@gmail.com',
      'sarrol@vonwillingh.co.za',
      'mandatetracker@mjgrealestate.co.za'
    )
  LOOP
    RAISE NOTICE '';
    RAISE NOTICE '📧 Processing: % (% %)', student_record.email, student_record.first_name, student_record.last_name;
    RAISE NOTICE '   Student ID: %', student_record.id;
    
    -- Delete quiz_attempts
    BEGIN
      DELETE FROM quiz_attempts WHERE student_id = student_record.id;
      GET DIAGNOSTICS deleted_count = ROW_COUNT;
      RAISE NOTICE '   ✅ Deleted % quiz attempt(s)', deleted_count;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE '   ⚠️  Quiz attempts: %', SQLERRM;
    END;
    
    -- Delete student_progress
    BEGIN
      DELETE FROM student_progress WHERE student_id = student_record.id;
      GET DIAGNOSTICS deleted_count = ROW_COUNT;
      RAISE NOTICE '   ✅ Deleted % student_progress record(s)', deleted_count;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE '   ⚠️  Student progress: %', SQLERRM;
    END;
    
    -- Delete module_progress
    BEGIN
      DELETE FROM module_progress WHERE student_id = student_record.id;
      GET DIAGNOSTICS deleted_count = ROW_COUNT;
      RAISE NOTICE '   ✅ Deleted % module_progress record(s)', deleted_count;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE '   ⚠️  Module progress: %', SQLERRM;
    END;
    
    -- Delete enrollments
    BEGIN
      DELETE FROM enrollments WHERE student_id = student_record.id;
      GET DIAGNOSTICS deleted_count = ROW_COUNT;
      RAISE NOTICE '   ✅ Deleted % enrollment(s)', deleted_count;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE '   ⚠️  Enrollments: %', SQLERRM;
    END;
    
    -- Delete applications
    BEGIN
      DELETE FROM applications WHERE student_id = student_record.id;
      GET DIAGNOSTICS deleted_count = ROW_COUNT;
      RAISE NOTICE '   ✅ Deleted % application(s)', deleted_count;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE '   ⚠️  Applications: %', SQLERRM;
    END;
    
    -- Finally, delete the student record
    BEGIN
      DELETE FROM students WHERE id = student_record.id;
      total_deleted := total_deleted + 1;
      RAISE NOTICE '   ✅ Deleted student account: %', student_record.email;
      RAISE NOTICE '   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE '   ❌ Failed to delete student: %', SQLERRM;
    END;
    
  END LOOP;
  
  RAISE NOTICE '';
  RAISE NOTICE '================================================';
  RAISE NOTICE '🎉 DELETION COMPLETE!';
  RAISE NOTICE '📊 Total students deleted: %', total_deleted;
  RAISE NOTICE '================================================';
  
END $$;

-- ========================================
-- VERIFICATION
-- ========================================

SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ All students successfully deleted'
    ELSE '⚠️  ' || COUNT(*) || ' student(s) still exist'
  END AS deletion_status
FROM students
WHERE email IN (
  'ceesproductions@gmail.com',
  'sarrol@vonwillingh.co.za',
  'mandatetracker@mjgrealestate.co.za'
);
