-- =====================================================
-- VERIFY AIFUND001 RE-IMPORT SUCCESS
-- =====================================================

-- 1. Check course and module details
SELECT 
    c.id AS course_id,
    c.code,
    c.name,
    m.id AS module_id,
    m.title AS module_title,
    m.has_quiz
FROM courses c
JOIN modules m ON m.course_id = c.id
WHERE c.code = 'AIFUND001';

-- 2. Check quiz questions by type
SELECT 
    qq.question_type,
    COUNT(*) AS question_count,
    SUM(qq.points) AS total_points
FROM courses c
JOIN modules m ON m.course_id = c.id
JOIN quiz_questions qq ON qq.module_id = m.id
WHERE c.code = 'AIFUND001'
GROUP BY qq.question_type
ORDER BY qq.question_type;

-- 3. Check TRUE/FALSE questions (should have "True" and "False" options)
SELECT 
    qq.order_number,
    LEFT(qq.question_text, 60) AS question_preview,
    qq.option_a,
    qq.option_b,
    qq.option_c,
    qq.option_d,
    qq.correct_answer,
    qq.points
FROM courses c
JOIN modules m ON m.course_id = c.id
JOIN quiz_questions qq ON qq.module_id = m.id
WHERE c.code = 'AIFUND001'
    AND qq.question_type = 'true_false'
ORDER BY qq.order_number
LIMIT 3;

-- 4. Check MULTIPLE-SELECT questions (should have 5 options)
SELECT 
    qq.order_number,
    LEFT(qq.question_text, 60) AS question_preview,
    qq.option_a,
    qq.option_b,
    qq.option_c,
    qq.option_d,
    qq.option_e,  -- Should NOT be null
    qq.correct_answer,  -- Should be comma-separated like "A,B,C"
    qq.points
FROM courses c
JOIN modules m ON m.course_id = c.id
JOIN quiz_questions qq ON qq.module_id = m.id
WHERE c.code = 'AIFUND001'
    AND qq.question_type = 'multiple_select'
ORDER BY qq.order_number
LIMIT 3;

-- 5. Overall summary
SELECT 
    COUNT(*) AS total_questions,
    SUM(points) AS total_points,
    CASE 
        WHEN COUNT(*) = 30 THEN '✅ ALL 30 QUESTIONS IMPORTED'
        ELSE '⚠️ Expected 30, got ' || COUNT(*)
    END AS status
FROM courses c
JOIN modules m ON m.course_id = c.id
JOIN quiz_questions qq ON qq.module_id = m.id
WHERE c.code = 'AIFUND001';
