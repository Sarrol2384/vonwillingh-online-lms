-- =====================================================
-- VERIFY LATEST AIFUND001 COURSE IMPORT
-- =====================================================

-- 1. Check course and module details with quiz question count
SELECT 
    c.id AS course_id,
    c.code AS course_code,
    c.name AS course_name,
    m.id AS module_id,
    m.title AS module_title,
    m.has_quiz,
    COUNT(qq.id) AS question_count
FROM courses c
JOIN modules m ON m.course_id = c.id
LEFT JOIN quiz_questions qq ON qq.module_id = m.id
WHERE c.code = 'AIFUND001'
GROUP BY c.id, c.code, c.name, m.id, m.title, m.has_quiz;

-- 2. Check quiz questions by type
SELECT 
    question_type,
    COUNT(*) AS count,
    SUM(points) AS total_points
FROM quiz_questions qq
JOIN modules m ON m.id = qq.module_id
JOIN courses c ON c.id = m.course_id
WHERE c.code = 'AIFUND001'
GROUP BY question_type
ORDER BY question_type;

-- 3. Sample of questions
SELECT 
    order_number,
    question_type,
    LEFT(question_text, 80) AS question_preview,
    correct_answer,
    points
FROM quiz_questions qq
JOIN modules m ON m.id = qq.module_id
JOIN courses c ON c.id = m.course_id
WHERE c.code = 'AIFUND001'
ORDER BY order_number
LIMIT 10;

-- 4. Final status check
SELECT 
    CASE 
        WHEN COUNT(*) = 30 THEN '✅ COMPLETE: All 30 questions imported'
        WHEN COUNT(*) > 30 THEN '⚠️ WARNING: ' || COUNT(*) || ' questions (expected 30)'
        WHEN COUNT(*) = 0 THEN '❌ ERROR: No questions found'
        ELSE '⚠️ INCOMPLETE: Only ' || COUNT(*) || ' questions (expected 30)'
    END AS import_status
FROM quiz_questions qq
JOIN modules m ON m.id = qq.module_id
JOIN courses c ON c.id = m.course_id
WHERE c.code = 'AIFUND001';
