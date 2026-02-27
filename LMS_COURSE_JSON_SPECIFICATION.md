# VonWillingh LMS Course JSON Specification
**Version 1.0 - Technical Blueprint for PBK LMS Integration**

This document provides the exact structure, rules, and examples for course JSON files that successfully import into VonWillingh LMS. Follow this specification to ensure 100% compatibility.

---

## 1. COURSE-LEVEL STRUCTURE

### Required Top-Level Structure
```json
{
  "course": { ... },
  "modules": [ ... ]
}
```

### Course Object Fields

| Field | Required | Type | Description | Constraints |
|-------|----------|------|-------------|-------------|
| `name` | **YES** | string | Full course name | Max 200 chars, no line breaks |
| `code` | **YES** | string | Unique course identifier | Alphanumeric + dashes/underscores only. Format: `[A-Z]{3,8}[0-9]{3}` (e.g., "AIFUND001") |
| `description` | **YES** | string | Course overview | Max 1000 chars |
| `level` | **YES** | string | Course level | Must be one of: "Certificate", "Diploma", "Advanced Diploma", "Bachelor" |
| `duration` | **YES** | string | Course length | Free text (e.g., "4 weeks", "6 months") |
| `price` | **YES** | number | Course cost | Positive number or 0 (free). No currency symbol in value |
| `currency` | optional | string | Price currency | Default: "ZAR". ISO 4217 code |
| `category` | optional | string | Course category | Default: "General". Examples: "Technology", "Business", "Marketing" |

### Validation Rules
- `code` **must be unique** across all courses
- If a course with the same `code` exists, the **entire course is replaced** (not merged)
- `price` must be parseable as a number (decimals allowed: 1500, 1500.00, 0)
- `name` and `description` support **emoji characters** ✅
- No HTML allowed in `name`, `description`, or `code` fields

### Example Course Object
```json
{
  "course": {
    "name": "Introduction to Artificial Intelligence Fundamentals",
    "code": "AIFUND001",
    "description": "A comprehensive introduction to AI fundamentals designed specifically for small business owners and entrepreneurs in South Africa.",
    "price": 1500,
    "currency": "ZAR",
    "level": "Certificate",
    "duration": "4 weeks",
    "category": "Technology"
  }
}
```

---

## 2. MODULE STRUCTURE

### Module Array
The `modules` field is an **array of module objects**, ordered by `order_number`.

### Module Object Fields

| Field | Required | Type | Description | Constraints |
|-------|----------|------|-------------|-------------|
| `title` | **YES** | string | Module name | Max 200 chars |
| `description` | **YES** | string | Module summary | Max 500 chars |
| `order_number` | **YES** | number | Module sequence | Integer ≥ 1, must be unique per course |
| `content` | **YES** | string | HTML content | Max ~50,000 chars (see HTML rules) |
| `duration_minutes` | optional | number | Reading time | Default: 45. Used for progress tracking |
| `has_quiz` | optional | boolean | Quiz present | Default: false. Set `true` if `quiz` object exists |
| `quiz` | optional | object | Quiz data | See Quiz Structure section |

### Ordering Rules
- Modules are ordered **strictly by `order_number`**, not array position
- `order_number` must start at 1 and increment by 1 (no gaps: 1, 2, 3, not 1, 3, 5)
- If `order_number` values are not sequential, import will fail

### Content Field (HTML)
- Maximum recommended size: **50,000 characters** per module
- Full HTML support with inline CSS
- Must be a **single string** (use `\n` for line breaks in JSON)
- JavaScript is **stripped** (no `<script>` tags)

### Example Module Object
```json
{
  "title": "Module 1: Introduction to AI for Small Business",
  "description": "Understand what AI is, dispel common myths, and discover practical applications.",
  "order_number": 1,
  "duration_minutes": 60,
  "content": "<div style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);'>...</div>",
  "has_quiz": true,
  "quiz": { ... }
}
```

---

## 3. QUIZ STRUCTURE

