# ⏱️ Quiz Timer Configuration Guide

## 🚀 Quick Actions

### Enable 60-Second Test Mode (NOW)

**Run this in Supabase SQL Editor:**
```
https://supabase.com/dashboard/project/dgcobxtkzewzkrzpfcdr/sql/new
```

**Script:** `/home/user/webapp/ENABLE_60_SECOND_TEST_MODE.sql`

**Or copy this:**
```sql
UPDATE module_progression_rules 
SET minimum_content_time_seconds = 60
WHERE module_id IN (
    SELECT m.id FROM modules m 
    JOIN courses c ON m.course_id = c.id 
    WHERE c.code = 'AIFUND001' AND m.title ILIKE '%Module 1%'
);
```

**Result:** Quiz unlocks after **1 minute** instead of 30 minutes

---

### Switch to 45 Minutes (LATER - Production)

**Run this in Supabase SQL Editor:**

**Script:** `/home/user/webapp/SET_45_MINUTES_PRODUCTION.sql`

**Or copy this:**
```sql
UPDATE module_progression_rules 
SET minimum_content_time_seconds = 2700
WHERE module_id IN (
    SELECT m.id FROM modules m 
    JOIN courses c ON m.course_id = c.id 
    WHERE c.code = 'AIFUND001' AND m.title ILIKE '%Module 1%'
);
```

**Result:** Quiz unlocks after **45 minutes** of reading

---

## 📊 Time Conversions

| Time | Seconds | SQL Value |
|------|---------|-----------|
| **1 minute** | 60 | `60` |
| **5 minutes** | 300 | `300` |
| **10 minutes** | 600 | `600` |
| **15 minutes** | 900 | `900` |
| **30 minutes** | 1800 | `1800` |
| **45 minutes** | 2700 | `2700` |
| **60 minutes** | 3600 | `3600` |

---

## 🧪 Testing Steps (With 60-Second Mode)

1. **Enable test mode** (run script above)

2. **Open Module 1:**
   - URL: https://vonwillingh-online-lms.pages.dev/student-login
   - Log in with test student
   - Open course AIFUND001
   - Click "Module 1: Introduction to AI for Small Business"

3. **Scroll to bottom:**
   - You'll see the blue instruction box
   - Timer shows: "0 / 1 minute (1 min remaining)"

4. **Wait 60 seconds:**
   - Timer updates every 10 seconds
   - "0 / 1 minute" → "1 / 1 minute"
   - Scroll requirement shows "Not yet"

5. **Scroll all the way down:**
   - Past all content to the very bottom
   - Scroll requirement changes to "Complete ✓"

6. **Quiz unlocks:**
   - Green success message appears
   - Button changes to "Start Quiz"
   - Click to open quiz modal

7. **Take quiz:**
   - Answer all 20 questions
   - Submit and verify pass/fail results

**Total test time: ~2 minutes** ✅

---

## 🎯 Current Settings

After running the test mode script:

- ⏱️ **Time required:** 60 seconds (1 minute)
- 📜 **Scroll required:** Yes (to bottom)
- 📝 **Quiz questions:** 20
- ✅ **Passing score:** 70% (14/20 correct)
- 🔄 **Max attempts:** 3
- 🔒 **Blocks Module 2:** Until passed

---

## 🔄 Switching Between Modes

### Quick Commands

**Test Mode (60 seconds):**
```sql
UPDATE module_progression_rules SET minimum_content_time_seconds = 60;
```

**Production Mode (45 minutes):**
```sql
UPDATE module_progression_rules SET minimum_content_time_seconds = 2700;
```

**Check Current Setting:**
```sql
SELECT 
    m.title,
    mpr.minimum_content_time_seconds AS seconds,
    ROUND(mpr.minimum_content_time_seconds / 60.0, 1) AS minutes
FROM module_progression_rules mpr
JOIN modules m ON mpr.module_id = m.id
WHERE m.title ILIKE '%Module 1%';
```

---

## 📝 Verification Query

After changing the time setting, verify it worked:

```sql
SELECT 
    m.title AS module,
    mpr.minimum_content_time_seconds AS seconds,
    CASE 
        WHEN mpr.minimum_content_time_seconds = 60 THEN '1 minute (TEST MODE)'
        WHEN mpr.minimum_content_time_seconds = 2700 THEN '45 minutes (PRODUCTION)'
        ELSE ROUND(mpr.minimum_content_time_seconds / 60.0, 0) || ' minutes'
    END AS readable_time
FROM module_progression_rules mpr
JOIN modules m ON mpr.module_id = m.id
WHERE m.title ILIKE '%Module 1%';
```

**Expected results:**
- **Test mode:** "1 minute (TEST MODE)"
- **Production mode:** "45 minutes (PRODUCTION)"

---

## ⚠️ Important Notes

1. **Test mode is for development only** - Don't leave it at 60 seconds for real students!

2. **Students already in progress** - If a student is already reading when you change the setting, they need to refresh the page to see the new time requirement.

3. **Hard refresh** - After changing settings, students should hard-refresh (Ctrl+Shift+R or Cmd+Shift+R) to clear cache.

4. **Timer is active time** - Only counts time when the student is on the page (tab is active).

---

## 🎯 Recommended Timeline

| Phase | Time Setting | Purpose |
|-------|-------------|---------|
| **Now (Testing)** | 60 seconds | Quick testing of the complete workflow |
| **Beta Testing** | 15-30 minutes | Test with a few real students |
| **Production** | 45 minutes | Full deployment for all students |

---

## 🚀 Next Steps

1. ✅ **Run test mode script** → `/home/user/webapp/ENABLE_60_SECOND_TEST_MODE.sql`
2. ✅ **Test complete workflow** → Take quiz after 60 seconds
3. ✅ **Verify pass/fail logic** → Test both scenarios
4. ✅ **Check Module 2 blocking** → Verify it unlocks after passing
5. ⏳ **Switch to production** → Run `/home/user/webapp/SET_45_MINUTES_PRODUCTION.sql`

---

**Files Created:**
- `/home/user/webapp/ENABLE_60_SECOND_TEST_MODE.sql` - Enable test mode
- `/home/user/webapp/SET_45_MINUTES_PRODUCTION.sql` - Enable production mode
- `/home/user/webapp/TIMER_CONFIGURATION_GUIDE.md` - This guide

**Git Commit:** `6383d38`

---

**Ready to test! Run the 60-second script and open Module 1.** 🚀
