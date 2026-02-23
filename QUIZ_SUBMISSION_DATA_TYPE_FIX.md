# 🔴 CRITICAL: Quiz Submission Data Type Error

**Date**: 2026-02-23  
**Error**: `invalid input syntax for type integer: ["c33b4ed9-...", "d1132368-..."]`  
**Status**: ⏳ **AWAITING DATABASE FIX**

---

## 🐛 **The Problem**

When you submit the quiz, the backend tries to save your answers as JSON:

```json
{
  "question_id_1": "A",
  "question_id_2": "B",
  "question_id_3": "True",
  "question_id_4": "A,C,E"
}
```

But the database column is defined as **INTEGER** instead of **JSONB**, causing this error:

```
invalid input syntax for type integer: 
["c33b4ed9-5d5c-4320-af8c-48ad5cfc2e41", ...]
```

---

## 🔧 **THE FIX (Simple Version)**

**Run this in Supabase SQL Editor:**

```sql
-- Drop the wrong-type columns and recreate as JSONB
ALTER TABLE quiz_attempts DROP COLUMN IF EXISTS answers;
ALTER TABLE quiz_attempts ADD COLUMN answers JSONB;

ALTER TABLE quiz_attempts DROP COLUMN IF EXISTS results;
ALTER TABLE quiz_attempts ADD COLUMN results JSONB;

-- Verify
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'quiz_attempts' 
    AND column_name IN ('answers', 'results');
```

**Expected Output:**
| column_name | data_type |
|-------------|-----------|
| answers | jsonb |
| results | jsonb |

---

## 🔧 **ALTERNATIVE: Complete Schema Fix**

If you want to ensure ALL columns have correct types, run this comprehensive script:

```sql
-- Check current schema
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'quiz_attempts'
ORDER BY ordinal_position;

-- Fix answers and results columns
ALTER TABLE quiz_attempts DROP COLUMN IF EXISTS answers;
ALTER TABLE quiz_attempts ADD COLUMN answers JSONB;

ALTER TABLE quiz_attempts DROP COLUMN IF EXISTS results;
ALTER TABLE quiz_attempts ADD COLUMN results JSONB;

-- Ensure UUID columns are correct
ALTER TABLE quiz_attempts 
ALTER COLUMN student_id TYPE UUID USING student_id::uuid;

ALTER TABLE quiz_attempts 
ALTER COLUMN module_id TYPE UUID USING module_id::uuid;

ALTER TABLE quiz_attempts 
ALTER COLUMN enrollment_id TYPE UUID USING enrollment_id::uuid;

-- Ensure INTEGER columns are correct
ALTER TABLE quiz_attempts 
ALTER COLUMN total_questions TYPE INTEGER USING total_questions::integer;

ALTER TABLE quiz_attempts 
ALTER COLUMN correct_answers TYPE INTEGER USING correct_answers::integer;

ALTER TABLE quiz_attempts 
ALTER COLUMN wrong_answers TYPE INTEGER USING wrong_answers::integer;

-- Verify everything
SELECT 
    column_name,
    data_type,
    CASE 
        WHEN column_name IN ('answers', 'results') AND data_type = 'jsonb' THEN '✅'
        WHEN column_name IN ('student_id', 'module_id', 'enrollment_id') AND data_type = 'uuid' THEN '✅'
        WHEN column_name IN ('total_questions', 'correct_answers', 'wrong_answers') AND data_type = 'integer' THEN '✅'
        ELSE '⚠️'
    END AS status
FROM information_schema.columns 
WHERE table_name = 'quiz_attempts';
```

---

## 📊 **Expected Schema After Fix**

| Column | Type | Purpose |
|--------|------|---------|
| id | uuid | Primary key |
| student_id | uuid | Who took the quiz |
| module_id | uuid | Which module |
| enrollment_id | uuid | Which enrollment |
| total_questions | integer | Total questions (30) |
| correct_answers | integer | Correct count |
| wrong_answers | integer | Wrong count |
| questions_attempted | integer | Questions answered |
| percentage | decimal(5,2) | Score percentage |
| passed | boolean | Pass/fail (70% threshold) |
| attempt_number | integer | Attempt # (1-3) |
| time_spent_seconds | integer | Time in seconds |
| **answers** | **jsonb** | Student answers JSON ← **FIX THIS** |
| **results** | **jsonb** | Detailed results JSON ← **FIX THIS** |
| started_at | timestamp | When started |
| created_at | timestamp | When created |

---

## 🧪 **Testing After Fix**

### Step 1: Run the SQL fix
1. Open Supabase SQL Editor
2. Run the **Simple Fix** script above
3. Verify output shows `jsonb` for both columns

