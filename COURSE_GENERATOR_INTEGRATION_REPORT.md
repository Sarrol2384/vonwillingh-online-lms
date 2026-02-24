# 📋 Course Generator Integration Report

## Date: 2026-02-22

---

## 🎯 Summary

The VonWillingh Online LMS has been updated to support full course imports with quiz questions. This report documents the **exact requirements** for the Course Generator to create compatible course JSON files.

---

## ✅ What's Working

1. **Course Import Endpoint**: `/api/courses/external-import` ✅
2. **Authentication**: X-API-Key header system ✅
3. **Module Content**: Rich HTML content imports successfully ✅
4. **Basic Course Metadata**: All fields validate and insert correctly ✅

---

## ⚠️ Recent Issues & Fixes

### Issue 1: Missing Database Columns
**Problem**: The `quiz_questions` table was missing required columns:
- `option_e` (for 5-option multiple_select questions)
- `points` (for question scoring)
- `order_number` (for question ordering)

**Status**: ✅ **FIXED** - Database schema updated with all required columns

**SQL Applied**:
```sql
ALTER TABLE quiz_questions ADD COLUMN IF NOT EXISTS option_e TEXT;
ALTER TABLE quiz_questions ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 5;
ALTER TABLE quiz_questions ADD COLUMN IF NOT EXISTS order_number INTEGER;
```

---

### Issue 2: Quiz Questions Not Inserting
**Problem**: Course imported successfully, but quiz questions count was 0

**Root Cause**: Database schema incompatibility - import code tried to insert columns that didn't exist

**Status**: ✅ **RESOLVED** - Schema updated, import code working

---

## 📝 Required JSON Structure for Course Generator

### Complete JSON Format

```json
{
  "course": {
    "name": "Course Title",
    "code": "COURSECODE001",
    "description": "Course description text",
    "price": 1500,
    "currency": "ZAR",
    "level": "Certificate",
    "duration": "4 weeks",
    "category": "Technology"
  },
  "modules": [
    {
      "title": "Module 1: Module Title",
      "description": "Module description",
      "order_number": 1,
      "duration_minutes": 60,
      "content": "<div>Rich HTML content here</div>",
      "has_quiz": true,
      "quiz": {
        "title": "Module 1 Assessment Quiz",
        "description": "Test your understanding",
        "passing_score": 70,
        "max_attempts": 3,
        "time_limit_minutes": 45,
        "questions": [
          {
            "order_number": 1,
            "question_text": "Question text here?",
            "question_type": "multiple_choice",
            "points": 3,
            "options": [
              "Option A text",
              "Option B text",
              "Option C text",
              "Option D text"
            ],
            "correct_answer": "B"
          }
        ]
      }
    }
  ]
}
```

---

## 🔑 Critical Field Requirements

### Course Level (MUST be one of these exactly)
- ✅ `"Certificate"`
- ✅ `"Diploma"`
- ✅ `"Advanced Diploma"`
- ✅ `"Bachelor"`
- ❌ NOT `"Beginner"` or any other value

### Module Fields (ALL REQUIRED)
- `title` (string)
- `description` (string)
- `order_number` (integer, starting from 1)
- `content` (string, HTML)
- `has_quiz` (boolean)
- `quiz` (object, required if has_quiz is true)

### Quiz Question Types

#### 1. Multiple Choice
```json
{
  "question_type": "multiple_choice",
  "points": 3,
  "options": ["A", "B", "C", "D"],
  "correct_answer": "B"
}
```
- **Exactly 4 options** (A, B, C, D)
- **Single correct answer** (letter: A, B, C, or D)

#### 2. True/False
```json
{
  "question_type": "true_false",
  "points": 3,
  "correct_answer": "True"
}
```
- **No options array** (automatically True/False)
- **Correct answer**: "True" or "False" (string, not boolean)

#### 3. Multiple Select
```json
{
  "question_type": "multiple_select",
  "points": 4,
  "options": ["A", "B", "C", "D", "E"],
  "correct_answers": ["A", "C", "E"]
}
```
- **Exactly 5 options** (A, B, C, D, E)
- **Multiple correct answers** (array of letters)
- **Note**: Uses `correct_answers` (plural) not `correct_answer`

