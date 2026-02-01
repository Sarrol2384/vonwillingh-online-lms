# VonWillingh Online - Learning Management System

## Project Overview

**Name:** VonWillingh Online LMS  
**Organization:** VonWillingh Online  
**Email:** sarrol@vonwillingh.co.za  
**Phone:** 081 216 3629  
**Total Courses:** 30 Business Training Programs (10 FREE + 20 Paid)

### Key Features
✅ Public homepage with professional property branding  
✅ Complete course catalog (40 property-related programs)  
✅ Online application form with document upload  
✅ Admin dashboard for application review  
✅ Payment integration (PayFast, PayPal, Stripe, EFT)  
✅ Student portal with login system  
✅ Module-based learning with sequential unlocking  
✅ Progress tracking and completion logic  
✅ Certificate generation and download  
✅ Automated email notifications  

## URLs

### Development
- **Sandbox Server:** Port 3000 (Cloudflare Pages local development)
  - Homepage: `/`
  - Application Form: `/apply`
  - Admin Login: `/admin-login`
  - Admin Dashboard: `/admin-dashboard`
  - Admin Applications: `/admin-applications`
  - Admin Payments: `/admin-payments`
  - Student Login: `/student-login`
  - Student Dashboard: `/student/dashboard`
  - Course Detail: `/student/course/:courseId`
  - Module Viewer: `/student/module/:moduleId`

### Production
- **Production URL:** https://vonwillingh-online-lms.pages.dev
- **Custom Domain:** vonwillingh.co.za (can be configured)
- **Email System:** Brevo (requires custom domain authentication)

## Technology Stack

- **Backend:** Hono (TypeScript) - Lightweight web framework
- **Frontend:** HTML/CSS/JavaScript + TailwindCSS
- **Hosting:** Cloudflare Pages (Edge computing)
- **Database:** Supabase PostgreSQL
- **Storage:** Supabase Storage (for file uploads)
- **Authentication:** Supabase Auth
- **Payment:** PayFast, PayPal, Stripe (to be integrated)

## Business Training Programs (30 Courses)

### FREE Short Courses (10 courses - perfect for getting started!)
1. AI Tools Every Small Business Should Use in 2026 (3 modules, 2 hours, FREE)
2. From Chaos to Clarity: Organizing Your Business (4 modules, 3 hours, FREE)
3. Social Media Marketing for Beginners (3 modules, 2 hours, FREE)
4. Excel Basics for Business Owners (4 modules, 3 hours, FREE)
5. Financial Literacy: Understanding Your Numbers (3 modules, 2 hours, FREE)
6. Time Management for Busy Entrepreneurs (3 modules, 2 hours, FREE)
7. Building Your Brand on a Budget (3 modules, 2 hours, FREE)
8. Customer Service Excellence (4 modules, 3 hours, FREE)
9. Email Marketing Made Simple (3 modules, 2 hours, FREE)
10. Business Plan Basics in One Afternoon (3 modules, 2 hours, FREE)

### PAID Comprehensive Courses (20 courses)

#### Digital Marketing & Social Media (4 courses)
- Complete Digital Marketing Mastery (8 modules, 6 weeks, R2,500)
- Social Media Strategy for Business Growth (6 modules, 4 weeks, R1,800)
- Content Marketing & Storytelling (7 modules, 5 weeks, R2,200)
- Google Ads & Facebook Advertising (6 modules, 4 weeks, R2,000)

#### Business Management & Strategy (4 courses)
- Small Business Management Essentials (10 modules, 8 weeks, R3,500)
- Strategic Planning for Entrepreneurs (8 modules, 6 weeks, R2,800)
- Operations Management for Small Businesses (7 modules, 5 weeks, R2,400)
- Scaling Your Business: Growth Strategies (9 modules, 7 weeks, R3,200)

#### Finance & Accounting (3 courses)
- Bookkeeping & Accounting for Non-Accountants (8 modules, 6 weeks, R2,600)
- Financial Management for Small Businesses (10 modules, 8 weeks, R3,200)
- Cash Flow Management & Forecasting (6 modules, 4 weeks, R2,000)

