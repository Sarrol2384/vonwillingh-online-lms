# 🗑️ Delete Test Applications - Quick Guide

## 📄 SQL Script Created

**File:** `/home/user/webapp/delete_test_applications_both.sql`

This script will delete **both test students** and all their related data:

1. **lmsepg@mjgrealestate.co.za**
2. **vonwillinghc@gmail.com**

---

## 🚀 How to Use

### Step 1: Open Supabase SQL Editor
🔗 https://supabase.com/dashboard/project/dgcobxtkzewzkrzpfcdr/sql/new

### Step 2: Copy the SQL Script
The script is located at: `/home/user/webapp/delete_test_applications_both.sql`

### Step 3: Run in 3 Parts

#### Part 1: Preview (SELECT Queries)
Run the first section to see what will be deleted:
- Students
- Applications
- Enrollments
- Student progress
- Quiz attempts

**Review the results carefully!**

#### Part 2: Delete (DELETE Queries)
Run the DELETE statements in order:
1. ✅ student_progress
2. ✅ quiz_attempts
3. ✅ enrollments
4. ✅ applications
5. ✅ students

#### Part 3: Verify (Final SELECT)
Run the verification queries at the end.
- Should return **0 rows** for both students
- Confirms deletion was successful

---

## 🎯 What Gets Deleted

### For Each Student:
- ❌ Student record
- ❌ All applications (pending, approved, rejected)
- ❌ All enrollments (active courses)
- ❌ All student progress (module completion)
- ❌ All quiz attempts and scores

### What's Preserved:
- ✅ Courses (not affected)
- ✅ Modules (not affected)
- ✅ Other students (James Von Willingh, etc.)

---

## ✅ After Deletion - Fresh Testing

### You Can Now Test:

1. **Submit Fresh Applications:**
   - https://vonwillingh-online-lms.pages.dev/apply
   - Use either email (or both):
     - lmsepg@mjgrealestate.co.za
     - vonwillinghc@gmail.com

2. **Test Email Workflow:**
   - ✅ Application received email
   - ✅ Application approved email
   - ✅ Payment verified email (with login credentials)
   - ✅ **Click "Login to Student Portal" button**
   - ✅ **Should go to production site with VonWillingh logo!**

3. **Verify Fixes:**
   - ✅ Email URLs point to production
   - ✅ VonWillingh logo displays correctly
   - ✅ No PBK branding anywhere
   - ✅ Login credentials work

---

## 🔍 Quick Verification Commands

### Check if students exist (should return 0 rows after deletion):
```sql
SELECT * FROM students 
WHERE email IN ('lmsepg@mjgrealestate.co.za', 'vonwillinghc@gmail.com');
```

### Count remaining students (should only show James):
```sql
SELECT count(*) as total_students, 
       string_agg(full_name, ', ') as student_names
FROM students;
```

---

## ⚠️ Important Notes

- **Deletion is permanent** - Cannot be undone
- **Run Step 1 first** - Preview before deleting
- **Foreign key order matters** - Script deletes in correct order
- **Safe for production** - Only deletes test accounts

---

## 📋 Deletion Order (Prevents Foreign Key Errors)

1. `student_progress` (depends on: students, modules)
2. `quiz_attempts` (depends on: students, quizzes)
3. `enrollments` (depends on: students, courses)
4. `applications` (depends on: students, courses)
5. `students` (last, after all dependencies removed)

---

## 🎉 Ready for Clean Testing!

After running this script, you'll have:
- ✅ Clean database (test accounts removed)
- ✅ Fresh start for testing
- ✅ Ability to test complete workflow
- ✅ Verify all fixes (email URLs, logo, etc.)

---

**Script Location:** `/home/user/webapp/delete_test_applications_both.sql`  
**Supabase SQL Editor:** https://supabase.com/dashboard/project/dgcobxtkzewzkrzpfcdr/sql/new  
**Commit:** 26fca82
