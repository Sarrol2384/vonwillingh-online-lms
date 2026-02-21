-- ============================================================
-- REMOVE PLAIN-TEXT QUIZ FROM MODULE 1 CONTENT
-- ============================================================
-- This removes the embedded plain-text quiz (non-clickable)
-- Keeps only the interactive Quiz Component V3 quiz
-- ============================================================

-- STEP 1: Create backup FIRST
CREATE TABLE IF NOT EXISTS modules_backup_20250221_v2 AS 
SELECT * FROM modules 
WHERE id IN (
    SELECT m.id FROM modules m
    JOIN courses c ON m.course_id = c.id
    WHERE c.code = 'AIFUND001' 
      AND m.title ILIKE '%Module 1%'
);

-- STEP 2: Verify backup was created
DO $$
DECLARE
    v_backup_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_backup_count FROM modules_backup_20250221_v2;
    
    IF v_backup_count > 0 THEN
        RAISE NOTICE '✅ Backup created: % rows', v_backup_count;
    ELSE
        RAISE EXCEPTION '❌ Backup failed! Stopping.';
    END IF;
END $$;

-- STEP 3: Find where quiz content starts
-- (Looking for patterns like "19" or "20" followed by "Easy" or "Hard" or "Medium")
DO $$
DECLARE
    v_module_id UUID;
    v_content TEXT;
    v_quiz_start INTEGER;
    v_new_content TEXT;
BEGIN
    -- Get Module 1
    SELECT m.id, m.content INTO v_module_id, v_content
    FROM modules m
    JOIN courses c ON m.course_id = c.id
    WHERE c.code = 'AIFUND001'
      AND m.title ILIKE '%Module 1%'
    LIMIT 1;
    
    IF v_module_id IS NULL THEN
        RAISE EXCEPTION '❌ Module 1 not found!';
    END IF;
    
    RAISE NOTICE '✅ Found Module 1: %', v_module_id;
    RAISE NOTICE 'Original content length: % characters', LENGTH(v_content);
    
    -- Try different patterns to find where quiz starts
    -- Pattern 1: Look for "19" followed by difficulty level
    v_quiz_start := POSITION('<div' || CHR(10) || CHR(10) || '19' IN v_content);
    
    IF v_quiz_start = 0 THEN
        -- Pattern 2: Look for "Question 19" or "Question 20"
        v_quiz_start := POSITION('Question 19' IN v_content);
    END IF;
    
    IF v_quiz_start = 0 THEN
        -- Pattern 3: Look for the specific question text
        v_quiz_start := POSITION('According to the Stellenbosch University' IN v_content);
        
        -- Back up to find the start of the quiz section (go back ~500 chars)
        IF v_quiz_start > 500 THEN
            v_quiz_start := v_quiz_start - 500;
        END IF;
    END IF;
    
    IF v_quiz_start > 0 THEN
        -- Found quiz! Cut content at that point
        v_new_content := SUBSTRING(v_content, 1, v_quiz_start - 1);
        
        RAISE NOTICE '✅ Found quiz start at position: %', v_quiz_start;
        RAISE NOTICE '✅ New content length: % characters', LENGTH(v_new_content);
        RAISE NOTICE '✅ Removing % characters', LENGTH(v_content) - LENGTH(v_new_content);
        
        -- Update the module
        UPDATE modules
        SET content = v_new_content,
            updated_at = NOW()
        WHERE id = v_module_id;
        
        RAISE NOTICE '✅ Module 1 content updated!';
    ELSE
        RAISE WARNING '⚠️  Could not find quiz start position automatically';
        RAISE NOTICE 'Content preview (last 500 chars): %', SUBSTRING(v_content, LENGTH(v_content) - 500, 500);
    END IF;
END $$;

-- STEP 4: Verify the update
SELECT 
    m.title,
    LENGTH(m.content) as new_content_length,
    CASE 
        WHEN m.content LIKE '%Question 19%' OR m.content LIKE '%Question 20%' 
        THEN '⚠️  Still has quiz questions'
        ELSE '✅ Quiz removed'
    END as status,
    CASE
        WHEN m.content LIKE '%According to the Stellenbosch%'
        THEN '⚠️  Still has quiz text'
        ELSE '✅ No quiz text found'
    END as double_check
FROM modules m
JOIN courses c ON m.course_id = c.id
WHERE c.code = 'AIFUND001'
  AND m.title ILIKE '%Module 1%';

-- STEP 5: If something went wrong, restore from backup:
-- UNCOMMENT THE LINES BELOW TO RESTORE:
/*
UPDATE modules m
SET content = mb.content,
    updated_at = mb.updated_at
FROM modules_backup_20250221_v2 mb
WHERE m.id = mb.id;

SELECT 'Restored from backup' as status;
*/