### Quiz Object Fields

| Field | Required | Type | Description | Constraints |
|-------|----------|------|-------------|-------------|
| `title` | **YES** | string | Quiz name | Max 200 chars |
| `description` | **YES** | string | Quiz instructions | Max 500 chars |
| `passing_score` | **YES** | number | Passing % | Integer 0-100 (e.g., 70 = 70%) |
| `max_attempts` | **YES** | number | Retry limit | Integer ≥ 1 (recommend: 3) |
| `time_limit_minutes` | **YES** | number | Quiz duration | Integer ≥ 1 (0 = unlimited) |
| `questions` | **YES** | array | Question list | Min 1, max 100 questions |

### Question Types Supported
1. **`multiple_choice`** - Single correct answer (A, B, C, D, E)
2. **`true_false`** - True or False questions
3. **`multiple_select`** - Multiple correct answers (A, B, C, etc.)

### Question Object Fields

| Field | Required | Type | Description | Constraints |
|-------|----------|------|-------------|-------------|
| `order_number` | **YES** | number | Question sequence | Integer ≥ 1, unique per quiz |
| `question_text` | **YES** | string | Question prompt | Max 1000 chars, **no HTML** |
| `question_type` | **YES** | string | Type of question | Must be: "multiple_choice", "true_false", or "multiple_select" |
| `points` | **YES** | number | Score weight | Integer ≥ 1 (typically 3-4) |
| `options` | **YES** (MC/MS) | array of strings | Answer choices | 2-5 options for MC, exactly 2 for TF, 3-5 for MS |
| `correct_answer` | **YES** (MC/TF) | string | Correct option | Letter ("A", "B", "C") or word ("True", "False") |
| `correct_answers` | **YES** (MS only) | array of strings | Multiple correct options | Array of letters: ["A", "B", "C"] |
| `difficulty` | optional | string | Question level | "easy", "medium", "hard" (not used in grading) |
| `explanation` | optional | string | Answer explanation | Max 500 chars, shown after submission |

### Answer Format Rules

#### For `multiple_choice`:
- `options`: Array of 2-5 strings
- `correct_answer`: Single letter (A, B, C, D, E) representing index position
  - "A" = first option (index 0)
  - "B" = second option (index 1)
  - "C" = third option (index 2), etc.

#### For `true_false`:
- `options`: **Must be exactly** `["True", "False"]` (in this order)
- `correct_answer`: String "True" or "False" (**not** letters!)
- Case-sensitive: Use capital T and F

#### For `multiple_select`:
- `options`: Array of 3-5 strings
- `correct_answers`: Array of letters (e.g., `["A", "C", "D"]`)
- Must have at least 2 correct answers
- Order of letters in array doesn't matter

### Quiz Scoring
- **Total Points** = Sum of all `points` values across all questions
- **Passing Score** = `(total_points * passing_score / 100)`
- Example: 30 questions × 3 points each = 90 total, 70% passing = 63 points minimum
- **Important**: True/false questions were broken in earlier versions - they now work correctly if you use `"True"/"False"` as `correct_answer`

### Example Quiz Object
```json
{
  "title": "Module 1 Assessment Quiz",
  "description": "Test your understanding of AI fundamentals.",
  "passing_score": 70,
  "max_attempts": 3,
  "time_limit_minutes": 45,
  "questions": [
    {
      "order_number": 1,
      "question_text": "What is the primary purpose of AI in small business?",
      "question_type": "multiple_choice",
      "points": 3,
      "options": [
        "To replace all human employees",
        "To automate repetitive tasks and improve decision-making",
        "To create humanoid robots"
      ],
      "correct_answer": "B"
    },
    {
      "order_number": 2,
      "question_text": "AI is designed to completely replace humans.",
      "question_type": "true_false",
      "points": 3,
      "correct_answer": "False"
    },
    {
      "order_number": 3,
      "question_text": "Which AI applications are mentioned for retail? (Select all)",
      "question_type": "multiple_select",
      "points": 4,
      "options": [
        "Personalized recommendations",
        "Chatbots",
        "Inventory forecasting",
        "Tax filing"
      ],
      "correct_answers": ["A", "B", "C"]
    }
  ]
}
```

