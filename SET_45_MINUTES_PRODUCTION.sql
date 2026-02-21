-- =====================================================
-- SET TO 45 MINUTES (PRODUCTION MODE)
-- =====================================================
-- Changes content time requirement from 60 seconds to 45 minutes
-- Run this in Supabase when ready for production
-- =====================================================

UPDATE module_progression_rules 
SET minimum_content_time_seconds = 2700
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
    ROUND(mpr.minimum_content_time_seconds / 60.0, 0) AS minutes
FROM module_progression_rules mpr
JOIN modules m ON mpr.module_id = m.id
WHERE m.title ILIKE '%Module 1%';

-- Expected result: 2700 seconds (45 minutes)

-- =====================================================
-- ALTERNATIVE TIME SETTINGS (if needed)
-- =====================================================
-- 30 minutes: 1800 seconds
-- 45 minutes: 2700 seconds
-- 60 minutes: 3600 seconds
-- =====================================================
