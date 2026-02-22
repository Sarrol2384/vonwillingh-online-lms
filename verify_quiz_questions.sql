-- Check if quiz questions exist for the recently imported course
SELECT 
    c.id AS course_id,
    c.name AS course_name,
    c.code AS course_code,
    m.id AS module_id,
    m.title AS module_title,
    m.has_quiz,
    m.quiz_title,
    COUNT(qq.id) AS question_count,
    CASE 
        WHEN COUNT(qq.id) = 0 THEN '❌ NO QUESTIONS FOUND'
        WHEN COUNT(qq.id) < 30 THEN '⚠️ INCOMPLETE (' || COUNT(qq.id) || '/30)'
        ELSE '✅ COMPLETE (' || COUNT(qq.id) || ' questions)'
    END AS status
FROM courses c
JOIN modules m ON m.course_id = c.id
LEFT JOIN quiz_questions qq ON qq.module_id = m.id
WHERE c.code = 'AIFUND001'
GROUP BY c.id, c.name, c.code, m.id, m.title, m.has_quiz, m.quiz_title;

-- List the actual questions if they exist
SELECT 
    qq.id,
    qq.order_number,
    qq.question_type,
    LEFT(qq.question_text, 80) AS question_preview,
    qq.correct_answer,
    qq.points
FROM quiz_questions qq
JOIN modules m ON qq.module_id = m.id
JOIN courses c ON m.course_id = c.id
WHERE c.code = 'AIFUND001'
ORDER BY qq.order_number
LIMIT 10;
