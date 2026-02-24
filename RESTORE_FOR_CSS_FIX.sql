-- ============================================================
-- RESTORE MODULE 1 BACKUP (Run this first)
-- ============================================================
-- This restores Module 1 to the state with BOTH quizzes
-- (plain-text + interactive). The CSS will then hide the
-- plain-text quiz, keeping only the interactive one visible.
-- ============================================================

UPDATE modules m
SET content = mb.content,
    updated_at = mb.updated_at,
    has_quiz = mb.has_quiz,
    quiz_title = mb.quiz_title,
    quiz_description = mb.quiz_description
FROM module1_backup_20250221 mb
WHERE m.id = mb.id;

-- Verify the restore
SELECT 
    'RESTORE COMPLETE' AS status,
    m.title,
    LENGTH(m.content) AS content_length_bytes,
    ROUND(LENGTH(m.content)::NUMERIC / 1024, 2) AS content_length_kb,
    CASE 
        WHEN m.content = mb.content THEN '✅ Content matches backup'
        ELSE '❌ Content mismatch' 
    END AS verification,
    m.has_quiz,
    m.quiz_title,
    (SELECT COUNT(*) FROM quiz_questions qq WHERE qq.module_id = m.id) AS quiz_questions_count
FROM modules m
JOIN module1_backup_20250221 mb ON m.id = mb.id;
