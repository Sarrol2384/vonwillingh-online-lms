-- Find where the plain-text quiz starts in Module 1 content
SELECT 
    m.id,
    m.title,
    LENGTH(m.content) as total_length,
    POSITION('Question 20' IN m.content) as q20_position,
    POSITION('Easy' IN m.content) as easy_position,
    POSITION('What is the recommended approach' IN m.content) as question_text_position,
    SUBSTRING(m.content, POSITION('Question 20' IN m.content) - 100, 300) as context_around_q20
FROM modules m
JOIN courses c ON m.course_id = c.id
WHERE c.code = 'AIFUND001'
  AND m.title ILIKE '%Module 1%';
