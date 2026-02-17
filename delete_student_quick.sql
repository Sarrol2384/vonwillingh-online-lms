-- QUICK DELETE: Single student by email
-- Use this if you just want to delete one student quickly

-- Replace 'email@example.com' with the actual email
DO $$
DECLARE
    v_student_id INTEGER;
BEGIN
    -- Get student ID
    SELECT id INTO v_student_id FROM students WHERE email = 'vonwillinghc@gmail.com';
    
    IF v_student_id IS NOT NULL THEN
        -- Delete in correct order
        DELETE FROM student_progress WHERE student_id = v_student_id;
        DELETE FROM quiz_attempts WHERE student_id = v_student_id;
        DELETE FROM enrollments WHERE student_id = v_student_id;
        DELETE FROM applications WHERE student_id = v_student_id;
        DELETE FROM students WHERE id = v_student_id;
        
        RAISE NOTICE 'Student deleted successfully! ID: %', v_student_id;
    ELSE
        RAISE NOTICE 'Student not found with that email';
    END IF;
END $$;

-- Verify deletion
SELECT 'Deleted successfully!' as status WHERE NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'vonwillinghc@gmail.com'
);
