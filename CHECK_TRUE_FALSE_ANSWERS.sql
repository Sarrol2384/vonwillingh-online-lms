-- Check True/False questions 16-18 in the database
-- Run this in Supabase SQL Editor

SELECT 
  qq.order_number,
  qq.question_text,
  qq.question_type,
  qq.option_a,
  qq.option_b,
  qq.correct_answer,
  LENGTH(qq.correct_answer) as answer_length,
  ASCII(SUBSTRING(qq.correct_answer, 1, 1)) as first_char_ascii,
  qq.correct_answer = 'False' as matches_false,
  qq.correct_answer = 'True' as matches_true
FROM quiz_questions qq
JOIN modules m ON qq.module_id = m.id
JOIN courses c ON m.course_id = c.id
WHERE c.code = 'AIFUND001'
  AND qq.order_number IN (16, 17, 18)
ORDER BY qq.order_number;

-- This will show:
-- 1. What text is stored in option_a and option_b
-- 2. What the correct_answer is (exact text)
-- 3. If there are any hidden characters or whitespace
-- 4. If the answer matches "True" or "False" exactly
