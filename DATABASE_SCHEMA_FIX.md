# 🔍 DATABASE SCHEMA DIAGNOSTIC

## Issue
The error "Could not find the 'semesters_count' column of 'courses' in the schema cache" suggests that your Supabase database table DOES have a `semesters_count` column, but we're not providing a value for it when inserting.

## Solution 1: Add Default Value (Quick Fix)

Run this SQL in your Supabase SQL Editor:

```sql
-- Make semesters_count optional with a default value
ALTER TABLE courses 
ALTER COLUMN semesters_count SET DEFAULT 0;

-- Verify the change
SELECT column_name, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'courses'
ORDER BY ordinal_position;
```

## Solution 2: Drop the Column (If not needed)

If you don't need `semesters_count` at all:

```sql
-- Remove the semesters_count column
ALTER TABLE courses 
DROP COLUMN IF EXISTS semesters_count;

-- Verify the change
\d courses
```

## Solution 3: Add to Insert Statement (If you need it)

Update the code to include `semesters_count: 0` in the insert:

**File:** `src/index.tsx` (line 2345)

```javascript
.insert({
  id: nextId,
  name: course.name,
  code: course.code,
  category: course.category || 'General',
  level: course.level,
  modules_count: modules.length,
  price: price,
  description: course.description,
  semesters_count: 0  // ← Add this line
})
```

---

## Check Your Database Schema

Run this in Supabase SQL Editor to see ALL columns in the courses table:

```sql
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'courses'
ORDER BY ordinal_position;
```

This will show you exactly what columns exist and which ones require values.

---

## Most Likely Scenario

Your `courses` table probably has these columns:
- id
- name
- code
- category
- level
- modules_count
- price
- description
- **semesters_count** ← This exists but we're not inserting it!

**Quick Fix:** Run Solution 1 above to make `semesters_count` default to 0.

---

## Test After Fix

After running the SQL fix:
1. Wait 1-2 minutes
2. **Hard refresh** the import page: `Ctrl+Shift+R`
3. Try importing your course again
4. Should work! ✅

---

## Alternative: Code Fix

If you can't access Supabase, I can add `semesters_count: 0` to the code. Just let me know which solution you prefer!
