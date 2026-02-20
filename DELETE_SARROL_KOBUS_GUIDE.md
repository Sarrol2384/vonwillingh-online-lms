# 🗑️ Delete Sarrol and Kobus Students - Quick Reference

## 📄 SQL Script Created

**File:** `/home/user/webapp/delete_sarrol_kobus_students.sql`

---

## 🎯 Students to be Deleted:

1. **Sarrol Von Willingh**
   - ID: `8ca011fc-5d52-43b1-8fce-8f58f6f782f4`
   - Email: `vonwillinghc@gmail.com`
   - Phone: 0815163529

2. **Kobus Von Willingh**
   - ID: `edce4e2c-d810-4d31-9d13-fef94e7f17e9`
   - Email: `mandatetracker@mjgrealestate.co.za`
   - Phone: 0219492534

---

## 🚀 How to Run

### Step 1: Open Supabase SQL Editor
🔗 https://supabase.com/dashboard/project/dgcobxtkzewzkrzpfcdr/sql/new

### Step 2: Copy the SQL Script
From: `/home/user/webapp/delete_sarrol_kobus_students.sql`

### Step 3: Run in 3 Parts

#### Part 1: Preview ✅
Run the SELECT queries to see what will be deleted:
- Shows student details
- Shows all applications
- Shows all enrollments
- Shows progress and quiz attempts

**Review carefully before proceeding!**

#### Part 2: Delete ⚠️
Run the DELETE statements in order:
```sql
DELETE FROM student_progress WHERE student_id IN (...);
DELETE FROM quiz_attempts WHERE student_id IN (...);
DELETE FROM enrollments WHERE student_id IN (...);
DELETE FROM applications WHERE student_id IN (...);
DELETE FROM students WHERE id IN (...);
```

#### Part 3: Verify ✅
Run the verification queries:
- Should show 0 students with those IDs
- Shows list of remaining students

---

## ✅ What Gets Deleted

For each student:
- ❌ Student record
- ❌ All applications (any status)
- ❌ All enrollments (if any)
- ❌ All student progress
- ❌ All quiz attempts

---

## 🎉 After Deletion

You'll have a clean slate for testing:
- ✅ Ready for fresh applications
- ✅ Test complete workflow
- ✅ Verify all fixes (logo, email URLs, etc.)

---

## 🔍 Quick Check Queries

### Check if students still exist (should be 0):
```sql
SELECT * FROM students 
WHERE id IN (
    '8ca011fc-5d52-43b1-8fce-8f58f6f782f4',
    'edce4e2c-d810-4d31-9d13-fef94e7f17e9'
);
```

### List all remaining students:
```sql
SELECT id, full_name, email, created_at 
FROM students 
ORDER BY created_at DESC;
```

---

## ⚠️ Important Notes

- **Deletion is permanent** - Cannot be undone
- **Run Preview first** - Always check Step 1 before Step 2
- **Foreign key safe** - Script deletes in correct order
- **Only affects these 2 students** - Other data is safe

---

## 📋 Next Steps After Deletion

1. **Submit fresh applications:**
   - https://vonwillingh-online-lms.pages.dev/apply

2. **Test complete workflow:**
   - Application submission ✅
   - Admin approval ✅
   - Payment upload ✅
   - Payment verification ✅
   - Student login ✅

3. **Verify all fixes:**
   - VonWillingh logo (not PBK) ✅
   - Email URLs to production ✅
   - Payment page works ✅
   - Login credentials work ✅

---

**Script Location:** `/home/user/webapp/delete_sarrol_kobus_students.sql`  
**Supabase SQL Editor:** https://supabase.com/dashboard/project/dgcobxtkzewzkrzpfcdr/sql/new  
**Commit:** 303596e

---

**Ready to clean up and start fresh testing!** 🚀
