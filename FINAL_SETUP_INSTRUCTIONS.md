# ✅ FINAL SCRIPT - NO MANUAL STEPS NEEDED

## 🎯 This Script Does EVERYTHING

**File:** `/home/user/webapp/SETUP_COMPLETE_AUTO.sql`

This script will:
1. ✅ Create `module_progression_rules` table
2. ✅ Create `module_content_completion` table
3. ✅ Add quiz columns to `modules` table
4. ✅ **Automatically find Module 1**
5. ✅ **Automatically insert the progression rule**
6. ✅ **Automatically update Module 1 with quiz info**

**No manual steps. No finding IDs. Just run it.**

---

## 🚀 How to Run (2 minutes)

### Step 1: Open Supabase
```
https://supabase.com/dashboard/project/dgcobxtkzewzkrzpfcdr/sql/new
```

### Step 2: Copy the Script
- Open file: `/home/user/webapp/SETUP_COMPLETE_AUTO.sql`
- Select all (Ctrl+A)
- Copy (Ctrl+C)

### Step 3: Run It
- Paste into Supabase SQL editor
- Click **"Run"**
- Wait ~3 seconds

### Step 4: Look for Success Message
```
NOTICE: ========================================
NOTICE: SUCCESS! Setup complete.
NOTICE: ========================================
NOTICE: Course ID: 123
NOTICE: Module 1 ID: 456
NOTICE: Module 2 ID: 789
NOTICE: 
NOTICE: Configuration:
NOTICE:   - Passing score: 70% (14/20)
NOTICE:   - Max attempts: 3
NOTICE:   - Content time: 30 minutes
NOTICE:   - Scroll required: Yes
NOTICE: 
NOTICE: Tables created:
NOTICE:   - module_progression_rules
NOTICE:   - module_content_completion
NOTICE: 
NOTICE: Ready to test!
```

---

## ✅ What You Get

### Tables Created:
1. **module_progression_rules** - Quiz requirements and progression logic
2. **module_content_completion** - Student time/scroll tracking

### Module 1 Configured:
- `has_quiz` = TRUE
- `quiz_title` = "Module 1: Introduction to AI for Small Business - Assessment"
- `quiz_description` = "Test your knowledge..."
- Progression rule inserted with:
  - Passing score: 70%
  - Max attempts: 3
  - Content time: 30 minutes
  - Scroll required: Yes
  - Blocks Module 2: Yes

---

## 🧪 After Running: Quick Test

### 1. Verify Tables (30 seconds)
```sql
-- Check tables exist
SELECT COUNT(*) FROM module_progression_rules;
SELECT COUNT(*) FROM module_content_completion;
```
Expected: Both return a number (at least 0)

### 2. Verify Module 1 Config (30 seconds)
```sql
-- Check Module 1
SELECT id, title, has_quiz, quiz_title 
FROM modules 
WHERE has_quiz = TRUE;
```
Expected: Shows Module 1 with has_quiz = true

### 3. Check Progression Rule (30 seconds)
```sql
-- Check rule was created
SELECT 
    m.title,
    mpr.minimum_quiz_score,
    mpr.max_quiz_attempts,
    mpr.minimum_content_time_seconds
FROM module_progression_rules mpr
JOIN modules m ON mpr.module_id = m.id;
```
Expected: Shows Module 1 with 70.00 score, 3 attempts, 1800 seconds

### 4. Optional: Enable Test Mode (30 seconds)
Change time from 30 minutes to 60 seconds for testing:
```sql
UPDATE module_progression_rules 
SET minimum_content_time_seconds = 60;
```

---

## 🎮 Test in Browser (10 minutes)

1. Go to: https://vonwillingh-online-lms.pages.dev/student-login
2. Log in with test student
3. Open course AIFUND001
4. Click Module 1
5. Open browser console (F12)
6. Watch for logs:
   ```
   [ModuleProgressionManager] Initializing...
   [ModuleProgressionManager] Time spent: 10s / 60s
   ```
7. Wait 60 seconds (or 30 min if not in test mode)
8. Scroll to bottom
9. Quiz button should unlock
10. Click "Start Quiz" and test

---

## 🐛 If It Fails

### Error: "Module 1 not found"
Your course might not have "Module 1" in the title. Check:
```sql
SELECT id, title FROM modules WHERE course_id = (SELECT id FROM courses WHERE code = 'AIFUND001');
```

### Error: Foreign key constraint
One of your tables (courses, modules, students) doesn't exist. Check:
```sql
SELECT table_name FROM information_schema.tables WHERE table_name IN ('courses', 'modules', 'students');
```

### Success But No Unlock
Check your browser console (F12) for JavaScript errors.

---

## 📊 Summary

**This script:**
- ✅ Creates all tables
- ✅ Finds Module 1 automatically
- ✅ Inserts progression rule automatically
- ✅ Updates Module 1 automatically
- ✅ No manual ID lookup needed
- ✅ No manual INSERT statements needed

**Just run it and test!**

---

## 🎯 Final Checklist

- [ ] Run `SETUP_COMPLETE_AUTO.sql` in Supabase
- [ ] See "SUCCESS! Setup complete" message
- [ ] Verify tables exist (query above)
- [ ] Optional: Enable test mode (60 seconds)
- [ ] Test in browser at student-login page
- [ ] Open Module 1, wait for unlock
- [ ] Take quiz, verify pass/fail

**Total time: 15 minutes from start to finish**

---

**This is the final script. It does everything automatically. Please try it!** 🚀
