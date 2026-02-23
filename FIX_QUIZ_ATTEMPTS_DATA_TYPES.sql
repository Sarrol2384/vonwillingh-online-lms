-- =====================================================
-- FIX quiz_attempts TABLE DATA TYPE ERRORS
-- =====================================================
-- Error: "invalid input syntax for type integer: [UUID array]"
-- Cause: answers column is INTEGER instead of JSONB
-- =====================================================

-- Step 1: Check current column types
SELECT 
    column_name,
    data_type,
    udt_name,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'quiz_attempts'
ORDER BY ordinal_position;

-- Step 2: Fix the answers column (INTEGER → JSONB)
DO $$
BEGIN
    -- Check if column exists and is wrong type
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'quiz_attempts' 
        AND column_name = 'answers' 
        AND data_type != 'jsonb'
    ) THEN
        -- Drop the column and recreate it as JSONB
        ALTER TABLE quiz_attempts DROP COLUMN IF EXISTS answers;
        ALTER TABLE quiz_attempts ADD COLUMN answers JSONB;
        RAISE NOTICE '✅ Fixed answers column: INTEGER → JSONB';
    ELSE
        RAISE NOTICE '✅ answers column already JSONB or does not exist';
    END IF;
END $$;

-- Step 3: Fix the results column (if it has the same issue)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'quiz_attempts' 
        AND column_name = 'results' 
        AND data_type != 'jsonb'
    ) THEN
        ALTER TABLE quiz_attempts DROP COLUMN IF EXISTS results;
        ALTER TABLE quiz_attempts ADD COLUMN results JSONB;
        RAISE NOTICE '✅ Fixed results column: → JSONB';
    ELSE
        RAISE NOTICE '✅ results column already JSONB or does not exist';
    END IF;
END $$;

-- Step 4: Ensure all other columns are correct types
ALTER TABLE quiz_attempts 
ALTER COLUMN student_id TYPE UUID USING student_id::uuid;

ALTER TABLE quiz_attempts 
ALTER COLUMN module_id TYPE UUID USING module_id::uuid;

ALTER TABLE quiz_attempts 
ALTER COLUMN enrollment_id TYPE UUID USING enrollment_id::uuid;

ALTER TABLE quiz_attempts 
ALTER COLUMN total_questions TYPE INTEGER USING total_questions::integer;

ALTER TABLE quiz_attempts 
ALTER COLUMN correct_answers TYPE INTEGER USING correct_answers::integer;

ALTER TABLE quiz_attempts 
ALTER COLUMN wrong_answers TYPE INTEGER USING wrong_answers::integer;

ALTER TABLE quiz_attempts 
ALTER COLUMN questions_attempted TYPE INTEGER USING questions_attempted::integer;

ALTER TABLE quiz_attempts 
ALTER COLUMN percentage TYPE DECIMAL(5,2) USING percentage::decimal;

ALTER TABLE quiz_attempts 
ALTER COLUMN passed TYPE BOOLEAN USING passed::boolean;

ALTER TABLE quiz_attempts 
ALTER COLUMN attempt_number TYPE INTEGER USING attempt_number::integer;

ALTER TABLE quiz_attempts 
ALTER COLUMN time_spent_seconds TYPE INTEGER USING time_spent_seconds::integer;

-- Step 5: Verify the fix
SELECT 
    column_name,
    data_type,
    CASE 
        WHEN column_name = 'answers' AND data_type = 'jsonb' THEN '✅ CORRECT'
        WHEN column_name = 'results' AND data_type = 'jsonb' THEN '✅ CORRECT'
        WHEN column_name IN ('student_id', 'module_id', 'enrollment_id') AND data_type = 'uuid' THEN '✅ CORRECT'
        WHEN column_name IN ('total_questions', 'correct_answers', 'wrong_answers', 'questions_attempted', 'attempt_number', 'time_spent_seconds') AND data_type = 'integer' THEN '✅ CORRECT'
        WHEN column_name = 'percentage' AND data_type = 'numeric' THEN '✅ CORRECT'
        WHEN column_name = 'passed' AND data_type = 'boolean' THEN '✅ CORRECT'
        ELSE '⚠️ CHECK THIS'
    END AS status
FROM information_schema.columns 
WHERE table_name = 'quiz_attempts'
ORDER BY ordinal_position;

-- Final status message
SELECT '✅ quiz_attempts table schema fixed!' AS status;
