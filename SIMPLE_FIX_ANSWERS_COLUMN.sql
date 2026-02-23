-- =====================================================
-- SIMPLE FIX: Change answers column to JSONB
-- =====================================================
-- This is the minimal fix for the immediate error
-- =====================================================

-- Check current type
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'quiz_attempts' 
    AND column_name IN ('answers', 'results');

-- Fix answers column: INTEGER → JSONB
ALTER TABLE quiz_attempts 
DROP COLUMN IF EXISTS answers;

ALTER TABLE quiz_attempts 
ADD COLUMN answers JSONB;

-- Fix results column: INTEGER → JSONB (if needed)
ALTER TABLE quiz_attempts 
DROP COLUMN IF EXISTS results;

ALTER TABLE quiz_attempts 
ADD COLUMN results JSONB;

-- Verify the fix
SELECT 
    column_name,
    data_type,
    CASE 
        WHEN data_type = 'jsonb' THEN '✅ CORRECT (JSONB)'
        ELSE '❌ WRONG TYPE: ' || data_type
    END AS status
FROM information_schema.columns 
WHERE table_name = 'quiz_attempts' 
    AND column_name IN ('answers', 'results');

-- Success message
SELECT '✅ Fixed: answers and results columns are now JSONB!' AS message;
