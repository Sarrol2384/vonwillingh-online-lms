# ⏱️ Quick Timer Setup Guide

## 🚀 Enable 60-Second Test Mode (NOW)

**Run this in Supabase SQL Editor:**
👉 https://supabase.com/dashboard/project/dgcobxtkzewzkrzpfcdr/sql/new

```sql
-- Set timer to 60 seconds for IMMEDIATE TESTING
UPDATE module_progression_rules 
SET minimum_content_time_seconds = 60,
    updated_at = NOW()
WHERE course_id = (SELECT id FROM courses WHERE code = 'AIFUND001');

-- Verify the change
SELECT 
    m.title AS module_title,
    mpr.minimum_content_time_seconds,
    mpr.minimum_content_time_seconds / 60.0 AS minutes_required,
    mpr.minimum_quiz_score,
    mpr.max_quiz_attempts
FROM module_progression_rules mpr
JOIN modules m ON mpr.module_id = m.id
WHERE mpr.course_id = (SELECT id FROM courses WHERE code = 'AIFUND001');
```

**Expected Result:**
```
module_title: "Module 1: Introduction to AI for Small Business"
minimum_content_time_seconds: 60
minutes_required: 1.0
minimum_quiz_score: 70.00
max_quiz_attempts: 3
```

---

## 🧪 TEST NOW (After Running SQL)

1. **Open:** https://vonwillingh-online-lms.pages.dev/student-login
2. **Login** with test credentials
3. **Open Module 1**
4. **Watch the timer:** Should say "**0/1 minutes**" (60 seconds = 1 minute)
5. **Wait 60 seconds** while viewing the module
6. **Scroll to bottom** of the page
7. **Quiz unlocks!** Button becomes active ✅

---

## 📊 LATER: Switch to 45-Minute Production Mode

When ready for production, run:

```sql
-- Set timer to 45 minutes (2700 seconds) for PRODUCTION
UPDATE module_progression_rules 
SET minimum_content_time_seconds = 2700,
    updated_at = NOW()
WHERE course_id = (SELECT id FROM courses WHERE code = 'AIFUND001');

-- Verify
SELECT 
    m.title AS module_title,
    mpr.minimum_content_time_seconds / 60.0 AS minutes_required
FROM module_progression_rules mpr
JOIN modules m ON mpr.module_id = m.id
WHERE mpr.course_id = (SELECT id FROM courses WHERE code = 'AIFUND001');
```

**Expected:** `minutes_required: 45.0`

---

## 📝 Timer Behavior Explained

### How It Works:
- **Timer starts** when student opens module
- **Counts up:** 0 → 60 seconds (test) or 0 → 2700 seconds (production)
- **Student sees:** Progress bar showing "X/Y minutes"
- **Scroll required:** Student must also scroll to bottom
- **Quiz unlocks:** When BOTH requirements met ✅

### What Students See:
```
┌─────────────────────────────────────────────────┐
│ 📚 Complete Module Content to Unlock Quiz       │
│                                                 │
│ To access the quiz, you need to:               │
│ 1. Spend at least 1 minute reading             │ ← 60 sec test
│ 2. Scroll to the bottom of the page            │
│                                                 │
│ Reading Time: 0/1 minutes                       │
│ [████░░░░░░] 50%                                │
│                                                 │
│ Scrolled to Bottom: ✅ Complete                 │
└─────────────────────────────────────────────────┘
```

---

## 🎯 Current Setup Summary

| Setting | Test Mode | Production |
|---------|-----------|------------|
| **Time Required** | 60 seconds | 45 minutes |
| **Display Shows** | 0/1 minutes | 0/45 minutes |
| **Scroll Required** | YES | YES |
| **Pass Score** | 70% (14/20) | 70% (14/20) |
| **Max Attempts** | 3 | 3 |

---

## 📂 Related Files

- `ENABLE_60_SECOND_TEST_MODE.sql` - Run this NOW
- `SET_45_MINUTES_PRODUCTION.sql` - Run this LATER
- `TIMER_CONFIGURATION_GUIDE.md` - Full documentation

---

## ✅ Next Steps

1. **Run** the 60-second SQL script in Supabase ⏱️
2. **Test** in browser (wait 60 sec, scroll, quiz unlocks) 🧪
3. **Verify** the improved messaging is clear 📝
4. **Later:** Switch to 45 minutes for production 🚀

---

**Git Commit:** `8f81b88`  
**Repository:** https://github.com/Sarrol2384/vonwillingh-online-lms
