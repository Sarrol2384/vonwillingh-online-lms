-- ============================================================
-- ADD OPTION_E COLUMN TO QUIZ_QUESTIONS TABLE
-- ============================================================
-- This allows quiz questions to have 5 options (A, B, C, D, E)
-- Required for multiple_select question types
-- ============================================================

-- Add option_e column to quiz_questions table
ALTER TABLE quiz_questions 
ADD COLUMN IF NOT EXISTS option_e TEXT;

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'quiz_questions'
ORDER BY ordinal_position;

-- Show result
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'quiz_questions' AND column_name = 'option_e'
        ) THEN '✅ option_e column added successfully'
        ELSE '❌ Failed to add option_e column'
    END AS result;
