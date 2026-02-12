-- ============================================================
-- PART 1: CLEANUP - Delete existing test course
-- ============================================================

DELETE FROM quiz_questions 
WHERE module_id IN (
  SELECT id FROM modules 
  WHERE course_id IN (SELECT id FROM courses WHERE code = 'TESTLEAD001')
);

DELETE FROM modules WHERE course_id IN (SELECT id FROM courses WHERE code = 'TESTLEAD001');

DELETE FROM courses WHERE code = 'TESTLEAD001';

-- Verify cleanup
SELECT 'Cleanup complete!' AS status;
