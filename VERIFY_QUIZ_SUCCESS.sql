-- ============================================================
-- VERIFY QUIZ QUESTIONS WERE INSERTED SUCCESSFULLY
-- ============================================================

-- Count questions by type
SELECT 
    question_type,
    COUNT(*) AS count,
    SUM(points) AS total_points
FROM quiz_questions qq
JOIN modules m ON qq.module_id = m.id
JOIN courses c ON m.course_id = c.id
WHERE c.code = 'AIFUND001'
GROUP BY question_type
ORDER BY question_type;

-- Show overall summary
SELECT 
    c.name AS course_name,
    c.code AS course_code,
    m.title AS module_title,
    m.has_quiz,
    m.quiz_title,
    COUNT(qq.id) AS total_questions,
    SUM(qq.points) AS total_points,
    CASE 
        WHEN COUNT(qq.id) = 30 THEN '✅ COMPLETE (30/30)'
        ELSE '⚠️ INCOMPLETE (' || COUNT(qq.id) || '/30)'
    END AS status
FROM courses c
JOIN modules m ON m.course_id = c.id
LEFT JOIN quiz_questions qq ON qq.module_id = m.id
WHERE c.code = 'AIFUND001'
GROUP BY c.id, c.name, c.code, m.id, m.title, m.has_quiz, m.quiz_title;

-- Show first 5 questions as sample
SELECT 
    order_number,
    question_type,
    LEFT(question_text, 60) AS question_preview,
    correct_answer,
    points
FROM quiz_questions qq
JOIN modules m ON qq.module_id = m.id
JOIN courses c ON m.course_id = c.id
WHERE c.code = 'AIFUND001'
ORDER BY order_number
LIMIT 5;
