-- Check for the imported course
SELECT id, name, code, level, category, price, modules_count, created_at
FROM courses 
WHERE name LIKE '%Vibe%' OR name LIKE '%vibe%'
ORDER BY created_at DESC
LIMIT 5;
