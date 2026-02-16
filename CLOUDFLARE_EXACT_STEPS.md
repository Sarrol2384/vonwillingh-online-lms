# 🎯 EXACT STEPS - Do This Now

## You're on the right page! Here's what to do:

### Step 1: Click "Settings" (Left Sidebar)
Look at the left side of your screen, you'll see:
- Workers & Pages (you're here ✅)
- Click **"Settings"** (under vonwillingh-online-lms)

### Step 2: Find "Environment variables"
In the Settings page, look for:
- **"Environment variables"** section
- Click on it

### Step 3: Click "Add variable" (or "Edit variables")

### Step 4: Add These 3 Variables

**Variable 1:**
```
Name: SUPABASE_URL
Value: https://dgcobxtkzewzkrzpfcdr.supabase.co
Environment: Production ✅ (check this box)
```
Click "Save" or "Add"

**Variable 2:**
```
Name: SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnY29ieHRrZXd6a3J6cGZjZHIiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNTY1MDM4NSwiZXhwIjoyMDUxMjI2Mzg1fQ.k8fQ8TY3oYmIXGZj0FiYkfzLIoVz5aWXN4qwWqXJE_0
Environment: Production ✅
```
Click "Save" or "Add"

**Variable 3:**
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: [You need to get this from Supabase - see below]
Environment: Production ✅
```

### Step 5: Get Your Service Role Key

**Open a new tab and go to:**
https://supabase.com/dashboard/project/dgcobxtkzewzkrzpfcdr/settings/api

**Look for:**
- Section called "Project API keys"
- Find **"service_role"** (NOT anon)
- Click the eye icon to reveal it
- Copy the entire key
- Paste it as the value for Variable 3

### Step 6: Save All Variables

Click **"Save"** or **"Deploy"** button

### Step 7: Redeploy

Go back to **"Deployments"** tab (where you are now in the screenshot)

Find the **LATEST deployment** (top one - "7 days ago"):
1. Click the **"View details"** button on the right
2. OR click the **"..."** menu (three dots)
3. Click **"Retry deployment"** or **"Redeploy"**

### Step 8: Wait & Check

- Wait **2-3 minutes** for build to complete
- Visit: https://vonwillingh-online-lms.pages.dev/courses
- Hard refresh: **Ctrl + Shift + R**
- You should see your real courses!

---

## 🆘 Can't Find Settings?

If you don't see "Settings" in the left sidebar:
1. Make sure you clicked on **"vonwillingh-online-lms"** project
2. You should see tabs at the top: Deployments, Metrics, Custom domains, **Settings**
3. Click the **Settings** tab at the top

---

## ✅ You'll Know It Worked When:

- Course count changes from "40 Programs" to something else
- "Vibe Coder's First Import Test" appears
- Real database courses show up

**DO THIS NOW!** Takes 3 minutes max! 🚀
