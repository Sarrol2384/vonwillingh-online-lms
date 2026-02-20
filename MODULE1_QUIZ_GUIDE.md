# 📝 Module 1 Quiz Creation Guide

## ✅ SQL Script Created!

**File:** `/home/user/webapp/CREATE_MODULE1_QUIZ.sql`

This script creates a comprehensive 20-question quiz for **AIFUND001 - Module 1: Introduction to AI for Small Business**.

---

## 📊 Quiz Specifications

### Question Distribution:
- **Total Questions:** 20
- **Easy:** 8 questions (40%) 
- **Medium:** 9 questions (45%)
- **Hard:** 3 questions (15%)

### Quiz Settings:
- ✅ **Passing Score:** 70% (14 out of 20 correct)
- ✅ **Maximum Attempts:** 3
- ✅ **Time Limit:** 40 minutes
- ✅ **Question Order:** Sequential (1-20)
- ✅ **Answer Shuffling:** Yes (randomized for each student)
- ✅ **Immediate Grading:** Yes
- ✅ **Show Explanations:** After passing or after 3 attempts

### Grading Behavior:
- **≥70% (Passed):** Show score + correct answers + explanations
- **<70% (Failed):** Show score only, allow retry, NO correct answers
- **After 3 failures:** Show score + correct answers + explanations

---

## 🚀 How to Run the SQL Script

### Step 1: Find Module ID

1. **Open Supabase SQL Editor:**
   - https://supabase.com/dashboard/project/dgcobxtkzewzkrzpfcdr/sql/new

2. **Run this query to find the Module 1 ID:**
   ```sql
   SELECT 
       m.id as module_id,
       m.title,
       c.name as course_name,
       c.code as course_code
   FROM modules m
   JOIN courses c ON m.course_id = c.id
   WHERE m.title ILIKE '%Module 1%' 
     AND m.title ILIKE '%Introduction to AI%'
     AND c.code = 'AIFUND001'
   ORDER BY m.created_at DESC
   LIMIT 5;
   ```

3. **Copy the `module_id`** from the result (looks like: `a1b2c3d4-...`)

---

### Step 2: Replace Module ID in Script

1. **Open the SQL script:** `/home/user/webapp/CREATE_MODULE1_QUIZ.sql`

2. **Find and replace `{MODULE_ID}`** with the actual module ID from Step 1

   Example:
   ```sql
   -- Before:
   VALUES ('{MODULE_ID}', ...
   
   -- After (using your actual ID):
   VALUES ('a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6', ...
   ```

3. **Do a global find-replace:**
   - Find: `{MODULE_ID}`
   - Replace with: (your actual module ID)
   - Should replace it in all 20 INSERT statements

---

### Step 3: Run the INSERT Statements

1. **Copy all 20 INSERT statements** (QUESTION 1 through QUESTION 20)

2. **Paste into Supabase SQL Editor**

3. **Click "Run"**

4. **Verify success:**
   - Should show 20 successful inserts
   - No error messages

---

### Step 4: Verify Quiz Creation

Run this query to confirm:

```sql
SELECT 
    order_number,
    LEFT(question_text, 60) || '...' as question_preview,
    difficulty,
    correct_answer,
    created_at
FROM quiz_questions
WHERE module_id = 'YOUR_MODULE_ID_HERE'
ORDER BY order_number;
```

**Expected result:** 20 rows, numbered 1-20

---

### Step 5: Check Difficulty Distribution

```sql
SELECT 
    difficulty,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / 20, 1) || '%' as percentage
FROM quiz_questions
WHERE module_id = 'YOUR_MODULE_ID_HERE'
GROUP BY difficulty
ORDER BY 
    CASE difficulty 
        WHEN 'easy' THEN 1 
        WHEN 'medium' THEN 2 
        WHEN 'hard' THEN 3 
    END;
```

**Expected result:**
- easy: 8 (40.0%)
- medium: 9 (45.0%)
- hard: 3 (15.0%)

---

## 📝 Quiz Question Summary

### Questions 1-8: Easy (Questions 2, 4, 7, 9, 12, 14, 17, 19)
- Basic concepts and definitions
- Straightforward recall
- No complex analysis required

### Questions 9-17: Medium (Questions 1, 3, 6, 8, 10, 13, 15, 18, 20)
- Application of concepts
- Compare and contrast
- Some analysis required

### Questions 18-20: Hard (Questions 5, 11, 16)
- Complex scenarios
- Multiple concepts integration
- Deep analysis and reasoning