---

## 4. IMPORT PROCESS & API

### API Endpoint
```
POST https://vonwillingh-online-lms.pages.dev/api/courses/external-import
```

### HTTP Method
**POST** (not PUT or PATCH)

### Headers Required
```http
Content-Type: application/json
X-API-Key: vonwillingh-lms-import-key-2026
```

### Authentication
- API Key: `vonwillingh-lms-import-key-2026` (default)
- Sent in header: `X-API-Key`
- **Important**: This key should be stored in environment variable `COURSE_IMPORT_API_KEY`
- Unauthorized requests return `401 Unauthorized` with error code `INVALID_API_KEY`

### Import Behavior
- **REPLACE, not MERGE**: If a course with the same `code` exists, it is **fully deleted and recreated**
- **Atomic operation**: Either the entire import succeeds, or it fails with no changes
- **No partial imports**: If module 3 fails, modules 1-2 are not imported

### File Size Limits
- Maximum JSON file size: **10 MB** (recommended: < 1 MB)
- Maximum content per module: **50,000 characters**
- Maximum total course size: ~100,000 characters across all modules

### Response Format

**Success (200 OK):**
```json
{
  "success": true,
  "message": "Course imported successfully",
  "course": {
    "id": 35,
    "name": "Introduction to AI Fundamentals",
    "code": "AIFUND001",
    "modules_count": 2
  }
}
```

**Error (400/401/500):**
```json
{
  "success": false,
  "message": "Missing required course fields: duration",
  "error": "MISSING_COURSE_FIELDS",
  "missing_fields": ["duration"]
}
```

### Error Codes
| Code | HTTP | Meaning |
|------|------|---------|
| `INVALID_API_KEY` | 401 | Missing or incorrect API key |
| `INVALID_DATA_STRUCTURE` | 400 | Missing `course` or `modules` fields |
| `MISSING_COURSE_FIELDS` | 400 | Required course field(s) missing |
| `INVALID_COURSE_CODE` | 400 | Code format invalid |
| `INVALID_COURSE_LEVEL` | 400 | Level not in allowed list |
| `INVALID_PRICE` | 400 | Price not a positive number |
| `MISSING_MODULE_FIELDS` | 400 | Required module field(s) missing |
| `INVALID_ORDER_NUMBER` | 400 | order_number not sequential |
| `QUIZ_VALIDATION_ERROR` | 400 | Quiz structure invalid |

---

## 5. CONTENT & HTML RULES

### Supported HTML Tags
✅ **Fully supported:**
- All text tags: `<h1>` to `<h6>`, `<p>`, `<span>`, `<div>`, `<strong>`, `<em>`, `<u>`, `<br>`
- Lists: `<ul>`, `<ol>`, `<li>`
- Tables: `<table>`, `<tr>`, `<td>`, `<th>`, `<thead>`, `<tbody>`
- Media: `<img>`, `<video>`, `<audio>` (with src URLs)
- Links: `<a href="...">`
- Semantic: `<section>`, `<article>`, `<aside>`, `<header>`, `<footer>`

### Blocked/Stripped HTML
❌ **Not allowed (stripped on save):**
- `<script>` tags and inline `onclick`/`onload` handlers
- `<iframe>` tags (security risk)
- `<form>`, `<input>`, `<button>` with actions
- `<object>`, `<embed>` tags

### Inline CSS Support
✅ **Fully supported:**
```html
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; color: white;">
  <h1 style="margin: 0; font-size: 2.5em;">Module Title</h1>
</div>
```

