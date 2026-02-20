# 🔄 How to Replace {MODULE_ID} - Step-by-Step Guide

## 🎯 Quick Answer:

You need to replace the text `{MODULE_ID}` with your actual module's UUID in all 20 INSERT statements.

---

## ✅ EASIEST METHOD: Copy, Find & Replace in Supabase

### Step 1: Get Your Module ID (30 seconds)

1. **Open Supabase SQL Editor:**
   ```
   https://supabase.com/dashboard/project/dgcobxtkzewzkrzpfcdr/sql/new
   ```

2. **Paste this query and click "Run":**
   ```sql
   SELECT 
       m.id as module_id,
       m.title
   FROM modules m
   JOIN courses c ON m.course_id = c.id
   WHERE c.code = 'AIFUND001'
     AND m.title ILIKE '%Module 1%'
   LIMIT 1;
   ```

3. **Copy the module_id:**
   - It looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`
   - **Click on the ID** and press `Ctrl+C` to copy

---

### Step 2: Open the SQL Script (10 seconds)

1. **Open this file:**
   ```
   /home/user/webapp/CREATE_MODULE1_QUIZ.sql
   ```

2. **Select ALL text:**
   - Windows/Linux: `Ctrl+A`
   - Mac: `Cmd+A`

3. **Copy it:**
   - Windows/Linux: `Ctrl+C`
   - Mac: `Cmd+C`

---

### Step 3: Paste into Supabase (5 seconds)

1. **Go back to Supabase SQL Editor**

2. **Clear the editor and paste:**
   - Windows/Linux: `Ctrl+V`
   - Mac: `Cmd+V`

3. **Now you'll see the entire script in the editor**

---

### Step 4: Find & Replace (20 seconds)

1. **Open Find & Replace:**
   - Windows/Linux: `Ctrl+H`
   - Mac: `Cmd+Option+F` or `Cmd+H`

2. **In the "Find" box, type:**
   ```
   {MODULE_ID}
   ```

3. **In the "Replace" box, paste your actual module ID:**
   ```
   a1b2c3d4-e5f6-7890-abcd-ef1234567890
   ```
   (use YOUR actual ID from Step 1)

4. **Click "Replace All"**
   - Should replace 20 occurrences

5. **Verify:**
   - Search for `{MODULE_ID}` again
   - Should show "0 results"

---

### Step 5: Run the Script (5 seconds)

1. **Click the "Run" button** in Supabase

2. **Wait for success message:**
   - Should see "Success" or "20 rows inserted"

3. **Done!** ✅

---

## 📝 Example:

### BEFORE (in the script):
```sql
INSERT INTO quiz_questions (module_id, question_text, ...)
VALUES (
    '{MODULE_ID}',  ← This placeholder
    'What is AI?',
    ...
);
```

### AFTER (after replace):
```sql
INSERT INTO quiz_questions (module_id, question_text, ...)
VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',  ← Your actual ID
    'What is AI?',
    ...
);
```

---

## 🎬 Visual Guide:

### What You're Looking For:

**Find this text (appears 20 times):**
```
'{MODULE_ID}'
```

**Replace with (your actual module ID):**
```
'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
```

⚠️ **IMPORTANT:** Keep the single quotes `'...'` around the ID!

---

## ✅ Verification Steps:

### 1. Before running, check:
- [ ] No more `{MODULE_ID}` in the script
- [ ] Your actual UUID appears 20 times
- [ ] Single quotes are still around the ID: `'...'`

### 2. After running, verify:
```sql
SELECT COUNT(*) as total_questions
FROM quiz_questions
WHERE module_id = 'YOUR_ACTUAL_MODULE_ID_HERE';
```
**Expected result:** 20

---

## 🚨 Common Mistakes:

### ❌ WRONG:
```sql
VALUES (
    {MODULE_ID},  ← Missing quotes!
    ...
);
```

### ❌ WRONG:
```sql
VALUES (
    'YOUR_ACTUAL_MODULE_ID_HERE',  ← Still has placeholder text!
    ...
);
```

### ✅ CORRECT:
```sql
VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',  ← Actual UUID with quotes
    ...
);
```

---

## 🔧 Troubleshooting:

### Problem: "Can't find module ID"
**Solution:**
```sql
-- List ALL modules to find yours:
SELECT m.id, m.title, c.name, c.code
FROM modules m
JOIN courses c ON m.course_id = c.id
ORDER BY m.created_at DESC;
```

### Problem: "Foreign key violation"
**Solution:** The module doesn't exist yet. Create the module first, then run the quiz script.

### Problem: "Duplicate key error"
**Solution:** Questions already exist. Delete them first:
```sql
DELETE FROM quiz_questions 
WHERE module_id = 'YOUR_MODULE_ID';
```

---

## ⏱️ Total Time: ~1-2 minutes

1. Get module ID: 30 seconds
2. Open script: 10 seconds  
3. Paste into Supabase: 5 seconds
4. Find & Replace: 20 seconds
5. Run script: 5 seconds

**Done!** ✅

---

## 💡 Pro Tip:

If you need to create quizzes for multiple modules, save your module IDs in a notepad:

```
Module 1: a1b2c3d4-e5f6-7890-abcd-ef1234567890
Module 2: b2c3d4e5-f6a7-8901-bcde-f12345678901
Module 3: c3d4e5f6-a7b8-9012-cdef-123456789012
```

Then you can quickly replace and run for each module!

---

## 📹 Quick Video Script:

1. ▶️ Open Supabase SQL Editor
2. ▶️ Run: `SELECT m.id FROM modules...` 
3. ▶️ Copy the module_id
4. ▶️ Open CREATE_MODULE1_QUIZ.sql
5. ▶️ Copy all text
6. ▶️ Paste into Supabase
7. ▶️ Press Ctrl+H (Find & Replace)
8. ▶️ Find: `{MODULE_ID}`
9. ▶️ Replace: (paste your ID)
10. ▶️ Click "Replace All"
11. ▶️ Click "Run"
12. ✅ Done!

---

## 🎉 That's It!

**You've successfully replaced the module ID and the quiz is ready to run!**

**Need help with any step? Let me know!** 🚀
