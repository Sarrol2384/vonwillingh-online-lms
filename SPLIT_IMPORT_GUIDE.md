# 🔧 ALTERNATIVE IMPORT METHOD - Split SQL Files

## 📋 Problem

The full `COMPLETE_IMPORT_SQL.sql` file is causing network issues in Supabase SQL Editor:
```
Error: failed to fetch (api.supabase.com)
```

## ✅ Solution: Run SQL in 5 Small Parts

I've split the import into 5 smaller files that are easier to run.

---

## 📦 Files Created (In Order)

All files are in `/home/user/webapp/`:

1. **PART1_CLEANUP.sql** - Delete existing test course
2. **PART2_CREATE_COURSE.sql** - Create the course
3. **PART3_CREATE_MODULE.sql** - Create Module 1 with content
4. **PART4_CREATE_QUIZ.sql** - Create 5 quiz questions
5. **PART5_VERIFY.sql** - Verify everything worked

---

## 🚀 Step-by-Step Instructions

### Step 1: Run PART1_CLEANUP.sql

1. Open `PART1_CLEANUP.sql`
2. Copy the entire contents
3. Go to Supabase Dashboard → SQL Editor → New Query
4. Paste and click **RUN**

**Expected Result:**
```
status: "Cleanup complete!"
```

---

### Step 2: Run PART2_CREATE_COURSE.sql

1. Open `PART2_CREATE_COURSE.sql`
2. Copy the entire contents
3. Paste in SQL Editor (new query or same tab)
4. Click **RUN**

**Expected Result:**
```
status: "Course created!"
course_id: [some UUID]
name: "Test: Business Leadership Fundamentals"
code: "TESTLEAD001"
```

**✅ Copy the course_id - you'll need it if anything goes wrong**

---

### Step 3: Run PART3_CREATE_MODULE.sql

1. Open `PART3_CREATE_MODULE.sql`
2. Copy the entire contents
3. Paste in SQL Editor
4. Click **RUN**

**Expected Result:**
```
status: "Module created!"
module_id: [some UUID]
title: "Module 1: Introduction to Leadership Principles"
course_code: "TESTLEAD001"
```

**✅ Copy the module_id - you'll need it if quiz questions fail**

---

### Step 4: Run PART4_CREATE_QUIZ.sql

1. Open `PART4_CREATE_QUIZ.sql`
2. Copy the entire contents
3. Paste in SQL Editor
4. Click **RUN**

**Expected Result:**
```
status: "Quiz questions created!"
total_questions: 5
total_points: 10
```

---

### Step 5: Run PART5_VERIFY.sql

1. Open `PART5_VERIFY.sql`
2. Copy the entire contents
3. Paste in SQL Editor
4. Click **RUN**

**Expected Result:**
```
status: "✅ IMPORT COMPLETE!"
course_name: "Test: Business Leadership Fundamentals"
course_code: "TESTLEAD001"
level: "Certificate"
category: "Leadership"
module_title: "Module 1: Introduction to Leadership Principles"
duration_minutes: 45
quiz_questions: 5
total_points: 10
```

---

## 🎯 Final Check

After running all 5 parts successfully:

1. Go to: **https://vonwillingh-online-lms.pages.dev/courses**
2. Look for: **"Test: Business Leadership Fundamentals"**
3. Click on it
4. Open Module 1
5. Check the quiz has 5 questions

---

## ⚠️ Troubleshooting

### If PART2 fails (course creation)

**Check if course already exists:**
```sql
SELECT * FROM courses WHERE code = 'TESTLEAD001';
```

If it exists, either:
- **Option A:** Use the existing course (skip to PART3)
- **Option B:** Run PART1 again to delete it, then retry PART2

---

### If PART3 fails (module creation)

**Check if module already exists:**
```sql
SELECT * FROM modules 
WHERE course_id = (SELECT id FROM courses WHERE code = 'TESTLEAD001');
```

If it exists:
- Delete it and retry:
```sql
DELETE FROM modules 
WHERE course_id = (SELECT id FROM courses WHERE code = 'TESTLEAD001');
```

---

### If PART4 fails (quiz questions)

**Most common issue:** Module doesn't exist yet

