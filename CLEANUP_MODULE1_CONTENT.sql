-- ============================================================
-- CLEAN UP MODULE 1 CONTENT - Remove Duplicate Quiz
-- ============================================================
-- This script removes the quiz Markdown that was embedded 
-- in Module 1 content during course import.
-- After running this, only Quiz Component V3 will render the quiz.
-- ============================================================

DO $$
DECLARE
    v_module_id INTEGER;
    v_old_length INTEGER;
    v_new_length INTEGER;
BEGIN
    -- Find Module 1 ID
    SELECT m.id INTO v_module_id
    FROM modules m
    JOIN courses c ON m.course_id = c.id
    WHERE c.code = 'AIFUND001'
      AND m.title ILIKE '%Module 1%'
    LIMIT 1;
    
    IF v_module_id IS NULL THEN
        RAISE NOTICE '❌ Module 1 not found!';
        RETURN;
    END IF;
    
    RAISE NOTICE '✅ Found Module 1 with ID: %', v_module_id;
    
    -- Get current content length
    SELECT LENGTH(content) INTO v_old_length
    FROM modules
    WHERE id = v_module_id;
    
    RAISE NOTICE 'Current content length: % characters', v_old_length;
    
    -- Remove quiz section from content
    -- This removes everything after the quiz separator
    UPDATE modules
    SET content = SPLIT_PART(content, E'\n\n---\n\n## 📝 Module Quiz', 1),
        updated_at = NOW()
    WHERE id = v_module_id;
    
    -- Get new content length
    SELECT LENGTH(content) INTO v_new_length
    FROM modules
    WHERE id = v_module_id;
    
    RAISE NOTICE 'New content length: % characters', v_new_length;
    RAISE NOTICE 'Removed % characters of quiz content', v_old_length - v_new_length;
    
    -- Verify quiz was removed
    IF EXISTS (
        SELECT 1 FROM modules
        WHERE id = v_module_id
          AND content LIKE '%## 📝 Module Quiz%'
    ) THEN
        RAISE NOTICE '⚠️  Warning: Quiz content may still be present';
    ELSE
        RAISE NOTICE '✅ SUCCESS! Quiz content removed from module';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    RAISE NOTICE '✅ Module 1 cleanup complete!';
    RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    RAISE NOTICE '';
    RAISE NOTICE '🧪 Test now:';
    RAISE NOTICE '1. Open https://vonwillingh-online-lms.pages.dev/student-login';
    RAISE NOTICE '2. Login and open Module 1';
    RAISE NOTICE '3. Verify only ONE quiz appears (at bottom)';
    RAISE NOTICE '4. Wait 60 seconds, scroll to bottom';
    RAISE NOTICE '5. Quiz unlocks ✅';
    
END $$;

-- Verify the results
SELECT 
    m.id,
    m.title,
    LENGTH(m.content) as content_length_chars,
    ROUND(LENGTH(m.content) / 1024.0, 2) as content_size_kb,
    CASE 
        WHEN m.content LIKE '%## 📝 Module Quiz%' THEN '❌ Still has quiz in content'
        ELSE '✅ Quiz removed from content'
    END as quiz_status,
    CASE
        WHEN m.has_quiz THEN '✅ Has quiz metadata'
        ELSE '❌ Missing quiz metadata'
    END as quiz_metadata_status
FROM modules m
JOIN courses c ON m.course_id = c.id
WHERE c.code = 'AIFUND001'
  AND m.title ILIKE '%Module 1%';
