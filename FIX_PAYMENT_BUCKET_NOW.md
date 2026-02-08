# FIX: Create Payment Proofs Storage Bucket

## The Problem
```
Error: "Bucket not found"
```

**Why?** The code expects a Supabase Storage bucket called `payment-proofs`, but it doesn't exist yet.

**Where?** In `src/index.tsx` line ~3331:
```typescript
const { data: uploadData, error: uploadError } = await adminClient.storage
  .from('payment-proofs')  // ⬅️ THIS BUCKET MUST EXIST!
  .upload(fileName, file, { contentType: file.type })
```

---

## The Solution (5 minutes)

### STEP 1: Create the Storage Bucket

1. **Go to Supabase Dashboard**
   - Open: https://supabase.com/dashboard
   - Select your project

2. **Navigate to Storage**
   - Left sidebar → Click "Storage"
   - Click "Create a new bucket"

3. **Create the Bucket**
   ```
   Bucket Name: payment-proofs
   Public bucket: ✅ YES (students need to upload)
   File size limit: 5 MB
   Allowed MIME types: image/jpeg, image/png, application/pdf
   ```

4. **Set Bucket Policies (IMPORTANT!)**
   - After creating the bucket, click on it
   - Go to "Policies" tab
   - Add these policies:

   **Policy 1: Allow Students to Upload**
   ```sql
   CREATE POLICY "Students can upload payment proofs"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (
     bucket_id = 'payment-proofs' 
     AND auth.role() = 'authenticated'
   );
   ```

   **Policy 2: Allow Anyone to Read (Public Access)**
   ```sql
   CREATE POLICY "Anyone can view payment proofs"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'payment-proofs');
   ```

   **Policy 3: Allow Admin to Delete**
   ```sql
   CREATE POLICY "Admin can delete payment proofs"
   ON storage.objects FOR DELETE
   TO authenticated
   USING (bucket_id = 'payment-proofs');
   ```

---

### STEP 2: Test the Upload

1. **Go back to the payment upload page**
   - URL: https://vonwillingh-online-lms.pages.dev/payment-upload?id={YOUR_APPLICATION_ID}

2. **Upload a test file**
   - Choose a JPG, PNG, or PDF (max 5 MB)
   - Click "Upload Proof of Payment"

3. **Expected Result**
   - ✅ Success message: "Proof of payment uploaded successfully!"
   - ✅ File appears in Supabase Storage → payment-proofs
   - ✅ Application status updates to "proof_uploaded"
   - ✅ Payment record created in payments table

---

## Quick Create SQL (Alternative Method)

If you prefer SQL, run this in Supabase SQL Editor:

```sql
-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment-proofs',
  'payment-proofs',
  true,
  5242880,  -- 5 MB in bytes
  ARRAY['image/jpeg', 'image/png', 'application/pdf']
);

-- Add upload policy
CREATE POLICY "Students can upload payment proofs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'payment-proofs');

-- Add read policy (public access)
CREATE POLICY "Anyone can view payment proofs"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'payment-proofs');

-- Add delete policy (admin only)
CREATE POLICY "Admin can delete payment proofs"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'payment-proofs');
```

---

## Verification

After creating the bucket, verify it exists:

```sql
-- Check bucket exists
SELECT * FROM storage.buckets WHERE id = 'payment-proofs';

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
```

---

## What Happens Next?

1. **Student uploads payment proof** → File saved to `payment-proofs` bucket
2. **System generates public URL** → `https://{project}.supabase.co/storage/v1/object/public/payment-proofs/{filename}`
3. **Application updated** → `payment_status = 'proof_uploaded'`, `payment_proof_url` set
4. **Payment record created** → New row in `payments` table
5. **Admin receives notification** → Can review and approve payment

---

## Timeline

- **Create bucket**: 2 minutes
- **Add policies**: 2 minutes
- **Test upload**: 1 minute
- **Total**: 5 minutes

---

## BOTTOM LINE

1. ✅ Go to Supabase → Storage
2. ✅ Create bucket: `payment-proofs` (public, 5 MB limit)
3. ✅ Add the 3 policies above
4. ✅ Test the upload
5. ✅ Upload should work!

**Let me know when you've created the bucket and I'll help you test it!** 🚀
