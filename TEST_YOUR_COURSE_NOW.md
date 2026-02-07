# 🚀 TEST YOUR AI BASICS COURSE - STEP BY STEP

## ✅ Your Course is Ready!

**File:** `ai-basics-course-v2-FIXED.json`  
**Status:** ✅ Fixed and validated  
**What was changed:** `price: 0` → `price: 0.01` (1 cent)

---

## 📥 OPTION 1: Direct Download & Test (Recommended - 3 minutes)

### Step 1: Download Your Fixed Course
**Download Link:** https://github.com/Sarrol2384/vonwillingh-online-lms/raw/main/ai-basics-course-v2-FIXED.json

Click the link above → File will download as `ai-basics-course-v2-FIXED.json`

### Step 2: Import the Course
1. Go to: **https://vonwillingh-online-lms.pages.dev/admin/courses/import**
2. Click **"Choose File"** or drag the downloaded file into the upload area
3. Select **"Create New Course"**
4. Click **"Import Course"**

### Step 3: Expected Result
You should see:
```
✅ Course "AI Basics for SA Small Business Owners" created successfully!
View Course →
```

### Step 4: Fix the Price (Make it Free)
1. Go to: **https://vonwillingh-online-lms.pages.dev/admin-courses**
2. Find **"AI Basics for SA Small Business Owners"**
3. Click **"Edit"**
4. Change price from **R0.01** to **R0.00**
5. Click **"Save"**

**Done!** Your course is now live and completely free! 🎉

---

## 📥 OPTION 2: Use Raw JSON (Alternative Method)

If the download doesn't work, copy this JSON:

```json
{
  "course": {
    "name": "AI Basics for SA Small Business Owners",
    "code": "AIBIZ001",
    "level": "Certificate",
    "description": "Discover how artificial intelligence can transform your small business without breaking the bank!...",
    "duration": "2 weeks",
    "price": 0.01,
    "category": "Artificial Intelligence"
  },
  "modules": [...]
}
```

**Full file is 103 KB** - Download from GitHub using Option 1 above.

---

## 🎯 Course Details

**Course Information:**
- **Name:** AI Basics for SA Small Business Owners
- **Code:** AIBIZ001
- **Level:** Certificate
- **Category:** Artificial Intelligence
- **Duration:** 2 weeks
- **Price:** R0.01 (change to R0.00 after import)
- **Modules:** 4 modules
- **Total Quiz Questions:** 40 questions (10 per module)

**Module Breakdown:**
1. **Module 1:** What is AI and Why Should You Care? (45 min, 10 quiz questions)
2. **Module 2:** ChatGPT - Your 24/7 Business Assistant (60 min, 10 quiz questions)
3. **Module 3:** Canva AI - Professional Design Made Easy (60 min, 10 quiz questions)
4. **Module 4:** Putting It All Together - Your AI Business System (45 min, 10 quiz questions)

**Features:**
- ✅ 4 comprehensive modules
- ✅ 40 quiz questions with explanations
- ✅ Real South African case studies
- ✅ Step-by-step practical guides
- ✅ Free tool recommendations
- ✅ Mobile-optimized content
- ✅ Professional HTML formatting

---

## 🔍 Verification Steps

After importing, verify everything works:

### 1. Check Admin View
- Go to: https://vonwillingh-online-lms.pages.dev/admin-courses
- You should see: **"AI Basics for SA Small Business Owners"** in the course list
- Verify: **4 modules** shown
- Verify: Price shows **R0.01** (or R0.00 if you already edited it)

### 2. Check Student View
- Go to: https://vonwillingh-online-lms.pages.dev/courses
- Find: **"AI Basics for SA Small Business Owners"**
- Click: **"View Course"** or **"Enroll Now"**
- Verify: All 4 modules are visible
- Verify: Content displays properly
- Verify: Quiz questions load correctly

### 3. Test a Module
- Open: **Module 1**
- Check: Content renders with proper formatting
- Check: Quiz has 10 questions
- Try: Take the quiz (passing score is 70%)

