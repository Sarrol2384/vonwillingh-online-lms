# FIX: Add ALL Missing Payment Columns

## The Error Now
```
Update failed: Could not find the 'payment_status' column of 'applications' in the schema cache
```

**This means we need to add MULTIPLE payment columns, not just one!**

---

## COMPLETE FIX (Run This Once)

### **Go to Supabase SQL Editor**

1. Open: https://supabase.com/dashboard
2. Click "SQL Editor" → "New Query"
3. **Copy and paste this COMPLETE script:**

```sql
-- Add ALL missing payment columns to applications table
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_proof_url TEXT,
ADD COLUMN IF NOT EXISTS payment_uploaded_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS payment_verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS payment_method TEXT;
```

4. Click **Run** (or Ctrl+Enter)

5. **Expected output:**
```
ALTER TABLE
```

---

## What These Columns Do

| Column | Type | Default | Purpose |
|--------|------|---------|---------|
| `payment_status` | TEXT | 'pending' | Tracks payment lifecycle: `pending` → `proof_uploaded` → `verified` |
| `payment_proof_url` | TEXT | NULL | Stores Supabase Storage URL of uploaded proof (bank slip/screenshot) |
| `payment_uploaded_at` | TIMESTAMP | NULL | When student uploaded the proof |
| `payment_verified_at` | TIMESTAMP | NULL | When admin verified and approved the payment |
| `payment_method` | TEXT | NULL | Payment method used (e.g., 'eft', 'bank_transfer') |

---

## Verification

After running the SQL, verify all columns exist:

```sql
-- Check the payment columns
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'applications' 
AND column_name LIKE '%payment%'
ORDER BY column_name;
```

**Expected result:**
```
payment_method        | text                     | NULL
payment_proof_url     | text                     | NULL
payment_status        | text                     | 'pending'::text
payment_uploaded_at   | timestamp with time zone | NULL
payment_verified_at   | timestamp with time zone | NULL
```

---

## Then Upload Again

After running the SQL:

1. **Refresh the payment upload page**
2. **Your file is already selected:** `WhatsApp Image 2026-02-06 at 11.38.14.jpeg` ✅
3. **Click "Upload Proof"**

**Expected result:**
- ✅ Success: "Proof of payment uploaded successfully!"
- ✅ File saved to `payment-proofs` bucket
- ✅ Application updated:
  - `payment_status = 'proof_uploaded'`
  - `payment_proof_url = 'https://...supabase.co/storage/v1/object/public/payment-proofs/...'`
  - `payment_uploaded_at = '2026-02-08T...'`

---

## Summary: All Fixes Needed

| Fix | Status | Time |
|-----|--------|------|
| 1. Create `payment-proofs` storage bucket | ✅ DONE | 2 min |
| 2. Add `payment_status` column | ⏳ NOW | 30 sec |
| 3. Add `payment_proof_url` column | ⏳ NOW | (same) |
| 4. Add `payment_uploaded_at` column | ⏳ NOW | (same) |
| 5. Add `payment_verified_at` column | ⏳ NOW | (same) |
| 6. Add `payment_method` column | ⏳ NOW | (same) |

**All 5 columns added in ONE command! ⬆️**

---

## Why This Happened

The `applications` table schema in your database is different from what the code expects. The upload code was written expecting these payment columns, but they were never added to the database.

**This is the COMPLETE fix - no more missing columns after this!**

---

## Timeline

- ✅ Storage bucket: DONE
- ⏳ Run SQL to add columns: **30 seconds**
- ⏳ Test upload: **10 seconds**
- **Total: 40 seconds to complete**

---

## Files

- Complete SQL script: `/home/user/course-studio/ADD_ALL_PAYMENT_COLUMNS.sql`
- This guide: `/home/user/webapp/FIX_ALL_PAYMENT_COLUMNS.md`

---

## BOTTOM LINE

**Run this ONE command to add ALL missing columns:**

```sql
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_proof_url TEXT,
ADD COLUMN IF NOT EXISTS payment_uploaded_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS payment_verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS payment_method TEXT;
```

**Then upload your proof again - it WILL work this time!** 🚀

---

## Need Help?

Let me know:
- ✅ When you've run the SQL
- ✅ What the output says
- ✅ Whether the upload works after

I'm here to help! 💪
