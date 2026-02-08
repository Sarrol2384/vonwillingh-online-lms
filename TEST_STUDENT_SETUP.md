# 🎓 CREATE TEST STUDENT - Complete Guide

## 🎯 TWO METHODS

---

## ✅ METHOD 1: Register via Web UI (SAFEST)

### **Step 1: Open Student Login Page**
```
https://vonwillingh-online-lms.pages.dev/student-login
```

### **Step 2: Register New Account**
Look for:
- "Register" button
- "Create Account" link
- "Sign Up" option

**If you see a registration form**, fill it in:
```
Name: Test Student
Email: teststudent@vonwillingh.co.za
Password: TestPass123!
Phone: +27123456789 (if required)
```

### **Step 3: Login**
After registration:
- Email: teststudent@vonwillingh.co.za
- Password: TestPass123!
- Click "Login"

### **Step 4: Explore Student Dashboard**
You should see:
- 📚 Available Courses
- 📝 My Applications
- 🎓 My Enrollments
- 📜 My Certificates

---

## ✅ METHOD 2: Create via SQL (IF UI DOESN'T WORK)

### **Step 1: Check students table schema**
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'students'
ORDER BY ordinal_position;
```

Run this first to see what columns exist!

### **Step 2: Create student account**

**IMPORTANT:** Don't run this yet! First, show me the schema from Step 1, then I'll give you the correct INSERT statement.

---

## 🎯 WHAT TO DO NOW

### **TRY METHOD 1 FIRST:**

1. **Open this URL:**
   ```
   https://vonwillingh-online-lms.pages.dev/student-login
   ```

2. **Take a screenshot** of what you see

3. **Look for:**
   - Registration/Sign Up option
   - Login form
   - Any errors

4. **Show me the screenshot**

---

## 🎯 IF REGISTRATION WORKS

After you register and login, you should see:

### **Student Dashboard with:**
- ✅ Your name displayed
- ✅ Navigation menu
- ✅ Available courses list
- ✅ Application status
- ✅ Enrolled courses

### **Then you can:**
- Browse available courses
- Apply for courses
- View course details (if route exists)
- See your applications
- Track enrollments

---

## 🎯 WHAT WE'LL TEST

Once you have a test student account, we can:
1. ✅ See what courses students can browse
2. ✅ Try applying for AIBIZ003 course
3. ✅ Check if course details show
4. ✅ See the full student experience
5. ✅ Identify what needs improvement

---

## 🎯 NEXT STEPS

### **RIGHT NOW:**

1. **Open:** https://vonwillingh-online-lms.pages.dev/student-login
2. **Screenshot** what you see
3. **Try to register** or tell me if there's no registration option
4. **Show me** the results

### **THEN:**

If registration doesn't work:
- I'll check the students table schema
- I'll create a proper SQL INSERT statement
- We'll create the account via database

If registration works:
- You login as test student
- You explore the student dashboard
- We see what students actually see
- We identify improvements needed

---

## 📸 SCREENSHOT REQUEST

**Open the student login page now and show me what you see!**

```
https://vonwillingh-online-lms.pages.dev/student-login
```

Then we'll proceed based on what's available! 🚀