---

## ❓ Troubleshooting

### Issue: "Course is missing required field: price"

**Still getting this error?** The Cloudflare cache hasn't updated yet.

**Quick Fixes:**
1. **Hard Refresh:** Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. **Incognito Mode:** Open https://vonwillingh-online-lms.pages.dev/admin/courses/import in a private/incognito window
3. **Clear Cache:** Go to Settings → Clear browsing data → Cached images and files
4. **Wait 10 minutes:** Cloudflare cache will refresh automatically

**Check if fix is live:**
- Open: https://vonwillingh-online-lms.pages.dev/static/course-import.js
- Search for: `=== ''` in the price validation
- **If NOT found:** Fix is live ✅
- **If found:** Still cached, try hard refresh

### Issue: JSON Validation Error

**Error:** "Invalid JSON format"

**Solution:**
- Re-download the file from GitHub (don't copy-paste)
- Make sure file extension is `.json` not `.txt`
- Use Option 1 (Direct Download) instead of copy-paste

### Issue: Duplicate Course Code

**Error:** "Course with code AIBIZ001 already exists"

**Solution:**
- You already imported this course!
- Go to admin-courses to view it
- Or change the course code to `AIBIZ002` before importing

---

## 🎓 After Successful Import

### Next Steps:

1. **Preview the Course**
   - Go to student view: https://vonwillingh-online-lms.pages.dev/courses
   - Click on your course
   - Test the learning experience

2. **Customize Content** (Optional)
   - Edit any module content via admin panel
   - Add videos (YouTube URLs)
   - Adjust quiz questions
   - Update South African examples

3. **Set Correct Price**
   - Go to admin-courses
   - Edit course
   - Change price from R0.01 to R0.00 for free access

4. **Publish & Share**
   - Course is already published (visible to students)
   - Share course link: `https://vonwillingh-online-lms.pages.dev/courses/AIBIZ001`
   - Monitor enrollments in admin dashboard

---

## 🎉 Success Criteria

You'll know everything worked when:

- ✅ No validation errors during import
- ✅ Success message appears with "View Course" link
- ✅ Course appears in admin-courses list
- ✅ All 4 modules are visible
- ✅ 40 quiz questions are loaded (10 per module)
- ✅ Content displays with proper HTML formatting
- ✅ Students can enroll and access the course
- ✅ Quizzes are interactive and functional

---

## 📞 Need Help?

If you encounter any issues:

1. **Take a screenshot** of the error message
2. **Check the browser console** (F12 → Console tab)
3. **Verify the JSON** at https://jsonlint.com
4. **Share the error details**

---

## 🚀 What's Next?

Once this course imports successfully:

1. **Test the entire learning flow**
   - Enroll as a student
   - Complete Module 1
   - Take the quiz
   - Get your certificate

2. **Create More Courses**
   - Use the Course Generator Prompt (COURSE_GENERATOR_PROMPT.md)
   - Generate 5-10 courses in GenSpark
   - Import them all using this same process

3. **Build Your Course Library**
   - Target: 30 professional courses
   - Timeframe: This month
   - Value: R1.5 million saved compared to Articulate

---

## 📋 Quick Reference

**Download:** https://github.com/Sarrol2384/vonwillingh-online-lms/raw/main/ai-basics-course-v2-FIXED.json  
**Import:** https://vonwillingh-online-lms.pages.dev/admin/courses/import  
**View Courses:** https://vonwillingh-online-lms.pages.dev/courses  
**Admin Panel:** https://vonwillingh-online-lms.pages.dev/admin-courses

**Support Files:**
- Course Generator: `COURSE_GENERATOR_PROMPT.md`
- Import Guide: `IMPORT_INSTRUCTIONS.md`
- Cache Fix: `CACHE_ISSUE_SOLUTIONS.md`

---

## 💪 You're Ready!

Everything is set up and ready to test. Follow Option 1 above for the smoothest experience. Your course will be live in less than 5 minutes!

Let me know how the import goes! 🚀
