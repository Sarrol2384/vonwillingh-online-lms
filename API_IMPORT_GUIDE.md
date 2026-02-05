# 🚀 VonWillingh LMS - External Course Import API

## Overview

This API allows external applications (like your GenSpark Course Creator app) to push courses **directly** to the VonWillingh LMS without any JSON file downloads or manual imports.

---

## 🔑 Authentication

**API Key Required**

All requests must include an API key in the headers:

```http
X-API-Key: vonwillingh-lms-import-key-2026
```

⚠️ **Security Note:** In production, use a secure API key stored as an environment variable `COURSE_IMPORT_API_KEY` in Cloudflare Pages.

---

## 📡 API Endpoint

### **POST** `/api/courses/external-import`

**Full URL:**
```
https://vonwillingh-online-lms.pages.dev/api/courses/external-import
```

---

## 📤 Request Format

### Headers

```http
Content-Type: application/json
X-API-Key: vonwillingh-lms-import-key-2026
```

### Request Body

```json
{
  "course": {
    "name": "AI Basics for Small Business Owners",
    "code": "AIFREE001",
    "level": "Certificate",
    "category": "Artificial Intelligence & Technology",
    "description": "Learn AI basics and practical tools...",
    "duration": "2 weeks",
    "price": 0
  },
  "modules": [
    {
      "title": "Understanding AI",
      "description": "Learn what AI is and how it works",
      "order_number": 1,
      "content": "<h2>What is AI?</h2><p>Content here...</p>",
      "content_type": "lesson",
      "video_url": "https://youtube.com/...",
      "duration_minutes": 30,
      "quiz": {
        "passing_score": 70,
        "max_attempts": 3,
        "questions": [
          {
            "question": "What does AI stand for?",
            "options": ["Artificial Intelligence", "Automated Internet", "Advanced Integration", "None"],
            "correct_answer": "Artificial Intelligence"
          }
        ]
      }
    }
  ]
}
```

---

## 📋 Required Fields

### Course Object (Required)

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `name` | string | ✅ Yes | Course name | "AI Basics for Small Business Owners" |
| `code` | string | ✅ Yes | Unique course code (letters, numbers, dash, underscore only) | "AIFREE001" |
| `level` | string | ✅ Yes | One of: Certificate, Diploma, Advanced Diploma, Bachelor | "Certificate" |
| `description` | string | ✅ Yes | Course description | "Learn AI basics..." |
| `duration` | string | ✅ Yes | Course duration | "2 weeks" |
| `price` | number | ✅ Yes | Course price in Rands (use 0 for FREE) | 0 |
| `category` | string | ❌ Optional | Course category | "Artificial Intelligence & Technology" |

### Module Object (Required)

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `title` | string | ✅ Yes | Module title | "Understanding AI" |
| `description` | string | ✅ Yes | Module description | "Learn what AI is..." |
| `order_number` | number | ✅ Yes | Module order (1, 2, 3, ...) | 1 |
| `content` | string | ✅ Yes | Module content (HTML/Markdown) | "<h2>What is AI?</h2>..." |
| `content_type` | string | ❌ Optional | Default: "lesson" | "lesson", "video", "quiz" |
| `video_url` | string | ❌ Optional | YouTube or video URL | "https://youtube.com/..." |
| `duration_minutes` | number | ❌ Optional | Module duration | 30 |
| `quiz` | object | ❌ Optional | Quiz data (see below) | {...} |

### Quiz Object (Optional)

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `passing_score` | number | ❌ Optional | Default: 70 | 70 |
| `max_attempts` | number | ❌ Optional | Default: 3 | 3 |
| `questions` | array | ✅ Yes (if quiz exists) | Array of question objects | [...] |

### Question Object

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `question` | string | ✅ Yes | Question text | "What does AI stand for?" |
| `options` | array | ✅ Yes | Array of answer options | ["Option A", "Option B"] |
| `correct_answer` | string | ✅ Yes | The correct answer (must match one option) | "Artificial Intelligence" |

---

