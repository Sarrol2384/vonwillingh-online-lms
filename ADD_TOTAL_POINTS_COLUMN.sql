-- =====================================================
-- ADD total_points COLUMN TO quiz_attempts TABLE
-- =====================================================
-- Error: "Could not find the 'total_points' column"
-- The backend now calculates and sends total_points,
-- but the database column doesn't exist yet.
-- =====================================================

-- Add the total_points column
ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS total_points INTEGER;

-- Verify the column exists
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'quiz_attempts' 
    AND column_name IN ('score', 'total_points')
ORDER BY column_name;

-- Check all numeric columns
SELECT 
    column_name,
    data_type,
    CASE 
        WHEN column_name = 'score' AND data_type IN ('integer', 'numeric', 'decimal') THEN '✅ OK'
        WHEN column_name = 'total_points' AND data_type = 'integer' THEN '✅ OK'
        WHEN column_name = 'score' THEN '⚠️ CHECK TYPE: ' || data_type
        WHEN column_name = 'total_points' THEN '⚠️ CHECK TYPE: ' || data_type
        ELSE '✅ OK'
    END AS status
FROM information_schema.columns 
WHERE table_name = 'quiz_attempts' 
    AND column_name IN ('score', 'total_points', 'correct_answers', 'wrong_answers', 'percentage', 'questions_attempted')
ORDER BY column_name;

-- Success message
SELECT '✅ total_points column added successfully!' AS message;
