# 🎓 CREATING TEST STUDENT ACCOUNT

## 🎯 METHOD 1: Register via UI (RECOMMENDED)

### **Step 1: Go to Student Login Page**
```
https://vonwillingh-online-lms.pages.dev/student-login
```

### **Step 2: Look for "Register" or "Create Account"**
- There should be a link/button to register
- Click it to open registration form

### **Step 3: Fill Registration Form**
```
Name: Test Student
Email: test.student@vonwillingh.co.za
Password: TestPass123!
Phone: +27 123456789 (optional)
```

### **Step 4: Submit & Login**
- Register
- Login with the credentials above
- See student dashboard

---

## 🎯 METHOD 2: Direct SQL Insert (FASTER!)

If the registration page doesn't work, I can create the account directly in the database:

```sql
-- Create test student account
INSERT INTO students (
  name, 
  email, 
  password_hash,
  phone,
  created_at
) VALUES (
  'Test Student',
  'test.student@vonwillingh.co.za',
  -- This is a hashed password for: TestPass123!
  -- (You'll need to hash it properly or use plain text for testing)
  'hashed_password_here',
  '+27 123456789',
  NOW()
);

-- Get the student ID
SELECT id, name, email FROM students 
WHERE email = 'test.student@vonwillingh.co.za';
```

---

## 🎯 WHAT TO DO FIRST

Let me check if the student-login route exists:
