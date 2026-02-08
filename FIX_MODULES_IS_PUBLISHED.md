# Fix: Course Page Error - Missing is_published Column

## 🔴 Error
```
Error: Failed to run sql query: ERROR: 42703: column "is_published" does not exist LINE 12: is_published
```

## 🎯 Root Cause
The `modules` table is missing the `is_published` column that the course detail API expects.

**Code Reference:** `src/index.tsx` line 2881
```typescript
.from('modules')
.select('*')
.eq('course_id', courseId)
.eq('is_published', true)  // ❌ Column doesn't exist!
```

## ✅ Solution

### Run This SQL in Supabase

```sql
-- Add missing is_published column to modules table
ALTER TABLE modules
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Verify course 32 exists
SELECT id, name, description, price 
FROM courses 
WHERE id = 32;

-- Check modules for course 32
SELECT 
    id,
    course_id,
    title,
    order_number,
    is_published
FROM modules
WHERE course_id = 32
ORDER BY order_number;

-- Count total modules
SELECT COUNT(*) as total_modules
FROM modules
WHERE course_id = 32;
```

**Expected Result:**
- `ALTER TABLE` should succeed
- You should see the course details
- You should see a list of modules (or 0 if no modules exist)

## 🧪 After Running SQL

1. Go to: https://vonwillingh-online-lms.pages.dev/student-login
2. Login with `sarrol@vonwillingh.co.za` / `rpnr9mufk2lU6OIC`
3. Click **Continue** on the course
4. Should now load without error!

## 📊 What to Expect

### If Course Has Modules
✅ Course page loads
✅ Shows list of modules
✅ Shows progress: "2 of 5 modules completed" (example)
✅ Can click on modules to view content

### If Course Has NO Modules
✅ Course page loads
⚠️ Shows "No modules available yet"
✅ No error

## 🔧 Other Missing Columns to Add

While we're at it, let's add other common columns that might be missing:

```sql
-- Add all potentially missing columns to modules table
ALTER TABLE modules
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_preview BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER,
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS content TEXT;

-- Verify columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'modules'
ORDER BY ordinal_position;
```

## 📋 Summary

**Issue**: Missing `is_published` column in `modules` table
**Fix**: Add the column with `ALTER TABLE`
**Status**: SQL ready to run ⏳

---

## 🎯 Bottom Line
Run the first SQL block above, then test the course page. It should work! 🚀
