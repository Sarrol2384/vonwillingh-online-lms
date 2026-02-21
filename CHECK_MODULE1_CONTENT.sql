-- Check Module 1 current content
SELECT 
    m.id,
    m.title,
    LENGTH(m.content) as content_length,
    SUBSTRING(m.content, 1, 500) as content_preview_first_500,
    SUBSTRING(m.content, LENGTH(m.content) - 500, 500) as content_preview_last_500,
    m.has_quiz,
    m.quiz_title
FROM modules m
JOIN courses c ON m.course_id = c.id
WHERE c.code = 'AIFUND001'
  AND m.title ILIKE '%Module 1%';
