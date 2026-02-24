# 🎯 QUIZ SUBMISSION FIX - Missing enrollment_id Column

**Date**: 2026-02-23  
**Status**: ⏳ **AWAITING DATABASE FIX**  
**Error**: `Could not find the 'enrollment_id' column of 'quiz_attempts' in the schema cache`

---

## 🎉 **GREAT NEWS: Quiz Rendering Works!**

### ✅ What's Working
- ✅ **Course import**: All 30 questions imported correctly
- ✅ **Multiple-choice questions (1-15)**: 4 radio buttons
- ✅ **True/False questions (16-23)**: "True" and "False" options (no more nulls!)
- ✅ **Multiple-select questions (24-30)**: 5 checkboxes (A-E)
- ✅ **Question display**: All types render correctly
- ✅ **Answer selection**: Radio buttons and checkboxes work
- ✅ **Quiz completion**: All 30 questions can be answered

### ❌ What's Broken
- ❌ **Quiz submission**: Database schema error
- ❌ **Score calculation**: Blocked by submission error

---

## 🔧 **THE FIX: Add Missing Column**

The `quiz_attempts` table is missing the `enrollment_id` column that the backend expects.

### Option 1: Add Missing Columns (Safe - Preserves Data)

**Use this if the table exists and you want to keep existing data.**

Copy and paste this into Supabase SQL Editor:

```sql
-- Add the missing enrollment_id column
ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE;

-- Add other potentially missing columns
ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS total_questions INTEGER;

ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS correct_answers INTEGER DEFAULT 0;

ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS wrong_answers INTEGER DEFAULT 0;

ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS questions_attempted INTEGER DEFAULT 0;

ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS percentage DECIMAL(5,2) DEFAULT 0;

ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS passed BOOLEAN DEFAULT false;

ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS attempt_number INTEGER DEFAULT 1;

ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS time_spent_seconds INTEGER DEFAULT 0;

ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS answers JSONB;

ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS results JSONB;

ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_enrollment 
ON quiz_attempts(enrollment_id);

-- Verify
SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ enrollment_id column EXISTS'
    ELSE '❌ enrollment_id column MISSING'
  END AS status
FROM information_schema.columns
WHERE table_name = 'quiz_attempts' 
  AND column_name = 'enrollment_id';
```

---

### Option 2: Create Table from Scratch (Clean Start)

**Use this if the table doesn't exist or you want to start fresh.**

```sql
-- Create quiz_attempts table with complete schema
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign Keys
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
  
  -- Quiz Results
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  wrong_answers INTEGER NOT NULL DEFAULT 0,
  questions_attempted INTEGER NOT NULL DEFAULT 0,
  percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  passed BOOLEAN NOT NULL DEFAULT false,
  
  -- Attempt Tracking
  attempt_number INTEGER NOT NULL DEFAULT 1,
  time_spent_seconds INTEGER DEFAULT 0,
  
  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- JSON Data
  answers JSONB,
  results JSONB
);

-- Create indexes
CREATE INDEX idx_quiz_attempts_student ON quiz_attempts(student_id);
CREATE INDEX idx_quiz_attempts_module ON quiz_attempts(module_id);
CREATE INDEX idx_quiz_attempts_enrollment ON quiz_attempts(enrollment_id);

-- Verify
SELECT '✅ quiz_attempts table created!' AS status;
```

---

## 📊 **Expected Backend Insert Structure**

When a student submits a quiz, the backend inserts:

```javascript
{
  student_id: UUID,              // Required
  module_id: UUID,               // Required
  enrollment_id: UUID,           // Required (was missing!)
  total_questions: INTEGER,      // e.g., 30
  correct_answers: INTEGER,      // e.g., 25
  wrong_answers: INTEGER,        // e.g., 5
  questions_attempted: INTEGER,  // e.g., 30
  percentage: DECIMAL,           // e.g., 83.33
  passed: BOOLEAN,               // true if >= 70%
  attempt_number: INTEGER,       // 1, 2, or 3
  answers: JSONB,                // { "question_id": "A" }
  results: JSONB,                // { "question_id": { correct: true } }
  time_spent_seconds: INTEGER,   // e.g., 1234
  started_at: TIMESTAMP          // NOW()
}
```

**File**: `/home/user/webapp/src/index.tsx` (lines 5787-5804)

---

## 🧪 **Testing After Fix**

### Step 1: Run the SQL Fix
1. Open Supabase SQL Editor
2. Run **Option 1** (add columns) or **Option 2** (create table)
3. Verify the output shows: `✅ enrollment_id column EXISTS`

### Step 2: Re-Test Quiz Submission
1. Go back to the quiz in your browser
2. Click "Try Again" (or refresh the page)
3. Complete the quiz (all 30 questions)
4. Click "Submit Quiz"

### Step 3: Expected Results
After clicking "Submit Quiz", you should see:

**If Passed (≥70% = 68+ points):**
```
🎉 Congratulations! You Passed!

Score: 85/97 (88%)
Passing Score: 70%

Results:
✓ 28 correct answers
✗ 2 wrong answers

[View Results] [Continue to Next Module]
```

**If Failed (<70%):**
```
😔 Not Quite There Yet

Score: 60/97 (62%)
Passing Score: 70%

You can retry the quiz. Attempts remaining: 2/3

[Try Again] [Review Module Content]
```

---

## 🔍 **Verify Quiz Attempt Was Saved**

After submitting, run this SQL to verify:

```sql
SELECT 
    qa.id,
    qa.attempt_number,
    qa.total_questions,
    qa.correct_answers,
    qa.percentage,
    qa.passed,
    qa.time_spent_seconds,
    qa.created_at,
    u.email AS student_email,
    m.title AS module_title
FROM quiz_attempts qa
JOIN users u ON u.id = qa.student_id
JOIN modules m ON m.id = qa.module_id
ORDER BY qa.created_at DESC
LIMIT 5;
```

**Expected**: You should see a new row with your quiz attempt!

---

## 📁 **Files Created**

1. **CREATE_QUIZ_ATTEMPTS_TABLE.sql**  
   - Complete table creation script
   - Use for clean start

2. **ADD_QUIZ_ATTEMPTS_COLUMNS.sql**  
   - Adds missing columns to existing table
   - Use to preserve existing data

3. **QUIZ_SUBMISSION_FIX.md** (this file)  
   - Comprehensive documentation

---

## 🎯 **Summary**

### Problem
```
Error: Could not find the 'enrollment_id' column of 'quiz_attempts' 
in the schema cache
```

### Root Cause
The `quiz_attempts` table was missing the `enrollment_id` column that the backend tries to insert.

### Solution
Run **Option 1** SQL script to add the missing column:
```sql
ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS enrollment_id UUID 
REFERENCES enrollments(id) ON DELETE CASCADE;
```

### After Fix
1. ✅ Quiz submission will work
2. ✅ Scores will be calculated
3. ✅ Pass/fail determined (70% threshold)
4. ✅ Attempts tracked (max 3)
5. ✅ Results displayed with detailed feedback

---

## 🚀 **Next Steps**

1. **Run the SQL fix** (Option 1 or Option 2 above)
2. **Verify column exists** (check query results)
3. **Test quiz submission** (click "Try Again")
4. **Share results** with me!

---

**Status**: ⏳ Waiting for you to run the SQL fix  
**Files Ready**: `ADD_QUIZ_ATTEMPTS_COLUMNS.sql` and `CREATE_QUIZ_ATTEMPTS_TABLE.sql`  
**Expected Time**: 30 seconds to run SQL, 2 minutes to test

---

**Run the SQL and let me know how it goes!** 🎯
