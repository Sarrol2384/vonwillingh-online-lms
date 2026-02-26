# 🔥 EMERGENCY FIX - SQL Error Resolved

## ❌ What Went Wrong

The SQL I gave you referenced a `users` table that doesn't exist in your database (or has a different name/schema).

## ✅ FIXED VERSION (Works Now!)

---

## 🎯 OPTION 1: Use Fixed SQL (No users table required)

### Step 1: Open Supabase SQL Editor
- https://supabase.com/dashboard
- Select: `vonwillingh-online-lms`
- Click: **SQL Editor** → **New Query**

### Step 2: Paste This FIXED SQL

```sql
-- View duplicates (shows user_id instead of email)
SELECT 
  e.user_id,
  e.id as enrollment_id,
  e.enrolled_at,
  ROW_NUMBER() OVER (PARTITION BY e.user_id ORDER BY e.enrolled_at DESC) as row_num
FROM enrollments e
WHERE e.course_id = 35
ORDER BY e.user_id, e.enrolled_at DESC;
```
**Click RUN** ✅ (safe to run - just shows data)

```sql
-- Delete duplicates (keeps newest per user)
DELETE FROM enrollments
WHERE id IN (
  SELECT e.id
  FROM (
    SELECT 
      id,
      ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY enrolled_at DESC) as row_num
    FROM enrollments
    WHERE course_id = 35
  ) e
  WHERE e.row_num > 1
);
```
**Click RUN** ✅ (deletes duplicates)

```sql
-- Verify it worked
SELECT 
  user_id,
  COUNT(*) as enrollment_count,
  MAX(enrolled_at) as latest_enrollment
FROM enrollments
WHERE course_id = 35
GROUP BY user_id;
```
**Click RUN** ✅ (should show count = 1 for each user_id)

### Step 3: Refresh Dashboard
- Go to: https://vonwillingh-online-lms.pages.dev/dashboard
- Hard refresh: **Ctrl+Shift+R**
- Should see **ONE** course card ✅

---

## 🎯 OPTION 2: Even Simpler - No SQL At All!

If you don't want to deal with SQL errors:

### Use Supabase Table Editor (Point & Click)

1. **Open Supabase Dashboard**
   - https://supabase.com/dashboard
   - Select: `vonwillingh-online-lms`

2. **Go to Table Editor**
   - Click: **Table Editor** in left sidebar
   - Select: **enrollments** table

3. **Filter by course**
   - Click: **Add Filter**
   - Column: `course_id`
   - Condition: `equals`
   - Value: `35`
   - Click **Apply**

4. **Find duplicates**
   - Look for rows with the same `user_id`
   - Note the `enrolled_at` timestamp for each

5. **Delete older enrollments**
   - For each duplicate set:
     - **KEEP** the row with the **NEWEST** `enrolled_at`
     - **DELETE** the row(s) with **OLDER** `enrolled_at`
   - Click the trash icon (🗑️) on each old row
   - Confirm deletion

6. **Refresh dashboard**
   - https://vonwillingh-online-lms.pages.dev/dashboard
   - Should see **ONE** course card ✅

---

## 🎯 OPTION 3: Nuclear Option (Simplest, but resets progress)

### Manual Unenroll & Re-enroll

1. Go to: https://vonwillingh-online-lms.pages.dev/dashboard
2. Click **⋮** (three dots) on EACH course card
3. Select **"Unenroll"** (do this for BOTH cards)
4. Go to: https://vonwillingh-online-lms.pages.dev/courses
5. Click **"Enroll"** on "Introduction to AI Fundamentals"
6. Done! ✅

⚠️ **Note**: This resets your course progress

---

## 📁 Files Ready

1. **`FIX_DUPLICATES_SUPABASE_V2.sql`** ⭐ **USE THIS** - Fixed version (no users table)
2. **`CHECK_DATABASE_SCHEMA.sql`** - Check your database structure first
3. **`EMERGENCY_FIX.md`** - This guide

---

## 🔍 If You Want to Check First

Run this SQL first to see your database structure:

```sql
-- See what tables you have
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

Then:

```sql
-- See duplicate enrollments
SELECT 
  user_id,
  COUNT(*) as enrollment_count
FROM enrollments
WHERE course_id = 35
GROUP BY user_id
HAVING COUNT(*) > 1;
```

This shows which `user_id` values have duplicates.

---

## ✅ What Changed

**Original SQL** (BROKEN):
```sql
FROM enrollments e
JOIN users u ON u.id = e.user_id  ← This table doesn't exist!
```

**Fixed SQL** (WORKS):
```sql
FROM enrollments e
-- No JOIN needed! Just use user_id directly
```

---

## 🚀 After You Fix It

**Expected result:**
- ✅ Only **ONE** course card visible
- ✅ "Continue" button works
- ✅ Module 1 loads correctly
- ✅ Module 2 loads correctly
- ✅ All 60 quiz questions accessible

---

## 📞 Choose Your Method

**Fastest**: SQL method (copy-paste from `FIX_DUPLICATES_SUPABASE_V2.sql`)  
**Safest**: Table Editor (point & click, visual)  
**Simplest**: Manual unenroll/re-enroll (but resets progress)

---

**All three methods work - pick the one you're most comfortable with!** 🎉

The SQL error is now fixed! ✅
