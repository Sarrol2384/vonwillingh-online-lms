# VONWILLINGH COURSE GENERATOR - PROJECT REQUIREMENTS

## 🎯 PROJECT GOAL
Create a standalone web application that generates professional courses for VonWillingh Online LMS with **GUARANTEED compatibility** - no import errors, ever.

---

## 📊 EXACT DATABASE SCHEMA (Critical - DO NOT DEVIATE)

### Courses Table
```
id: integer (auto-generated)
name: text (required, unique)
code: text (optional, but recommended)
category: text (required, default 'General')
level: text (required: 'Certificate', 'Diploma', 'Advanced Diploma', 'Bachelor')
modules_count: integer (calculated from modules array length)
duration: text (optional, e.g., '2 weeks')
price: numeric (required, NOT string - must be number: 0, 1500, etc.)
description: text (optional)
is_free: boolean (optional, default false)
created_at: timestamp (auto)
```

### Modules Table
```
id: uuid (auto-generated)
course_id: integer (foreign key to courses.id)
title: text (required)
description: text (optional)
order_number: integer (required, NOT NULL - must be 1, 2, 3, 4...)
content: text (required - HTML format)
content_type: text (optional, default 'lesson')
duration_minutes: integer (optional)
video_url: text (optional)
pdf_materials: array (optional)
quiz: jsonb (optional - JSON format)
created_at: timestamp (auto)
```

---

## ✅ MANDATORY JSON OUTPUT FORMAT

```json
{
  "name": "Course Name Here",
  "code": "COURSCODE001",
  "level": "Certificate",
  "category": "Category Name",
  "description": "Course description...",
  "duration": "2 weeks",
  "price": 0,
  "modules": [
    {
      "title": "Module 1: Title",
      "description": "Module description",
      "order_number": 1,
      "content": "<h1>HTML Content</h1><p>Content here...</p>",
      "content_type": "lesson",
      "duration_minutes": 45,
      "video_url": "",
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

## ❌ FORBIDDEN FIELDS (WILL CAUSE ERRORS)

**DO NOT INCLUDE IN JSON:**
- ❌ `semesters_count` (does not exist)
- ❌ `module_number` (does not exist - use `order_number`)
- ❌ `order_index` (does not exist - use `order_number`)
- ❌ `is_published` (does not exist in modules)
- ❌ `duration_hours` (does not exist - use `duration_minutes`)

---

## 🎨 GENERATOR FEATURES

### 1. User Interface
- Clean, simple form
- Input fields:
  - Course name (text)
  - Course code (text, optional, auto-generate if empty)
  - Level (dropdown: Certificate, Diploma, Advanced Diploma, Bachelor)
  - Category (text or dropdown)
  - Price (number input, default 0)
  - Duration (text, e.g., "2 weeks")
  - Number of modules (1-10)
  - Target audience (for context)
  - Learning outcomes (for content generation)

### 2. Content Generation (AI-Powered)
- Use AI to generate:
  - Course description (200-300 words)
  - Module titles and descriptions
  - HTML content for each module (with South African context)
  - Quiz questions (10 per module, mixed difficulty)
- All content must be professional, engaging, SA-focused

### 3. Validation (CRITICAL)
Before generating JSON, validate:
- ✅ `price` is a NUMBER not a string
- ✅ `order_number` is set for EVERY module (1, 2, 3...)
- ✅ `level` is one of: Certificate, Diploma, Advanced Diploma, Bachelor
- ✅ NO forbidden fields are present
- ✅ `modules` array has at least 1 module
- ✅ Quiz structure is correct (if included)

### 4. Output
- Display JSON in textarea (for copy-paste)
- Download button (saves as .json file)
- "Test JSON" button (validates with jsonlint)
- Clear success/error messages

---

## 🚀 TECH STACK RECOMMENDATION

**Simple & Fast:**
- HTML + Tailwind CSS (for UI)
- Vanilla JavaScript or React (your choice)
- OpenAI API or Anthropic Claude API (for content generation)
- No backend needed (all client-side)

**OR**

**Full Stack:**
- Frontend: React/Next.js + Tailwind
- Backend: Node.js + Express (for AI API calls)
- Deploy: Vercel or Cloudflare Pages

---

## 📝 IMPLEMENTATION STEPS

### Step 1: Create Form
```html
<form>
  <input name="name" placeholder="Course Name" required>
  <input name="code" placeholder="Course Code (optional)">
  <select name="level" required>
    <option>Certificate</option>
    <option>Diploma</option>
    <option>Advanced Diploma</option>
    <option>Bachelor</option>
  </select>
  <input name="category" placeholder="Category">
  <input name="price" type="number" value="0" required>
  <input name="duration" placeholder="e.g., 2 weeks">
  <input name="module_count" type="number" min="1" max="10" value="4">
  <textarea name="audience" placeholder="Target audience"></textarea>
  <textarea name="outcomes" placeholder="Learning outcomes"></textarea>
  <button type="submit">Generate Course</button>
