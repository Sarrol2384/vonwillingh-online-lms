-- Check the actual structure of quiz_questions table
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'quiz_questions'
ORDER BY ordinal_position;

-- Also check if the table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'quiz_questions'
) AS table_exists;
