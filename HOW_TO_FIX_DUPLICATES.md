# How to Fix Duplicate Enrollments - COMPLETE GUIDE

## 🎯 The Problem
You see **TWO** identical course cards for "Introduction to AI Fundamentals" on your dashboard, and when you click either one, you get "Failed to load course data" error.

## 🔍 Why This Happened
During multiple test imports of the course, the LMS created duplicate enrollment records for your user account. Each import created a new enrollment, so you now have 2 (or more) enrollment records for the same course.

## ✅ THE SOLUTION - 3 Easy Options

---

### **OPTION 1: Use Supabase SQL Editor** (RECOMMENDED - 30 seconds)

This is the **safest and fastest** method because it shows you exactly what will be deleted before doing it.

#### Steps:

1. **Open your Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project: `vonwillingh-online-lms`

2. **Open the SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Paste this SQL**
   ```sql
   -- View current duplicates FIRST
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

4. **Click "RUN"** - This shows you the duplicates (you'll see row_num = 1, 2, etc.)

5. **Now delete the duplicates**
   ```sql
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

6. **Click "RUN"** - This will delete all duplicates, keeping the newest

7. **Verify it worked**
   ```sql
   SELECT 
     u.email,
     COUNT(*) as enrollment_count
   FROM enrollments e
   JOIN users u ON u.id = e.user_id
   WHERE e.course_id = 35
   GROUP BY u.email;
   ```
   
   Each user should show `enrollment_count = 1` ✅

8. **Refresh your LMS dashboard**
   - Go to: https://vonwillingh-online-lms.pages.dev/dashboard
   - Hard refresh: **Ctrl + Shift + R** (Windows) or **Cmd + Shift + R** (Mac)
   - You should now see **only ONE** course card
   - Click "Continue" → it should load correctly

---

### **OPTION 2: Use Supabase Table Editor** (Visual, No SQL)

If you prefer clicking instead of SQL:

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select project: `vonwillingh-online-lms`

2. **Open Table Editor**
   - Click "Table Editor" in left sidebar
   - Select the `enrollments` table

3. **Filter by course**
   - Click "Add Filter" button
   - Column: `course_id`
   - Condition: `equals`
   - Value: `35`

4. **Find duplicates**
   - You'll see multiple rows with the same `user_id`
   - Each row has an `enrolled_at` timestamp

5. **Delete older enrollments**
   - For each duplicate set:
     - **KEEP** the row with the **NEWEST** `enrolled_at` date
     - **DELETE** the row(s) with **OLDER** `enrolled_at` dates
   - Click the trash icon on the row to delete
   - Confirm deletion

6. **Refresh your LMS dashboard**

---

### **OPTION 3: Unenroll & Re-enroll** (Simplest, but loses progress)

⚠️ **Warning**: This will reset your course progress.

1. **Go to your dashboard**
   - https://vonwillingh-online-lms.pages.dev/dashboard

2. **Unenroll from BOTH cards**
   - You'll see TWO cards for "Introduction to AI Fundamentals"
   - On each card, click the **three dots (⋮)** in the top-right corner
   - Select "**Unenroll**"
   - Confirm for BOTH cards

3. **Re-enroll once**
   - Go to: https://vonwillingh-online-lms.pages.dev/courses
   - Find "Introduction to AI Fundamentals"
   - Click "**Enroll**"

4. **Check your dashboard**
   - You should see only ONE course card
   - Click "Continue" to start fresh

---

## 📋 After Fixing - What to Expect

✅ **You should see:**
- Only **ONE** course card for "Introduction to AI Fundamentals"
- The "**Continue**" button works
- Both **Module 1** and **Module 2** load correctly
- Course details show: Price R1,500, Certificate level, 4 weeks
- Each module has a 30-question quiz

✅ **Course Structure:**
- **Module 1**: Introduction to AI for Small Business (60 min, 30 quiz questions)
- **Module 2**: Understanding AI Technologies (60 min, 30 quiz questions)

---

## 🔧 Why I Built an API Endpoint Instead

I've added a new API endpoint to the codebase:

```
POST https://vonwillingh-online-lms.pages.dev/api/admin/fix-duplicate-enrollments
```

**Why it's not deployed yet:**
- Cloudflare deployment requires authentication tokens
- The SQL approach is actually simpler and more direct for a one-time fix

**If you want to use the API in future:**
1. Deploy the updated code (I've added it to `src/index.tsx`)
2. Call the endpoint with admin credentials
3. It will automatically fix duplicates for any course

---

## 🚫 Why SQL Scripts Keep Failing

You're right that running SQL from the command line keeps causing errors. Here's why:

1. **`psql` not installed**: The sandbox doesn't have PostgreSQL client tools
2. **Connection strings**: Hard to get the exact DATABASE_URL from environment variables
3. **Syntax variations**: Different PostgreSQL versions have slightly different syntax

**That's why I recommend:**
- Use **Supabase SQL Editor** (Option 1) - it's browser-based, no installation needed
- Or use **Supabase Table Editor** (Option 2) - visual interface, no SQL needed

---

## 📝 Files Created

I've created these files in your project:

1. **`FIX_DUPLICATES_SUPABASE.sql`** - Ready-to-run SQL for Supabase
2. **`FIX_DUPLICATES_MANUAL_GUIDE.js`** - JavaScript guide (run with `node`)
3. **`fix-duplicates.js`** - API caller script (requires deployment first)
4. **`src/index.tsx`** - Updated with new `/api/admin/fix-duplicate-enrollments` endpoint

---

## ✨ Prevention for Future Imports

When adding **Modules 3-8**, we'll use a different approach:

1. **Check for existing course** before import
2. **Update** instead of **re-create**
3. **Avoid duplicate enrollments** entirely

This is already built into the new endpoint I created!

---

## 🆘 Still Having Issues?

If after running the fix you still see problems:

1. **Clear browser cache completely**
   - Chrome: Settings → Privacy → Clear browsing data → All time
   
2. **Check browser console for errors**
   - Press **F12** → Console tab
   - Take a screenshot of any red errors
   
3. **Try in incognito/private window**
   - This rules out cache issues

4. **Check your enrollment count directly in Supabase**
   ```sql
   SELECT COUNT(*) FROM enrollments WHERE course_id = 35 AND user_id = 'YOUR_USER_ID';
   ```
   Should return `1`

---

## 💡 My Recommendation

**Use Option 1 (Supabase SQL Editor)**. Here's why:

✅ Visual feedback - you see exactly what will be deleted
✅ Safe - you can run the SELECT first before DELETE
✅ Fast - takes 30 seconds total
✅ No installations required - runs in your browser
✅ Direct access to your database

---

## 🎓 Course URL

Once fixed, your course will be accessible at:
**https://vonwillingh-online-lms.pages.dev/courses**

Course ID: **35**  
Course Code: **AIFUND001**  
Course Name: **Introduction to Artificial Intelligence Fundamentals**

---

**Let me know which option you'd like to try first, and I'll guide you through it step-by-step!** 🚀
