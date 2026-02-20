# 🚀 QUICK START: Phase 3 Database Setup

## ⏱️ Total Time: 7 Minutes

---

## Step 1: Run Database Setup (5 min)

### 📍 Location:
```
https://supabase.com/dashboard/project/dgcobxtkzewzkrzpfcdr/sql/new
```

### 📝 Script to Run:
```
File: /home/user/webapp/LINK_QUIZ_TO_MODULE1.sql
```

### 🎬 Actions:
1. Open Supabase SQL Editor (link above)
2. Open file `LINK_QUIZ_TO_MODULE1.sql` in your code editor
3. Select All (Ctrl+A / Cmd+A)
4. Copy (Ctrl+C / Cmd+C)
5. Paste into Supabase editor
6. Click **"Run"** button
7. Wait ~5 seconds

### ✅ Success Indicators:
Look for these messages:
```
✅ Found Module 1 with ID: [uuid]
✅ Module 1 has 20 quiz questions
✅ Created module_progression_rules table
✅ Created module_content_completion table
✅ Configured progression rules for Module 1
✅ Updated Module 1 with quiz metadata

========================================
✅ QUIZ LINKING COMPLETE!
========================================
```

---

## Step 2: Verify Setup (2 min)

### 📍 Location:
```
Same Supabase SQL Editor (open new tab)
```

### 📝 Script to Run:
```
File: /home/user/webapp/VERIFY_QUIZ_INTEGRATION.sql
```

### 🎬 Actions:
1. Open new SQL editor tab in Supabase
2. Open file `VERIFY_QUIZ_INTEGRATION.sql`
3. Copy all contents
4. Paste and click **"Run"**

### ✅ Expected Results:
7 result sets showing:
1. ✅ Module 1 configuration (has_quiz=true)
2. ✅ 20 quiz questions (8 easy, 9 medium, 3 hard)
3. ✅ Progression rules (70% pass, 3 attempts, 30 min)
4. ✅ Table structure (4 tables with columns)
5. ✅ Indexes (performance optimization)
6. ✅ Sample questions (first 3)
7. ✅ Module 1 → Module 2 link

---

## Step 3: Configure Testing Mode (Optional, 1 min)

### Why?
Reduce content time from **30 minutes** to **60 seconds** for faster testing.

### 📝 Quick Config:
Run this in Supabase:
```sql
UPDATE module_progression_rules 
SET minimum_content_time_seconds = 60
WHERE module_id IN (
    SELECT m.id FROM modules m 
    JOIN courses c ON m.course_id = c.id 
    WHERE c.code = 'AIFUND001' 
    AND m.title ILIKE '%Module 1%'
);
```

### ✅ Result:
```
UPDATE 1
```
(Content time requirement now 60 seconds)

---

## 🧪 Quick Test (10 min)

### 1. Open Module 1
```
URL: https://vonwillingh-online-lms.pages.dev/student-login
```
- Log in with test student
- Open course AIFUND001
- Click "Module 1: Introduction to AI for Small Business"

### 2. Open Browser Console
- Press **F12** (Windows/Linux)
- Or **Cmd+Option+I** (Mac)
- Click **"Console"** tab

### 3. Watch Progress
You'll see logs like:
```
[ModuleProgressionManager] Time spent: 10s / 60s required
[ModuleProgressionManager] Scroll position: 45%
...
[ModuleProgressionManager] Time spent: 60s / 60s required ✓
[ModuleProgressionManager] Scroll position: 96% ✓
[ModuleProgressionManager] ✅ Content completion requirements met!
```

### 4. Verify Quiz Button
- **Before completion:** Disabled, shows countdown
- **After completion:** Enabled, shows "Start Quiz"

### 5. Take Quiz
- Click "Start Quiz"
- Answer all 20 questions
- Submit
- Verify pass/fail result displays correctly

---

## 📊 What Gets Created

### Database Tables (2):
1. **module_progression_rules**
   - Stores quiz requirements per module
   - Columns: passing_score, max_attempts, time_required, etc.

2. **module_content_completion**
   - Tracks student progress
   - Columns: time_spent, scrolled_to_bottom, completed_at, etc.

