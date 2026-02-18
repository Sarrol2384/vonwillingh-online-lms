# 🚨 Course Import Error: "Modules must be a non-empty array"

## ❌ Problem:
The import system expects a specific JSON structure with a `modules` array, but your JSON doesn't have it in the right format.

---

## ✅ CORRECT JSON Format:

### Required Structure:
```json
{
  "course": {
    "name": "Course Name Here",
    "code": "COURSECODE123",
    "level": "Certificate",
    "category": "Business Management",
    "price": 0,
    "description": "Course description here"
  },
  "modules": [
    {
      "title": "Module 1: Title",
      "description": "Module description",
      "order_number": 1,
      "content": "<h1>Module Content</h1><p>HTML content goes here</p>",
      "duration_minutes": 45
    }
  ],
  "importMode": "create"
}
```

---

## 📋 Required Fields:

### Course Object (required):
- ✅ `name` - Course name (required)
- ✅ `code` - Course code, e.g., "COURSE001" (required, letters/numbers/dashes/underscores only)
- ✅ `level` - Must be one of: "Certificate", "Diploma", "Advanced Diploma", "Bachelor"
- ⚠️ `category` - Optional, defaults to "General"
- ⚠️ `price` - Number, defaults to 0 (use 0 for free courses)
- ⚠️ `description` - Optional course description

### Modules Array (required):
- ✅ **Must be an array** with at least 1 module
- ✅ **Each module must have**:
  - `title` - Module title (required)
  - `description` - Module description (required)
  - `order_number` - Number starting from 1 (required)
  - `content` - HTML content (required)
  - `duration_minutes` - Optional, defaults to 45

### Import Mode (optional):
- `"create"` - Create new course (default)
- `"update"` - Update existing course, replace all modules
- `"append"` - Add modules to existing course

---

## ❌ Common Mistakes:

### Mistake 1: Missing "course" wrapper
```json
{
  "name": "My Course",    ❌ WRONG
  "modules": [...]
}
```

**Fix:** Wrap course fields in a "course" object:
```json
{
  "course": {
    "name": "My Course",  ✅ CORRECT
    ...
  },
  "modules": [...]
}
```

### Mistake 2: modules not an array
```json
{
  "course": {...},
  "modules": "Module 1"   ❌ WRONG (string)
}
```

**Fix:** Use an array:
```json
{
  "course": {...},
  "modules": [            ✅ CORRECT (array)
    {...}
  ]
}
```

### Mistake 3: Empty modules array
```json
{
  "course": {...},
  "modules": []           ❌ WRONG (empty)
}
```

**Fix:** Include at least one module:
```json
{
  "course": {...},
  "modules": [            ✅ CORRECT (has modules)
    {
      "title": "Module 1",
      ...
    }
  ]
}
```

### Mistake 4: Missing required module fields
```json
{
  "title": "Module 1"     ❌ WRONG (missing description, order_number, content)
}
```

**Fix:** Include all required fields:
```json
{
  "title": "Module 1",
  "description": "Intro",
  "order_number": 1,
  "content": "<h1>Content</h1>",
  "duration_minutes": 45  ✅ CORRECT
}
```

---

## 📄 Complete Working Example:

```json
{
  "course": {
    "name": "Introduction to Business Management",
    "code": "BUS101",
    "level": "Certificate",
    "category": "Business Management",
    "price": 2500,
    "description": "Learn the fundamentals of business management in South Africa"
  },
  "modules": [
    {
      "title": "Module 1: Business Basics",
      "description": "Understanding the fundamentals of business",
      "order_number": 1,
      "content": "<h1>Welcome to Module 1</h1><p>In this module, you will learn...</p><h2>Topics Covered</h2><ul><li>Business structures</li><li>Legal requirements in SA</li><li>Financial basics</li></ul>",
      "duration_minutes": 60
    },
    {
      "title": "Module 2: Financial Management",
      "description": "Managing business finances effectively",
      "order_number": 2,
      "content": "<h1>Module 2: Financial Management</h1><p>Understanding cash flow, budgets, and financial planning.</p><h2>Key Concepts</h2><ul><li>Cash flow management</li><li>Budgeting for SMEs</li><li>Financial reporting</li></ul>",
      "duration_minutes": 75
    }
  ],
  "importMode": "create"
}
```

---

## 🎯 Quick Fix for Your JSON:

If your course generator outputs a different format, you need to:

1. **Wrap course fields** in a `"course"` object
2. **Ensure modules** is an array: `"modules": [...]`
3. **Add required fields** to each module
4. **Add `importMode`** field (optional, defaults to "create")

---

## 🔧 Test File:

I've created a test file at: `/home/user/webapp/test-import-course.json`

Download it and try importing it to verify the system works!

---

## 📊 Validation Rules:

**Course Code:**
- Only letters, numbers, dashes, underscores
- Example: `BUS101`, `COURSE-001`, `LEAD_2024`

**Level:**
- Must be exactly one of these (case-sensitive):
  - `"Certificate"`
  - `"Diploma"`
  - `"Advanced Diploma"`
  - `"Bachelor"`

**Price:**
- Must be a number (not a string)
- Cannot be negative
- Use `0` for free courses

**Modules:**
- Must be an array `[]`
- Must have at least 1 module
- Each module must have: title, description, order_number, content

---

## ✅ After Fixing Your JSON:

1. Make sure it follows the structure above
2. Go to: https://vonwillingh-online-lms.pages.dev/admin/courses/import
3. Upload your corrected JSON
4. Click "Import Course"
5. Success! ✅

---

**The error happens because your JSON doesn't match the expected format. Fix the structure and it will work!** 🎯
