# 🎯 STEP-BY-STEP: Connect GitHub to Cloudflare

## You're Here: Cloudflare Settings Page ✅

Now follow these exact steps:

---

## **STEP 1: Navigate to Builds & deployments**

In your current Cloudflare page, look at the **left sidebar** under Settings:

1. You should see:
   - Variables and Secrets (you're here now)
   - **Bindings** ← click this or...
   - **Builds & deployments** ← **CLICK THIS!**
   - Runtime
   - General

2. **Click on "Builds & deployments"** in the left sidebar

---

## **STEP 2: Connect to GitHub**

Once you're in **Builds & deployments**, you should see:

1. A section that says **"Source"** or **"Build configuration"**
2. Look for a button or link that says:
   - **"Connect to Git"** or
   - **"Configure"** or
   - **"Connect repository"**

3. **Click that button**

---

## **STEP 3: Authorize GitHub**

You'll be taken to GitHub to authorize Cloudflare:

1. GitHub will ask: "Authorize Cloudflare Pages?"
2. **Click "Authorize"**
3. It may ask which repositories to give access to
4. Choose: **"Only select repositories"**
5. Select: **`Sarrol2384/vonwillingh-online-lms`**
6. **Click "Install & Authorize"**

---

## **STEP 4: Configure Build Settings**

Back in Cloudflare, you'll see a form. Fill it in:

| Field | Value |
|-------|-------|
| **Repository** | `Sarrol2384/vonwillingh-online-lms` |
| **Production branch** | `main` |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | (leave blank or `/`) |

---

## **STEP 5: Environment Variables**

Scroll down to **Environment variables** section.

You already have these variables set (I saw them in your screenshot):
- ✅ `BANK_ACCOUNT_NAME`
- ✅ `BANK_ACCOUNT_NUMBER`
- ✅ `BANK_BRANCH_CODE`
- ✅ (and others)

**These are already good! Don't change them.**

---

## **STEP 6: Save and Deploy**

1. Scroll to the bottom
2. **Click "Save and Deploy"**
3. Cloudflare will:
   - Connect to GitHub ✅
   - Pull the latest code ✅
   - Run `npm run build` ✅
   - Deploy to production ✅

---

## **STEP 7: Wait for Build (2-5 minutes)**

You'll see a build log showing:

```
Building...
✓ Cloning repository
✓ Installing dependencies
✓ Running npm run build
✓ Deploying to production
✅ Deployment successful!
```

**Wait for it to finish!**

---

## **STEP 8: Verify Deployment**

Once complete:

1. Go to the **Deployments** tab (top of page)
2. You should see:
   - Latest deployment: `SUCCESS` ✅
   - Branch: `main`
   - Commit: `f934e67` (or newer)
   - Status: **Live**

---

## **After Deployment is Live**

Then proceed with:

### **STEP 9: Run SQL Cleanup**
```sql
-- In Supabase: https://supabase.com/dashboard
-- SQL Editor → New Query → Paste this:

DO $$
DECLARE
  course_record RECORD;
  deleted_count INTEGER := 0;
BEGIN
  FOR course_record IN 
    SELECT id, code, name FROM courses 
    WHERE code LIKE 'BASS%' OR code LIKE 'TEST%' OR code LIKE 'AIBIZ%' OR code LIKE 'AI%'
  LOOP
    DELETE FROM applications WHERE course_id = course_record.id;
    DELETE FROM enrollments WHERE course_id = course_record.id;
    DELETE FROM module_progress WHERE module_id IN (SELECT id FROM modules WHERE course_id = course_record.id);
    DELETE FROM modules WHERE course_id = course_record.id;
    DELETE FROM courses WHERE id = course_record.id;
    deleted_count := deleted_count + 1;
  END LOOP;
  RAISE NOTICE '✅ Deleted % courses', deleted_count;
END $$;
```

### **STEP 10: Insert Fresh Course**

Use: `/home/user/course-studio/FRESH_COURSE_INSERT.sql`

---

## 🎯 **QUICK SUMMARY**

**RIGHT NOW:**
1. In Cloudflare Settings (where you are)
2. Click **"Builds & deployments"** in left sidebar
3. Click **"Connect to Git"**
4. Authorize GitHub
5. Select repo: `vonwillingh-online-lms`
6. Set build command: `npm run build`
7. Set output: `dist`
8. **Click "Save and Deploy"**

**THEN:**
- Wait 2-5 minutes for build
- Run SQL cleanup
- Run SQL insert
- ✅ Done!

---

## ❓ **CAN'T FIND "Builds & deployments"?**

If you don't see it in the left sidebar, try:

1. Click on **"Pages"** in the top navigation
2. Find **"vonwillingh-online-lms"** project
3. Click on it
4. Look for tabs at the top:
   - Deployments
   - Metrics
   - Custom domains
   - **Settings** ← you're here
5. Within Settings, scroll down or look for **"Build configuration"** section

---

Let me know when you find the "Builds & deployments" section and I'll guide you through the next step! 🚀
