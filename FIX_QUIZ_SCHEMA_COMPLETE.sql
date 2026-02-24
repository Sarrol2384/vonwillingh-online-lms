-- ============================================================
-- COMPLETE QUIZ SCHEMA FIX
-- ============================================================
-- This adds all missing columns needed for the quiz system
-- ============================================================

-- 1. Add option_e column (for 5-option multiple_select questions)
ALTER TABLE quiz_questions 
ADD COLUMN IF NOT EXISTS option_e TEXT;

-- 2. Add points column (for question scoring)
ALTER TABLE quiz_questions 
ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 5;

-- 3. Add order_number column (for question ordering)
ALTER TABLE quiz_questions 
ADD COLUMN IF NOT EXISTS order_number INTEGER;

-- 4. Verify all columns exist
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'quiz_questions'
ORDER BY ordinal_position;

-- 5. Show result summary
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_questions' AND column_name = 'option_e')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_questions' AND column_name = 'points')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_questions' AND column_name = 'order_number')
        THEN '✅ All required columns added successfully'
        ELSE '❌ Some columns are still missing'
    END AS status;