✅ **All CSS properties work**, including:
- Gradients: `linear-gradient()`, `radial-gradient()`
- Flexbox: `display: flex`, `justify-content`, etc.
- Grid: `display: grid`, `grid-template-columns`, etc.
- Animations: `@keyframes` not supported, but `transition` works
- Shadows: `box-shadow`, `text-shadow`
- Borders: `border-radius`, `border`, `outline`

### External CSS & JavaScript
❌ **Not supported:**
- `<link rel="stylesheet">` tags are stripped
- External JS libraries (jQuery, Bootstrap, etc.) not available
- Must use inline styles only

### Emoji Support
✅ **Fully supported** in all text fields:
```json
{
  "title": "Module 1: Introduction to AI 🤖",
  "description": "Learn AI basics! 🎯📚"
}
```

### Character Encoding
- UTF-8 encoding required
- Unicode characters supported (including Chinese, Arabic, emoji)
- Line breaks: Use `\n` in JSON strings (converted to `<br>` in display)

### Maximum Content Length
| Field | Max Characters | Notes |
|-------|----------------|-------|
| Module `content` | 50,000 | Recommended limit for performance |
| Course `description` | 1,000 | Hard limit |
| Module `title` | 200 | Hard limit |
| Quiz `question_text` | 1,000 | No HTML allowed |
| Quiz `explanation` | 500 | Displayed after quiz |

---

## 6. QUIZ BEHAVIOR & TIMING

### Reading Timer
- **30-minute minimum reading time** before quiz unlock
- Timer is **client-side** (stored in browser localStorage)
- Timer starts when student first opens the module
- Timer continues even if student leaves and returns
- **Scroll tracking**: Student must scroll to bottom of content **AND** wait 30 minutes

### Quiz Unlock Conditions
Both must be true:
1. ✅ 30 minutes elapsed since first module view
2. ✅ Student scrolled to bottom of content (tracked via scroll position)

### Passing Score Interpretation
- Stored as **integer percentage** (e.g., 70 = 70%, not 0.7)
- Calculated as: `(student_score / total_points) * 100`
- Example: Student scores 75/90 points = 83.3% (pass if threshold ≤ 83)

### Max Attempts Enforcement
- Enforced **per student account** (not per session)
- Attempts tracked in database: `quiz_attempts` table
- After max attempts, quiz is locked (student cannot retake)
- Attempts counter resets if instructor manually resets progress

### Time Limit Enforcement
- **Server-side** validation (cannot be bypassed)
- Timer stored in database: `quiz_attempts.started_at`
- When student submits, server checks: `(submitted_at - started_at) <= time_limit_minutes`
- If exceeded, submission rejected with error: "Time limit exceeded"

### Progression Rules
- **Module 2+ are locked** until previous module's quiz is passed
- Student can **view** all modules, but cannot **start** locked ones
- Locked modules show: 🔒 icon and "Complete previous module's quiz to unlock"
- First module (order_number = 1) is always unlocked

---

## 7. FULL WORKING EXAMPLE