#### Sales & Customer Relationships (3 courses)
- Sales Mastery: From Lead to Close (8 modules, 6 weeks, R2,800)
- Customer Relationship Management (CRM) (6 modules, 4 weeks, R2,200)
- Negotiation Skills for Entrepreneurs (5 modules, 3 weeks, R1,800)

#### AI & Technology (3 courses)
- AI for Business: Practical Applications (8 modules, 6 weeks, R2,900)
- ChatGPT & AI Tools for Productivity (6 modules, 4 weeks, R2,200)
- Building Your Online Business Presence (7 modules, 5 weeks, R2,500)

#### Human Resources & Leadership (3 courses)
- Leadership Skills for Small Business Owners (7 modules, 5 weeks, R2,600)
- Hiring & Managing Your First Employees (6 modules, 4 weeks, R2,200)
- Team Building & Company Culture (5 modules, 3 weeks, R1,900)

## Data Architecture

### Supabase Database Schema

#### Tables:

**1. students**
- id (UUID, primary key)
- full_name (TEXT)
- email (TEXT, unique)
- phone (TEXT)
- address (TEXT)
- date_of_birth (DATE)
- highest_qualification (TEXT)
- institution (TEXT)
- year_completed (INTEGER)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**2. courses**
- id (INTEGER, primary key)
- name (TEXT)
- category (TEXT)
- level (TEXT) - Short Course, Certificate
- modules_count (INTEGER)
- semesters_count (INTEGER)
- price (DECIMAL)
- description (TEXT)
- created_at (TIMESTAMP)

**3. applications**
- id (UUID, primary key)
- student_id (UUID, foreign key → students.id)
- course_id (INTEGER, foreign key → courses.id)
- status (TEXT) - 'pending', 'approved', 'rejected'
- motivation (TEXT)
- id_document_url (TEXT) - Supabase Storage URL
- transcripts_url (TEXT)
- certificates_url (TEXT)
- cv_url (TEXT)
- photo_url (TEXT)
- submitted_at (TIMESTAMP)
- reviewed_at (TIMESTAMP)
- reviewed_by (UUID, foreign key → admin_users.id)

**4. enrollments**
- id (UUID, primary key)
- student_id (UUID, foreign key → students.id)
- course_id (INTEGER, foreign key → courses.id)
- payment_status (TEXT) - 'pending', 'completed', 'failed'
- payment_amount (DECIMAL)
- payment_method (TEXT) - 'EFT', 'PayFast', 'PayPal', 'Stripe'
- payment_date (TIMESTAMP)
- enrollment_date (TIMESTAMP)
- completion_date (TIMESTAMP)
- certificate_url (TEXT)

**5. modules**
- id (UUID, primary key)
- course_id (INTEGER, foreign key → courses.id)
- module_number (INTEGER)
- title (TEXT)
- description (TEXT)
- video_url (TEXT) - Supabase Storage or external URL
- pdf_materials (TEXT[]) - Array of Supabase Storage URLs
- duration_hours (INTEGER)
- created_at (TIMESTAMP)

**6. student_progress**
- id (UUID, primary key)
- student_id (UUID, foreign key → students.id)
- module_id (UUID, foreign key → modules.id)
- status (TEXT) - 'locked', 'in_progress', 'completed'
- time_spent_minutes (INTEGER)
- quiz_score (INTEGER)
- assignment_submitted (BOOLEAN)
- completed_at (TIMESTAMP)

**7. admin_users**
- id (UUID, primary key)
- email (TEXT, unique)
- full_name (TEXT)
- role (TEXT) - 'admin', 'super_admin'
- created_at (TIMESTAMP)

**8. payments**
- id (UUID, primary key)
- enrollment_id (UUID, foreign key → enrollments.id)
- amount (DECIMAL)
- currency (TEXT) - 'ZAR'
- payment_method (TEXT)
- transaction_id (TEXT)
- status (TEXT) - 'pending', 'completed', 'failed', 'refunded'
- paid_at (TIMESTAMP)

