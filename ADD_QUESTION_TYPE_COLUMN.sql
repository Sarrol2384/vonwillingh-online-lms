-- ============================================================
-- ADD MISSING question_type COLUMN
-- ============================================================

-- Add the question_type column
ALTER TABLE quiz_questions 
ADD COLUMN IF NOT EXISTS question_type TEXT NOT NULL DEFAULT 'multiple_choice';

-- Add constraint to ensure valid question types
ALTER TABLE quiz_questions
DROP CONSTRAINT IF EXISTS quiz_questions_question_type_check;

ALTER TABLE quiz_questions
ADD CONSTRAINT quiz_questions_question_type_check 
CHECK (question_type IN ('multiple_choice', 'true_false', 'multiple_select'));

-- Verify the column was added
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'quiz_questions' AND column_name = 'question_type';

-- Show success message
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'quiz_questions' AND column_name = 'question_type'
        ) THEN '✅ question_type column added successfully'
        ELSE '❌ Failed to add question_type column'
    END AS status;
