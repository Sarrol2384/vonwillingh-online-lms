# 🔄 RESTORE MODULE 1 FROM BACKUP - DO THIS NOW

## ⚠️ **CORRECT DECISION!**

You're absolutely right - we need to restore to the backup version BEFORE inspecting or removing anything.

---

## 🚀 **RUN THIS SQL NOW:**

**File:** `/home/user/webapp/RESTORE_FROM_BACKUP.sql`

**Open Supabase and run this:**

```sql
-- Restore Module 1 from backup
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
```

---

## ✅ **Expected Output:**

```
RESTORE COMPLETE
✅ Content matches backup

Restored Module Details:
Title: Module 1: Introduction to AI for Small Business
Content length: 223073 bytes (217.84 KB)
Has quiz: TRUE
Quiz questions count: 20
```

---

## 📋 **After Restore:**

1. ✅ Run the restore SQL
2. ✅ Verify it says "✅ Content matches backup"
3. ✅ **Then** run `INSPECT_CONTENT_CAREFULLY.sql` to see where plain-text quiz is
4. ✅ **Then** we create a PRECISE removal script based on what we find

---

**Restore first, inspect second, remove third!** 🔄
