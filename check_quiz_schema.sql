-- Check the actual quiz_questions table schema
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'quiz_questions'
ORDER BY ordinal_position;
