# LMS Course JSON Structure - Rules & Guidelines

## ✅ PROVEN STRUCTURE (Based on TEST_COURSE_IMPORT.json that worked)

### Basic Structure
```json
{
  "course": {
    "name": "Course Name",
    "code": "COURSECODE",
    "level": "Certificate",
    "category": "Category Name",
    "description": "Course description",
    "duration": "X weeks",
    "price": 0
  },
  "modules": [
    {
      "title": "Module Title",
      "description": "Module description",
      "order_number": 1,
      "content": "HTML CONTENT HERE",
      "content_type": "lesson",
      "video_url": "",
      "duration_minutes": 60,
      "resources": [
        "Resource 1: https://example.com",
        "Resource 2: https://example.com"
      ],
      "quiz": {
        "passing_score": 70,
        "max_attempts": 3,
        "questions": [
          {
            "id": 1,
            "question": "Question text?",
            "type": "multiple_choice",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "correct_answer": "Option 1",
            "difficulty": "easy",
            "explanation": "Explanation text"
          }
        ]
      }
    }
  ]
}
```

---

## 🚨 CRITICAL RULES

### ✅ DO:
1. **HTML Quotes**: Use SINGLE quotes `'` for ALL HTML attributes
   - ✅ `<div style='color: red;'>`
   - ❌ `<div style="color: red;">`

2. **Content Format**: Single long string (no line breaks in JSON)
   - ✅ `"content": "<div>...</div><p>...</p>"`
   - ❌ `"content": "<div>...\n</div>\n<p>...</p>"`

3. **Required Fields**:
   - Course: `name`, `code`, `level`, `category`, `description`, `duration`, `price`
   - Module: `title`, `description`, `order_number`, `content`, `content_type`, `video_url`, `duration_minutes`
   - Quiz: `passing_score`, `max_attempts`, `questions`
   - Question: `id`, `question`, `type`, `options`, `correct_answer`, `difficulty`, `explanation`

4. **Field Names**:
   - ✅ `duration_minutes` (not `duration`)
   - ✅ `order_number` (integer)
   - ✅ `video_url` (can be empty string `""`)

5. **Quiz Location**: SEPARATE object after content
   - ✅ Quiz in its own `quiz` object
   - ❌ Quiz embedded in HTML content

6. **Question Types**: Valid types are:
   - `"multiple_choice"` - single correct answer
   - `"true_false"` - true/false only
   - (Other types may exist, test before using)

7. **Options Format**:
   - Always JSON array of strings
   - ✅ `["Option 1", "Option 2", "Option 3"]`

8. **Resources**: Optional array of strings
   - ✅ `["Name: URL", "Name: URL"]`
   - Can be omitted if not needed

### ❌ DON'T:

1. ❌ Use double quotes in HTML: `<div style="...">`
2. ❌ Embed quiz questions in content HTML
3. ❌ Use `\n` or line breaks in content
4. ❌ Use wrong field names (`duration` vs `duration_minutes`)
5. ❌ Mix content and quiz together
6. ❌ Forget required fields
7. ❌ Use complex HTML with unescaped quotes

---

## 📏 CONTENT GUIDELINES

### Professional Course Standards:

1. **Module Length**: 
   - Minimum: 2,000 words of meaningful content
   - Target: 3,000-5,000 words per module
   - Professional courses need depth!

2. **Content Structure**:
   ```html
   <div style='...'>
     <h1>Module Title</h1>
     <div style='...'>
       <h3>Learning Objectives</h3>
       <ul>
         <li>Objective 1</li>
         <li>Objective 2</li>
       </ul>
     </div>
     
     <h2>Topic 1</h2>
     <p>Detailed explanation...</p>
     <div style='...'>
       <h4>Key Point</h4>
       <p>...</p>
     </div>
     
     <h2>Topic 2</h2>
     <p>More content...</p>
     
     <!-- Continue with more topics -->
     
     <div style='...'>
       <h3>Key Takeaways</h3>
       <ul>
         <li>Summary point 1</li>
         <li>Summary point 2</li>
       </ul>
     </div>
   </div>
   ```

3. **Styling Best Practices**:
   - Use inline styles with single quotes
   - Common patterns:
     - Header gradient: `background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);`
     - Info boxes: `background: #e8f5e9; border-left: 5px solid #4caf50;`
     - Warning boxes: `background: #fff3e0; border: 2px solid #ff9800;`

4. **South African Context**:
   - Include local examples
   - Reference SA businesses/scenarios
   - Use rand (R) for prices
   - Mention SA-specific challenges (load shedding, etc.)

---

## 🎯 QUIZ GUIDELINES

1. **Question Distribution**:
   - Mix of easy (40%), medium (40%), hard (20%)
   - Varied question types
   - Cover all main topics

2. **Question Quality**:
   - Clear, unambiguous wording
   - Plausible distractors (wrong answers)
   - Detailed explanations
   - Helpful hints

3. **Quiz Settings**:
   - Passing score: 70% standard
   - Max attempts: 3 recommended
   - 5-10 questions per module typical
   - Professional courses: more questions (20-30)

---

## 🔧 TESTING CHECKLIST

Before importing:
- [ ] Validate JSON syntax (use json.tool or online validator)
- [ ] Check all HTML uses single quotes
- [ ] Verify no quiz content in HTML
- [ ] Confirm all required fields present
- [ ] Test content length (min 2000 words)
- [ ] Review question quality
- [ ] Check correct_answer matches an option exactly

---

## 📁 FILE NAMING

Convention: `COURSECODE_MODULE#_DESCRIPTION.json`

Examples:
- `ADVBUS001_MODULE1_INTRO.json`
- `ADVBUS001_COMPLETE_COURSE.json`
- `TEST_SINGLE_MODULE.json`

---

## 🚀 IMPORT MODES

When course exists, converter shows 3 options:

1. **Skip** - Don't import anything
2. **Update** - REPLACE all modules (destructive!)
3. **Append** - ADD new modules (safe)

⚠️ **IMPORTANT**: Choose carefully!
- First import: Use Update or Skip
- Adding modules: Use Append
- Replacing everything: Use Update (be careful!)
