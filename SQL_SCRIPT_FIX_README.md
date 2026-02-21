# 🔧 FIXED: SQL Script for Phase 3 Database Setup

## ⚠️ Issue Found & Resolved

**Problem:** The original `LINK_QUIZ_TO_MODULE1.sql` had `RAISE NOTICE` statements outside of `DO $$ ... END $$;` blocks, causing syntax errors at lines 76 and 106.

**Solution:** Created `LINK_QUIZ_TO_MODULE1_FIXED.sql` with all `RAISE NOTICE` statements properly enclosed in `DO` blocks.

---

## ✅ Use This File Instead

**File:** `/home/user/webapp/LINK_QUIZ_TO_MODULE1_FIXED.sql`

**Status:** ✅ Syntax validated and ready to run

---

## 🚀 How to Run (5 minutes)

### Step 1: Open Supabase SQL Editor
Navigate to:
```
https://supabase.com/dashboard/project/dgcobxtkzewzkrzpfcdr/sql/new
```

### Step 2: Copy the Fixed Script
- Open file: `/home/user/webapp/LINK_QUIZ_TO_MODULE1_FIXED.sql`
- Select all contents (Ctrl+A / Cmd+A)
- Copy (Ctrl+C / Cmd+C)

### Step 3: Paste and Execute
- Paste into Supabase SQL editor
- Click **"Run"** button (or press Ctrl+Enter)
- Wait ~5 seconds

### Step 4: Verify Success

You should see these messages (without the emoji characters):

```
NOTICE: Found Module 1 with ID: [uuid]
NOTICE: Module 1 has 20 quiz questions
NOTICE: Created module_progression_rules table
NOTICE: Created module_content_completion table
NOTICE: Course ID: [uuid], Module 1 ID: [uuid], Module 2 ID: [uuid]
NOTICE: Configured progression rules for Module 1
NOTICE:    - Requires quiz pass: >=70% (14/20 correct)
NOTICE:    - Max attempts: 3
NOTICE:    - Must complete content first (30 min minimum)
NOTICE:    - Must scroll to bottom
NOTICE:    - Blocks Module 2 until passed
NOTICE: Added has_quiz column to modules table
NOTICE: Added quiz_title column to modules table
NOTICE: Added quiz_description column to modules table
NOTICE: Updated Module 1 with quiz metadata
NOTICE:    - Quiz title: "Module 1: Introduction to AI for Small Business - Assessment"
NOTICE:    - Quiz questions: 20
NOTICE: 
NOTICE: ========================================
NOTICE: QUIZ LINKING COMPLETE!
NOTICE: ========================================
NOTICE: 
NOTICE: Summary:
NOTICE:    Module 1 ID: [uuid]
NOTICE:    Quiz Questions: 20
NOTICE:    Has Progression Rules: true
NOTICE: 
NOTICE: Configuration:
NOTICE:    Quiz position: END of module content
NOTICE:    Quiz button: "Start Quiz"
NOTICE:    Prerequisites: Complete content (30 min + scroll to bottom)
NOTICE:    Passing score: >=70% (14/20 correct)
NOTICE:    Max attempts: 3
NOTICE:    Blocks Module 2: Until quiz passed
NOTICE:    Manual override: Available after 3 fails
```

---

## 🔍 What Was Fixed

### Original Error (Line 76):
```sql
CREATE INDEX IF NOT EXISTS idx_progression_rules_module ON module_progression_rules(module_id);
CREATE INDEX IF NOT EXISTS idx_progression_rules_course ON module_progression_rules(course_id);

RAISE NOTICE '✅ Created module_progression_rules table';  ❌ ERROR: Outside DO block
```

### Fixed Version:
```sql
CREATE INDEX IF NOT EXISTS idx_progression_rules_module ON module_progression_rules(module_id);
CREATE INDEX IF NOT EXISTS idx_progression_rules_course ON module_progression_rules(course_id);

-- Step 4: Report table creation
DO $$
BEGIN
    RAISE NOTICE 'Created module_progression_rules table';  ✅ Inside DO block
    RAISE NOTICE 'Created module_content_completion table';
END $$;
```

All `RAISE NOTICE` statements are now properly wrapped in `DO $$ ... END $$;` blocks.

---

## 📋 What This Script Does

### 1. Verifies Prerequisites
- Checks that Module 1 exists in course AIFUND001
- Confirms 20 quiz questions are present
- Aborts with error if prerequisites not met

### 2. Creates Database Tables
- **module_progression_rules** - Stores quiz requirements per module
  - Columns: passing_score, max_attempts, time_required, scroll_required, etc.
  - Indexes on module_id and course_id
  