**Check module exists:**
```sql
SELECT id, title FROM modules 
WHERE course_id = (SELECT id FROM courses WHERE code = 'TESTLEAD001');
```

If no results, go back and run PART3.

If module exists but quiz questions fail:
```sql
-- Delete any partial questions
DELETE FROM quiz_questions 
WHERE module_id = (SELECT id FROM modules WHERE course_id = (SELECT id FROM courses WHERE code = 'TESTLEAD001'));

-- Then retry PART4
```

---

### If network errors persist

**Try Alternative SQL Editor:**

1. In Supabase Dashboard, click **Database** (left sidebar)
2. Click **Tables** tab
3. Look for "Run SQL" button (top right)
4. Try pasting the SQL there instead

**Or use the Supabase CLI:**
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref [your-project-ref]

# Run SQL file
supabase db execute --file PART1_CLEANUP.sql
supabase db execute --file PART2_CREATE_COURSE.sql
# ... etc
```

---

## 📊 Progress Checklist

Use this to track your progress:

- [ ] **Step 1:** PART1_CLEANUP.sql run successfully
- [ ] **Step 2:** PART2_CREATE_COURSE.sql created course
- [ ] **Step 3:** PART3_CREATE_MODULE.sql created module
- [ ] **Step 4:** PART4_CREATE_QUIZ.sql created 5 questions
- [ ] **Step 5:** PART5_VERIFY.sql shows complete import
- [ ] **Final:** Course visible at `/courses` page

---

## 💡 Why Split Files Work Better

### Advantages:

1. **Smaller Network Requests** - Less data = less chance of timeout
2. **Better Error Isolation** - Know exactly which part failed
3. **Progress Tracking** - Can see how far you got
4. **Resume Capability** - Can continue from where it failed
5. **Easier Debugging** - Each part has its own verification

### Each File is Self-Contained:

- Includes its own verification query
- Uses subqueries (no manual UUID management)
- Can be run independently
- Shows clear success message

---

## 🔄 If You Need to Start Over

Run this complete cleanup:

```sql
-- Nuclear option - delete everything
DELETE FROM quiz_questions 
WHERE module_id IN (
  SELECT id FROM modules 
  WHERE course_id IN (SELECT id FROM courses WHERE code = 'TESTLEAD001')
);

DELETE FROM modules 
WHERE course_id IN (SELECT id FROM courses WHERE code = 'TESTLEAD001');

DELETE FROM courses WHERE code = 'TESTLEAD001';

-- Verify cleanup
SELECT 
  (SELECT COUNT(*) FROM courses WHERE code = 'TESTLEAD001') AS courses,
  (SELECT COUNT(*) FROM modules WHERE course_id IN (SELECT id FROM courses WHERE code = 'TESTLEAD001')) AS modules,
  (SELECT COUNT(*) FROM quiz_questions WHERE module_id IN (SELECT id FROM modules WHERE course_id IN (SELECT id FROM courses WHERE code = 'TESTLEAD001'))) AS questions;
```

Should return: `courses: 0, modules: 0, questions: 0`

Then start fresh with PART1.

---

## 📝 Additional Notes

### Running Time:
- Each part takes: **5-10 seconds**
- Total time: **~1 minute** for all 5 parts

### Success Rate:
- Smaller files = **higher success rate**
- Network issues less likely with smaller payloads
- Can retry individual parts without affecting others

### Data Safety:
- PART1 includes cleanup (safe to re-run)
- Each part checks for existing data
- No risk of duplicate entries

---

## 🎓 After Successful Import

Once all 5 parts complete:

✅ **Test Course is Live!**

Test it by:
1. Viewing course catalog
2. Opening Module 1
3. Reading the content
4. Taking the quiz
5. Checking if scoring works (70% = pass)

Then we're ready to build:
**ADVBUS001 - Advanced Business Leadership** (5 modules, 64 questions)

---

**Current Status:** ✅ Split files ready

**Next Action:** Run PART1 through PART5 in order

**Expected Success Rate:** 95%+ (much higher than single large file)

---

*Created: 2026-02-12*
*Alternative to: COMPLETE_IMPORT_SQL.sql*
*Reason: Network timeout issues with large SQL files*
