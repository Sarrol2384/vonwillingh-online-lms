# FIX: Add Missing Payment Columns to Applications Table

## The Error
```
Update failed: Could not find the 'payment_proof_url' column of 'applications' in the schema cache
```

**Why?** The `applications` table is missing the `payment_proof_url` and `payment_uploaded_at` columns that the payment upload code expects.

**Where?** In `src/index.tsx` line 3378:
```typescript
await supabase
  .from('applications')
  .update({
    payment_status: 'proof_uploaded',
    payment_proof_url: publicUrl,          // ⬅️ THIS COLUMN MISSING!
    payment_uploaded_at: new Date().toISOString()  // ⬅️ THIS TOO!
  })
```

---

## The Solution (30 seconds)

### Run This SQL in Supabase

**Go to:** https://supabase.com/dashboard → SQL Editor → New Query

**Copy and paste:**

```sql
-- Add missing payment columns to applications table
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS payment_proof_url TEXT,
ADD COLUMN IF NOT EXISTS payment_uploaded_at TIMESTAMP WITH TIME ZONE;
```

**Click Run** (or press Ctrl+Enter)

**Expected output:**
```
ALTER TABLE
```

---

## Verification

After running the SQL, verify the columns exist:

```sql
-- Check the columns
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'applications' 
AND column_name IN ('payment_proof_url', 'payment_uploaded_at', 'payment_status')
ORDER BY column_name;
```

**Expected result:**
```
payment_proof_url    | text                        | YES
payment_status       | text                        | YES
payment_uploaded_at  | timestamp with time zone    | YES
```

---

## Timeline

1. ✅ **Storage bucket created** → DONE (you did this)
2. ✅ **Add missing columns** → NOW (30 seconds)
3. ✅ **Test upload again** → NEXT (10 seconds)

---

## What These Columns Do

| Column | Purpose |
|--------|---------|
| `payment_proof_url` | Stores the Supabase Storage URL of the uploaded proof (bank slip/screenshot) |
| `payment_uploaded_at` | Timestamp when the student uploaded the proof |
| `payment_status` | Should already exist; tracks status: `pending` → `proof_uploaded` → `verified` |

---

## After Adding Columns

1. **Go back to the payment upload page**
   - URL: https://vonwillingh-online-lms.pages.dev/payment-upload?id={APPLICATION_ID}

2. **Upload your proof of payment** (the file you selected)
   - File: WhatsApp Image 2026-02-06 at 11.38.14.jpeg ✅

3. **Expected result:**
   - ✅ Success message: "Proof of payment uploaded successfully!"
   - ✅ File appears in Supabase Storage → `payment-proofs` bucket
   - ✅ Application row updated:
     - `payment_status = 'proof_uploaded'`
     - `payment_proof_url = 'https://{project}.supabase.co/storage/v1/object/public/payment-proofs/{filename}'`
     - `payment_uploaded_at = '2026-02-08T...'`
   - ✅ New payment record created in `payments` table

---

## BOTTOM LINE

**Quick Fix (30 seconds):**

1. ✅ Open Supabase SQL Editor
2. ✅ Run: `ALTER TABLE applications ADD COLUMN IF NOT EXISTS payment_proof_url TEXT, ADD COLUMN IF NOT EXISTS payment_uploaded_at TIMESTAMP WITH TIME ZONE;`
3. ✅ Go back to payment upload page
4. ✅ Click "Upload Proof" again
5. ✅ Should work now! 🚀

---

## Files

- SQL script: `/home/user/course-studio/ADD_PAYMENT_COLUMNS.sql`
- This guide: `/home/user/webapp/FIX_PAYMENT_COLUMNS.md`

**Run the SQL now and try uploading again!**