**9. notifications**
- id (UUID, primary key)
- student_id (UUID, foreign key → students.id)
- type (TEXT) - 'application_received', 'application_approved', 'payment_received', 'login_credentials', 'module_unlocked'
- title (TEXT)
- message (TEXT)
- email_sent (BOOLEAN)
- read (BOOLEAN)
- sent_at (TIMESTAMP)

### Supabase Storage Buckets

**1. application-documents** (Private)
- ID documents
- Transcripts
- Certificates
- CVs
- Passport photos

**2. course-materials** (Public/Authenticated)
- Video lectures
- PDF materials
- Assignments

**3. certificates** (Private)
- Generated student certificates

## Application Workflow

### 1. **Student Applies**
- Fills application form
- Uploads required documents (max 5MB each)
- Selects course
- Submits application

### 2. **Admin Reviews**
- Logs into admin panel
- Views pending applications
- Reviews documents
- Approves or rejects

### 3. **Acceptance Letter**
- Auto-generated acceptance letter (if approved)
- Email sent with payment instructions
- Payment link provided

### 4. **Payment Processing**
- Student completes payment via:
  - EFT (Electronic Funds Transfer)
  - PayFast
  - PayPal
  - Stripe
- Payment confirmation webhook

### 5. **Account Activation**
- Supabase Auth account created
- Login credentials emailed
- Student portal access granted

### 6. **Learning Journey**
- Student logs in
- Sees enrolled course(s)
- Modules unlock sequentially
- Progress tracked automatically

### 7. **Module Completion**
- Determined by:
  - Time spent on module
  - Quiz/assessment passed
  - Assignment submitted
  - Manual "Complete" button

### 8. **Certificate Generation**
- All modules completed
- PDF certificate generated with Eyethu Property Group branding
- Available for download
- Account deactivated (or archived)

## Completion Logic Rules

A module is marked "complete" when **ALL** of these conditions are met:
1. **Minimum time spent** on module content (e.g., 80% of estimated duration)
2. **Quiz passed** (if applicable) - minimum 70% score
3. **Assignment submitted** (if applicable)
4. **Manual confirmation** - student clicks "Mark as Complete"

## User Roles

### 1. **Public User** (Not logged in)
- View homepage
- Browse course catalog
- Submit application

### 2. **Student** (Authenticated)
- View enrolled courses
- Access learning modules
- Track progress
- Download certificate
- Update profile

### 3. **Admin** (Authenticated)
- Review applications
- Approve/reject applications
- Manage courses and modules
- Upload course materials
- Track student progress
- Generate reports
- Send notifications

### 4. **Super Admin** (Authenticated)
- All admin permissions
- Manage admin users
- System configuration
- Payment settings

## Email Notifications

Automated emails sent for:
1. **Application Received** - Confirmation of submission
2. **Application Approved** - Acceptance letter with payment instructions
3. **Application Rejected** - Notification with reason (optional)
4. **Payment Received** - Confirmation and login credentials
5. **Welcome Email** - Login details and getting started guide
6. **Module Unlocked** - New module available notification
7. **Course Completed** - Congratulations and certificate ready
8. **Payment Reminder** - If payment pending after 7 days

## Development Guide

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier available)
- Cloudflare account (free tier available)

### Setup Instructions

1. **Install Dependencies**
```bash
cd /home/user/webapp
npm install
```

2. **Configure Supabase**
See Supabase Setup Guide in the original PBK README (database schema remains the same)

3. **Create .dev.vars file** (local environment variables)
```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
BREVO_API_KEY=your_brevo_api_key
FROM_EMAIL=noreply@vonwillingh.co.za
CONTACT_EMAIL=sarrol@vonwillingh.co.za
CONTACT_PHONE=081 216 3629
BANK_NAME=Absa
BANK_ACCOUNT_NAME=S Von Willingh
BANK_ACCOUNT_NUMBER=01163971026
BANK_BRANCH_CODE=632005
BANK_ACCOUNT_TYPE=Cheque Account
```

