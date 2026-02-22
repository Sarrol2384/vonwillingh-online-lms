-- ============================================================
-- MAKE OPTION COLUMNS NULLABLE
-- ============================================================
-- True/False questions don't have option_a, option_b, etc.
-- Only multiple_choice and multiple_select use these columns.
-- ============================================================

-- Make all option columns nullable
ALTER TABLE quiz_questions 
ALTER COLUMN option_a DROP NOT NULL;

ALTER TABLE quiz_questions 
ALTER COLUMN option_b DROP NOT NULL;

ALTER TABLE quiz_questions 
ALTER COLUMN option_c DROP NOT NULL;

ALTER TABLE quiz_questions 
ALTER COLUMN option_d DROP NOT NULL;

-- option_e is already nullable

-- Verify the changes
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'quiz_questions' 
AND column_name IN ('option_a', 'option_b', 'option_c', 'option_d', 'option_e')
ORDER BY column_name;

-- Show success message
SELECT '✅ All option columns are now nullable' AS status;