---

## 🎯 Quiz Topics Covered

1. **AI Fundamentals:** Russell & Norvig's framework, definitions
2. **Economic Impact:** McKinsey projections, ROI metrics
3. **Machine Learning Types:** Supervised, unsupervised, classifications
4. **AI Technologies:** NLP, Computer Vision, APIs
5. **Business Applications:** Chatbots, sentiment analysis, churn prediction
6. **Ethical Considerations:** Bias, fairness, POPIA compliance
7. **Implementation:** Best practices, common failures, ROI measurement
8. **Technical Concepts:** Training data, overfitting, validation

---

## 🎨 Visual Design (Already Implemented)

The quiz system already has the visual design you specified:

### Answer Options:
- ✅ Circular radio buttons
- ✅ Blue border (#667eea) on selection
- ✅ Green highlight for correct answers
- ✅ Red highlight for incorrect answers

### Difficulty Badges:
- ✅ Easy = Green badge
- ✅ Medium = Yellow badge
- ✅ Hard = Red badge

### Grading Display:
- ✅ Shows percentage: "80%"
- ✅ Shows fraction: "16/20"
- ✅ Shows explanations (when appropriate)

---

## 🧪 Testing the Quiz

### After Running SQL:

1. **Login as Student:**
   - https://vonwillingh-online-lms.pages.dev/student-login

2. **Enroll in AIFUND001 Course:**
   - Navigate to course
   - Open Module 1

3. **Start Quiz:**
   - Click "Start Quiz" button
   - Verify 20 questions load
   - Check that answers are shuffled

4. **Test Grading:**
   - **Test 1:** Answer 14+ correctly (≥70%)
     - Should show: Score + Correct Answers + Explanations
   
   - **Test 2:** Answer <14 correctly (<70%)
     - Should show: Score only
     - Should allow retry
     - Should NOT show correct answers
   
   - **Test 3:** Fail 3 times
     - Should show: Score + Correct Answers + Explanations

5. **Verify Visual Design:**
   - ✅ Difficulty badges show (green/yellow/red)
   - ✅ Radio buttons are circular
   - ✅ Selected answers have blue border
   - ✅ Correct answers highlighted green
   - ✅ Incorrect answers highlighted red

---

## 📋 Troubleshooting

### Issue: "Module not found"
**Solution:** Verify the module exists and you have the correct module_id

### Issue: "Duplicate key violation"
**Solution:** Questions already exist. Delete them first:
```sql
DELETE FROM quiz_questions 
WHERE module_id = 'YOUR_MODULE_ID';
```

### Issue: "Foreign key constraint"
**Solution:** The module_id doesn't exist. Create the module first.

### Issue: Questions don't appear in quiz
**Solution:** 
1. Check that module_id matches
2. Verify order_number is 1-20
3. Refresh browser cache

---

## ✅ Success Checklist

- [ ] Found Module 1 ID
- [ ] Replaced {MODULE_ID} in SQL script
- [ ] Ran all 20 INSERT statements successfully
- [ ] Verified 20 questions exist (SELECT query)
- [ ] Checked difficulty distribution (8/9/3)
- [ ] Tested quiz in student portal
- [ ] Verified grading behavior (pass/fail/3 attempts)
- [ ] Checked visual design (badges, colors, radio buttons)
- [ ] Confirmed answer shuffling works
- [ ] Verified explanations show correctly

---

## 📚 References in Quiz

All questions cite academic sources:
- Russell & Norvig (2020) - AI: A Modern Approach
- Goodfellow et al. (2016) - Deep Learning
- McKinsey Global Institute (2023) - AI State Reports
- Brynjolfsson & McAfee (2017) - Harvard Business Review
- Jurafsky & Martin (2023) - Speech and Language Processing
- IEEE (2019) - Ethically Aligned Design
- MIT Sloan (Ransbotham et al., 2020)
- South Africa POPIA (2021)

---

## 🎉 Quiz Creation Complete!

Once you've run the SQL script and verified the results, the quiz will be fully functional and ready for students!

**File Location:** `/home/user/webapp/CREATE_MODULE1_QUIZ.sql`  
**Supabase SQL Editor:** https://supabase.com/dashboard/project/dgcobxtkzewzkrzpfcdr/sql/new  
**Commit:** 641b5bd

---

**Ready to create quizzes for other modules? This same process can be repeated!** 🚀