</form>
```

### Step 2: Generate Content with AI
```javascript
async function generateCourse(formData) {
  // Call AI API (OpenAI, Claude, etc.)
  const prompt = `
    Create a professional course for VonWillingh Online LMS.
    
    Course Details:
    - Name: ${formData.name}
    - Level: ${formData.level}
    - Category: ${formData.category}
    - Target: ${formData.audience}
    - Outcomes: ${formData.outcomes}
    - Modules: ${formData.module_count}
    
    Requirements:
    - South African context (cities, examples, Rand pricing)
    - Professional, engaging content
    - HTML-formatted module content
    - 10 quiz questions per module
    - Real SA case studies
    
    Output JSON format: {...}
  `;
  
  const response = await callAI(prompt);
  return JSON.parse(response);
}
```

### Step 3: Validate Output
```javascript
function validateCourse(courseData) {
  const errors = [];
  
  // Check required fields
  if (!courseData.name) errors.push("Missing: name");
  if (!courseData.level) errors.push("Missing: level");
  if (typeof courseData.price !== 'number') errors.push("Price must be number");
  
  // Check modules
  if (!courseData.modules || courseData.modules.length === 0) {
    errors.push("Must have at least 1 module");
  }
  
  // Check each module
  courseData.modules.forEach((mod, i) => {
    if (!mod.order_number) errors.push(`Module ${i+1}: missing order_number`);
    if (!mod.title) errors.push(`Module ${i+1}: missing title`);
    if (!mod.content) errors.push(`Module ${i+1}: missing content`);
  });
  
  // Check for forbidden fields
  if (courseData.semesters_count !== undefined) errors.push("Remove: semesters_count");
  courseData.modules?.forEach((mod, i) => {
    if (mod.module_number !== undefined) errors.push(`Module ${i+1}: Remove module_number`);
    if (mod.order_index !== undefined) errors.push(`Module ${i+1}: Remove order_index`);
  });
  
  return errors;
}
```

### Step 4: Display & Download
```javascript
function displayResult(courseData) {
  // Validate
  const errors = validateCourse(courseData);
  if (errors.length > 0) {
    alert("Validation errors:\n" + errors.join("\n"));
    return;
  }
  
  // Display JSON
  document.getElementById('output').value = JSON.stringify(courseData, null, 2);
  
  // Enable download
  const blob = new Blob([JSON.stringify(courseData, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const link = document.getElementById('download-link');
  link.href = url;
  link.download = `${courseData.code || 'course'}.json`;
  link.style.display = 'block';
}
```

---

## 🎯 SUCCESS CRITERIA

The generator is successful if:
1. ✅ Generated JSON validates (no syntax errors)
2. ✅ Imports into VonWillingh LMS **without any errors**
3. ✅ All modules appear (not 0 modules)
4. ✅ Content displays correctly
5. ✅ Quizzes work
6. ✅ No schema mismatch errors

---

## 📋 TESTING CHECKLIST

Before releasing:
- [ ] Generate a simple 1-module course
- [ ] Copy JSON and import to VonWillingh LMS
- [ ] Verify: No errors, 1 module appears
- [ ] Generate a complex 5-module course with quizzes
- [ ] Import and verify all modules and quizzes work
- [ ] Test with price: 0 (free course)
- [ ] Test with price: 1500 (paid course)
- [ ] Test all 4 levels (Certificate, Diploma, etc.)

---

## 🚀 DEPLOYMENT

Deploy to:
- Vercel (recommended for Next.js)
- Cloudflare Pages (recommended for static sites)
- Netlify (also works well)

---

## 📚 SAMPLE OUTPUT

When user submits form, generate JSON like:

```json
{
  "name": "Digital Marketing for SA Small Businesses",
  "code": "DIGIMKT001",
  "level": "Certificate",
  "category": "Digital Marketing",
  "description": "Learn digital marketing specifically for South African small businesses...",
  "duration": "3 weeks",
  "price": 1200,
  "modules": [
    {
      "title": "Module 1: Introduction to Digital Marketing in SA",
      "description": "Overview of digital marketing landscape in South Africa",
      "order_number": 1,
      "content": "<div><h1>Welcome to Digital Marketing</h1><p>In South Africa, digital marketing has become essential...</p></div>",
      "content_type": "lesson",
      "duration_minutes": 45,
      "video_url": "",
      "quiz": {
        "passing_score": 70,
        "max_attempts": 3,
        "questions": [...]
      }
    }
  ]
}
```

---

## 💡 BENEFITS OF THIS APPROACH

1. **No Import Errors** - JSON matches schema perfectly
2. **Fast** - Generate courses in seconds, not hours
3. **Consistent** - Same format every time
4. **Scalable** - Generate 100 courses quickly
5. **Portable** - JSON files can be shared, backed up
6. **Testable** - Validate before importing

---

## 🎓 PROJECT NAME SUGGESTION

**"VonWillingh Course Creator"**

Tagline: "Generate professional LMS courses in seconds"

---

## 🔗 NEXT STEPS

1. Create new project directory
2. Set up basic HTML form
3. Integrate AI API for content generation
4. Add validation logic
5. Test with VonWillingh LMS import
6. Deploy to Cloudflare Pages
7. Share link with VonWillingh team

---

**This approach will 100% eliminate import errors because the JSON structure will ALWAYS match the database schema!**

Would you like me to start building this generator for you?
