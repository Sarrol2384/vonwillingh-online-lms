-- ============================================================
-- FIX CORRECT_ANSWER COLUMN LENGTH
-- ============================================================
-- Change from VARCHAR(1) to TEXT to support:
-- - Single letters: "A", "B", "C", "D", "E"
-- - True/False: "True", "False"
-- - Multiple answers: "A,C,E"
-- ============================================================

-- Change the column type from character varying(1) to TEXT
ALTER TABLE quiz_questions 
ALTER COLUMN correct_answer TYPE TEXT;

-- Verify the change
SELECT 
    column_name,
    data_type,
    character_maximum_length
FROM information_schema.columns
WHERE table_name = 'quiz_questions' AND column_name = 'correct_answer';

-- Show success message
SELECT '✅ correct_answer column changed to TEXT (no length limit)' AS status;
