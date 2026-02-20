-- Method 1: Direct table inspection
SELECT * FROM quiz_questions LIMIT 0;

-- Method 2: Check using pg_catalog
SELECT 
    a.attname AS column_name,
    pg_catalog.format_type(a.atttypid, a.atttypmod) AS data_type
FROM 
    pg_catalog.pg_attribute a
WHERE 
    a.attrelid = 'quiz_questions'::regclass
    AND a.attnum > 0 
    AND NOT a.attisdropped
ORDER BY a.attnum;

-- Method 3: Show all table columns simply
\d quiz_questions
