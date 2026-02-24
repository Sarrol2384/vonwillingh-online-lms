-- =====================================================
-- CHECK LATEST QUIZ ATTEMPT DETAILS
-- =====================================================

SELECT 
    qa.id,
    qa.attempt_number,
    qa.total_questions,
    qa.correct_answers,
    qa.wrong_answers,
    qa.questions_attempted,
    qa.score,
    qa.total_points,
    qa.percentage,
    qa.passed,
    qa.time_spent_seconds,
    qa.created_at,
    jsonb_pretty(qa.answers) AS answers_json,
    jsonb_pretty(qa.results) AS results_json
FROM quiz_attempts qa
WHERE qa.module_id IN (
    SELECT id FROM modules WHERE course_id = 35
)
ORDER BY qa.created_at DESC
LIMIT 1;

-- Also check how many questions each type you got correct
SELECT 
    qq.question_type,
    COUNT(*) AS total_questions,
    SUM(CASE WHEN (qa.results->>qq.id::text)::boolean = true THEN 1 ELSE 0 END) AS correct_count
FROM quiz_attempts qa
JOIN modules m ON m.id = qa.module_id
JOIN quiz_questions qq ON qq.module_id = m.id
WHERE qa.module_id IN (SELECT id FROM modules WHERE course_id = 35)
    AND qa.id = (
        SELECT id FROM quiz_attempts 
        WHERE module_id IN (SELECT id FROM modules WHERE course_id = 35)
        ORDER BY created_at DESC 
        LIMIT 1
    )
GROUP BY qq.question_type;
