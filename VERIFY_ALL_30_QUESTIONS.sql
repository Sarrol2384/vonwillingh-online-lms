-- =====================================================
-- VERIFY ALL 30 QUESTIONS ARE IN DATABASE
-- =====================================================

-- 1. Count total questions for AIFUND001
SELECT 
    c.code,
    c.name,
    m.title,
    COUNT(qq.id) AS total_questions
FROM courses c
JOIN modules m ON m.course_id = c.id
LEFT JOIN quiz_questions qq ON qq.module_id = m.id
WHERE c.code = 'AIFUND001'
GROUP BY c.id, c.code, c.name, m.id, m.title;

-- 2. Count by question type
SELECT 
    qq.question_type,
    COUNT(*) AS count,
    SUM(qq.points) AS total_points
FROM courses c
JOIN modules m ON m.course_id = c.id
JOIN quiz_questions qq ON qq.module_id = m.id
WHERE c.code = 'AIFUND001'
GROUP BY qq.question_type
ORDER BY qq.question_type;

-- 3. Check for missing order_numbers (1-30)
WITH expected_orders AS (
    SELECT generate_series(1, 30) AS expected_order
),
actual_orders AS (
    SELECT qq.order_number
    FROM courses c
    JOIN modules m ON m.course_id = c.id
    JOIN quiz_questions qq ON qq.module_id = m.id
    WHERE c.code = 'AIFUND001'
)
SELECT 
    eo.expected_order,
    CASE 
        WHEN ao.order_number IS NULL THEN '❌ MISSING'
        ELSE '✅ EXISTS'
    END AS status
FROM expected_orders eo
LEFT JOIN actual_orders ao ON ao.order_number = eo.expected_order
WHERE ao.order_number IS NULL
ORDER BY eo.expected_order;

-- 4. Show all questions with order numbers
SELECT 
    qq.order_number,
    qq.question_type,
    LEFT(qq.question_text, 80) AS question_preview,
    qq.points,
    CASE 
        WHEN qq.option_a IS NULL THEN '❌ NULL'
        ELSE '✅ OK'
    END AS has_options
FROM courses c
JOIN modules m ON m.course_id = c.id
JOIN quiz_questions qq ON qq.module_id = m.id
WHERE c.code = 'AIFUND001'
ORDER BY qq.order_number;

-- 5. Final summary
SELECT 
    CASE 
        WHEN COUNT(*) = 30 THEN '✅ All 30 questions present'
        WHEN COUNT(*) < 30 THEN '❌ MISSING: Only ' || COUNT(*) || ' questions found (expected 30)'
        ELSE '⚠️ WARNING: ' || COUNT(*) || ' questions found (expected 30)'
    END AS status,
    COUNT(*) AS actual_count
FROM courses c
JOIN modules m ON m.course_id = c.id
JOIN quiz_questions qq ON qq.module_id = m.id
WHERE c.code = 'AIFUND001';