4. **Build the project**
```bash
npm run build
```

5. **Start development server**
```bash
# Clean port first
npm run clean-port

# Start with PM2
pm2 start ecosystem.config.cjs

# Check logs
pm2 logs eyethu-property-lms --nostream
```

6. **Test the application**
```bash
npm run test
# or
curl http://localhost:3000
```

### Available Scripts

```bash
npm run dev                 # Vite dev server (local machine)
npm run dev:sandbox         # Wrangler dev server (sandbox)
npm run build              # Build for production
npm run preview            # Preview production build
npm run deploy             # Deploy to Cloudflare Pages
npm run deploy:prod        # Deploy to production with project name
npm run clean-port         # Kill processes on port 3000
npm run test               # Test local server
```

## Deployment

### Deploy to Cloudflare Pages

1. **Build the project**
```bash
npm run build
```

2. **Create Cloudflare Pages project**
```bash
npx wrangler pages project create vonwillingh-online-lms \
  --production-branch main \
  --compatibility-date 2024-01-01
```

3. **Deploy to Cloudflare**
```bash
npm run deploy:prod
```

4. **Configure Environment Variables**
```bash
npx wrangler pages secret put SUPABASE_URL --project-name vonwillingh-online-lms
npx wrangler pages secret put SUPABASE_ANON_KEY --project-name vonwillingh-online-lms
npx wrangler pages secret put SUPABASE_SERVICE_ROLE_KEY --project-name vonwillingh-online-lms
npx wrangler pages secret put BREVO_API_KEY --project-name vonwillingh-online-lms
npx wrangler pages secret put FROM_EMAIL --project-name vonwillingh-online-lms
npx wrangler pages secret put CONTACT_EMAIL --project-name vonwillingh-online-lms
```

5. **Custom Domain** (Optional)
```bash
npx wrangler pages domain add vonwillingh.co.za --project-name vonwillingh-online-lms
```

## Customization Notes

This LMS has been customized from the original PBK Memorial Leadership Institute LMS:

### Changes Made:
✅ **Branding:** Updated to VonWillingh Online
✅ **Colors:** Changed from property brown (#8B7355) to professional navy blue (#2C3E50)
✅ **Courses:** Replaced 40 property programs with 30 business training courses (10 FREE + 20 paid)
✅ **Contact:** Updated email (sarrol@vonwillingh.co.za) and removed website
✅ **Logo:** VonWillingh Online circular logo with VW monogram
✅ **Email Templates:** Updated all email notifications with VonWillingh branding
✅ **Certificate IDs:** Changed from EPG- to VW- prefix
✅ **Banking Details:** Updated to S Von Willingh / Absa account details
✅ **Target Audience:** Focus on entrepreneurs and small business owners
✅ **Course Structure:** Short courses (2-3 hours) and certificates (3-8 weeks)

### Still To Configure:
⏳ **Supabase:** Set up Supabase project and populate with business courses
⏳ **Email Service:** Configure Brevo API keys (requires domain authentication)
⏳ **Payment Gateway:** Configure PayFast/PayPal/Stripe credentials (optional)
⏳ **Custom Domain:** Point vonwillingh.co.za to Cloudflare Pages (optional)
⏳ **Course Content:** Upload actual course materials, videos, and PDFs

## Support & Contact

**Organization:** VonWillingh Online  
**Email:** sarrol@vonwillingh.co.za  
**Phone:** 081 216 3629

## Technical Support

For technical issues or questions about the LMS platform, please contact VonWillingh Online management.

---

**Last Updated:** 2026-02-01  
**Version:** 1.0.0 (Customized from PBK LMS v2.1.0 → Eyethu Property Group → VonWillingh Online)  
**Status:** ✅ Customization Complete - Ready for Configuration & Deployment
