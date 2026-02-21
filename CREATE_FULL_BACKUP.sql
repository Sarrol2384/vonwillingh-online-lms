-- ============================================================
-- CREATE COMPREHENSIVE BACKUP BEFORE ANY CHANGES
-- ============================================================
-- This creates multiple backup tables and exports to verify
-- Run this BEFORE making ANY changes to Module 1
-- ============================================================

-- BACKUP 1: Full modules table backup
DROP TABLE IF EXISTS modules_backup_full_20250221 CASCADE;
CREATE TABLE modules_backup_full_20250221 AS 
SELECT * FROM modules;

-- BACKUP 2: Module 1 specific backup with metadata
DROP TABLE IF EXISTS module1_backup_20250221 CASCADE;
CREATE TABLE module1_backup_20250221 AS 
SELECT 
    m.*,
    c.code as course_code,
    c.name as course_name,
    NOW() as backup_timestamp
FROM modules m
JOIN courses c ON m.course_id = c.id
WHERE c.code = 'AIFUND001' 
  AND m.title ILIKE '%Module 1%';

-- BACKUP 3: Module 1 content only (for easy viewing)
DROP TABLE IF EXISTS module1_content_backup_20250221 CASCADE;
CREATE TABLE module1_content_backup_20250221 AS
SELECT 
    m.id,
    m.title,
    m.content,
    LENGTH(m.content) as content_length,
    m.updated_at,
    NOW() as backup_timestamp
FROM modules m
JOIN courses c ON m.course_id = c.id
WHERE c.code = 'AIFUND001' 
  AND m.title ILIKE '%Module 1%';

-- Verify all backups were created
DO $$
DECLARE
    v_full_count INTEGER;
    v_module1_count INTEGER;
    v_content_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_full_count FROM modules_backup_full_20250221;
    SELECT COUNT(*) INTO v_module1_count FROM module1_backup_20250221;
    SELECT COUNT(*) INTO v_content_count FROM module1_content_backup_20250221;
    
    RAISE NOTICE '';
    RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    RAISE NOTICE '✅ BACKUP COMPLETE!';
    RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    RAISE NOTICE '';
    RAISE NOTICE '📦 Backup 1: modules_backup_full_20250221';
    RAISE NOTICE '   Total modules backed up: %', v_full_count;
    RAISE NOTICE '';
    RAISE NOTICE '📦 Backup 2: module1_backup_20250221';
    RAISE NOTICE '   Module 1 records: %', v_module1_count;
    RAISE NOTICE '';
    RAISE NOTICE '📦 Backup 3: module1_content_backup_20250221';
    RAISE NOTICE '   Content records: %', v_content_count;
    RAISE NOTICE '';
    
    IF v_module1_count = 0 THEN
        RAISE EXCEPTION '❌ ERROR: Module 1 not found! Cannot create backup.';
    END IF;
    
    RAISE NOTICE '✅ All backups verified!';
    RAISE NOTICE '✅ Safe to proceed with changes.';
    RAISE NOTICE '';
END $$;

-- Show Module 1 details for verification
SELECT 
    m.id,
    m.title,
    m.course_id,
    c.code as course_code,
    LENGTH(m.content) as content_length_bytes,
    ROUND(LENGTH(m.content) / 1024.0, 2) as content_size_kb,
    m.has_quiz,
    m.quiz_title,
    m.created_at,
    m.updated_at,
    (SELECT COUNT(*) FROM quiz_questions qq WHERE qq.module_id = m.id) as quiz_questions_count
FROM modules m
JOIN courses c ON m.course_id = c.id
WHERE c.code = 'AIFUND001' 
  AND m.title ILIKE '%Module 1%';

-- Show content preview (first 500 chars)
SELECT 
    '=== MODULE 1 CONTENT START ===' as marker,
    SUBSTRING(m.content, 1, 500) as content_preview_start
FROM modules m
JOIN courses c ON m.course_id = c.id
WHERE c.code = 'AIFUND001' 
  AND m.title ILIKE '%Module 1%';

-- Show content preview (last 500 chars)
SELECT 
    '=== MODULE 1 CONTENT END ===' as marker,
    SUBSTRING(m.content, LENGTH(m.content) - 500, 500) as content_preview_end
FROM modules m
JOIN courses c ON m.course_id = c.id
WHERE c.code = 'AIFUND001' 
  AND m.title ILIKE '%Module 1%';

-- Find quiz positions in content
SELECT 
    'Quiz Pattern Search' as info,
    POSITION('Question 19' IN m.content) as question_19_position,
    POSITION('Question 20' IN m.content) as question_20_position,
    POSITION('According to the Stellenbosch' IN m.content) as stellenbosch_question_position,
    POSITION('What is the recommended approach' IN m.content) as recommended_approach_position,
    CASE 
        WHEN m.content LIKE '%Question 19%' THEN '✅ Has Question 19'
        ELSE '❌ No Question 19'
    END as has_q19,
    CASE 
        WHEN m.content LIKE '%Question 20%' THEN '✅ Has Question 20'
        ELSE '❌ No Question 20'
    END as has_q20
FROM modules m
JOIN courses c ON m.course_id = c.id
WHERE c.code = 'AIFUND001' 
  AND m.title ILIKE '%Module 1%';
