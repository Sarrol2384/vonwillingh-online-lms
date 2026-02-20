-- =====================================================
-- QUIZ INTEGRATION VERIFICATION SCRIPT
-- =====================================================
-- Run this after LINK_QUIZ_TO_MODULE1.sql to verify everything is set up correctly
-- =====================================================

-- Check 1: Verify Module 1 exists with quiz metadata
SELECT 
    '1. Module 1 Configuration' AS check_name,
    m.id,
    m.title,
    m.has_quiz,
    m.quiz_title,
    LEFT(m.quiz_description, 100) AS quiz_description_preview
FROM modules m
JOIN courses c ON m.course_id = c.id
WHERE c.code = 'AIFUND001'
  AND m.title ILIKE '%Module 1%';

-- Check 2: Count quiz questions
SELECT 
    '2. Quiz Questions' AS check_name,
    COUNT(*) AS total_questions,
    SUM(CASE WHEN difficulty = 'easy' THEN 1 ELSE 0 END) AS easy_questions,
    SUM(CASE WHEN difficulty = 'medium' THEN 1 ELSE 0 END) AS medium_questions,
    SUM(CASE WHEN difficulty = 'hard' THEN 1 ELSE 0 END) AS hard_questions
FROM quiz_questions qq
JOIN modules m ON qq.module_id = m.id
JOIN courses c ON m.course_id = c.id
WHERE c.code = 'AIFUND001'
  AND m.title ILIKE '%Module 1%';

-- Check 3: Verify progression rules
SELECT 
    '3. Progression Rules' AS check_name,
    m.title AS module_title,
    mpr.requires_quiz_pass,
    mpr.minimum_quiz_score || '%' AS passing_score,
    mpr.max_quiz_attempts,
    mpr.minimum_content_time_seconds || ' seconds (' || 
        ROUND(mpr.minimum_content_time_seconds / 60.0, 1) || ' minutes)' AS min_time,
    mpr.requires_scroll_to_bottom,
    mpr.is_required_for_next,
    mpr.manual_override_allowed
FROM module_progression_rules mpr
JOIN modules m ON mpr.module_id = m.id
WHERE m.title ILIKE '%Module 1%';

-- Check 4: Verify table structure
SELECT 
    '4. Database Tables' AS check_name,
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name IN ('quiz_questions', 'quiz_attempts', 'module_progression_rules', 'module_content_completion')
  AND table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- Check 5: Verify indexes
SELECT 
    '5. Database Indexes' AS check_name,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('quiz_questions', 'quiz_attempts', 'module_progression_rules', 'module_content_completion')
ORDER BY tablename, indexname;

-- Check 6: Sample quiz questions (first 3)
SELECT 
    '6. Sample Questions' AS check_name,
    qq.order_number,
    qq.difficulty,
    LEFT(qq.question_text, 80) AS question_preview,
    qq.correct_answer,
    qq.option_a AS option_a_preview
FROM quiz_questions qq
JOIN modules m ON qq.module_id = m.id
JOIN courses c ON m.course_id = c.id
WHERE c.code = 'AIFUND001'
  AND m.title ILIKE '%Module 1%'
ORDER BY qq.order_number
LIMIT 3;

-- Check 7: Verify Module 1 and Module 2 relationship
SELECT 
    '7. Module Progression' AS check_name,
    m1.title AS module_1,
    m2.title AS module_2_next,
    mpr.requires_quiz_pass AS blocks_module_2
FROM modules m1
LEFT JOIN module_progression_rules mpr ON mpr.module_id = m1.id
LEFT JOIN modules m2 ON mpr.next_module_id = m2.id
WHERE m1.title ILIKE '%Module 1%';

-- =====================================================
-- EXPECTED RESULTS SUMMARY
-- =====================================================
-- Check 1: Should show Module 1 with has_quiz=TRUE and quiz_title set
-- Check 2: Should show 20 questions (8 easy, 9 medium, 3 hard)
-- Check 3: Should show:
--    - requires_quiz_pass: true
--    - passing_score: 70%
--    - max_attempts: 3
--    - min_time: 1800 seconds (30 minutes) or 60 seconds if using test mode
--    - requires_scroll_to_bottom: true
-- Check 4: Should list all columns for 4 tables
-- Check 5: Should show indexes on module_id, student_id, etc.
-- Check 6: Should show first 3 quiz questions with difficulty and preview
-- Check 7: Should show Module 1 linked to Module 2 with blocks_module_2=true
-- =====================================================

-- QUICK FIX QUERIES (if needed)
-- =====================================================

-- If progression rules are missing:
-- Run: /home/user/webapp/LINK_QUIZ_TO_MODULE1.sql

-- If quiz questions are missing:
-- Run: /home/user/webapp/FIX_QUIZ_TABLE_AND_CREATE.sql

-- To reduce content time requirement for testing:
-- UPDATE module_progression_rules SET minimum_content_time_seconds = 60
-- WHERE module_id IN (SELECT m.id FROM modules m JOIN courses c ON m.course_id = c.id WHERE c.code = 'AIFUND001' AND m.title ILIKE '%Module 1%');

-- To reset to production (30 minutes):
-- UPDATE module_progression_rules SET minimum_content_time_seconds = 1800
-- WHERE module_id IN (SELECT m.id FROM modules m JOIN courses c ON m.course_id = c.id WHERE c.code = 'AIFUND001' AND m.title ILIKE '%Module 1%');
