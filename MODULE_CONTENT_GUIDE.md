# Module Content Deployment Guide

## 📚 What You Have Now

### Module Learning Content ✅
- **File:** `CREATE_LEADERSHIP_COURSE_MODULES.sql`
- **Contains:** Full learning content for Module 1 & 2
- **Format:** Rich HTML with headings, lists, tables, styled callouts

### Module Quiz Questions ✅
- **Module 1:** `SIMPLE_MODULE_1_QUIZ.sql` (30 questions)
- **Module 2:** `MODULE_2_QUIZ.sql` (30 questions)

---

## 🚀 Deployment Steps

### Step 1: Deploy Module Content (NEW!)

Run `CREATE_LEADERSHIP_COURSE_MODULES.sql` in Supabase SQL Editor

This will create:
- **Module 1: Introduction to Leadership** (45 min read)
  - Ubuntu philosophy
  - Leadership styles (Transformational, Transactional, Servant, Authentic)
  - Emotional Intelligence
  - Intergenerational leadership
  - Leading change in SA context

- **Module 2: Core Concepts in Leadership** (50 min read)
  - Team development stages (Tuckman)
  - Situational leadership
  - Path-Goal theory
  - Organizational culture (Schein)
  - Stakeholder management
  - LMX theory & Level 5 leadership
  - Learning organizations (Senge)
  - Change management (Kotter)
  - Diversity & inclusion
  - Virtual team leadership
  - Effective feedback (SBI model)

### Step 2: Update Module 1 Quiz Points

```sql
-- Set variable points by question type
UPDATE quiz_questions SET points = 2
WHERE question_type = 'true_false'
  AND module_id IN (SELECT id FROM modules WHERE title = 'Module 1: Introduction to Leadership');

UPDATE quiz_questions SET points = 3
WHERE question_type = 'single_choice'
  AND module_id IN (SELECT id FROM modules WHERE title = 'Module 1: Introduction to Leadership');

UPDATE quiz_questions SET points = 4
WHERE question_type = 'multiple_choice'
  AND module_id IN (SELECT id FROM modules WHERE title = 'Module 1: Introduction to Leadership');
```

### Step 3: Verify Module 1 (Already Deployed)

Quiz questions should already be in the database. If not, run:
`SIMPLE_MODULE_1_QUIZ.sql`

### Step 4: Deploy Module 2 Quiz

Run `MODULE_2_QUIZ.sql` in Supabase SQL Editor

---

## 📖 Module Content Structure

### Module 1: Introduction to Leadership

**Topics Covered:**
1. Ubuntu Leadership Philosophy
   - Collective responsibility & community building
   - Real impact: 40% higher engagement
2. Leadership Styles
   - Transformational, Transactional, Servant, Authentic
   - When to use each style
3. Emotional Intelligence (EQ)
   - 5 components: Self-awareness, Self-regulation, Motivation, Empathy, Social Skills
   - EQ accounts for 58% of job performance
4. Intergenerational Leadership
   - Baby Boomers, Gen X, Millennials, Gen Z
   - Communication strategies across generations
5. Leading Change in South Africa
   - Change management principles
   - Cultural sensitivity considerations

**Duration:** 45 minutes  
**Quiz:** 30 questions (pass = 70%)

---

### Module 2: Core Concepts in Leadership

**Topics Covered:**
1. Team Development (Tuckman's 5 Stages)
   - Forming, Storming, Norming, Performing, Adjourning
2. Situational Leadership
   - 4 styles: Directing, Coaching, Supporting, Delegating
3. Path-Goal Leadership Theory
   - How leaders influence performance
4. Organizational Culture
   - Schein's 3 levels: Artifacts, Values, Assumptions
5. Stakeholder Management
   - Power/Interest matrix
   - Engagement strategies
6. Leader-Member Exchange (LMX)
   - Avoiding in-group/out-group dynamics
7. Level 5 Leadership (Jim Collins)
   - Personal humility + Professional will
8. Learning Organizations (Peter Senge)
   - The 5 disciplines
9. Change Management (Kotter's 8 Steps)
10. Diversity & Inclusion Leadership
    - Implicit bias, social identity theory
11. Virtual/Hybrid Team Leadership
12. Effective Feedback (SBI Model)

**Duration:** 50 minutes  
**Quiz:** 30 questions (pass = 70%)

---

## 🎯 Content Features

### Visual Elements
- ✅ Styled callout boxes (statistics, warnings, tips)
- ✅ Tables for comparison matrices
- ✅ Bulleted and numbered lists
- ✅ Clear headings and sections
- ✅ Real-world SA examples

### Educational Design
- ✅ Progressive difficulty (Module 1 → Module 2)
- ✅ South African context throughout
- ✅ Ubuntu philosophy integration
- ✅ Practical examples and case studies
- ✅ Key takeaways at the end
- ✅ Quiz preparation guidance

---

## ✅ Verification Checklist

After running the SQL:

- [ ] Check Supabase `modules` table
- [ ] Verify Module 1 exists with content
- [ ] Verify Module 2 exists with content
- [ ] Both modules linked to correct course
- [ ] Content renders properly in module viewer
- [ ] Duration shows (45 min / 50 min)

---

## 📱 Student Learning Flow

```
1. Student enrolls in Leadership course
   ↓
2. Opens Module 1: Introduction to Leadership
   ↓
3. Reads 45-minute content
   ↓
4. Clicks "Start Quiz" button
   ↓
5. Answers 30 questions (mix of types)
   ↓
6. Submits quiz
   ↓
7. If pass (≥70%): Click "Close & Continue"
   ↓
8. Module marked complete
   ↓
9. Progress updates: "1 of 5 modules completed"
   ↓
10. Moves to Module 2 (repeat process)
```

---

## 🔧 Technical Details

### Database Fields

```sql
modules table:
- course_id (FK)
- module_number (1, 2, 3, etc.)
- title (e.g., "Module 1: Introduction to Leadership")
- description (short summary)
- content (full HTML content)
- content_type ('lesson')
- order_index (display order)
- duration (e.g., "45 minutes")
```

### HTML Content Format

- Valid HTML5
- Escaped single quotes (`''` instead of `'`)
- Inline CSS for styled callouts
- Responsive design-friendly
- Screen reader accessible

---

## 📝 Next Steps

1. **Run** `CREATE_LEADERSHIP_COURSE_MODULES.sql` in Supabase
2. **Update** Module 1 quiz points (run SQL from Step 2 above)
3. **Test** Module 1 end-to-end
4. **Deploy** Module 2 quiz (`MODULE_2_QUIZ.sql`)
5. **Test** Module 2 end-to-end
6. **Create** Modules 3, 4, 5 content and quizzes

---

## 🎓 Module 3, 4, 5 Planning

Based on the course structure, consider these topics:

**Module 3:** Leadership in Practice
- Decision-making frameworks
- Conflict resolution techniques
- Performance management
- Coaching and mentoring

**Module 4:** Strategic Leadership
- Vision and strategy development
- Innovation leadership
- Risk management
- Business acumen for leaders

**Module 5:** Personal Leadership Development
- Self-assessment and reflection
- Leadership development plan
- Continuous improvement
- Building your leadership brand

---

**Created:** 2026-02-09  
**File:** `CREATE_LEADERSHIP_COURSE_MODULES.sql`  
**Size:** 28 KB (705 lines)  
**Status:** Ready to deploy ✅