### Module 1 Configuration:
| Setting | Value |
|---------|-------|
| Quiz Questions | 20 (8 easy, 9 medium, 3 hard) |
| Passing Score | 70% (14/20 correct) |
| Max Attempts | 3 |
| Content Time | 30 min (1800s) - or 60s in test mode |
| Scroll Required | Yes (95% of content) |
| Blocks Module 2 | Yes |

---

## 🐛 Quick Troubleshooting

### ❌ Error: "Module 1 not found"
**Fix:** Verify course AIFUND001 exists:
```sql
SELECT * FROM courses WHERE code = 'AIFUND001';
```

### ❌ Error: "No quiz questions found"
**Fix:** Run quiz questions script first:
```
File: /home/user/webapp/FIX_QUIZ_TABLE_AND_CREATE.sql
```

### ❌ Quiz button stays disabled
**Fix:** 
1. Check console for errors
2. Wait for full time requirement (60s in test mode)
3. Scroll all the way to bottom

### ❌ Quiz doesn't load
**Fix:**
1. Check Network tab (F12 → Network)
2. Look for failed API calls
3. Verify student is logged in

---

## 📁 File Reference

| File | Purpose | Size |
|------|---------|------|
| `LINK_QUIZ_TO_MODULE1.sql` | **Run this first** - Creates tables & links quiz | 11 KB |
| `VERIFY_QUIZ_INTEGRATION.sql` | **Run second** - Verifies setup | 5 KB |
| `PHASE3_DATABASE_SETUP_AND_TESTING.md` | Complete testing guide | 21 KB |
| `PHASE3_READY_TO_EXECUTE.md` | Detailed summary | 13 KB |
| `QUIZ_MODULE_INTEGRATION.md` | API documentation | 10 KB |

---

## ✅ Completion Checklist

### Database Setup:
- [ ] Ran `LINK_QUIZ_TO_MODULE1.sql` in Supabase
- [ ] Saw success messages (✅ QUIZ LINKING COMPLETE!)
- [ ] Ran `VERIFY_QUIZ_INTEGRATION.sql`
- [ ] Verified 7 result sets show correct data

### Configuration:
- [ ] (Optional) Reduced time to 60s for testing
- [ ] Verified progression rules with query

### Testing:
- [ ] Opened Module 1 in browser
- [ ] Opened console and saw progress logs
- [ ] Waited for time requirement
- [ ] Scrolled to bottom
- [ ] Quiz button unlocked
- [ ] Started quiz, saw all 20 questions
- [ ] Submitted quiz, saw result

### Verification:
- [ ] Passed quiz (≥70%): Saw green result, correct answers shown
- [ ] Failed quiz (<70%): Saw red result, answers hidden
- [ ] Module 2 blocking works (if Module 2 exists)

---

## 🎯 Success!

Once all checkboxes above are complete, **Phase 3 is done!** 🎉

The quiz-module integration is fully operational:
- ✅ Database configured
- ✅ Content tracking active
- ✅ Quiz unlocking works
- ✅ Pass/fail logic verified
- ✅ Module progression enforced

---

## 🚀 Next Steps

### Reset to Production (After Testing):
```sql
UPDATE module_progression_rules 
SET minimum_content_time_seconds = 1800
WHERE module_id IN (
    SELECT m.id FROM modules m 
    JOIN courses c ON m.course_id = c.id 
    WHERE c.code = 'AIFUND001' 
    AND m.title ILIKE '%Module 1%'
);
```
(Changes back to 30 minutes)

### Optional Enhancements:
- Update student dashboard with quiz status
- Create admin reporting interface
- Add manual override panel
- Create quizzes for other modules

---

## 📞 Need Help?

See detailed guides:
- **Setup Issues:** `PHASE3_DATABASE_SETUP_AND_TESTING.md`
- **API Problems:** `QUIZ_MODULE_INTEGRATION.md`
- **Quiz Config:** `QUIZ_CONFIGURATION_COMPLETE.md`

---

**Total Time to Complete Phase 3: ~30 minutes**
- Database setup: 7 minutes
- Testing: 20 minutes
- Verification: 3 minutes

**Good luck! 🚀**
