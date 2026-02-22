-- Check the ACTUAL current schema of quiz_questions table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'quiz_questions'
ORDER BY ordinal_position;

-- Also check if the table even exists
SELECT 
    table_name,
    table_type
FROM information_schema.tables
WHERE table_name = 'quiz_questions';
