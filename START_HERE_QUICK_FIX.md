# 🎯 FIX DUPLICATE ENROLLMENTS IN 30 SECONDS

## YOU'RE RIGHT - I SHOULD DO IT MYSELF!

But since I can't access your Supabase dashboard directly, here's the **ABSOLUTE EASIEST** way for you to fix it:

---

## ⚡ 30-SECOND FIX

### Step 1: Open Supabase SQL Editor
Go to: https://supabase.com/dashboard

- Select your project: `vonwillingh-online-lms`
- Click: **SQL Editor** in the left sidebar
- Click: **New Query**

### Step 2: Copy & Paste This SQL

```sql
-- View duplicates first (safe to run)
SELECT 
  u.email,
  e.id as enrollment_id,
  e.enrolled_at,
  ROW_NUMBER() OVER (PARTITION BY e.user_id ORDER BY e.enrolled_at DESC) as row_num
FROM enrollments e
JOIN users u ON u.id = e.user_id
WHERE e.course_id = 35
ORDER BY u.email, e.enrolled_at DESC;
```

**Click RUN** → You'll see row_num = 1, 2, 3... (anything >1 is a duplicate)

### Step 3: Delete the Duplicates

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

**Click RUN** → Duplicates deleted! ✅

### Step 4: Verify It Worked

```sql
-- Verify (each user should have count = 1)
SELECT 
  u.email,
  COUNT(*) as enrollment_count
FROM enrollments e
JOIN users u ON u.id = e.user_id
WHERE e.course_id = 35
GROUP BY u.email;
```

**Click RUN** → Should show `enrollment_count = 1` for each user ✅

### Step 5: Refresh Your Dashboard

1. Go to: https://vonwillingh-online-lms.pages.dev/dashboard
2. Hard refresh: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)
3. You should see **ONLY ONE** course card ✅
4. Click "Continue" → Modules load correctly ✅

---

## ✅ DONE!

That's it! 30 seconds, problem solved.

---

## 🚀 Alternative: Even Simpler (No SQL)

If you don't want to use SQL:

1. Go to: https://vonwillingh-online-lms.pages.dev/dashboard
2. On EACH course card, click the three dots (**⋮**)
3. Select "**Unenroll**" (do this for BOTH cards)
4. Go to: https://vonwillingh-online-lms.pages.dev/courses
5. Click "**Enroll**" on "Introduction to AI Fundamentals"
6. Done! ✅

⚠️ **Note**: This resets your course progress, but it's the simplest method.

---

## 📋 Summary

**Problem**: Two course cards, "Failed to load course data"  
**Cause**: Duplicate enrollments from multiple imports  
**Fix Time**: 30 seconds  
**Method**: Supabase SQL Editor (or manual unenroll/re-enroll)

---

## 🆘 Still Need Help?

All files are ready for you:

- **SOLUTION_SUMMARY.md** - This guide
- **HOW_TO_FIX_DUPLICATES.md** - Detailed guide with screenshots
- **FIX_DUPLICATES_SUPABASE.sql** - The SQL script above
- **Pull Request**: https://github.com/Sarrol2384/vonwillingh-online-lms/pull/1

---

**Just copy the SQL above into Supabase SQL Editor and run it!** 🎉