### Complete Minimal Course JSON
```json
{
  "course": {
    "name": "Introduction to Artificial Intelligence Fundamentals",
    "code": "AIFUND001",
    "description": "A comprehensive introduction to AI fundamentals designed specifically for small business owners and entrepreneurs in South Africa. Learn practical AI applications, understand key concepts, and discover how to leverage AI tools to grow your business.",
    "price": 1500,
    "currency": "ZAR",
    "level": "Certificate",
    "duration": "4 weeks",
    "category": "Technology"
  },
  "modules": [
    {
      "title": "Module 1: Introduction to AI for Small Business",
      "description": "Understand what AI is, dispel common myths, and discover practical applications for small businesses.",
      "order_number": 1,
      "duration_minutes": 60,
      "content": "<div style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 12px; color: white; margin-bottom: 30px;'><h1 style='margin: 0; font-size: 2.5em;'>Module 1: Introduction to AI</h1></div><div style='background: white; padding: 30px;'><h2>What is AI?</h2><p>Artificial Intelligence (AI) is the simulation of human intelligence by computer systems...</p></div>",
      "has_quiz": true,
      "quiz": {
        "title": "Module 1 Assessment Quiz",
        "description": "Test your understanding of AI fundamentals. 3 questions, 70% to pass.",
        "passing_score": 70,
        "max_attempts": 3,
        "time_limit_minutes": 15,
        "questions": [
          {
            "order_number": 1,
            "question_text": "What is the primary purpose of AI in small business contexts?",
            "question_type": "multiple_choice",
            "points": 3,
            "options": [
              "To replace all human employees",
              "To automate repetitive tasks and improve decision-making",
              "To create humanoid robots"
            ],
            "correct_answer": "B"
          },
          {
            "order_number": 2,
            "question_text": "AI is designed to completely replace human employees in small businesses.",
            "question_type": "true_false",
            "points": 3,
            "correct_answer": "False"
          },
          {
            "order_number": 3,
            "question_text": "Which AI applications are specifically mentioned for retail? (Select all that apply)",
            "question_type": "multiple_select",
            "points": 4,
            "options": [
              "Personalized product recommendations",
              "Chatbots for customer service",
              "Inventory forecasting",
              "Automated tax filing"
            ],
            "correct_answers": ["A", "B", "C"]
          }
        ]
      }
    }
  ]
}
```

### Import Command (cURL)
```bash
curl -X POST https://vonwillingh-online-lms.pages.dev/api/courses/external-import \
  -H "Content-Type: application/json" \
  -H "X-API-Key: vonwillingh-lms-import-key-2026" \
  --data @course.json
```

### Expected Response
```json
{
  "success": true,
  "message": "Course imported successfully with 1 module(s)",
  "course": {
    "id": 35,
    "name": "Introduction to Artificial Intelligence Fundamentals",
    "code": "AIFUND001",
    "modules_count": 1
  }
}
```

---

## 8. KNOWN ISSUES & TIPS

### ⚠️ Common Mistakes

1. **True/False Questions**
   - ❌ WRONG: `"correct_answer": "B"` (letter)
   - ✅ CORRECT: `"correct_answer": "False"` (word)
   - Must use `"True"` or `"False"` exactly (capital T/F)

2. **Multiple Select Questions**
   - ❌ WRONG: `"correct_answer": "A"` (single letter)
   - ✅ CORRECT: `"correct_answers": ["A", "B"]` (array, plural field name)

3. **Order Numbers**
   - ❌ WRONG: Modules ordered 1, 3, 5 (gaps)
   - ✅ CORRECT: Modules ordered 1, 2, 3 (sequential)

4. **Quiz Array**
   - ❌ WRONG: `"quiz": { "questions": [] }` (empty array)
   - ✅ CORRECT: Either omit `quiz` field entirely, or include ≥1 question

5. **Content with JavaScript**
   - ❌ WRONG: `<script>alert('Hi')</script>` (stripped)
   - ✅ CORRECT: Use inline CSS for styling, no JS needed

6. **Course Code Reuse**
   - ⚠️ **WARNING**: Using the same `code` will **DELETE and REPLACE** the entire existing course
   - Enrolled students lose progress if course is replaced
   - Use versioned codes for updates: `AIFUND001`, `AIFUND002`, etc.

### 💡 Best Practices

1. **Content Formatting**
   - Use inline CSS liberally for styling
   - Test HTML rendering in browser before import
   - Keep module content < 30,000 chars for fast loading

2. **Quiz Design**
   - Mix question types: 50% MC, 30% TF, 20% MS
   - Typical points: 3 for MC/TF, 4 for MS
   - Set passing score: 70% for certificate courses, 80% for advanced

3. **Module Progression**
   - Always include quizzes for sequential learning
   - Set reasonable passing scores (not 100%)
   - Allow 3 attempts minimum

4. **Testing Before Production**
   - Import to test course code first (e.g., `TEST001`)
   - Have a student test the quiz flow
   - Check mobile rendering
   - Verify all content displays correctly

