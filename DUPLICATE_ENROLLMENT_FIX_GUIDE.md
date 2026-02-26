# 🔧 Duplicate Enrollment Fix Guide

## Problem
User "Kobus" has 2 enrollments for the same course (AIFUND001), causing:
- Duplicate course cards on dashboard
- "Failed to load course data" error when clicking
- Unable to access course modules

## Root Cause
The course was re-imported multiple times during testing, which created duplicate course records briefly. When a user is enrolled, the system may have enrolled them in both instances.

---

## ✅ Solution 1: Manual Fix via Database (Recommended)

### Step 1: Identify Duplicate Enrollments

Run this SQL query to see all enrollments:

```sql
SELECT 
    e.id as enrollment_id,
    e.user_id,
    u.email,
    e.course_id,
    c.name as course_name,
    e.enrolled_at,
    e.progress,
    e.completed
FROM enrollments e
JOIN courses c ON c.id = e.course_id
JOIN users u ON u.id = e.user_id
WHERE c.code = 'AIFUND001'
ORDER BY e.enrolled_at DESC;
```

### Step 2: Delete Older Duplicate(s)

Keep the **most recent enrollment** (highest `enrolled_at` timestamp), delete the rest:

```sql
-- Replace <enrollment_id> with the ID from Step 1
DELETE FROM enrollments WHERE id = <enrollment_id>;
```

**Example:**
```sql
-- If enrollment IDs are 123 (newer) and 122 (older)
-- Keep 123, delete 122
DELETE FROM enrollments WHERE id = 122;
```

---

## ✅ Solution 2: Via Admin Panel

1. **Access Admin Panel:**
   - Go to: https://vonwillingh-online-lms.pages.dev/admin
   
2. **Navigate to Enrollments:**
   - Look for "Enrollments" or "Students" section
   
3. **Find User "Kobus" Enrollments:**
   - Filter by course AIFUND001
   - Or search for user "Kobus Van Willingh"
   
4. **Delete Duplicate:**
   - Identify the older enrollment (earlier date)
   - Click "Delete" or "Remove Enrollment"
   - Keep the most recent one

---

## ✅ Solution 3: Unenroll and Re-enroll

If you have access to unenroll:

1. **Unenroll from ALL instances:**
   - On dashboard, find "Unenroll" or "Leave Course" button
   - Do this for BOTH duplicate entries
   
2. **Re-enroll fresh:**
   - Go to course catalog
   - Enroll in AIFUND001 again
   - This will create a clean, single enrollment

---

## ✅ Solution 4: Script to Auto-Fix

Run this SQL to automatically remove duplicates:

```sql
-- This will keep the most recent enrollment per user per course
-- and delete all older duplicates

WITH ranked_enrollments AS (
    SELECT 
        id,
        ROW_NUMBER() OVER (
            PARTITION BY user_id, course_id 
            ORDER BY enrolled_at DESC
        ) as rn
    FROM enrollments
    WHERE course_id = 35  -- AIFUND001
)
DELETE FROM enrollments 
WHERE id IN (
    SELECT id FROM ranked_enrollments WHERE rn > 1
);
```

---

## 🔍 Verification

After fixing, verify the fix worked:

```sql
-- Should return only 1 row per user
SELECT 
    u.email,
    COUNT(*) as enrollment_count
FROM enrollments e
JOIN users u ON u.id = e.user_id
WHERE e.course_id = 35
GROUP BY u.email
HAVING COUNT(*) > 1;
```

If this returns 0 rows, the duplicates are fixed! ✅

---

## 🚀 Expected Result After Fix

**Dashboard should show:**
- ✅ Only **1** "Introduction to Artificial Intelligence Fundamentals" card
- ✅ "Continue" button works correctly
- ✅ Course loads without errors
- ✅ Both Module 1 and Module 2 accessible

---

## 📝 Prevention for Future

To prevent this issue when importing Modules 3-8:

1. **Don't delete existing course** before re-import
2. The API endpoint handles updates automatically
3. Or: Test imports with a test user account first

---

## 🆘 If Issue Persists

If the course still shows "Failed to load course data" after fixing duplicates:

1. **Clear browser cache:** Ctrl+Shift+Delete
2. **Hard refresh:** Ctrl+Shift+R
3. **Logout and login again**
4. **Check browser console** for specific errors (F12 → Console tab)

---

**File Created:** 2026-02-24  
**Issue:** Duplicate enrollments causing dashboard errors  
**Status:** Fix guide provided
