# VonWillingh Online - Complete Setup & Deployment Guide

**Created:** 2026-02-01  
**Status:** ✅ Ready for Deployment  
**Project:** VonWillingh Online Learning Management System

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [GitHub Repository Setup](#github-repository-setup)
3. [Supabase Database Setup](#supabase-database-setup)
4. [Email Service Setup (Brevo)](#email-service-setup-brevo)
5. [Local Development](#local-development)
6. [Cloudflare Pages Deployment](#cloudflare-pages-deployment)
7. [Post-Deployment Configuration](#post-deployment-configuration)
8. [Testing & Verification](#testing--verification)
9. [Troubleshooting](#troubleshooting)

---

## ✅ Pre-Deployment Checklist

### Completed Items
- [x] VonWillingh Online branding applied
- [x] 30 business courses created (10 FREE + 20 paid)
- [x] Logo installed (vonwillingh-logo.png)
- [x] Contact info updated (sarrol@vonwillingh.co.za)
- [x] Banking details configured (S Von Willingh / Absa)
- [x] Certificate prefix changed (VW-)
- [x] All PBK/Eyethu references removed
- [x] Project built successfully
- [x] Git commits complete

### Pending Items
- [ ] GitHub repository renamed
- [ ] Supabase project created
- [ ] Brevo email service configured
- [ ] Cloudflare Pages deployed
- [ ] Environment variables set
- [ ] Courses uploaded to database
- [ ] Test enrollment completed

---

## 1. GitHub Repository Setup

### Option A: Rename Existing Repository (Recommended)

1. **Go to GitHub:**
   - Visit: https://github.com/Sarrol2384/pbk-lms-or-pbk-leadership-institute
   - Click **Settings** tab

2. **Rename Repository:**
   - Scroll to "Repository name"
   - Change to: `vonwillingh-online-lms`
   - Click "Rename"

3. **Update Local Git Remote:**
   ```bash
   cd /home/user/webapp
   git remote set-url origin https://github.com/Sarrol2384/vonwillingh-online-lms.git
   git remote -v  # Verify the change
   ```

4. **Push Changes:**
   ```bash
   git push origin main
   ```

### Option B: Create New Repository

1. Create new repo: `vonwillingh-online-lms`
2. Update remote:
   ```bash
   git remote set-url origin https://github.com/Sarrol2384/vonwillingh-online-lms.git
   git push -u origin main
   ```

---

## 2. Supabase Database Setup

### Step 1: Create Supabase Project

1. **Go to Supabase:**
   - Visit: https://supabase.com
   - Sign in with GitHub

2. **Create New Project:**
   - Click "New Project"
   - Name: `VonWillingh Online LMS`
   - Database Password: (Choose strong password - SAVE THIS!)
   - Region: `South Africa (Cape Town)` or closest
   - Pricing Plan: Free tier is sufficient to start

3. **Wait for Setup:** (takes 2-3 minutes)

### Step 2: Get API Credentials

1. **Go to Project Settings:**
   - Click Settings (gear icon) → API

2. **Copy These Values:**
   ```
   Project URL: https://xxxxx.supabase.co
   anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
   service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
   ```

3. **⚠️ IMPORTANT:** Save these securely! You'll need them for environment variables.

### Step 3: Create Database Schema

1. **Open SQL Editor:**
   - Go to SQL Editor (left sidebar)
   - Click "New Query"

2. **Run This Schema:**

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Students table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    address TEXT,
    date_of_birth DATE,
    highest_qualification TEXT,
    institution TEXT,
    year_completed INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Courses table
CREATE TABLE IF NOT EXISTS public.courses (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT,
    category TEXT NOT NULL,
    level TEXT NOT NULL,
    modules_count INTEGER,
    duration TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    description TEXT,
    is_free BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Applications table
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id),
    course_id INTEGER REFERENCES public.courses(id),
    status TEXT DEFAULT 'pending',
    motivation TEXT,
    id_document_url TEXT,
    transcripts_url TEXT,
    certificates_url TEXT,
    cv_url TEXT,
    photo_url TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id),
    course_id INTEGER REFERENCES public.courses(id),
    payment_status TEXT DEFAULT 'pending',
    payment_amount DECIMAL(10,2),
    payment_method TEXT,
    payment_date TIMESTAMP WITH TIME ZONE,
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    completion_date TIMESTAMP WITH TIME ZONE,
    certificate_url TEXT,
    certificate_id TEXT
);

-- Modules table
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id INTEGER REFERENCES public.courses(id),
    title TEXT NOT NULL,
    description TEXT,
    order_number INTEGER NOT NULL,
    content TEXT,
    content_type TEXT DEFAULT 'lesson',
    duration_minutes INTEGER,
    video_url TEXT,
    pdf_materials TEXT[],
    quiz JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Student Progress table
CREATE TABLE IF NOT EXISTS public.student_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id),
    module_id UUID REFERENCES public.modules(id),
    enrollment_id UUID REFERENCES public.enrollments(id),
    status TEXT DEFAULT 'locked',
    time_spent_minutes INTEGER DEFAULT 0,
    quiz_score INTEGER,
    assignment_submitted BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Admin Users table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enrollment_id UUID REFERENCES public.enrollments(id),
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'ZAR',
    payment_method TEXT,
    transaction_id TEXT,
    status TEXT DEFAULT 'pending',
    proof_of_payment_url TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Courses (public read)
CREATE POLICY "Courses are viewable by everyone" ON public.courses
    FOR SELECT USING (true);

-- RLS Policies for Students (own data only)
CREATE POLICY "Students can view own data" ON public.students
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Students can update own data" ON public.students
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for Applications
CREATE POLICY "Users can insert applications" ON public.applications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own applications" ON public.applications
    FOR SELECT USING (student_id IN (SELECT id FROM public.students WHERE auth.uid() = id));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_applications_student_id ON public.applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON public.enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_modules_course_id ON public.modules(course_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_student_id ON public.student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_module_id ON public.student_progress(module_id);
```

3. **Click "Run"** and verify all tables are created successfully.

### Step 4: Create Storage Buckets

1. **Go to Storage:**
   - Click Storage (left sidebar)
   - Create these buckets:

2. **Create Buckets:**
   
   **Bucket 1: application-documents** (Private)
   - Name: `application-documents`
   - Public: NO (unchecked)
   - File size limit: 5MB
   - For: ID documents, transcripts, certificates, CVs, photos

   **Bucket 2: course-materials** (Public)
   - Name: `course-materials`
   - Public: YES (checked)
   - For: Video lectures, PDF materials

   **Bucket 3: certificates** (Private)
   - Name: `certificates`
   - Public: NO (unchecked)
   - For: Generated student certificates

3. **Set Storage Policies:** (Run in SQL Editor)

```sql
-- Application documents: authenticated users can upload
CREATE POLICY "Authenticated users can upload application docs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'application-documents');

CREATE POLICY "Users can view own application docs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'application-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Course materials: public read, admin write
CREATE POLICY "Anyone can view course materials"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'course-materials');

-- Certificates: users can view own certificates
CREATE POLICY "Users can view own certificates"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Step 5: Insert Sample VonWillingh Courses

```sql
-- Insert the 30 VonWillingh Online business courses
INSERT INTO public.courses (name, code, category, level, modules_count, duration, price, is_free, description) VALUES
-- FREE Short Courses
('AI Tools Every Small Business Should Use in 2026', 'AI-FREE-001', 'AI & Technology', 'Short Course', 3, '2 hours', 0, TRUE, 'Discover essential AI tools to transform your small business operations.'),
('From Chaos to Clarity: Organizing Your Business', 'BM-FREE-001', 'Business Management', 'Short Course', 4, '3 hours', 0, TRUE, 'Learn practical organizational systems for small businesses.'),
('Social Media Marketing for Beginners', 'DM-FREE-001', 'Digital Marketing', 'Short Course', 3, '2 hours', 0, TRUE, 'Master social media basics for business growth.'),
('Excel Basics for Business Owners', 'BT-FREE-001', 'Business Tools', 'Short Course', 4, '3 hours', 0, TRUE, 'Essential Excel skills every business owner needs.'),
('Financial Literacy: Understanding Your Numbers', 'FIN-FREE-001', 'Finance', 'Short Course', 3, '2 hours', 0, TRUE, 'Demystify business finances and understand your numbers.'),
('Time Management for Busy Entrepreneurs', 'PROD-FREE-001', 'Productivity', 'Short Course', 3, '2 hours', 0, TRUE, 'Maximize productivity and manage your time effectively.'),
('Building Your Brand on a Budget', 'BRAND-FREE-001', 'Branding', 'Short Course', 3, '2 hours', 0, TRUE, 'Create a strong brand without breaking the bank.'),
('Customer Service Excellence', 'CS-FREE-001', 'Customer Relations', 'Short Course', 4, '3 hours', 0, TRUE, 'Deliver exceptional customer service consistently.'),
('Email Marketing Made Simple', 'DM-FREE-002', 'Digital Marketing', 'Short Course', 3, '2 hours', 0, TRUE, 'Build effective email marketing campaigns.'),
('Business Plan Basics in One Afternoon', 'BP-FREE-001', 'Business Planning', 'Short Course', 3, '2 hours', 0, TRUE, 'Create a simple, effective business plan.'),

-- Digital Marketing (4 paid)
('Complete Digital Marketing Mastery', 'DM-CERT-001', 'Digital Marketing', 'Certificate', 8, '6 weeks', 2500, FALSE, 'Comprehensive digital marketing training for business growth.'),
('Social Media Strategy for Business Growth', 'DM-CERT-002', 'Digital Marketing', 'Certificate', 6, '4 weeks', 1800, FALSE, 'Develop winning social media strategies.'),
('Content Marketing & Storytelling', 'DM-CERT-003', 'Digital Marketing', 'Certificate', 7, '5 weeks', 2200, FALSE, 'Master content creation and brand storytelling.'),
('Google Ads & Facebook Advertising', 'DM-CERT-004', 'Digital Marketing', 'Certificate', 6, '4 weeks', 2000, FALSE, 'Run profitable online advertising campaigns.'),

-- Business Management (4 paid)
('Small Business Management Essentials', 'BM-CERT-001', 'Business Management', 'Certificate', 10, '8 weeks', 3500, FALSE, 'Complete guide to managing a small business.'),
('Strategic Planning for Entrepreneurs', 'BS-CERT-001', 'Business Strategy', 'Certificate', 8, '6 weeks', 2800, FALSE, 'Develop strategic plans for business success.'),
('Operations Management for Small Businesses', 'BM-CERT-002', 'Business Management', 'Certificate', 7, '5 weeks', 2400, FALSE, 'Streamline operations and boost efficiency.'),
('Scaling Your Business: Growth Strategies', 'BS-CERT-002', 'Business Strategy', 'Certificate', 9, '7 weeks', 3200, FALSE, 'Scale your business sustainably.'),

-- Finance (3 paid)
('Bookkeeping & Accounting for Non-Accountants', 'FIN-CERT-001', 'Finance', 'Certificate', 8, '6 weeks', 2600, FALSE, 'Master business finances without being an accountant.'),
('Financial Management for Small Businesses', 'FIN-CERT-002', 'Finance', 'Certificate', 10, '8 weeks', 3200, FALSE, 'Comprehensive financial management training.'),
('Cash Flow Management & Forecasting', 'FIN-CERT-003', 'Finance', 'Certificate', 6, '4 weeks', 2000, FALSE, 'Master cash flow for business stability.'),

-- Sales (3 paid)
('Sales Mastery: From Lead to Close', 'SALES-CERT-001', 'Sales', 'Certificate', 8, '6 weeks', 2800, FALSE, 'Complete sales training for entrepreneurs.'),
('Customer Relationship Management (CRM)', 'CR-CERT-001', 'Customer Relations', 'Certificate', 6, '4 weeks', 2200, FALSE, 'Build lasting customer relationships.'),
('Negotiation Skills for Entrepreneurs', 'SALES-CERT-002', 'Sales', 'Certificate', 5, '3 weeks', 1800, FALSE, 'Master negotiation in business.'),

-- AI & Technology (3 paid)
('AI for Business: Practical Applications', 'AI-CERT-001', 'AI & Technology', 'Certificate', 8, '6 weeks', 2900, FALSE, 'Implement AI tools in your business.'),
('ChatGPT & AI Tools for Productivity', 'AI-CERT-002', 'AI & Technology', 'Certificate', 6, '4 weeks', 2200, FALSE, 'Boost productivity with AI assistants.'),
('Building Your Online Business Presence', 'TECH-CERT-001', 'Technology', 'Certificate', 7, '5 weeks', 2500, FALSE, 'Establish your business online.'),

-- Leadership & HR (3 paid)
('Leadership Skills for Small Business Owners', 'LEAD-CERT-001', 'Leadership', 'Certificate', 7, '5 weeks', 2600, FALSE, 'Develop essential leadership skills.'),
('Hiring & Managing Your First Employees', 'HR-CERT-001', 'Human Resources', 'Certificate', 6, '4 weeks', 2200, FALSE, 'Build and manage your first team.'),
('Team Building & Company Culture', 'LEAD-CERT-002', 'Leadership', 'Certificate', 5, '3 weeks', 1900, FALSE, 'Create a positive company culture.');
```

### Step 6: Create First Admin User

1. **Go to Authentication:**
   - Click Authentication → Users
   - Click "Add User"

2. **Create Admin:**
   - Email: `sarrol@vonwillingh.co.za`
   - Password: (Choose strong password)
   - Auto Confirm: YES

3. **Get User ID:**
   - Click on the newly created user
   - Copy the UUID (e.g., `123e4567-e89b-12d3-a456-426614174000`)

4. **Add to admin_users table:**

```sql
INSERT INTO public.admin_users (id, email, full_name, role)
VALUES (
  '123e4567-e89b-12d3-a456-426614174000',  -- Replace with actual UUID
  'sarrol@vonwillingh.co.za',
  'Sarrol Von Willingh',
  'super_admin'
);
```

---

## 3. Email Service Setup (Brevo)

### Step 1: Create Brevo Account

1. **Sign Up:**
   - Visit: https://www.brevo.com
   - Click "Sign up free"
   - Email: `sarrol@vonwillingh.co.za`
   - Complete verification

2. **Free Plan Benefits:**
   - 300 emails per day
   - 9,000 emails per month
   - Perfect for getting started!

### Step 2: Get API Key

1. **Go to SMTP & API:**
   - Dashboard → SMTP & API
   - Click "Create a new API key"

2. **Create Key:**
   - Name: `VonWillingh Online LMS`
   - Permissions: Full access
   - Click "Generate"

3. **Copy API Key:**
   - Format: `xkeysib-xxxxxxxxx...`
   - **SAVE THIS!** You won't see it again.

### Step 3: Configure Sender (Optional - for production)

For now, you can use Brevo's default sender. For custom domain later:

1. Go to **Senders & IP** → **Domains**
2. Add domain: `vonwillingh.co.za`
3. Add DNS records (SPF, DKIM, DMARC)
4. Wait for verification (24-48 hours)

For testing, use: `noreply@sendingtest.brevo.com` (Brevo provides this)

---

## 4. Local Development

### Step 1: Create .dev.vars File

```bash
cd /home/user/webapp
cp .dev.vars.example .dev.vars
```

### Step 2: Edit .dev.vars

```bash
nano .dev.vars
```

**Add your actual values:**

```env
# Supabase (from Step 2.2)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx

# Brevo (from Step 3.2)
BREVO_API_KEY=xkeysib-xxxxx

# Contact Info
FROM_EMAIL=noreply@vonwillingh.co.za
CONTACT_EMAIL=sarrol@vonwillingh.co.za
CONTACT_PHONE=081 216 3629

# Banking
BANK_NAME=Absa
BANK_ACCOUNT_NAME=S Von Willingh
BANK_ACCOUNT_NUMBER=01163971026
BANK_BRANCH_CODE=632005
BANK_ACCOUNT_TYPE=Cheque Account
```

**Save:** Ctrl+O, Enter, Ctrl+X

### Step 3: Install Dependencies

```bash
cd /home/user/webapp
npm install
```

### Step 4: Build Project

```bash
npm run build
```

### Step 5: Test Locally

```bash
npm run dev:sandbox
```

Visit: `http://localhost:3000`

---

## 5. Cloudflare Pages Deployment

### Step 1: Install Wrangler (if needed)

```bash
npm install -g wrangler
```

### Step 2: Login to Cloudflare

```bash
wrangler login
```

This will open a browser window. Login and authorize.

### Step 3: Create Cloudflare Pages Project

```bash
cd /home/user/webapp
npx wrangler pages project create vonwillingh-online-lms --production-branch main
```

### Step 4: Deploy

```bash
npm run deploy:prod
```

This will:
- Build the project
- Upload to Cloudflare Pages
- Give you a URL like: `https://vonwillingh-online-lms.pages.dev`

### Step 5: Add Environment Variables

```bash
# Supabase
npx wrangler pages secret put SUPABASE_URL --project-name vonwillingh-online-lms
# Paste your URL when prompted

npx wrangler pages secret put SUPABASE_ANON_KEY --project-name vonwillingh-online-lms
# Paste your anon key

npx wrangler pages secret put SUPABASE_SERVICE_ROLE_KEY --project-name vonwillingh-online-lms
# Paste your service role key

# Brevo
npx wrangler pages secret put BREVO_API_KEY --project-name vonwillingh-online-lms
# Paste your Brevo key

# Contact
npx wrangler pages secret put FROM_EMAIL --project-name vonwillingh-online-lms
# Enter: noreply@vonwillingh.co.za

npx wrangler pages secret put CONTACT_EMAIL --project-name vonwillingh-online-lms
# Enter: sarrol@vonwillingh.co.za

npx wrangler pages secret put CONTACT_PHONE --project-name vonwillingh-online-lms
# Enter: 081 216 3629

# Banking
npx wrangler pages secret put BANK_NAME --project-name vonwillingh-online-lms
# Enter: Absa

npx wrangler pages secret put BANK_ACCOUNT_NAME --project-name vonwillingh-online-lms
# Enter: S Von Willingh

npx wrangler pages secret put BANK_ACCOUNT_NUMBER --project-name vonwillingh-online-lms
# Enter: 01163971026

npx wrangler pages secret put BANK_BRANCH_CODE --project-name vonwillingh-online-lms
# Enter: 632005

npx wrangler pages secret put BANK_ACCOUNT_TYPE --project-name vonwillingh-online-lms
# Enter: Cheque Account
```

### Step 6: Redeploy After Adding Secrets

```bash
npm run deploy:prod
```

---

## 6. Post-Deployment Configuration

### Step 1: Verify Deployment

Visit your Cloudflare Pages URL: `https://vonwillingh-online-lms.pages.dev`

Check:
- [ ] Homepage loads
- [ ] VonWillingh logo appears
- [ ] Courses page shows 30 courses
- [ ] Application form works
- [ ] Admin login page accessible

### Step 2: Test Admin Login

1. Go to: `https://vonwillingh-online-lms.pages.dev/admin-login`
2. Email: `sarrol@vonwillingh.co.za`
3. Password: (the one you set in Supabase)
4. Should redirect to admin dashboard

### Step 3: Test Student Application

1. Fill out application form
2. Upload test documents
3. Submit application
4. Check if email is received
5. Login as admin and verify application appears

### Step 4: Custom Domain (Optional)

If you have `vonwillingh.co.za`:

```bash
npx wrangler pages domain add vonwillingh.co.za --project-name vonwillingh-online-lms
```

Then add DNS records as instructed by Cloudflare.

---

## 7. Testing & Verification

### Test Checklist

#### Public Pages
- [ ] Homepage loads correctly
- [ ] VonWillingh logo displays
- [ ] 30 courses show in catalog
- [ ] 10 FREE courses marked as free
- [ ] Course details page works
- [ ] Application form accessible

#### Application Flow
- [ ] Student can submit application
- [ ] Documents upload successfully
- [ ] Email sent to student (confirmation)
- [ ] Application appears in admin dashboard
- [ ] Admin can approve/reject

#### Payment Flow
- [ ] Approval email includes bank details
- [ ] Bank details are correct (S Von Willingh, Absa)
- [ ] Student can upload proof of payment
- [ ] Admin can verify payment

#### Student Portal
- [ ] Student receives login credentials
- [ ] Student can login
- [ ] Enrolled courses display
- [ ] Modules are accessible
- [ ] Progress tracking works

#### Admin Portal
- [ ] Admin can login
- [ ] Applications dashboard works
- [ ] Can view/manage applications
- [ ] Can verify payments
- [ ] Can view student list

---

## 8. Troubleshooting

### Issue: Build Fails

**Solution:**
```bash
cd /home/user/webapp
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Deployment Fails

**Check:**
1. Wrangler is logged in: `wrangler whoami`
2. Project name is correct in wrangler.jsonc
3. Try: `wrangler pages project list`

### Issue: Environment Variables Not Working

**Solution:**
```bash
# List all secrets
npx wrangler pages secret list --project-name vonwillingh-online-lms

# Delete and re-add if needed
npx wrangler pages secret delete VARIABLE_NAME --project-name vonwillingh-online-lms
```

### Issue: Emails Not Sending

**Check:**
1. Brevo API key is correct
2. FROM_EMAIL is set correctly
3. Check Brevo dashboard for blocked emails
4. Verify email recipient is valid

### Issue: Database Errors

**Check:**
1. Supabase credentials are correct
2. RLS policies are set up
3. Tables exist in database
4. Run SQL schema again if needed

### Issue: Admin Can't Login

**Solution:**
```sql
-- Verify admin user exists
SELECT * FROM auth.users WHERE email = 'sarrol@vonwillingh.co.za';

-- Verify in admin_users table
SELECT * FROM public.admin_users WHERE email = 'sarrol@vonwillingh.co.za';

-- If missing, add:
INSERT INTO public.admin_users (id, email, full_name, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'sarrol@vonwillingh.co.za'),
  'sarrol@vonwillingh.co.za',
  'Sarrol Von Willingh',
  'super_admin'
);
```

---

## 9. Quick Reference

### Important URLs

**Development:**
- Local: http://localhost:3000

**Production:**
- Main: https://vonwillingh-online-lms.pages.dev
- Admin: https://vonwillingh-online-lms.pages.dev/admin-login
- Apply: https://vonwillingh-online-lms.pages.dev/apply

**External Services:**
- Supabase: https://app.supabase.com
- Brevo: https://app.brevo.com
- Cloudflare: https://dash.cloudflare.com

### Key Commands

```bash
# Build
npm run build

# Local development
npm run dev:sandbox

# Deploy
npm run deploy:prod

# Check logs
npx wrangler pages deployment tail --project-name vonwillingh-online-lms

# View secrets
npx wrangler pages secret list --project-name vonwillingh-online-lms
```

### Contact Info

**Admin Email:** sarrol@vonwillingh.co.za  
**Phone:** 081 216 3629  
**Bank:** S Von Willingh, Absa, 01163971026

---

## 🎉 Deployment Complete!

Your VonWillingh Online LMS is now:
- ✅ Fully branded
- ✅ Database configured
- ✅ Deployed to Cloudflare Pages
- ✅ Ready to accept students!

### Next Steps:
1. Add actual course content (videos, PDFs)
2. Test complete enrollment flow
3. Invite first students
4. Monitor Brevo email delivery
5. Consider custom domain setup

**Need Help?** Review this guide or check the troubleshooting section.

---

**Document Created:** 2026-02-01  
**Version:** 1.0  
**Status:** ✅ Complete
