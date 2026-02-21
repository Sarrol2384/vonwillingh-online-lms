-- Check what Module 1 currently has
SELECT 
    m.id,
    m.title,
    LENGTH(m.content) as current_content_length,
    m.updated_at,
    SUBSTRING(m.content, 1, 200) as first_200_chars,
    CASE 
        WHEN m.content LIKE '%Module Quiz%' THEN '✅ Has quiz text'
        ELSE '❌ No quiz text'
    END as has_quiz_text,
    CASE
        WHEN LENGTH(m.content) < 5000 THEN '⚠️ Content seems too short'
        WHEN LENGTH(m.content) > 5000 AND LENGTH(m.content) < 15000 THEN '✅ Normal length (lesson only)'
        ELSE '✅ Full length (lesson + quiz)'
    END as content_status
FROM modules m
JOIN courses c ON m.course_id = c.id
WHERE c.code = 'AIFUND001'
  AND m.title ILIKE '%Module 1%';