## ✅ Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Course \"AI Basics for Small Business Owners\" created successfully with 6 modules",
  "data": {
    "course_id": 42,
    "course_name": "AI Basics for Small Business Owners",
    "course_code": "AIFREE001",
    "modules_count": 6,
    "price": 0,
    "level": "Certificate",
    "duration": "2 weeks",
    "course_url": "https://vonwillingh-online-lms.pages.dev/courses"
  }
}
```

---

## ❌ Error Responses

### 1. Unauthorized (Invalid API Key)

**Status:** `401 Unauthorized`

```json
{
  "success": false,
  "message": "Unauthorized: Invalid or missing API key",
  "error": "INVALID_API_KEY"
}
```

### 2. Course Already Exists

**Status:** `409 Conflict`

```json
{
  "success": false,
  "message": "Course with code \"AIFREE001\" already exists (Name: \"AI Basics\", ID: 42)",
  "error": "COURSE_EXISTS",
  "existing_course": {
    "id": 42,
    "name": "AI Basics for Small Business Owners",
    "code": "AIFREE001"
  }
}
```

### 3. Missing Required Fields

**Status:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Missing required course fields: name, code",
  "error": "MISSING_COURSE_FIELDS",
  "missing_fields": ["name", "code"]
}
```

### 4. Invalid Course Level

**Status:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Course level must be one of: Certificate, Diploma, Advanced Diploma, Bachelor",
  "error": "INVALID_COURSE_LEVEL",
  "valid_levels": ["Certificate", "Diploma", "Advanced Diploma", "Bachelor"]
}
```

### 5. Invalid Module Data

**Status:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Module 2 is missing required fields: title, content",
  "error": "MISSING_MODULE_FIELDS",
  "module_index": 1,
  "missing_fields": ["title", "content"]
}
```

### 6. Database Error

**Status:** `500 Internal Server Error`

```json
{
  "success": false,
  "message": "Failed to create course: [error details]",
  "error": "DATABASE_ERROR"
}
```

---

## 🧪 Testing with cURL

### Test 1: Simple Course (No Quizzes)

```bash
curl -X POST https://vonwillingh-online-lms.pages.dev/api/courses/external-import \
  -H "Content-Type: application/json" \
  -H "X-API-Key: vonwillingh-lms-import-key-2026" \
  -d '{
    "course": {
      "name": "Test Course",
      "code": "TEST001",
      "level": "Certificate",
      "category": "Test Category",
      "description": "A test course",
      "duration": "1 week",
      "price": 0
    },
    "modules": [
      {
        "title": "Module 1",
        "description": "First module",
        "order_number": 1,
        "content": "<h2>Welcome</h2><p>This is a test module.</p>"
      }
    ]
  }'
```

### Test 2: Course with Quiz

```bash
curl -X POST https://vonwillingh-online-lms.pages.dev/api/courses/external-import \
  -H "Content-Type: application/json" \
  -H "X-API-Key: vonwillingh-lms-import-key-2026" \
  -d '{
    "course": {
      "name": "Quiz Test Course",
      "code": "QUIZ001",
      "level": "Certificate",
      "description": "A course with quiz",
      "duration": "1 week",
      "price": 0
    },
    "modules": [
      {
        "title": "Module 1",
        "description": "Module with quiz",
        "order_number": 1,
        "content": "<h2>Content</h2>",
        "quiz": {
          "passing_score": 70,
          "max_attempts": 3,
          "questions": [
            {
              "question": "What is 2+2?",
              "options": ["3", "4", "5", "6"],
              "correct_answer": "4"
            }
          ]
        }
      }
    ]
  }'
```

---

## 🔗 Integration with GenSpark Course Creator

### Step 1: In Your Course Creator App

After you generate a course, instead of downloading JSON, call this API:

