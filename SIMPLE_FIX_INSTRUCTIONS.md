# 🔧 Simple Fix for Duplicate Enrollments

Since the admin panel isn't available, here are your **3 easiest options**:

---

## ✅ Option 1: Use Your Database Dashboard (Recommended)

You mentioned earlier that you have access to your Supabase or database dashboard.

### Steps:

1. **Go to your database dashboard** (Supabase, or wherever your Postgres DB is hosted)

2. **Open the SQL Editor**

3. **Copy and paste this SQL:**

```sql
-- This will remove duplicate enrollments, keeping only the most recent one
WITH ranked_enrollments AS (
    SELECT 
        e.id,
        ROW_NUMBER() OVER (
            PARTITION BY e.user_id, e.course_id 
            ORDER BY e.enrolled_at DESC
        ) as rn
    FROM enrollments e
    JOIN courses c ON c.id = e.course_id
    WHERE c.code = 'AIFUND001'
)
DELETE FROM enrollments 
WHERE id IN (
    SELECT id FROM ranked_enrollments WHERE rn > 1
);
```

4. **Click "Run"**

5. **Refresh your LMS dashboard** - you should now see only 1 course card!

---

## ✅ Option 2: Manual Unenroll from Student Dashboard

1. **On your student dashboard**, hover over each course card for AIFUND001

2. Look for a **menu icon (⋮)** or **"Unenroll" button**

3. **Unenroll from BOTH duplicates**

4. **Go to the course catalog** and **re-enroll once**

---

## ✅ Option 3: I Can Create an API Endpoint

If you want, I can create a simple API endpoint at:
```
/api/admin/fix-duplicate-enrollments
```

This would:
- Automatically find and remove duplicate enrollments
- Keep the most recent enrollment for each user
- Return a success message

Would you like me to create this endpoint?

---

## 🎯 Verification After Fix

After using any of the above options, verify it worked:

1. **Refresh your dashboard** (Ctrl+F5 for hard refresh)
2. You should see **only 1 course card** for AIFUND001
3. Click "Continue" - it should load without errors
4. You should see Module 1 and Module 2

---

## 📝 Why This Happened

During our testing, I imported the course multiple times:
- First import created enrollment #1
- I deleted the course and re-imported
- Second import created enrollment #2
- Both enrollments remained in the database

The fix removes the older enrollment, keeping only the most recent one.

---

**Which option would you prefer?**
1. Run the SQL in your database dashboard (fastest)
2. Manually unenroll/re-enroll
3. I create an API endpoint for you