5. **File Management**
   - Keep one JSON file per course
   - Version control your JSON files
   - Store images on CDN, link via `<img src="https://...">`

### 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Import returns 401 | Check API key in `X-API-Key` header |
| True/False questions always wrong | Use `"True"/"False"` not `"A"/"B"` |
| Module 2 not showing | Check `order_number` is 2, not 1 again |
| Content not displaying | HTML might be invalid; validate first |
| Quiz locked immediately | Check `has_quiz` is `true` |
| Students can't access Module 2 | They must pass Module 1 quiz first |

---

## 9. VALIDATION CHECKLIST

Before importing, verify:

**Course Level:**
- ✅ `course.code` is unique and alphanumeric
- ✅ `course.level` is one of: Certificate, Diploma, Advanced Diploma, Bachelor
- ✅ `course.price` is a number ≥ 0
- ✅ All required fields present: name, code, description, level, duration, price

**Modules Level:**
- ✅ `modules` is an array with ≥ 1 module
- ✅ Each module has: title, description, order_number, content
- ✅ `order_number` values are sequential: 1, 2, 3, ...
- ✅ Content is valid HTML (no unclosed tags)
- ✅ Content length < 50,000 chars

**Quiz Level (if present):**
- ✅ `quiz.questions` has ≥ 1 question
- ✅ Each question has: order_number, question_text, question_type, points, correct_answer(s)
- ✅ True/False questions use `"True"/"False"` as correct_answer
- ✅ Multiple Select questions use `correct_answers` (plural) array
- ✅ `passing_score` is 0-100
- ✅ `time_limit_minutes` is ≥ 1

---

## 10. APPENDIX: TECHNICAL DETAILS

### Database Schema (Reference)

**Courses Table:**
```sql
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  level VARCHAR(50) NOT NULL,
  category VARCHAR(100),
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'ZAR',
  duration VARCHAR(100),
  modules_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Modules Table:**
```sql
CREATE TABLE modules (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  module_number INTEGER NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  content TEXT,
  content_type VARCHAR(50) DEFAULT 'lesson',
  duration_minutes INTEGER DEFAULT 45,
  order_index INTEGER NOT NULL,
  video_url VARCHAR(500),
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Quizzes Table:**
```sql
CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY,
  module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  passing_score INTEGER NOT NULL,
  time_limit_minutes INTEGER NOT NULL,
  max_attempts INTEGER DEFAULT 3,
  total_points INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Questions Table:**
```sql
CREATE TABLE quiz_questions (
  id SERIAL PRIMARY KEY,
  quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50) NOT NULL,
  points INTEGER NOT NULL,
  difficulty VARCHAR(20),
  explanation TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Import Process Flow
1. Validate API key
2. Parse JSON body
3. Validate course structure
4. Check if course code exists
5. If exists: DELETE old course (CASCADE deletes modules, quizzes, questions)
6. INSERT new course
7. For each module:
   - INSERT module
   - If has quiz:
     - INSERT quiz
     - INSERT questions
     - INSERT question options
8. Return success response

---

## CONCLUSION

This specification is based on the **actual working implementation** of AIFUND001 with Modules 1 and 2, successfully imported and tested on VonWillingh LMS.

**Key Takeaways for PBK LMS:**
1. Use the exact field names shown
2. Follow the answer format rules (especially True/False)
3. Support full HTML with inline CSS
4. Implement replace-on-import (not merge)
5. Validate all fields before database insert
6. Support module progression locking

**Test File:** Use `AIFUND001-COMPLETE-WITH-FULL-MODULE2.json` as your reference implementation.

**Questions?** Contact VonWillingh LMS technical team with this document as reference.

---

**Document Version:** 1.0  
**Last Updated:** 2026-02-26  
**Based on:** VonWillingh LMS v2024.1 (live production system)  
**Test Course:** AIFUND001 (Course ID: 35)  
**API Endpoint:** https://vonwillingh-online-lms.pages.dev/api/courses/external-import
