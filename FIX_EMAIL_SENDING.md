# 🚨 EMAIL NOT SENDING - Missing Brevo API Key

## ❌ Problem
Applications are being created successfully, but confirmation emails are not being sent because the **BREVO_API_KEY** environment variable is missing in Cloudflare.

## ✅ Solution: Add Brevo API Key to Cloudflare

### Step 1: Get Your Brevo API Key

1. **Go to:** https://app.brevo.com/settings/keys/api
2. **Login** with your Brevo account
3. **Copy your API key** (starts with `xkeysib-`)

**Don't have a Brevo account?**
1. Sign up at: https://www.brevo.com/ (FREE - 300 emails/day)
2. Verify your email
3. Go to Settings → API Keys
4. Create a new API key
5. Copy it

### Step 2: Add to Cloudflare Environment Variables

1. **Go to:** https://dash.cloudflare.com
2. **Navigate to:** Pages → vonwillingh-online-lms
3. **Click:** Settings → Environment variables
4. **Click:** "Add variable"

**Add this variable:**
```
Variable name: BREVO_API_KEY
Value: xkeysib-YOUR_ACTUAL_API_KEY_HERE
Environment: Production ✅ (check this)
```

5. **Click:** "Save"

### Step 3: Redeploy

After adding the variable, you need to redeploy:

**Run this command:**
```bash
cd /home/user/webapp
export CLOUDFLARE_API_TOKEN="z2LVpFsGszg8hP42OQRfvZcX1SZMJVX47qVBfqiI"
npm run deploy
```

**OR use the quick script:**
```bash
cd /home/user/webapp && ./deploy.sh
```

### Step 4: Test Email

1. Submit a new test application
2. Check your email inbox (vonwillinghc@gmail.com)
3. You should receive: "Application Received - VonWillingh Online"

---

## 📋 All Required Environment Variables

Make sure these are ALL set in Cloudflare:

```
✅ SUPABASE_URL (already set)
✅ SUPABASE_ANON_KEY (already set)
✅ SUPABASE_SERVICE_ROLE_KEY (already set)
❌ BREVO_API_KEY (MISSING - add this!)
✅ FROM_EMAIL (should be: noreply@vonwillingh.co.za or your domain)
✅ CONTACT_EMAIL (should be: info@vonwillingh.co.za)
```

---

## 🔍 Check Current Application Status

**Run this SQL in Supabase:**

```sql
SELECT 
    a.id,
    a.status,
    a.created_at,
    s.full_name,
    s.email,
    c.name as course_name
FROM applications a
JOIN students s ON s.id = a.student_id
JOIN courses c ON c.id = a.course_id
WHERE s.email = 'vonwillinghc@gmail.com'
ORDER BY a.created_at DESC
LIMIT 5;
```

This will show if your application was created (it should be there with status "pending").

---

## 📧 What Emails Are Sent

The system sends these emails automatically:

1. **Application Received** - When student submits application
2. **Application Approved** - When admin approves (includes payment instructions)
3. **Application Rejected** - When admin rejects (with reason)
4. **Payment Verified** - When admin marks payment as verified (includes login credentials)
5. **Course Completion** - When student completes all modules and quizzes

---

## 🆘 Troubleshooting

### Email Not Received After Adding API Key?

**Check spam folder** - Brevo emails sometimes go to spam initially

**Verify API key is correct:**
- Starts with `xkeysib-`
- No extra spaces
- Copied completely

**Check Brevo dashboard:**
- Go to: https://app.brevo.com/statistics
- Check "Email Activity" to see if email was sent

**Test email manually:**
- Go to admin dashboard: https://vonwillingh-online-lms.pages.dev/admin-payments
- Approve an application
- This triggers approval email

---

## 🎯 Quick Summary

**To fix email sending:**

1. ✅ Get Brevo API key from https://app.brevo.com/settings/keys/api
2. ✅ Add `BREVO_API_KEY` to Cloudflare environment variables
3. ✅ Redeploy: `./deploy.sh`
4. ✅ Test by submitting a new application

**Estimated time:** 5 minutes

---

**Once you add the Brevo API key, ALL emails will work automatically!** 📧✅
