# 🎓 Quick Reference: VonWillingh Course Generator

## 📋 ESSENTIAL INFORMATION

### Course Database Schema (What the LMS Expects)

#### **COURSES Table**
```
Required Fields:
- id (integer, auto-generated)
- name (string) - Course title
- code (string) - Unique code like "DIGIMKT001"
- level (string) - Certificate, Diploma, Advanced Diploma, Bachelor
- category (string) - e.g., "Digital Marketing"
- description (text) - Course overview
- price (decimal) - In Rands, use 0 for FREE
- modules_count (integer) - Number of modules
- duration (string) - e.g., "4 weeks"

NOT in database (will be ignored):
- is_published (doesn't exist)
- semesters_count (doesn't exist)
- duration (stored in description only)
```

#### **MODULES Table**
```
Required Fields:
- id (integer, auto-generated)
- course_id (integer) - Links to course
- module_number (integer) - 1, 2, 3, etc.
- title (string) - Module title
- description (text) - Module summary
- content (text) - Full HTML content
- content_type (string) - "lesson", "video", "quiz"
- order_index (integer) - Same as module_number
- video_url (string, optional) - YouTube or video URL
- duration_minutes (integer, optional) - How long to complete

NOT in database (will be ignored):
- is_published (doesn't exist)
- resources (store in content instead)
```

#### **QUIZZES Table**
```
Required Fields:
- id (integer, auto-generated)
- module_id (integer) - Links to module
- passing_score (integer) - Default: 70
- max_attempts (integer) - Default: 3
- questions (jsonb) - Array of question objects
```

---

## 🎯 JSON STRUCTURE TEMPLATE

```json
{
  "course": {
    "name": "Course Name Here",
    "code": "UNIQUE001",
    "level": "Certificate",
    "category": "Category Name",
    "description": "Engaging description...",
    "duration": "X weeks",
    "price": 0
  },
  "modules": [
    {
      "title": "Module Title",
      "description": "Module summary",
      "order_number": 1,
      "content": "<h1>HTML Content Here</h1>",
      "content_type": "lesson",
      "video_url": "https://youtube.com/...",
      "duration_minutes": 30,
      "resources": ["Resource: URL"],
      "quiz": {
        "passing_score": 70,
        "max_attempts": 3,
        "questions": [
          {
            "id": 1,
            "question": "Question text?",
            "type": "multiple_choice",
            "options": ["A", "B", "C", "D"],
            "correct_answer": "A",
            "difficulty": "easy",
            "explanation": "Why A is correct..."
          }
        ]
      }
    }
  ]
}
```

---

## 🔑 API INTEGRATION

### Endpoint
```
POST https://vonwillingh-online-lms.pages.dev/api/courses/external-import
```

### Headers
```
Content-Type: application/json
X-API-Key: vonwillingh-lms-import-key-2026
```

### Success Response
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "course_id": 42,
    "course_url": "https://vonwillingh-online-lms.pages.dev/courses"
  }
}
```

---

## ✅ VALIDATION CHECKLIST

**Course Object:**
- [ ] `name` - Present and descriptive
- [ ] `code` - UPPERCASE + numbers (e.g., DIGIMKT001)
- [ ] `level` - One of: Certificate, Diploma, Advanced Diploma, Bachelor
- [ ] `category` - Descriptive category name
- [ ] `description` - 200-300 words
- [ ] `duration` - Format: "X weeks" or "X months"
- [ ] `price` - Number (0 for free, or amount in Rands)

**Module Objects:**
- [ ] `title` - Clear, descriptive
- [ ] `description` - 1-2 sentences
- [ ] `order_number` - Sequential: 1, 2, 3...
- [ ] `content` - HTML formatted (see formatting guide)
- [ ] `content_type` - Usually "lesson"
- [ ] `quiz` - Object with questions array

**Quiz Objects:**
- [ ] `passing_score` - Number (usually 70)
- [ ] `max_attempts` - Number (usually 3)
- [ ] `questions` - Array with 10 questions
- [ ] Each question has: id, question, type, options, correct_answer, difficulty, explanation

---

## 🎨 CONTENT FORMATTING RULES

### HTML Structure
```html
<!-- Hero Banner -->
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; border-radius: 12px; margin-bottom: 30px;">
  <h1>Module Title</h1>
</div>

