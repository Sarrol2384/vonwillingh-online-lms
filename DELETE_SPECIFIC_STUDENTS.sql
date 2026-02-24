-- ========================================
-- DELETE SPECIFIC STUDENT ACCOUNTS
-- ========================================
-- This script removes 3 student accounts and all related data
-- Students to delete:
-- 1. ceesproductions@gmail.com
-- 2. sarrol@vonwillingh.co.za
-- 3. mandatetracker@mjgrealestate.co.za
-- ========================================

DO $$
DECLARE
  student_record RECORD;
  deleted_students INTEGER := 0;
  deleted_enrollments INTEGER := 0;
  deleted_applications INTEGER := 0;
  deleted_quiz_attempts INTEGER := 0;
  deleted_progress INTEGER := 0;
  deleted_sessions INTEGER := 0;
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
    
    -- Delete student_sessions
    BEGIN
      DELETE FROM student_sessions WHERE student_id = student_record.id;
      GET DIAGNOSTICS deleted_sessions = ROW_COUNT;
      RAISE NOTICE '   ✅ Deleted % session(s)', deleted_sessions;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE '   ⚠️  Sessions: % (continuing...)', SQLERRM;
    END;
    
    -- Delete quiz_attempts
    BEGIN
      DELETE FROM quiz_attempts WHERE student_id = student_record.id;
      GET DIAGNOSTICS deleted_quiz_attempts = ROW_COUNT;
      RAISE NOTICE '   ✅ Deleted % quiz attempt(s)', deleted_quiz_attempts;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE '   ⚠️  Quiz attempts: % (continuing...)', SQLERRM;
    END;
    
    -- Delete student_progress
    BEGIN
      DELETE FROM student_progress WHERE student_id = student_record.id;
      GET DIAGNOSTICS deleted_progress = ROW_COUNT;
      RAISE NOTICE '   ✅ Deleted % progress record(s)', deleted_progress;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE '   ⚠️  Progress: % (continuing...)', SQLERRM;
    END;
    
    -- Delete module_progress
    BEGIN
      DELETE FROM module_progress WHERE student_id = student_record.id;
      GET DIAGNOSTICS deleted_progress = ROW_COUNT;
      RAISE NOTICE '   ✅ Deleted % module progress record(s)', deleted_progress;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE '   ⚠️  Module progress: % (continuing...)', SQLERRM;
    END;
    
    -- Delete enrollments
    BEGIN
      DELETE FROM enrollments WHERE student_id = student_record.id;
      GET DIAGNOSTICS deleted_enrollments = ROW_COUNT;
      RAISE NOTICE '   ✅ Deleted % enrollment(s)', deleted_enrollments;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE '   ⚠️  Enrollments: % (continuing...)', SQLERRM;
    END;
    
    -- Delete applications
    BEGIN
      DELETE FROM applications WHERE student_id = student_record.id;
      GET DIAGNOSTICS deleted_applications = ROW_COUNT;
      RAISE NOTICE '   ✅ Deleted % application(s)', deleted_applications;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE '   ⚠️  Applications: % (continuing...)', SQLERRM;
    END;
    
    -- Delete payments (if table exists)
    BEGIN
      DELETE FROM payments WHERE application_id IN (
        SELECT id FROM applications WHERE student_id = student_record.id
      );
      RAISE NOTICE '   ✅ Deleted payment records';
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE '   ⚠️  Payments: % (table may not exist, continuing...)', SQLERRM;
    END;
    
    -- Finally, delete the student record
    BEGIN
      DELETE FROM students WHERE id = student_record.id;
      deleted_students := deleted_students + 1;
      RAISE NOTICE '   ✅ Deleted student account: %', student_record.email;
      RAISE NOTICE '   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE '   ❌ Failed to delete student: %', SQLERRM;
    END;
    
  END LOOP;
  
  RAISE NOTICE '';
  RAISE NOTICE '================================================';
  RAISE NOTICE '🎉 DELETION COMPLETE!';
  RAISE NOTICE '📊 Total students deleted: %', deleted_students;
  RAISE NOTICE '================================================';
  
END $$;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Check if students are deleted
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

-- Show remaining students (for verification)
SELECT 
  id,
  email,
  first_name,
  last_name,
  created_at
FROM students
ORDER BY created_at DESC
LIMIT 10;

-- ========================================
-- EXPECTED OUTPUT
-- ========================================
/*
🗑️  Starting student deletion process...
================================================

📧 Processing: ceesproductions@gmail.com (First Last)
   Student ID: uuid-here
   ✅ Deleted X session(s)
   ✅ Deleted X quiz attempt(s)
   ✅ Deleted X progress record(s)
   ✅ Deleted X module progress record(s)
   ✅ Deleted X enrollment(s)
   ✅ Deleted X application(s)
   ✅ Deleted payment records
   ✅ Deleted student account: ceesproductions@gmail.com
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[...same for other 2 students...]

================================================
🎉 DELETION COMPLETE!
📊 Total students deleted: 3
================================================

✅ All students successfully deleted
*/
