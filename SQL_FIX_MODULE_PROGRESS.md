# ❌ ERROR FOUND: module_progress table doesn't exist!

## What Happened
The cleanup SQL tried to delete from `module_progress` table, but your database doesn't have that table.

**Error:**
```
ERROR: 42P01: relation "module_progress" does not exist
```

---

## ✅ FIXED SQL - Copy This Instead

Replace the cleanup SQL with this fixed version:

```sql
-- FIXED CLEANUP - Works with your database
DO $$
DECLARE
  course_record RECORD;
  deleted_count INTEGER := 0;
BEGIN
  RAISE NOTICE 'Starting cleanup...';
  
  FOR course_record IN 
    SELECT id, code, name FROM courses 
    WHERE code LIKE 'BASS%' OR code LIKE 'TEST%' OR code LIKE 'AIBIZ%' OR code LIKE 'AI%'
  LOOP
    RAISE NOTICE 'Deleting: % (%)', course_record.name, course_record.code;
    
    -- 1. Delete applications
    DELETE FROM applications WHERE course_id = course_record.id;
    
    -- 2. Delete enrollments
    DELETE FROM enrollments WHERE course_id = course_record.id;
    
    -- 3. Delete modules (NO module_progress - it doesn't exist!)
    DELETE FROM modules WHERE course_id = course_record.id;
    
    -- 4. Delete course
    DELETE FROM courses WHERE id = course_record.id;
    
    deleted_count := deleted_count + 1;
    RAISE NOTICE '✅ Deleted!';
  END LOOP;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ CLEANUP COMPLETE! Deleted % courses', deleted_count;
  RAISE NOTICE '========================================';
END $$;
```

---

## 🎯 RUN THE FIXED SQL NOW

1. **Clear the old SQL** in Supabase SQL Editor
2. **Copy the SQL above** (the fixed version)
3. **Paste it** into Supabase
4. **Click Run** (Ctrl+Enter)
5. Should see: "✅ CLEANUP COMPLETE!"

---

## What's Different?

**OLD (broken):**
```sql
DELETE FROM module_progress WHERE ...  ❌ Table doesn't exist!
DELETE FROM modules WHERE ...
DELETE FROM courses WHERE ...
```

**NEW (fixed):**
```sql
DELETE FROM applications WHERE ...     ✅ Works
DELETE FROM enrollments WHERE ...      ✅ Works
DELETE FROM modules WHERE ...          ✅ Works
DELETE FROM courses WHERE ...          ✅ Works
```

---

## After Cleanup Works

Then run the **insert SQL** (this one is fine):

```sql
DO $$
DECLARE
  new_course_id INTEGER;
BEGIN
  SELECT COALESCE(MAX(id), 0) + 1 INTO new_course_id FROM courses;
  
  INSERT INTO courses (id, name, code, level, category, description, duration, price, modules_count, is_published)
  VALUES (new_course_id, 'AI Basics for SA Small Business Owners', 'AIBIZ003', 'Certificate', 
          'Artificial Intelligence', 'Learn AI tools', '2 weeks', 0.01, 4, true);
  
  INSERT INTO modules (course_id, title, description, order_number, content, content_type, duration_minutes, is_published, video_url)
  VALUES
  (new_course_id, 'Module 1: What is AI?', 'Intro', 1, '<h1>AI</h1>', 'lesson', 45, true, ''),
  (new_course_id, 'Module 2: ChatGPT', 'ChatGPT', 2, '<h1>ChatGPT</h1>', 'lesson', 60, true, ''),
  (new_course_id, 'Module 3: Canva AI', 'Design', 3, '<h1>Canva</h1>', 'lesson', 60, true, ''),
  (new_course_id, 'Module 4: AI System', 'Workflow', 4, '<h1>System</h1>', 'lesson', 45, true, '');
  
  RAISE NOTICE '✅ Course created with ID: %', new_course_id;
END $$;
```

---

## 🎯 QUICK STEPS

1. **Run the FIXED cleanup SQL** (above, without module_progress)
2. **Run the insert SQL** (create course)
3. **Test:** https://vonwillingh-online-lms.pages.dev/admin-courses
4. **Hard refresh:** Ctrl+Shift+R
5. ✅ **See your course!**

---

**Copy the fixed cleanup SQL above and run it now!** 🚀
