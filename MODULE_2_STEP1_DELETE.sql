-- ============================================
-- STEP 1: Delete existing Module 2
-- ============================================

-- Delete quiz questions first (foreign key constraint)
DELETE FROM quiz_questions 
WHERE module_id IN (
  SELECT id FROM modules 
  WHERE title = 'Module 2: Core Concepts in Leadership'
);

-- Delete the module
DELETE FROM modules
WHERE title = 'Module 2: Core Concepts in Leadership';

-- Verify deletion
SELECT 
  'Cleanup Complete!' as message,
  (SELECT COUNT(*) FROM modules WHERE title = 'Module 2: Core Concepts in Leadership') as remaining_modules,
  (SELECT COUNT(*) FROM quiz_questions WHERE module_id IN (SELECT id FROM modules WHERE title = 'Module 2: Core Concepts in Leadership')) as remaining_questions;