- **module_content_completion** - Tracks student progress
  - Columns: time_spent, scrolled_to_bottom, completed_at, etc.
  - Indexes on student_id and module_id

### 3. Configures Module 1 Progression
- Links quiz to Module 1
- Sets passing score: 70% (14/20 correct)
- Sets max attempts: 3
- Sets content requirements: 30 minutes + scroll to bottom
- Links to Module 2 (blocks until quiz passed)

### 4. Adds Module Metadata
- Adds `has_quiz`, `quiz_title`, `quiz_description` columns to modules table
- Updates Module 1 with quiz information

### 5. Verifies Setup
- Confirms all tables created
- Confirms progression rules configured
- Displays summary of configuration

---

## ⚙️ Configuration Values

After running this script, Module 1 will have:

| Setting | Value | Location |
|---------|-------|----------|
| **Quiz Questions** | 20 (8 easy, 9 medium, 3 hard) | `quiz_questions` table |
| **Passing Score** | 70% (14/20 correct) | `module_progression_rules.minimum_quiz_score` |
| **Max Attempts** | 3 | `module_progression_rules.max_quiz_attempts` |
| **Content Time** | 30 minutes (1800 seconds) | `module_progression_rules.minimum_content_time_seconds` |
| **Scroll Required** | Yes (95% of content) | `module_progression_rules.requires_scroll_to_bottom` |
| **Blocks Module 2** | Yes | `module_progression_rules.is_required_for_next` |
| **Manual Override** | Allowed | `module_progression_rules.manual_override_allowed` |

---

## 🧪 After Running: Quick Test Configuration

To speed up testing, reduce content time from 30 minutes to 60 seconds:

```sql
UPDATE module_progression_rules 
SET minimum_content_time_seconds = 60
WHERE module_id IN (
    SELECT m.id FROM modules m 
    JOIN courses c ON m.course_id = c.id 
    WHERE c.code = 'AIFUND001' 
    AND m.title ILIKE '%Module 1%'
);
```

**Remember to reset to 30 minutes after testing:**

```sql
UPDATE module_progression_rules 
SET minimum_content_time_seconds = 1800
WHERE module_id IN (
    SELECT m.id FROM modules m 
    JOIN courses c ON m.course_id = c.id 
    WHERE c.code = 'AIFUND001' 
    AND m.title ILIKE '%Module 1%'
);
```

---

## ✅ Next Steps After Running

1. **Verify Setup** - Run `/home/user/webapp/VERIFY_QUIZ_INTEGRATION.sql`
2. **Test System** - Follow `/home/user/webapp/PHASE3_CHECKLIST.md`
3. **Configure Testing Mode** - Optional: reduce time to 60 seconds
4. **Test Workflow** - Open Module 1, complete content, take quiz

---

## 🐛 If Errors Still Occur

### Error: "Module 1 not found"
**Fix:** Verify course and module exist:
```sql
SELECT c.code, m.title 
FROM courses c 
JOIN modules m ON m.course_id = c.id 
WHERE c.code = 'AIFUND001';
```

### Error: "No quiz questions found"
**Fix:** Run quiz questions script first:
- File: `/home/user/webapp/FIX_QUIZ_TABLE_AND_CREATE.sql`

### Error: "relation already exists"
**Note:** Safe to ignore. Tables already exist from previous run.

---

## 📁 File Locations

| File | Location | Purpose |
|------|----------|---------|
| **LINK_QUIZ_TO_MODULE1_FIXED.sql** | `/home/user/webapp/` | ✅ **Use this one** |
| ~~LINK_QUIZ_TO_MODULE1.sql~~ | `/home/user/webapp/` | ❌ Has syntax errors |
| **VERIFY_QUIZ_INTEGRATION.sql** | `/home/user/webapp/` | Run after setup |
| **PHASE3_CHECKLIST.md** | `/home/user/webapp/` | Testing guide |

---

## 🎉 Success Criteria

The script ran successfully if you see:
- ✅ "Found Module 1 with ID"
- ✅ "Module 1 has 20 quiz questions"
- ✅ "Created module_progression_rules table"
- ✅ "Created module_content_completion table"
- ✅ "Configured progression rules for Module 1"
- ✅ "QUIZ LINKING COMPLETE!"

---

## 📞 Summary

**Problem:** Original script had syntax errors  
**Solution:** Use `LINK_QUIZ_TO_MODULE1_FIXED.sql` instead  
**Time to Run:** 5 minutes  
**Next Step:** Run `VERIFY_QUIZ_INTEGRATION.sql`  

**The fixed script is ready to use!** 🚀
