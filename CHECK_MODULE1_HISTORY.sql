-- Check if Supabase has audit logs or if we can see when it was updated
SELECT 
    m.id,
    m.title,
    m.created_at,
    m.updated_at,
    LENGTH(m.content) as content_length,
    m.has_quiz
FROM modules m
JOIN courses c ON m.course_id = c.id
WHERE c.code = 'AIFUND001'
  AND m.title ILIKE '%Module 1%';

-- Try to check if there's a backup or previous version
-- Note: Supabase doesn't have automatic versioning unless enabled
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE '%backup%' OR table_name LIKE '%history%' OR table_name LIKE '%audit%';
