-- Delete existing AIFUND001 course and all related data
-- This will cascade delete modules and quiz_questions automatically

DELETE FROM courses WHERE code = 'AIFUND001';

-- Verify deletion
SELECT 
    CASE 
        WHEN NOT EXISTS (SELECT 1 FROM courses WHERE code = 'AIFUND001')
        THEN '✅ Course AIFUND001 deleted successfully - ready for fresh import'
        ELSE '❌ Course still exists'
    END AS status;
