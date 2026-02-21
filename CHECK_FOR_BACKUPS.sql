-- Check if Supabase has any backup or audit tables
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'public'
  AND (
    tablename LIKE '%backup%' 
    OR tablename LIKE '%history%' 
    OR tablename LIKE '%audit%'
    OR tablename LIKE '%log%'
  );

-- Check if there's a modules_audit or modules_history table
SELECT EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_name = 'modules_audit'
) as has_modules_audit;

-- Check the updated_at timestamp to see when content was changed
SELECT 
    m.id,
    m.title,
    m.created_at,
    m.updated_at,
    m.updated_at - m.created_at as time_since_creation,
    CASE 
        WHEN m.updated_at > m.created_at + interval '1 hour' 
        THEN '⚠️ Content was modified after creation'
        ELSE '✅ Content unchanged since creation'
    END as modification_status
FROM modules m
JOIN courses c ON m.course_id = c.id
WHERE c.code = 'AIFUND001'
  AND m.title ILIKE '%Module 1%';