```javascript
const courseData = {
  course: {
    name: "AI Basics for Small Business Owners",
    code: "AIFREE001",
    level: "Certificate",
    category: "Artificial Intelligence & Technology",
    description: "...",
    duration: "2 weeks",
    price: 0
  },
  modules: [
    // ... module data
  ]
}

const response = await fetch('https://vonwillingh-online-lms.pages.dev/api/courses/external-import', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'vonwillingh-lms-import-key-2026'
  },
  body: JSON.stringify(courseData)
})

const result = await response.json()

if (result.success) {
  console.log('✅ Course created:', result.data.course_url)
  console.log('📦 Course ID:', result.data.course_id)
} else {
  console.error('❌ Error:', result.message)
}
```

### Step 2: No More Manual Imports!

✅ **Old Way (Manual):**
1. Generate course in GenSpark App
2. Download JSON file
3. Go to VonWillingh LMS
4. Upload JSON
5. Click Import
6. Deal with errors ❌

✅ **New Way (Automatic):**
1. Generate course in GenSpark App
2. Click "Publish to LMS"
3. Done! ✅

---

## 🔒 Security Best Practices

### 1. Use Environment Variable for API Key

In Cloudflare Pages dashboard:
1. Go to Settings → Environment Variables
2. Add: `COURSE_IMPORT_API_KEY` = `your-secure-random-key-here`
3. The API will use this instead of the hardcoded default

### 2. Generate a Secure API Key

```bash
# Generate a secure random key
openssl rand -base64 32
```

Example output: `k7Jd9mP2qR5tYw8vX3nZ1bC4fG6hL0sN`

### 3. Use HTTPS Only

The API only works over HTTPS (enforced by Cloudflare).

### 4. Rate Limiting (Optional)

Consider adding rate limiting in production to prevent abuse.

---

## 📊 API Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| `200` | ✅ Success | Course created successfully |
| `400` | ❌ Bad Request | Invalid data structure or missing fields |
| `401` | ❌ Unauthorized | Invalid or missing API key |
| `409` | ❌ Conflict | Course with same code already exists |
| `500` | ❌ Server Error | Database or internal error |

---

## 🧪 Testing the API

### Option 1: Use Postman

1. **URL:** `https://vonwillingh-online-lms.pages.dev/api/courses/external-import`
2. **Method:** POST
3. **Headers:**
   - `Content-Type: application/json`
   - `X-API-Key: vonwillingh-lms-import-key-2026`
4. **Body:** (See example above)

### Option 2: Use Your GenSpark App

Just make a fetch/axios call from your course creator app!

### Option 3: Use the Test Script

I'll create a test script for you below.

---

## 🎯 Next Steps

1. ✅ **API is Live:** The endpoint is ready to use
2. 🔨 **Update Your Course Creator:** Add a "Publish to LMS" button
3. 🔑 **Secure Your API Key:** Use environment variable in production
4. 🧪 **Test:** Try the cURL examples above
5. 🚀 **Deploy:** Push courses directly from your app!

---

## ❓ FAQ

### Q: Can I update an existing course?
**A:** Currently, the API only supports creating NEW courses. If a course with the same code exists, you'll get a `409 Conflict` error. To update, delete the old course first or use a different course code.

### Q: What happens if the API call fails?
**A:** The API is transactional - if module insertion fails, the course will be rolled back and deleted. You'll get a detailed error message.

### Q: Can I import multiple courses at once?
**A:** No, each API call creates one course. To create multiple courses, make multiple API calls.

### Q: What formats are supported for content?
**A:** Module content can be HTML or Markdown. The LMS will render it properly.

### Q: How do I include images in content?
**A:** Use full URLs for images in your HTML:
```html
<img src="https://example.com/image.jpg" alt="Description">
```

### Q: Can I use this API from a browser?
**A:** Yes! The API has CORS enabled for `/api/*` routes. Just make sure to include the API key in headers.

---

## 📞 Support

If you encounter issues:

1. Check the error message and error code
2. Verify your API key is correct
3. Validate your JSON structure
4. Check Cloudflare deployment logs
5. Contact support with the error details

---

**API Version:** 1.0  
**Last Updated:** 2026-02-05  
**Endpoint:** https://vonwillingh-online-lms.pages.dev/api/courses/external-import
