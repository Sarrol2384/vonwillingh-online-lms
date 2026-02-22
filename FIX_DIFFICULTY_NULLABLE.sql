-- ============================================================
-- MAKE DIFFICULTY COLUMN NULLABLE
-- ============================================================
-- The difficulty column is currently NOT NULL but we don't
-- use it in our import. Make it nullable with a default.
-- ============================================================

-- Make difficulty column nullable
ALTER TABLE quiz_questions 
ALTER COLUMN difficulty DROP NOT NULL;

-- Set a default value for difficulty
ALTER TABLE quiz_questions 
ALTER COLUMN difficulty SET DEFAULT 'medium';

-- Verify the change
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'quiz_questions' AND column_name = 'difficulty';

-- Show success message
SELECT '✅ difficulty column is now nullable with default "medium"' AS status;
