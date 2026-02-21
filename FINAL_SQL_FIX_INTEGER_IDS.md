# 🔧 FINAL FIX: SQL Script for INTEGER IDs

## ⚠️ Root Cause Identified

**Problem:** Your database uses **INTEGER** IDs for `courses` and `modules` tables, but the previous scripts assumed **UUID** IDs.

**Error:** `foreign key constraint "module_progression_rules_course_id_fkey" cannot be implemented DETAIL: Key columns "course_id" and "id" are of incompatible types: uuid and integer.`

**Solution:** Created `LINK_QUIZ_TO_MODULE1_INTEGER_IDS.sql` with correct INTEGER data types.

---

## ✅ Use This File (Final Version)

**File:** `/home/user/webapp/LINK_QUIZ_TO_MODULE1_INTEGER_IDS.sql`

**Status:** ✅ Compatible with your database schema

---

## 🚀 How to Run (5 minutes)

### Step 1: Open Supabase SQL Editor
```
https://supabase.com/dashboard/project/dgcobxtkzewzkrzpfcdr/sql/new
```

### Step 2: Copy the Correct Script
- Open file: `/home/user/webapp/LINK_QUIZ_TO_MODULE1_INTEGER_IDS.sql`
- Select all (Ctrl+A)
- Copy (Ctrl+C)

### Step 3: Paste and Execute
- Paste into Supabase editor
- Click **"Run"**
- Wait ~5 seconds

### Step 4: Verify Success

Look for these messages:

```
NOTICE: Found Module 1 with ID: [number]
NOTICE: Module 1 has 20 quiz questions
NOTICE: Created module_progression_rules table
NOTICE: Created module_content_completion table
NOTICE: Course ID: [number], Module 1 ID: [number], Module 2 ID: [number]
NOTICE: Configured progression rules for Module 1
NOTICE: 
NOTICE: ========================================
NOTICE: QUIZ LINKING COMPLETE!
NOTICE: ========================================
```

---

## 🔍 What Changed

### Database Schema Differences

| Table | Previous (Wrong) | Corrected |
|-------|-----------------|-----------|
| `module_progression_rules.id` | UUID | **SERIAL** (INTEGER) |
| `module_progression_rules.course_id` | UUID | **INTEGER** |
| `module_progression_rules.module_id` | UUID | **INTEGER** |
| `module_progression_rules.next_module_id` | UUID | **INTEGER** |
| `module_content_completion.id` | UUID | **SERIAL** (INTEGER) |
| `module_content_completion.module_id` | UUID | **INTEGER** |
| `module_content_completion.enrollment_id` | UUID | **INTEGER** |
| `module_content_completion.student_id` | UUID | UUID ✅ (kept) |

### Key Changes in Script

**Before (UUID):**
```sql
CREATE TABLE module_progression_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id),
    module_id UUID NOT NULL REFERENCES modules(id),
    ...
```

**After (INTEGER):**
```sql
CREATE TABLE module_progression_rules (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id),
    module_id INTEGER NOT NULL REFERENCES modules(id),
    ...
```

---

## 📋 What This Script Does

### 1. Verifies Prerequisites
- Checks Module 1 exists with INTEGER ID
- Confirms 20 quiz questions present
- Uses type casting (`::text`) to handle potential mismatches

### 2. Creates Tables with Correct Types
- **module_progression_rules** - Uses INTEGER for course_id, module_id
- **module_content_completion** - Uses INTEGER for module_id, enrollment_id

### 3. Configures Module 1
- Sets passing score: 70%
- Sets max attempts: 3
- Sets content requirements: 30 min + scroll
- Links to Module 2 (INTEGER reference)

---

## 🐛 If This Still Fails

### Check Your Database Schema

Run this query in Supabase to confirm data types:

