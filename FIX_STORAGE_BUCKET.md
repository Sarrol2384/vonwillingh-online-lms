# 🔧 FIX: Supabase Storage Bucket Not Found

## 🎯 Problem
Error: "Upload failed: Bucket not found"

This means the Supabase Storage bucket for payment proofs hasn't been created yet.

---

## ✅ SOLUTION: Create Storage Bucket in Supabase

### **Step 1: Go to Supabase Dashboard**
1. Open: https://supabase.com/dashboard
2. Select your project (vonwillingh-online-lms)

### **Step 2: Navigate to Storage**
1. Click **"Storage"** in the left sidebar
2. You should see a list of buckets (or empty if none exist)

### **Step 3: Create New Bucket**
Click **"New Bucket"** or **"Create Bucket"**

**Bucket Configuration:**
```
Bucket Name: payment-proofs
Public: No (keep private for security)
File size limit: 5 MB
Allowed MIME types: 
  - application/pdf
  - image/jpeg
  - image/jpg
  - image/png
```

Click **"Create Bucket"**

### **Step 4: Set Bucket Policies (IMPORTANT!)**

After creating the bucket, set these policies:

**Policy 1: Allow authenticated users to upload**
```sql
-- Policy name: Allow authenticated uploads
-- Allowed operation: INSERT
-- Target roles: authenticated
-- Policy definition:
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'payment-proofs');
```

**Policy 2: Allow users to view their own uploads**
```sql
-- Policy name: Allow users to view own files
-- Allowed operation: SELECT
-- Target roles: authenticated
-- Policy definition:
CREATE POLICY "Allow users to view own files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'payment-proofs');
```

**Policy 3: Allow admins to view all files**
```sql
-- Policy name: Allow admin access
-- Allowed operation: SELECT
-- Target roles: authenticated
-- Policy definition:
CREATE POLICY "Allow admin access"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'payment-proofs');
```

### **Step 5: Test Upload**

After creating the bucket:
1. Go back to the payment upload page
2. Try uploading your proof of payment again
3. Should work! ✅

---

## 🎯 QUICK SETUP (Via Supabase UI)

### **In Supabase Storage Dashboard:**

1. **Click "New Bucket"**
2. **Name:** `payment-proofs`
3. **Public:** ❌ No (uncheck)
4. **File size limit:** 5 MB
5. **Allowed file types:** PDF, JPG, PNG
6. **Click "Create"**

7. **Click the bucket → "Policies" tab**
8. **Click "New Policy"**
9. **Select "For full customization"**
10. **Add the INSERT policy** (allow authenticated users)
11. **Add the SELECT policy** (allow users to view)
12. **Save**

---

## 🎯 ALTERNATIVE: Manual SQL Setup

If you prefer SQL, run this in Supabase SQL Editor:

```sql
-- Create storage bucket (if not exists via UI)
-- Note: Buckets are usually created via UI

-- Set up policies
CREATE POLICY "Allow authenticated file uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'payment-proofs');

CREATE POLICY "Allow users to read payment proofs"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'payment-proofs');

CREATE POLICY "Allow admins to manage payment proofs"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'payment-proofs');
```

---

## 🎯 WHAT THE BUCKET IS FOR

The `payment-proofs` bucket stores:
- Student payment proof uploads (bank slips, screenshots)
- PDF, JPG, PNG files
- Max 5MB per file
- Private (only authenticated users can access)

When a student uploads proof of payment:
1. File is uploaded to Supabase Storage
2. URL is saved in the database (applications table)
3. Admin can view/download the proof
4. Admin can approve/reject based on proof

---

## 🎯 AFTER FIXING

Once the bucket is created:
1. ✅ Go back to payment upload page
2. ✅ Upload your proof (bank slip or screenshot)
3. ✅ Click "Upload Proof"
4. ✅ Should succeed!
5. ✅ Admin can then review and approve

---

## 📸 NEED HELP?

If you need help creating the bucket:
1. Take a screenshot of your Supabase Storage page
2. Show me
3. I'll guide you through each click!

---

🎯 **Go create the `payment-proofs` bucket now!** 🪣
