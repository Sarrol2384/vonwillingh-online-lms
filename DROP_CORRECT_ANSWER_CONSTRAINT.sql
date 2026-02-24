-- ============================================================
-- DROP CORRECT_ANSWER CHECK CONSTRAINT
-- ============================================================
-- The constraint only allows single letters (A, B, C, D)
-- But we need to support:
-- - Single letters: "A", "B", "C", "D", "E"
-- - True/False: "True", "False"
-- - Multiple answers: "A,C,E"
-- ============================================================

-- First, let's see what the constraint is
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'quiz_questions'::regclass
AND conname = 'quiz_questions_correct_answer_check';

-- Drop the restrictive constraint
ALTER TABLE quiz_questions
DROP CONSTRAINT IF EXISTS quiz_questions_correct_answer_check;

-- Verify it was dropped
SELECT 
    CASE 
        WHEN NOT EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conrelid = 'quiz_questions'::regclass 
            AND conname = 'quiz_questions_correct_answer_check'
        ) THEN '✅ Constraint dropped successfully - correct_answer can now accept any text'
        ELSE '❌ Constraint still exists'
    END AS status;
