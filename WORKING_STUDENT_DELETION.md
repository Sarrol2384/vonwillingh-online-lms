# ✅ WORKING STUDENT DELETION SQL - USE THIS FORMAT

## 🎯 CORRECT ORDER AND FORMAT

**Run each statement ONE BY ONE in this exact order:**

```sql
-- 1. Delete applications
DELETE FROM applications
WHERE student_id IN (
    SELECT id FROM students 
    WHERE email IN ('email1@example.com', 'email2@example.com', 'email3@example.com')
);

-- 2. Delete enrollments
DELETE FROM enrollments
WHERE student_id IN (
    SELECT id FROM students 
    WHERE email IN ('email1@example.com', 'email2@example.com', 'email3@example.com')
);

-- 3. Delete quiz attempts
DELETE FROM quiz_attempts
WHERE student_id IN (
    SELECT id FROM students 
    WHERE email IN ('email1@example.com', 'email2@example.com', 'email3@example.com')
);

-- 4. Delete student progress
DELETE FROM student_progress
WHERE student_id IN (
    SELECT id FROM students 
    WHERE email IN ('email1@example.com', 'email2@example.com', 'email3@example.com')
);

-- 5. Delete module progress
DELETE FROM module_progress
WHERE student_id IN (
    SELECT id FROM students 
    WHERE email IN ('email1@example.com', 'email2@example.com', 'email3@example.com')
);

-- 6. Delete module content completion
DELETE FROM module_content_completion
WHERE student_id IN (
    SELECT id FROM students 
    WHERE email IN ('email1@example.com', 'email2@example.com', 'email3@example.com')
);

-- 7. FINALLY - Delete the students
DELETE FROM students
WHERE email IN ('email1@example.com', 'email2@example.com', 'email3@example.com');
```

## ⚠️ IMPORTANT NOTES

1. **Run statements ONE BY ONE** - Don't run all together
2. **If a statement fails, skip it** - Some tables might be empty
3. **Always do students LAST** - They have foreign key dependencies
4. **Use this exact format** - Simple IN clause with subquery

## 📋 TEMPLATE FOR QUICK USE

```sql
DELETE FROM applications WHERE student_id IN (SELECT id FROM students WHERE email IN ('EMAIL_HERE'));
DELETE FROM enrollments WHERE student_id IN (SELECT id FROM students WHERE email IN ('EMAIL_HERE'));
DELETE FROM quiz_attempts WHERE student_id IN (SELECT id FROM students WHERE email IN ('EMAIL_HERE'));
DELETE FROM student_progress WHERE student_id IN (SELECT id FROM students WHERE email IN ('EMAIL_HERE'));
DELETE FROM module_progress WHERE student_id IN (SELECT id FROM students WHERE email IN ('EMAIL_HERE'));
DELETE FROM module_content_completion WHERE student_id IN (SELECT id FROM students WHERE email IN ('EMAIL_HERE'));
DELETE FROM students WHERE email IN ('EMAIL_HERE');
```

## ✅ VERIFIED WORKING

This format has been tested and works. Do NOT use:
- ❌ DO blocks with loops
- ❌ Payments table joins (causes errors)
- ❌ student_sessions table (doesn't exist)
- ❌ Certificates table (doesn't exist)

Just use the simple format above!
