# Email Sender Quick Fix

## Problem:
Domain authentication taking too long (10+ hours, should be 1-24 hours)

## Quick Solution:
Use Brevo's verified relay email temporarily

## Steps:

### In Cloudflare Dashboard:
1. Go to: Workers & Pages → vonwillingh-online-lms
2. Settings → Environment variables
3. Edit FROM_EMAIL variable:
   - Current: sarrol@vonwillingh.co.za
   - Change to: noreply@vonwillingh-online.pages.dev
   OR
   - Change to: vonwillinghc@gmail.com (if verified in Brevo)

### Then:
1. Click "Save"
2. Create new deployment
3. Test application form
4. Check Brevo logs
5. Emails should deliver successfully

## Alternative - Verify Gmail in Brevo:
1. Brevo → Settings → Senders & IPs → Senders
2. Add new sender: vonwillinghc@gmail.com
3. Verify email
4. Update FROM_EMAIL to Gmail
5. Redeploy

## After DNS Works:
Change FROM_EMAIL back to: sarrol@vonwillingh.co.za
