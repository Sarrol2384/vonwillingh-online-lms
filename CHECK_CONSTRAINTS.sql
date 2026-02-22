-- Check what constraints exist on quiz_questions table
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'quiz_questions'::regclass;
