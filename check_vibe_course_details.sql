-- Check Vibe Coder course details
SELECT 
    id,
    name,
    code,
    level,
    category,
    price,
    modules_count,
    duration,
    description,
    created_at
FROM courses 
WHERE name LIKE '%Vibe%'
ORDER BY created_at DESC;

-- Check all courses to compare
SELECT 
    id,
    name,
    level,
    price,
    modules_count
FROM courses 
ORDER BY id;
