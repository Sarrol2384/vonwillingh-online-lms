-- ============================================================
-- RESTORE MODULE 1 FROM BACKUP
-- ============================================================
-- Use this if something went wrong and you need to restore
-- ============================================================

-- Option 1: Restore from Module 1 specific backup (RECOMMENDED)
UPDATE modules m
SET 
    content = mb.content,
    updated_at = mb.updated_at,
    has_quiz = mb.has_quiz,
    quiz_title = mb.quiz_title,
    quiz_description = mb.quiz_description
FROM module1_backup_20250221 mb
WHERE m.id = mb.id;

-- Verify restore
SELECT 
    'RESTORE COMPLETE' as status,
    m.id,
    m.title,
    LENGTH(m.content) as content_length,
    m.updated_at,
    CASE 
        WHEN m.content = mb.content THEN '✅ Content matches backup'
        ELSE '❌ Content mismatch'
    END as verification
FROM modules m
JOIN module1_backup_20250221 mb ON m.id = mb.id
WHERE m.id IN (SELECT id FROM module1_backup_20250221);

-- Show what was restored
SELECT 
    'Restored Module Details' as info,
    m.title,
    LENGTH(m.content) as content_length_bytes,
    ROUND(LENGTH(m.content) / 1024.0, 2) as content_size_kb,
    m.has_quiz,
    m.quiz_title,
    m.updated_at,
    (SELECT COUNT(*) FROM quiz_questions qq WHERE qq.module_id = m.id) as quiz_questions_count
FROM modules m
WHERE m.id IN (SELECT id FROM module1_backup_20250221);