### Step 2: Test Quiz Submission
1. Go back to the quiz in your browser
2. Click "Try Again" (or refresh page)
3. Complete all 30 questions
4. Click "Submit Quiz"

### Step 3: Expected Results

**If Passed (≥70%):**
```
🎉 Congratulations! You Passed!

Your Score: 85/97 (88%)
Passing Score: 70% (68 points)

Results Summary:
✅ 28 correct answers
❌ 2 wrong answers

Time Spent: 8 minutes 32 seconds
Attempt: 1 of 3

[View Detailed Results] [Continue to Next Module]
```

**If Failed (<70%):**
```
😔 Not Quite There Yet

Your Score: 60/97 (62%)
Passing Score: 70% (68 points)

You can retry the quiz!
Attempts Remaining: 2 of 3

[Try Again] [Review Module Content] [View Results]
```

---

## 🔍 **Verify Quiz Attempt in Database**

After successfully submitting, run this SQL:

```sql
SELECT 
    qa.id,
    qa.attempt_number,
    qa.total_questions,
    qa.correct_answers,
    qa.wrong_answers,
    qa.percentage,
    qa.passed,
    qa.time_spent_seconds,
    jsonb_pretty(qa.answers) AS answers_preview,
    qa.created_at
FROM quiz_attempts qa
WHERE qa.module_id IN (
    SELECT id FROM modules 
    WHERE course_id = 35
)
ORDER BY qa.created_at DESC
LIMIT 1;
```

**Expected**: You should see a row with:
- `answers`: JSON object with your answers
- `percentage`: Your calculated score (0-100)
- `passed`: `true` if ≥70%, `false` otherwise

---

## 📁 **Files Created**

1. **SIMPLE_FIX_ANSWERS_COLUMN.sql**  
   - Quick fix: Drop and recreate columns as JSONB
   - Recommended for immediate fix

2. **FIX_QUIZ_ATTEMPTS_DATA_TYPES.sql**  
   - Comprehensive fix: All column types corrected
   - Use if you want to ensure entire schema is correct

3. **QUIZ_SUBMISSION_DATA_TYPE_FIX.md** (this file)  
   - Complete documentation

---

## 🎯 **Root Cause Analysis**

### Why This Happened

The `quiz_attempts` table was likely created with:
```sql
CREATE TABLE quiz_attempts (
    ...
    answers INTEGER,  -- ❌ WRONG! Should be JSONB
    results INTEGER   -- ❌ WRONG! Should be JSONB
);
```

But the backend code tries to insert JSON:
```typescript
.insert({
    answers: { "question_1": "A", "question_2": "B" },  // JSON object
    results: { "question_1": { correct: true } }         // JSON object
})
```

PostgreSQL sees an object `{}` and complains:
> "invalid input syntax for type integer"

### The Fix

Change column type to JSONB (JSON Binary):
```sql
ALTER TABLE quiz_attempts 
ALTER COLUMN answers TYPE JSONB;
```

Or drop and recreate:
```sql
ALTER TABLE quiz_attempts DROP COLUMN answers;
ALTER TABLE quiz_attempts ADD COLUMN answers JSONB;
```

---

## 📊 **Progress Update**

| Component | Status | Notes |
|-----------|--------|-------|
| Course import | ✅ Working | All 30 questions imported |
| Quiz rendering | ✅ Fixed | All types display correctly |
| True/False | ✅ Fixed | Shows "True" and "False" |
| Multiple-select | ✅ Fixed | Shows 5 checkboxes |
| enrollment_id | ✅ Fixed | Column added |
| **answers column** | ❌ **FIX THIS** | INTEGER → JSONB |
| Quiz submission | ⏳ Blocked | Waiting for fix |
| Score calculation | ⏳ Blocked | Waiting for fix |

---

## 🚀 **Next Steps**

1. ✅ Run the **Simple Fix** SQL script
2. ✅ Verify columns show `jsonb` type
3. ✅ Test quiz submission
4. ✅ Share results!

---

**Run the SQL fix and let me know how it goes!** 🎯

**Expected Time**: 30 seconds to run SQL, 2 minutes to test quiz

---

## 💡 **Pro Tip**

If you want to see what the backend is trying to insert, check the browser console (F12) when you submit the quiz. You'll see a POST request to `/api/student/module/{moduleId}/quiz/submit` with a JSON body like:

```json
{
  "studentId": "...",
  "enrollmentId": "...",
  "answers": {
    "question_id_1": "A",
    "question_id_2": "True",
    "question_id_3": "A,C,E"
  },
  "timeSpentSeconds": 512
}
```

This JSON is what needs to be stored in the `answers` JSONB column!