---

## 📊 Recommended Quiz Distribution (30 questions)

| Type | Count | Points Each | Total Points |
|------|-------|-------------|--------------|
| Multiple Choice | 15 | 3 | 45 |
| True/False | 8 | 3 | 24 |
| Multiple Select | 7 | 4 | 28 |
| **TOTAL** | **30** | - | **97** |

**Passing Score**: 70% = 68 points minimum

---

## 🔌 API Integration Details

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
  "message": "Course \"Course Name\" created successfully with 1 modules",
  "data": {
    "course_id": 35,
    "course_name": "Course Name",
    "course_code": "COURSECODE001",
    "modules_count": 1,
    "price": 1500,
    "level": "Certificate",
    "duration": "4 weeks",
    "course_url": "https://vonwillingh-online-lms.pages.dev/courses"
  }
}
```

### Error Response Examples

#### Duplicate Course
```json
{
  "success": false,
  "message": "Course with code \"COURSECODE001\" already exists",
  "error": "COURSE_EXISTS",
  "existing_course": {
    "id": 35,
    "name": "Existing Course Name",
    "code": "COURSECODE001"
  }
}
```

#### Missing Required Fields
```json
{
  "success": false,
  "message": "Missing required course fields: duration",
  "error": "MISSING_COURSE_FIELDS",
  "missing_fields": ["duration"]
}
```

#### Invalid Course Level
```json
{
  "success": false,
  "message": "Course level must be one of: Certificate, Diploma, Advanced Diploma, Bachelor",
  "error": "INVALID_COURSE_LEVEL",
  "valid_levels": ["Certificate", "Diploma", "Advanced Diploma", "Bachelor"]
}
```

---

## 🚨 Common Mistakes to Avoid

### ❌ Wrong: Using "Beginner" as level
```json
{
  "course": {
    "level": "Beginner"  // ❌ WRONG
  }
}
```

### ✅ Correct: Use valid level
```json
{
  "course": {
    "level": "Certificate"  // ✅ CORRECT
  }
}
```

---

### ❌ Wrong: Missing order_number
```json
{
  "modules": [{
    "title": "Module 1",
    "order": 1  // ❌ WRONG field name
  }]
}
```

### ✅ Correct: Use order_number
```json
{
  "modules": [{
    "title": "Module 1",
    "order_number": 1  // ✅ CORRECT
  }]
}
```

---

### ❌ Wrong: Boolean for True/False answer
```json
{
  "question_type": "true_false",
  "correct_answer": true  // ❌ WRONG (boolean)
}
```

### ✅ Correct: String for True/False answer
```json
{
  "question_type": "true_false",
  "correct_answer": "True"  // ✅ CORRECT (string)
}
```

---

### ❌ Wrong: Multiple select with correct_answer (singular)
```json
{
  "question_type": "multiple_select",
  "correct_answer": "A,C,E"  // ❌ WRONG
}
```

### ✅ Correct: Multiple select with correct_answers (array)
```json
{
  "question_type": "multiple_select",
  "correct_answers": ["A", "C", "E"]  // ✅ CORRECT
}
```

---

## 🗄️ Database Schema (After Updates)

### quiz_questions Table
```sql
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL,  -- 'multiple_choice', 'true_false', 'multiple_select'
  option_a TEXT,
  option_b TEXT,
  option_c TEXT,
  option_d TEXT,
  option_e TEXT,                -- ✅ NEWLY ADDED (for multiple_select)
  correct_answer TEXT,          -- Single answer (A, B, C, D, E, True, False)
  points INTEGER DEFAULT 5,     -- ✅ NEWLY ADDED
  order_number INTEGER,         -- ✅ NEWLY ADDED
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Key Notes**:
- `option_e` is **optional** - only used for multiple_select questions
- `points` defaults to 5 if not provided
- `correct_answer` stores comma-separated values for multiple_select (e.g., "A,C,E")

---

## 🧪 Testing Checklist for Course Generator

Before sending a course JSON to the LMS, verify:

