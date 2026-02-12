-- ============================================================
-- PART 5: FINAL VERIFICATION
-- ============================================================

SELECT 
  '✅ IMPORT COMPLETE!' AS status,
  c.name AS course_name,
  c.code AS course_code,
  c.level,
  c.category,
  m.title AS module_title,
  m.duration_minutes,
  COUNT(q.id) AS quiz_questions,
  SUM(q.points) AS total_points
FROM courses c
JOIN modules m ON m.course_id = c.id
LEFT JOIN quiz_questions q ON q.module_id = m.id
WHERE c.code = 'TESTLEAD001'
GROUP BY c.id, c.name, c.code, c.level, c.category, m.id, m.title, m.duration_minutes;
