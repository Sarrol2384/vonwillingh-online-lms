-- =====================================================
-- ENABLE 60-SECOND TEST MODE
-- =====================================================
-- Changes content time requirement from 30 minutes to 60 seconds
-- Run this in Supabase to test the system quickly
-- =====================================================

UPDATE module_progression_rules 
SET minimum_content_time_seconds = 60
WHERE module_id IN (
    SELECT m.id 
    FROM modules m 
    JOIN courses c ON m.course_id = c.id 
    WHERE c.code = 'AIFUND001' 
    AND m.title ILIKE '%Module 1%'
);

-- Verify the change
SELECT 
    m.title,
    mpr.minimum_content_time_seconds AS seconds,
    ROUND(mpr.minimum_content_time_seconds / 60.0, 1) AS minutes
FROM module_progression_rules mpr
JOIN modules m ON mpr.module_id = m.id
WHERE m.title ILIKE '%Module 1%';

-- Expected result: 60 seconds (1.0 minutes)