1. ✅ Course level is one of: Certificate, Diploma, Advanced Diploma, Bachelor
2. ✅ Course has `duration` field as string (e.g., "4 weeks")
3. ✅ All modules have `order_number` (integer, not `order`)
4. ✅ All modules have `content` field with HTML
5. ✅ Quiz has exactly 30 questions
6. ✅ Multiple choice questions have 4 options
7. ✅ Multiple select questions have 5 options
8. ✅ Multiple select uses `correct_answers` (array), not `correct_answer`
9. ✅ True/False questions use "True" or "False" strings, not booleans
10. ✅ All questions have `order_number` (1-30)
11. ✅ All questions have `points` field
12. ✅ Course code is unique and uses only letters, numbers, dashes, underscores

---

## 📞 Communication Protocol

### When Course Generator Creates a New Course:

1. **Generate JSON** following the exact format above
2. **Validate locally** against the checklist
3. **POST to endpoint** with proper headers
4. **Parse response**:
   - If `success: true` → Course created successfully
   - If `success: false` → Check error code and adjust

### Error Handling:

- `COURSE_EXISTS` → Use a different course code
- `MISSING_COURSE_FIELDS` → Add the missing fields
- `INVALID_COURSE_LEVEL` → Use one of the 4 valid levels
- `MISSING_MODULE_FIELDS` → Check which module is missing fields
- `INVALID_MODULE_ORDER` → Ensure order_number is a positive integer

---

## 🎓 Example: Complete Working Course JSON

See file: `AIFUND001-module1.json` for a complete working example with:
- ✅ Proper course metadata
- ✅ Rich HTML content (3,000+ words)
- ✅ 30 questions (15 MC, 8 TF, 7 MS)
- ✅ All required fields
- ✅ Correct field names and types
- ✅ Valid course level

---

## 🔄 Next Steps for Integration

1. **Course Generator** should update its templates to match this exact format
2. **Test with a sample course** (use AIFUND001 structure as reference)
3. **Implement validation** before sending to LMS
4. **Add error handling** for all error codes
5. **Log successful imports** for tracking

---

## 📊 Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Course Import API | ✅ Working | Fully functional |
| Quiz Question Insert | ✅ Fixed | Schema updated |
| Module Content | ✅ Working | HTML imports correctly |
| Validation | ✅ Working | All checks in place |
| Error Messages | ✅ Clear | Detailed error responses |
| Documentation | ✅ Complete | This document |

---

## 🤝 Collaboration Notes

**For Course Generator Team**:
- Use this document as the **single source of truth** for JSON format
- Test against the live endpoint: `https://vonwillingh-online-lms.pages.dev/api/courses/external-import`
- Report any issues or inconsistencies immediately
- Keep this document updated if requirements change

**For LMS Team** (me):
- Monitor import logs for errors
- Keep API stable and backward-compatible
- Update documentation when schema changes
- Provide clear error messages

---

## 📁 Reference Files

- `AIFUND001-module1.json` - Complete working example
- `FIX_QUIZ_SCHEMA_COMPLETE.sql` - Database schema updates
- `QUIZ_IMPORT_FIX_COMPLETE.md` - Technical fix documentation
- `CHECK_ACTUAL_SCHEMA.sql` - Schema verification query

---

## 🎯 Final Recommendations for Course Generator

### Do This:
✅ Use exact field names as documented (e.g., `order_number` not `order`)
✅ Use exact course levels (Certificate, Diploma, Advanced Diploma, Bachelor)
✅ Include `duration` as a string (e.g., "4 weeks")
✅ Use 4 options for multiple_choice, 5 for multiple_select
✅ Use `correct_answers` (array) for multiple_select
✅ Use string values for true_false: "True" or "False"
✅ Include `points` for each question
✅ Sequential `order_number` for questions (1, 2, 3, ... 30)

### Don't Do This:
❌ Don't use "Beginner" or custom level names
❌ Don't use `order` instead of `order_number`
❌ Don't skip the `duration` field
❌ Don't use boolean values for true_false answers
❌ Don't use `correct_answer` (singular) for multiple_select
❌ Don't skip `points` or `order_number` on questions

---

**End of Report**

*Generated: 2026-02-22*  
*Last Updated: After quiz schema fix*  
*Status: Complete and Ready for Integration*