<!-- Key Insight Box -->
<div style="background: #fff3e0; border: 2px solid #ff9800; padding: 20px; margin: 25px 0; border-radius: 8px;">
  <h4 style="color: #e65100;">💡 Key Insight</h4>
  <p>Important takeaway here...</p>
</div>

<!-- Case Study -->
<div style="background: white; border: 2px solid #2196f3; padding: 25px; border-radius: 10px; margin: 30px 0;">
  <h4>🏪 Real Success Story: Name - Location</h4>
  <p><strong>Before:</strong> Challenge</p>
  <p><strong>After:</strong> Results</p>
</div>
```

### Mobile-Friendly Rules
- Short paragraphs (2-4 sentences)
- Clear headings (H2, H3)
- Generous padding (20px minimum)
- No tiny text (16px minimum)
- High contrast colors

---

## 🇿🇦 SOUTH AFRICAN REQUIREMENTS

### Currency
- Always use **Rands (R)** - R150, R1,500, etc.
- Use R0 for free courses/tools

### Local Examples
**Cities:** Johannesburg, Cape Town, Durban, Pretoria, Soweto, Sandton
**Names:** Thabo, Nomsa, Sipho, Lerato, Zanele, Mandla
**Businesses:** Spaza shops, salons, hardware stores, consulting

### SA Companies
- Banks: Capitec, Standard Bank, ABSA, Nedbank, FNB
- Retailers: Checkers, Pick n Pay, Woolworths, Takealot
- Directories: Yellow Pages SA, Snupit, HelloPeter

---

## 📊 RECOMMENDED SPECIFICATIONS

| Aspect | Recommended Value |
|--------|-------------------|
| Modules per course | 4-8 modules |
| Questions per module | 10 questions |
| Quiz passing score | 70% |
| Quiz max attempts | 3 attempts |
| Content length | 1,500-2,500 words/module |
| Case studies | 2 per module |
| Resource links | 3-5 per module |
| Step-by-step guides | 1-2 per module |

---

## 🚀 IMPORT METHODS

### Method 1: Manual Import (Current)
1. Generate JSON in Course Creator
2. Download .json file
3. Go to VonWillingh LMS Admin → Import
4. Upload file
5. Select "Create New Course"
6. Click "Import"

### Method 2: API Import (Recommended)
1. Generate JSON in Course Creator
2. Click "Publish to LMS" button
3. App sends POST request to API
4. Course appears immediately in LMS
5. No downloads or uploads needed!

---

## ⚠️ COMMON ERRORS & FIXES

### Error: "Column 'is_published' does not exist"
**Fix:** Remove `is_published` from course and module objects

### Error: "Column 'semesters_count' does not exist"
**Fix:** Remove `semesters_count` from course object

### Error: "Invalid course code format"
**Fix:** Use only letters, numbers, dash, underscore (e.g., DIGIMKT001)

### Error: "Invalid level"
**Fix:** Use exactly: Certificate, Diploma, Advanced Diploma, or Bachelor

### Error: "Quiz question correct_answer doesn't match any option"
**Fix:** Ensure `correct_answer` is EXACTLY the same as one of the options (case-sensitive)

---

## 🎯 QUALITY STANDARDS

To compete with Articulate, Udemy, Coursera:

✅ **Storytelling:** Start with relatable scenarios
✅ **Visual Design:** Use colored boxes, gradients, icons
✅ **Practical Value:** Include step-by-step guides
✅ **South African Context:** 2+ local examples per module
✅ **Engagement:** Questions, challenges, action plans
✅ **Assessment:** 10 meaningful quiz questions
✅ **Resources:** 3-5 helpful links per module
✅ **Mobile-Optimized:** Short paragraphs, clear structure

---

## 📞 SUPPORT FILES

- **Full Prompt:** `COURSE_GENERATOR_PROMPT.md` (17 KB)
- **API Guide:** `API_IMPORT_GUIDE.md` (12 KB)
- **Example Course:** `AIFREE001_FINAL_FIX.json` (174 KB)
- **SQL Script:** `create_course_FINAL.sql` (11 KB)

---

## 🎉 SUCCESS METRICS

A great course should have:

- **Completion Rate:** 60%+ of students finish
- **Quiz Scores:** 75%+ average
- **Satisfaction:** "Better than paid courses"
- **Application:** Students implement within 1 week
- **Referrals:** Students recommend to others

---

**Remember:** Every course should make learners say: "This is worth way more than I paid!" 🚀
