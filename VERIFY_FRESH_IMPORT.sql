-- Verify the fresh import
SELECT 
    c.id AS course_id,
    c.code,
    c.name,
    m.id AS module_id,
    m.title AS module_title,
    m.has_quiz,
    COUNT(qq.id) AS question_count
FROM courses c
JOIN modules m ON m.course_id = c.id
LEFT JOIN quiz_questions qq ON qq.module_id = m.id
WHERE c.code = 'AIFUND001'
GROUP BY c.id, c.code, c.name, m.id, m.title, m.has_quiz;

-- Check question types distribution
SELECT 
    qq.question_type,
    COUNT(*) AS count,
    SUM(qq.points) AS total_points
FROM quiz_questions qq
JOIN modules m ON qq.module_id = m.id
JOIN courses c ON m.course_id = c.id
WHERE c.code = 'AIFUND001'
GROUP BY qq.question_type
ORDER BY qq.question_type;