```sql
-- Check courses table ID type
SELECT 
    table_name,
    column_name, 
    data_type
FROM information_schema.columns 
WHERE table_name = 'courses' AND column_name = 'id';

-- Check modules table ID type
SELECT 
    table_name,
    column_name, 
    data_type
FROM information_schema.columns 
WHERE table_name = 'modules' AND column_name = 'id';

-- Check students table ID type
SELECT 
    table_name,
    column_name, 
    data_type
FROM information_schema.columns 
WHERE table_name = 'students' AND column_name = 'id';

-- Check enrollments table ID type
SELECT 
    table_name,
    column_name, 
    data_type
FROM information_schema.columns 
WHERE table_name = 'enrollments' AND column_name = 'id';
```

**Expected results:**
- `courses.id` → **integer** or **bigint**
- `modules.id` → **integer** or **bigint**
- `students.id` → **uuid** (kept as UUID)
- `enrollments.id` → **integer** or **bigint**

### If You See Different Types

Please run the query above and share the results. I'll create a script that matches your exact schema.

---

## ⚙️ Configuration After Setup

After running this script successfully:

### Quick Test Mode (Optional)
Reduce time from 30 minutes to 60 seconds:

```sql
UPDATE module_progression_rules 
SET minimum_content_time_seconds = 60
WHERE module_id = (
    SELECT m.id FROM modules m 
    JOIN courses c ON m.course_id = c.id 
    WHERE c.code = 'AIFUND001' 
    AND m.title ILIKE '%Module 1%'
    LIMIT 1
);
```

### Reset to Production
Change back to 30 minutes:

```sql
UPDATE module_progression_rules 
SET minimum_content_time_seconds = 1800
WHERE module_id = (
    SELECT m.id FROM modules m 
    JOIN courses c ON m.course_id = c.id 
    WHERE c.code = 'AIFUND001' 
    AND m.title ILIKE '%Module 1%'
    LIMIT 1
);
```

---

## 📁 File Versions

| File | Data Types | Status |
|------|-----------|--------|
| ~~LINK_QUIZ_TO_MODULE1.sql~~ | UUID | ❌ Wrong + syntax errors |
| ~~LINK_QUIZ_TO_MODULE1_FIXED.sql~~ | UUID | ❌ Syntax fixed but wrong types |
| **LINK_QUIZ_TO_MODULE1_INTEGER_IDS.sql** | INTEGER | ✅ **USE THIS** |

---

## ✅ Next Steps After Running

1. **Run Verification Script** (2 min)
   ```
   File: /home/user/webapp/VERIFY_QUIZ_INTEGRATION.sql
   ```
   (This should work without modification)

2. **Configure Test Mode** (1 min)
   - Run the 60-second query above

3. **Test the System** (20 min)
   - Follow `/home/user/webapp/PHASE3_CHECKLIST.md`
   - Test content completion tracking
   - Test quiz unlock
   - Test pass/fail scenarios

---

## 🎯 Success Criteria

The script succeeded if you see:
- ✅ "Found Module 1 with ID: [number]" (not UUID)
- ✅ "Module 1 has 20 quiz questions"
- ✅ "Created module_progression_rules table"
- ✅ "Created module_content_completion table"
- ✅ "Configured progression rules for Module 1"
- ✅ "QUIZ LINKING COMPLETE!"
- ✅ **No errors about incompatible types**

---

## 📊 What You'll Have After This

### Database Tables
1. **module_progression_rules** (with INTEGER IDs)
   - Stores quiz requirements per module
   - Links Module 1 → Module 2 progression

2. **module_content_completion** (with INTEGER module_id)
   - Tracks student time spent
   - Tracks scroll completion

### Module 1 Configuration
- Passing score: 70% (14/20)
- Max attempts: 3
- Content time: 30 minutes
- Scroll required: Yes (95%)
- Blocks Module 2: Yes

---

## 🚀 Summary

**Issue:** Database uses INTEGER IDs, scripts assumed UUID  
**Fix:** Created `LINK_QUIZ_TO_MODULE1_INTEGER_IDS.sql` with INTEGER types  
**Status:** Ready to run  
**Time:** 5 minutes  

**This should work! Please try it and let me know if any errors occur.** 🙏
