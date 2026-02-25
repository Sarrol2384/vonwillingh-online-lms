-- Check Module 1 Quiz
SELECT 
    m.title as module_title,
    q.title as quiz_title,
    q.passing_score,
    q.max_attempts,
    q.time_limit_minutes,
    COUNT(qq.id) as total_questions
FROM modules m
JOIN quizzes q ON q.module_id = m.id
LEFT JOIN quiz_questions qq ON qq.quiz_id = q.id
WHERE m.course_id = 35 AND m.order_number = 1
GROUP BY m.title, q.title, q.passing_score, q.max_attempts, q.time_limit_minutes;

-- Check Module 2 Quiz
SELECT 
    m.title as module_title,
    q.title as quiz_title,
    q.passing_score,
    q.max_attempts,
    q.time_limit_minutes,
    COUNT(qq.id) as total_questions
FROM modules m
JOIN quizzes q ON q.module_id = m.id
LEFT JOIN quiz_questions qq ON qq.quiz_id = q.id
WHERE m.course_id = 35 AND m.order_number = 2
GROUP BY m.title, q.title, q.passing_score, q.max_attempts, q.time_limit_minutes;

-- Question type breakdown for Module 1
SELECT 
    m.order_number as module_num,
    qq.question_type,
    COUNT(*) as count
FROM modules m
JOIN quizzes q ON q.module_id = m.id
JOIN quiz_questions qq ON qq.quiz_id = q.id
WHERE m.course_id = 35 AND m.order_number = 1
GROUP BY m.order_number, qq.question_type
ORDER BY m.order_number, qq.question_type;

-- Question type breakdown for Module 2
SELECT 
    m.order_number as module_num,
    qq.question_type,
    COUNT(*) as count
FROM modules m
JOIN quizzes q ON q.module_id = m.id
JOIN quiz_questions qq ON qq.quiz_id = q.id
WHERE m.course_id = 35 AND m.order_number = 2
GROUP BY m.order_number, qq.question_type
ORDER BY m.order_number, qq.question_type;

-- Sample questions from each module
SELECT 
    m.order_number as module,
    qq.order_number as q_num,
    SUBSTRING(qq.question_text, 1, 80) as question_preview,
    qq.question_type,
    qq.points,
    qq.correct_answer,
    qq.correct_answers
FROM modules m
JOIN quizzes q ON q.module_id = m.id
JOIN quiz_questions qq ON qq.quiz_id = q.id
WHERE m.course_id = 35 
  AND qq.order_number IN (1, 16, 24)
ORDER BY m.order_number, qq.order_number;
