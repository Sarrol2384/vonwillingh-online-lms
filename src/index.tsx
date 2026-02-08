import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { getSupabaseClient, getSupabaseAdminClient } from './supabase'
import { 
  sendEmail, 
  getApplicationReceivedEmail,
  getApplicationApprovedEmail,
  getApplicationRejectedEmail,
  getPaymentVerifiedEmail,
  getCourseCompletionEmail
} from './email'

type Bindings = {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_ROLE_KEY: string
  BREVO_API_KEY: string
  RESEND_API_KEY: string  // Keep for backward compatibility
  FROM_EMAIL: string
  CONTACT_EMAIL: string
  BANK_NAME: string
  BANK_ACCOUNT_NAME: string
  BANK_ACCOUNT_NUMBER: string
  BANK_BRANCH_CODE: string
  BANK_ACCOUNT_TYPE: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// VonWillingh Online brand colors (from logo)
const BRAND_COLORS = {
  primary: '#2C3E50', // Navy blue from logo
  secondary: '#FFFFFF',
  accent: '#3498DB', // Light blue accent
  text: '#000000', // Black text
  background: '#F9FAFB'
}

// VonWillingh Online Courses - Business Skills for Entrepreneurs & Small Businesses
const COURSES = [
  // FREE Short Courses (10 courses - perfect for getting started)
  { id: 1, name: 'AI Tools Every Small Business Should Use in 2026', category: 'AI & Technology', level: 'Short Course', modules: 3, duration: '2 hours', price: 0 },
  { id: 2, name: 'From Chaos to Clarity: Organizing Your Business', category: 'Business Management', level: 'Short Course', modules: 4, duration: '3 hours', price: 0 },
  { id: 3, name: 'Social Media Marketing for Beginners', category: 'Digital Marketing', level: 'Short Course', modules: 3, duration: '2 hours', price: 0 },
  { id: 4, name: 'Excel Basics for Business Owners', category: 'Business Tools', level: 'Short Course', modules: 4, duration: '3 hours', price: 0 },
  { id: 5, name: 'Financial Literacy: Understanding Your Numbers', category: 'Finance', level: 'Short Course', modules: 3, duration: '2 hours', price: 0 },
  { id: 6, name: 'Time Management for Busy Entrepreneurs', category: 'Productivity', level: 'Short Course', modules: 3, duration: '2 hours', price: 0 },
  { id: 7, name: 'Building Your Brand on a Budget', category: 'Branding', level: 'Short Course', modules: 3, duration: '2 hours', price: 0 },
  { id: 8, name: 'Customer Service Excellence', category: 'Customer Relations', level: 'Short Course', modules: 4, duration: '3 hours', price: 0 },
  { id: 9, name: 'Email Marketing Made Simple', category: 'Digital Marketing', level: 'Short Course', modules: 3, duration: '2 hours', price: 0 },
  { id: 10, name: 'Business Plan Basics in One Afternoon', category: 'Business Planning', level: 'Short Course', modules: 3, duration: '2 hours', price: 0 },
  
  // PAID Comprehensive Courses (20 courses)
  // Digital Marketing & Social Media (4 courses)
  { id: 11, name: 'Complete Digital Marketing Mastery', category: 'Digital Marketing', level: 'Certificate', modules: 8, duration: '6 weeks', price: 2500 },
  { id: 12, name: 'Social Media Strategy for Business Growth', category: 'Digital Marketing', level: 'Certificate', modules: 6, duration: '4 weeks', price: 1800 },
  { id: 13, name: 'Content Marketing & Storytelling', category: 'Digital Marketing', level: 'Certificate', modules: 7, duration: '5 weeks', price: 2200 },
  { id: 14, name: 'Google Ads & Facebook Advertising', category: 'Digital Marketing', level: 'Certificate', modules: 6, duration: '4 weeks', price: 2000 },
  
  // Business Management & Strategy (4 courses)
  { id: 15, name: 'Small Business Management Essentials', category: 'Business Management', level: 'Certificate', modules: 10, duration: '8 weeks', price: 3500 },
  { id: 16, name: 'Strategic Planning for Entrepreneurs', category: 'Business Strategy', level: 'Certificate', modules: 8, duration: '6 weeks', price: 2800 },
  { id: 17, name: 'Operations Management for Small Businesses', category: 'Business Management', level: 'Certificate', modules: 7, duration: '5 weeks', price: 2400 },
  { id: 18, name: 'Scaling Your Business: Growth Strategies', category: 'Business Strategy', level: 'Certificate', modules: 9, duration: '7 weeks', price: 3200 },
  
  // Finance & Accounting (3 courses)
  { id: 19, name: 'Bookkeeping & Accounting for Non-Accountants', category: 'Finance', level: 'Certificate', modules: 8, duration: '6 weeks', price: 2600 },
  { id: 20, name: 'Financial Management for Small Businesses', category: 'Finance', level: 'Certificate', modules: 10, duration: '8 weeks', price: 3200 },
  { id: 21, name: 'Cash Flow Management & Forecasting', category: 'Finance', level: 'Certificate', modules: 6, duration: '4 weeks', price: 2000 },
  
  // Sales & Customer Relationships (3 courses)
  { id: 22, name: 'Sales Mastery: From Lead to Close', category: 'Sales', level: 'Certificate', modules: 8, duration: '6 weeks', price: 2800 },
  { id: 23, name: 'Customer Relationship Management (CRM)', category: 'Customer Relations', level: 'Certificate', modules: 6, duration: '4 weeks', price: 2200 },
  { id: 24, name: 'Negotiation Skills for Entrepreneurs', category: 'Sales', level: 'Certificate', modules: 5, duration: '3 weeks', price: 1800 },
  
  // AI & Technology (3 courses)
  { id: 25, name: 'AI for Business: Practical Applications', category: 'AI & Technology', level: 'Certificate', modules: 8, duration: '6 weeks', price: 2900 },
  { id: 26, name: 'ChatGPT & AI Tools for Productivity', category: 'AI & Technology', level: 'Certificate', modules: 6, duration: '4 weeks', price: 2200 },
  { id: 27, name: 'Building Your Online Business Presence', category: 'Technology', level: 'Certificate', modules: 7, duration: '5 weeks', price: 2500 },
  
  // Human Resources & Leadership (3 courses)
  { id: 28, name: 'Leadership Skills for Small Business Owners', category: 'Leadership', level: 'Certificate', modules: 7, duration: '5 weeks', price: 2600 },
  { id: 29, name: 'Hiring & Managing Your First Employees', category: 'Human Resources', level: 'Certificate', modules: 6, duration: '4 weeks', price: 2200 },
  { id: 30, name: 'Team Building & Company Culture', category: 'Leadership', level: 'Certificate', modules: 5, duration: '3 weeks', price: 1900 }
]

// Homepage
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>VonWillingh Online - Smart Business Training for Entrepreneurs</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          :root {
            --primary: ${BRAND_COLORS.primary};
            --secondary: ${BRAND_COLORS.secondary};
          }
          .brand-bg { background-color: ${BRAND_COLORS.primary}; }
          .brand-text { color: ${BRAND_COLORS.primary}; }
          .brand-border { border-color: ${BRAND_COLORS.primary}; }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Navigation -->
        <nav class="brand-bg text-white shadow-lg">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-3">
                    <!-- Logo and Title -->
                    <div class="flex items-center space-x-3">
                        <img src="/static/vonwillingh-logo.png" alt="VonWillingh Online Logo" class="h-24 sm:h-28 md:h-32 object-contain">
                        <div class="hidden sm:block">
                            <h1 class="text-sm sm:text-base md:text-xl font-bold leading-tight">VonWillingh Online</h1>
                            <p class="text-xs sm:text-sm text-blue-100">AI-Powered Business Training</p>
                        </div>
                        <div class="block sm:hidden">
                            <h1 class="text-sm font-bold">VonWillingh<br>Online</h1>
                            <p class="text-xs text-blue-100">AI Training</p>
                        </div>
                    </div>
                    
                    <!-- Desktop Menu -->
                    <div class="hidden lg:flex space-x-4 items-center">
                        <a href="/" class="hover:text-yellow-200 transition"><i class="fas fa-home mr-1"></i> Home</a>
                        <a href="/courses" class="hover:text-yellow-200 transition"><i class="fas fa-book mr-1"></i> Courses</a>
                        <a href="/apply" class="bg-white text-blue-900 px-4 py-2 rounded-lg hover:bg-blue-50 transition font-semibold">
                            <i class="fas fa-file-alt mr-1"></i> Apply Now
                        </a>
                        <a href="/student-login" class="hover:text-blue-200 transition"><i class="fas fa-sign-in-alt mr-1"></i> Student Login</a>
                    </div>
                    
                    <!-- Mobile Menu Button -->
                    <button id="mobile-menu-btn" class="lg:hidden text-white p-2">
                        <i class="fas fa-bars text-2xl"></i>
                    </button>
                </div>
                
                <!-- Mobile Menu -->
                <div id="mobile-menu" class="hidden lg:hidden pb-4">
                    <div class="flex flex-col space-y-3 pt-3 border-t border-blue-600">
                        <a href="/" class="hover:text-blue-200 transition py-2"><i class="fas fa-home mr-2"></i> Home</a>
                        <a href="/courses" class="hover:text-blue-200 transition py-2"><i class="fas fa-book mr-2"></i> Courses</a>
                        <a href="/apply" class="bg-white text-blue-900 px-4 py-3 rounded-lg hover:bg-blue-50 transition font-semibold text-center">
                            <i class="fas fa-file-alt mr-2"></i> Apply Now
                        </a>
                        <a href="/student-login" class="hover:text-blue-200 transition py-2"><i class="fas fa-sign-in-alt mr-2"></i> Student Login</a>
                    </div>
                </div>
            </div>
        </nav>
        
        <script>
            // Mobile menu toggle
            document.getElementById('mobile-menu-btn').addEventListener('click', function() {
                const menu = document.getElementById('mobile-menu');
                const icon = this.querySelector('i');
                menu.classList.toggle('hidden');
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            });
        </script>

        <!-- Hero Section -->
        <section class="brand-bg text-white py-20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 class="text-5xl font-bold mb-6">Master AI & Business Skills for the Future</h2>
                <p class="text-xl mb-8 text-blue-100">30 AI-Powered Courses | 10 FREE Courses | Learn at Your Pace | Future-Ready Skills</p>
                <div class="flex justify-center space-x-4">
                    <a href="/apply" class="bg-white text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition shadow-lg">
                        <i class="fas fa-file-alt mr-2"></i> Start Your Application
                    </a>
                    <a href="/courses" class="bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition shadow-lg">
                        <i class="fas fa-search mr-2"></i> Explore Courses
                    </a>
                </div>
            </div>
        </section>

        <!-- Stats Section -->
        <section class="py-12 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                    <div class="p-6">
                        <div class="text-4xl font-bold brand-text mb-2">30</div>
                        <div class="text-gray-600">Business Training Courses</div>
                    </div>
                    <div class="p-6">
                        <div class="text-4xl font-bold brand-text mb-2">10</div>
                        <div class="text-gray-600">FREE Short Courses</div>
                    </div>
                    <div class="p-6">
                        <div class="text-4xl font-bold brand-text mb-2">100%</div>
                        <div class="text-gray-600">Online Learning</div>
                    </div>
                    <div class="p-6">
                        <div class="text-4xl font-bold brand-text mb-2">24/7</div>
                        <div class="text-gray-600">Support Available</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Featured Programs -->
        <section class="py-16 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h3 class="text-3xl font-bold text-center mb-12 brand-text">Featured Business Programs</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                        <div class="text-4xl mb-4 brand-text"><i class="fas fa-robot"></i></div>
                        <h4 class="text-xl font-bold mb-2">AI & Technology</h4>
                        <p class="text-gray-600 mb-4">Harness AI tools to boost productivity and grow your business</p>
                        <a href="/courses?category=AI+%26+Technology" class="brand-text hover:underline">Explore Programs <i class="fas fa-arrow-right ml-1"></i></a>
                    </div>
                    <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                        <div class="text-4xl mb-4 brand-text"><i class="fas fa-chart-line"></i></div>
                        <h4 class="text-xl font-bold mb-2">Digital Marketing</h4>
                        <p class="text-gray-600 mb-4">Master social media, content marketing, and online advertising</p>
                        <a href="/courses?category=Digital+Marketing" class="brand-text hover:underline">Explore Programs <i class="fas fa-arrow-right ml-1"></i></a>
                    </div>
                    <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                        <div class="text-4xl mb-4 brand-text"><i class="fas fa-briefcase"></i></div>
                        <h4 class="text-xl font-bold mb-2">Business Management</h4>
                        <p class="text-gray-600 mb-4">Learn essential skills to organize, manage, and scale your business</p>
                        <a href="/courses?category=Business+Management" class="brand-text hover:underline">Explore Programs <i class="fas fa-arrow-right ml-1"></i></a>
                    </div>
                </div>
            </div>
        </section>

        <!-- How It Works -->
        <section class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h3 class="text-3xl font-bold text-center mb-12 brand-text">Your Journey With Us</h3>
                <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <div class="text-center">
                        <div class="brand-bg text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg">1</div>
                        <h4 class="font-bold mb-2">Apply Online</h4>
                        <p class="text-sm text-gray-600">Submit application & documents</p>
                    </div>
                    <div class="text-center">
                        <div class="brand-bg text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg">2</div>
                        <h4 class="font-bold mb-2">Get Accepted</h4>
                        <p class="text-sm text-gray-600">Receive acceptance letter</p>
                    </div>
                    <div class="text-center">
                        <div class="brand-bg text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg">3</div>
                        <h4 class="font-bold mb-2">Make Payment</h4>
                        <p class="text-sm text-gray-600">Secure online payment</p>
                    </div>
                    <div class="text-center">
                        <div class="brand-bg text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg">4</div>
                        <h4 class="font-bold mb-2">Start Learning</h4>
                        <p class="text-sm text-gray-600">Access your modules</p>
                    </div>
                    <div class="text-center">
                        <div class="brand-bg text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg">5</div>
                        <h4 class="font-bold mb-2">Graduate</h4>
                        <p class="text-sm text-gray-600">Download certificate</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section class="brand-bg text-white py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h3 class="text-2xl font-bold mb-4">Ready to Start Your Business Journey?</h3>
                <div class="space-y-2">
                    <p class="text-blue-100"><i class="fas fa-envelope mr-2"></i> <a href="mailto:sarrol@vonwillingh.co.za" class="underline hover:text-white">sarrol@vonwillingh.co.za</a></p>
                    <p class="text-blue-100"><i class="fas fa-phone mr-2"></i> <a href="tel:+27812163629" class="underline hover:text-white">081 216 3629</a></p>
                    <p class="text-sm text-blue-100"><i class="fas fa-info-circle mr-2"></i> VonWillingh Online Learning Platform</p>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="bg-gray-900 text-white py-8">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p>&copy; 2024 VonWillingh Online. All rights reserved.</p>
                <p class="text-sm text-gray-400 mt-2">Smart Business Training for Entrepreneurs</p>
                <p class="text-sm text-gray-400 mt-1">Email: sarrol@vonwillingh.co.za | Phone: 081 216 3629</p>
            </div>
        </footer>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    </body>
    </html>
  `)
})

// Courses catalog page
app.get('/courses', (c) => {
  const category = c.req.query('category')
  const filteredCourses = category ? COURSES.filter(course => course.category === category) : COURSES
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Course Catalog - VonWillingh Online</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          .brand-bg { background-color: ${BRAND_COLORS.primary}; }
          .brand-text { color: ${BRAND_COLORS.primary}; }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Navigation -->
        <nav class="brand-bg text-white shadow-lg">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-4">
                    <div class="flex items-center space-x-4">
                        <img src="/static/vonwillingh-logo.png" alt="VonWillingh Online Logo" class="h-16 w-auto">
                        <h1 class="text-xl font-bold">VonWillingh Online</h1>
                    </div>
                    <div class="flex space-x-4">
                        <a href="/" class="hover:text-blue-200"><i class="fas fa-home mr-1"></i> Home</a>
                        <a href="/courses" class="text-white font-semibold"><i class="fas fa-book mr-1"></i> Courses</a>
                        <a href="/apply" class="bg-white text-blue-900 px-4 py-2 rounded-lg hover:bg-blue-50">Apply Now</a>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Course Catalog -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 class="text-4xl font-bold mb-8 brand-text">Course Catalog - 40 Programs</h2>
            
            <!-- Filter -->
            <div class="mb-8 bg-white p-4 rounded-lg shadow">
                <label class="font-semibold mr-4">Filter by Category:</label>
                <select onchange="window.location.href = this.value" class="border border-gray-300 rounded px-4 py-2">
                    <option value="/courses">All Courses (40)</option>
                    ${Array.from(new Set(COURSES.map(c => c.category))).map(cat => 
                      `<option value="/courses?category=${encodeURIComponent(cat)}" ${category === cat ? 'selected' : ''}>${cat}</option>`
                    ).join('')}
                </select>
            </div>

            <!-- Courses Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${filteredCourses.map(course => `
                    <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition p-6">
                        <div class="flex items-start justify-between mb-4">
                            <span class="brand-bg text-white px-3 py-1 rounded-full text-sm font-semibold">${course.level}</span>
                            <span class="text-gray-600 text-sm">${course.category}</span>
                        </div>
                        <h3 class="text-xl font-bold mb-2">${course.name}</h3>
                        <div class="space-y-2 text-sm text-gray-600 mb-4">
                            ${course.modules > 0 ? `<p><i class="fas fa-book-open mr-2"></i>${course.modules} Modules</p>` : '<p><i class="fas fa-flask mr-2"></i>Research-Based</p>'}
                            ${course.semesters > 0 ? `<p><i class="fas fa-calendar-alt mr-2"></i>${course.semesters} Semesters</p>` : ''}
                            <p><i class="fas fa-tag mr-2"></i>R ${course.price.toLocaleString()}</p>
                        </div>
                        <a href="/apply?course=${course.id}" class="brand-bg text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition inline-block w-full text-center">
                            <i class="fas fa-file-alt mr-2"></i>Apply Now
                        </a>
                    </div>
                `).join('')}
            </div>
        </div>

        <footer class="bg-gray-900 text-white py-8 mt-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p>&copy; 2024 VonWillingh Online. All rights reserved.</p>
            </div>
        </footer>
    </body>
    </html>
  `)
})

// Application form page
app.get('/apply', async (c) => {
  try {
    // Load courses from database instead of hardcoded array
    const supabase = getSupabaseAdminClient(c.env)
    const { data: dbCourses, error } = await supabase
      .from('courses')
      .select('id, name, level, price')
      .order('id')
    
    if (error) {
      console.error('Error loading courses:', error)
      // Fall back to hardcoded courses if database fails
      var courses = COURSES
    } else {
      var courses = dbCourses && dbCourses.length > 0 ? dbCourses : COURSES
    }
    
    const courseId = c.req.query('course')
    const selectedCourse = courseId ? courses.find(c => c.id === parseInt(courseId)) : null
    
    return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Form - VonWillingh Online</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          .brand-bg { background-color: ${BRAND_COLORS.primary}; }
          .brand-text { color: ${BRAND_COLORS.primary}; }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Navigation -->
        <nav class="brand-bg text-white shadow-lg">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-4">
                    <div class="flex items-center space-x-4">
                        <img src="/static/vonwillingh-logo.png" alt="VonWillingh Online Logo" class="h-16 w-auto">
                        <h1 class="text-xl font-bold">VonWillingh Online</h1>
                    </div>
                    <div class="flex space-x-4">
                        <a href="/" class="hover:text-blue-200"><i class="fas fa-home mr-1"></i> Home</a>
                        <a href="/courses" class="hover:text-blue-200"><i class="fas fa-book mr-1"></i> Courses</a>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Application Form -->
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="bg-white rounded-lg shadow-lg p-8">
                <h2 class="text-3xl font-bold mb-6 brand-text">
                    <i class="fas fa-file-alt mr-2"></i>Application Form
                </h2>
                
                <div id="alert" class="hidden mb-6 p-4 rounded-lg"></div>

                <form id="applicationForm" class="space-y-6">
                    <!-- Personal Information -->
                    <div class="border-b pb-6">
                        <h3 class="text-xl font-bold mb-4">Personal Information</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block font-semibold mb-2">Full Name *</label>
                                <input type="text" name="fullName" required class="w-full border border-gray-300 rounded px-4 py-2">
                            </div>
                            <div>
                                <label class="block font-semibold mb-2">Email Address *</label>
                                <input type="email" name="email" required class="w-full border border-gray-300 rounded px-4 py-2">
                            </div>
                            <div>
                                <label class="block font-semibold mb-2">Phone Number *</label>
                                <input type="tel" name="phone" required class="w-full border border-gray-300 rounded px-4 py-2">
                            </div>
                            <div>
                                <label class="block font-semibold mb-2">Date of Birth *</label>
                                <input type="date" name="dob" required class="w-full border border-gray-300 rounded px-4 py-2">
                            </div>
                            <div class="md:col-span-2">
                                <label class="block font-semibold mb-2">Physical Address *</label>
                                <textarea name="address" required rows="3" class="w-full border border-gray-300 rounded px-4 py-2"></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Course Selection -->
                    <div class="border-b pb-6">
                        <h3 class="text-xl font-bold mb-4">Course Selection</h3>
                        <div>
                            <label class="block font-semibold mb-2">Select Course *</label>
                            <select name="courseId" required class="w-full border border-gray-300 rounded px-4 py-2">
                                <option value="">-- Choose a Course --</option>
                                ${courses.map(course => `
                                    <option value="${course.id}" ${selectedCourse && selectedCourse.id === course.id ? 'selected' : ''}>
                                        ${course.name} (${course.level}) - R ${course.price.toLocaleString()}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                    </div>

                    <!-- Document Upload -->
                    <div class="border-b pb-6">
                        <h3 class="text-xl font-bold mb-4">Document Upload (Max 5MB per file)</h3>
                        <div class="space-y-4">
                            <div>
                                <label class="block font-semibold mb-2">ID Document / Passport * <span class="text-sm text-gray-500">(PDF, JPG, PNG)</span></label>
                                <input type="file" name="idDocument" required accept=".pdf,.jpg,.jpeg,.png" class="w-full border border-gray-300 rounded px-4 py-2">
                            </div>
                            <div>
                                <label class="block font-semibold mb-2">Certificates <span class="text-sm text-gray-500">(PDF)</span></label>
                                <input type="file" name="certificates" accept=".pdf" class="w-full border border-gray-300 rounded px-4 py-2">
                            </div>
                            <div>
                                <label class="block font-semibold mb-2">CV / Resume * <span class="text-sm text-gray-500">(PDF)</span></label>
                                <input type="file" name="cv" required accept=".pdf" class="w-full border border-gray-300 rounded px-4 py-2">
                            </div>
                        </div>
                    </div>

                    <!-- Additional Information -->
                    <div class="pb-6">
                        <h3 class="text-xl font-bold mb-4">Additional Information</h3>
                        <div>
                            <label class="block font-semibold mb-2">Why do you want to study this course?</label>
                            <textarea name="motivation" rows="4" class="w-full border border-gray-300 rounded px-4 py-2"></textarea>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <div class="flex justify-end space-x-4">
                        <a href="/courses" class="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition">
                            Cancel
                        </a>
                        <button type="submit" class="brand-bg text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition font-semibold">
                            <i class="fas fa-paper-plane mr-2"></i>Submit Application
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <footer class="bg-gray-900 text-white py-8 mt-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p>&copy; 2024 VonWillingh Online. All rights reserved.</p>
            </div>
        </footer>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
            document.getElementById('applicationForm').addEventListener('submit', async (e) => {
                e.preventDefault()
                
                const alert = document.getElementById('alert')
                const formData = new FormData(e.target)
                
                // Validate file sizes (5MB max)
                const files = ['idDocument', 'certificates', 'cv']
                for (const fileName of files) {
                    const file = formData.get(fileName)
                    if (file && file.size > 5 * 1024 * 1024) {
                        alert.className = 'mb-6 p-4 rounded-lg bg-red-100 text-red-700'
                        alert.textContent = fileName + ' exceeds 5MB limit. Please upload a smaller file.'
                        alert.classList.remove('hidden')
                        return
                    }
                }
                
                try {
                    // Extract form data - skip file inputs since upload isn't implemented
                    const data = {
                        fullName: formData.get('fullName'),
                        email: formData.get('email'),
                        phone: formData.get('phone'),
                        dob: formData.get('dob'),
                        address: formData.get('address'),
                        courseId: formData.get('courseId'),
                        motivation: formData.get('motivation')
                    }
                    
                    console.log('📝 Submitting application:', data.fullName, data.email)
                    
                    const response = await axios.post('/api/applications', data)
                    
                    alert.className = 'mb-6 p-4 rounded-lg bg-yellow-100 text-yellow-800'
                    alert.textContent = '✓ Application submitted successfully! Check your email for confirmation.'
                    alert.classList.remove('hidden')
                    
                    setTimeout(() => {
                        window.location.href = '/application-success'
                    }, 2000)
                    
                } catch (error) {
                    alert.className = 'mb-6 p-4 rounded-lg bg-red-100 text-red-700'
                    const errorMsg = error.response?.data?.message || error.message || 'Error submitting application. Please try again.'
                    alert.textContent = '✗ ' + errorMsg
                    alert.classList.remove('hidden')
                    console.error('Application error:', error.response?.data || error)
                }
            })
        </script>
    </body>
    </html>
  `)
  } catch (error) {
    console.error('Error loading apply page:', error)
    return c.html('<h1>Error loading application form. Please try again later.</h1>')
  }
})

// Application success page
app.get('/application-success', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Submitted - VonWillingh Online</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          .brand-bg { background-color: ${BRAND_COLORS.primary}; }
        </style>
    </head>
    <body class="bg-gray-50">
        <div class="min-h-screen flex items-center justify-center px-4">
            <div class="max-w-2xl w-full bg-white rounded-lg shadow-lg p-12 text-center">
                <div class="text-6xl text-yellow-700 mb-6">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h1 class="text-3xl font-bold mb-4">Application Submitted Successfully!</h1>
                <p class="text-lg text-gray-600 mb-6">
                    Thank you for applying to VonWillingh Online.
                </p>
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <h3 class="font-bold mb-3">What Happens Next?</h3>
                    <ul class="text-left space-y-2 text-gray-700">
                        <li><i class="fas fa-envelope mr-2 text-blue-600"></i>You'll receive a confirmation email shortly</li>
                        <li><i class="fas fa-user-check mr-2 text-blue-600"></i>Our admissions team will review your application (2-5 business days)</li>
                        <li><i class="fas fa-file-contract mr-2 text-blue-600"></i>If approved, you'll receive an acceptance letter with payment instructions</li>
                        <li><i class="fas fa-credit-card mr-2 text-blue-600"></i>Complete payment to activate your student account</li>
                        <li><i class="fas fa-graduation-cap mr-2 text-blue-600"></i>Start learning immediately after payment confirmation</li>
                    </ul>
                </div>
                <div class="space-x-4">
                    <a href="/" class="brand-bg text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition inline-block">
                        <i class="fas fa-home mr-2"></i>Back to Home
                    </a>
                    <a href="/courses" class="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition inline-block">
                        <i class="fas fa-book mr-2"></i>View More Courses
                    </a>
                </div>
            </div>
        </div>
    </body>
    </html>
  `)
})

// Simple Login (for debugging)
app.get('/simple-login', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Login - Debug</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <div class="min-h-screen flex items-center justify-center px-4">
        <div class="max-w-md w-full">
            <div class="text-center mb-8">
                <h2 class="text-4xl font-bold text-blue-900 mb-2">VonWillingh Online</h2>
                <h3 class="text-2xl font-semibold text-gray-700">Student Portal - Debug Mode</h3>
                <p class="text-gray-600 mt-2">Sign in to access your courses</p>
            </div>
            
            <div class="bg-white rounded-lg shadow-lg p-8">
                <div id="alertBox" class="hidden mb-4 p-4 rounded-lg"></div>
                
                <form id="loginForm" class="space-y-6">
                    <div>
                        <label class="block font-semibold mb-2 text-gray-700">Email Address</label>
                        <input 
                            type="email" 
                            id="email" 
                            value="sarrol@vonwillingh.co.za"
                            required 
                            class="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                        >
                    </div>
                    <div>
                        <label class="block font-semibold mb-2 text-gray-700">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            value="Lorras@116397"
                            required 
                            class="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                        >
                    </div>
                    <button 
                        type="submit" 
                        id="loginBtn" 
                        class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold text-lg"
                    >
                        Sign In
                    </button>
                </form>
                
                <div id="debugInfo" class="mt-6 p-4 bg-gray-100 rounded-lg text-sm font-mono overflow-auto max-h-96">
                    <div class="font-bold mb-2 text-lg">📊 Debug Info:</div>
                    <div id="debugOutput" class="whitespace-pre-wrap">Waiting for login attempt...</div>
                </div>
            </div>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        document.getElementById('loginForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const loginBtn = document.getElementById('loginBtn');
            const alertBox = document.getElementById('alertBox');
            const debugOutput = document.getElementById('debugOutput');
            
            // Update UI
            loginBtn.disabled = true;
            loginBtn.textContent = 'Signing in...';
            alertBox.classList.add('hidden');
            debugOutput.innerHTML = \`📝 Attempting login...
Email: \${email}
Time: \${new Date().toLocaleString()}

\`;
            
            try {
                debugOutput.innerHTML += '🌐 Sending POST request to /api/student/login...\\n';
                debugOutput.innerHTML += \`Request body: \${JSON.stringify({email, password: '***'}, null, 2)}\\n\\n\`;
                
                const response = await axios.post('/api/student/login', {
                    email: email,
                    password: password
                });
                
                debugOutput.innerHTML += \`✅ Response received!\\nStatus: \${response.status}\\n\\n\`;
                debugOutput.innerHTML += \`Response data:\\n\${JSON.stringify(response.data, null, 2)}\\n\\n\`;
                
                if (response.data.success) {
                    // Store session
                    const sessionData = {
                        studentId: response.data.student.id,
                        fullName: response.data.student.full_name,
                        email: response.data.student.email,
                        loginTime: new Date().toISOString()
                    };
                    
                    localStorage.setItem('studentSession', JSON.stringify(sessionData));
                    
                    // Show success
                    alertBox.className = 'mb-4 p-4 rounded-lg bg-green-100 text-green-800 border-2 border-green-300 font-semibold';
                    alertBox.textContent = '✅ Login successful! Redirecting to dashboard...';
                    alertBox.classList.remove('hidden');
                    
                    debugOutput.innerHTML += \`✅ Session stored in localStorage\\n\`;
                    debugOutput.innerHTML += \`👤 Student: \${response.data.student.full_name}\\n\`;
                    debugOutput.innerHTML += \`🆔 Student ID: \${response.data.student.id}\\n\`;
                    debugOutput.innerHTML += '🔄 Redirecting to /student/dashboard in 2 seconds...\\n';
                    
                    // Redirect
                    setTimeout(() => {
                        window.location.href = '/student/dashboard';
                    }, 2000);
                    
                } else {
                    throw new Error(response.data.message || 'Login failed');
                }
                
            } catch (error) {
                console.error('Login error:', error);
                
                debugOutput.innerHTML += \`\\n❌ ERROR OCCURRED!\\n\`;
                debugOutput.innerHTML += \`Error Type: \${error.name}\\n\`;
                debugOutput.innerHTML += \`Error Message: \${error.message}\\n\\n\`;
                
                if (error.response) {
                    debugOutput.innerHTML += \`HTTP Status: \${error.response.status}\\n\`;
                    debugOutput.innerHTML += \`Response Data:\\n\${JSON.stringify(error.response.data, null, 2)}\\n\`;
                } else if (error.request) {
                    debugOutput.innerHTML += 'No response received from server\\n';
                    debugOutput.innerHTML += 'Possible causes:\\n';
                    debugOutput.innerHTML += '- Server is down\\n';
                    debugOutput.innerHTML += '- Network error\\n';
                    debugOutput.innerHTML += '- CORS issue\\n';
                } else {
                    debugOutput.innerHTML += \`Setup Error: \${error.message}\\n\`;
                }
                
                alertBox.className = 'mb-4 p-4 rounded-lg bg-red-100 text-red-800 border-2 border-red-300 font-semibold';
                alertBox.textContent = error.response?.data?.message || error.message || 'Login failed';
                alertBox.classList.remove('hidden');
                
                loginBtn.disabled = false;
                loginBtn.textContent = 'Sign In';
            }
        });
        
        // Show initial info
        console.log('Simple Login Page Loaded');
        console.log('Email pre-filled:', document.getElementById('email').value);
    </script>
</body>
</html>
  `)
})

// Student Login (placeholder - will connect to Supabase)
app.get('/student-login', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Student Login - VonWillingh Online</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          .brand-bg { background-color: ${BRAND_COLORS.primary}; }
        </style>
    </head>
    <body class="bg-gray-50">
        <div class="min-h-screen flex items-center justify-center px-4">
            <div class="max-w-md w-full">
                <div class="text-center mb-8">
                    <img src="/static/vonwillingh-logo.png" alt="VonWillingh Online Logo" class="h-48 w-48 mx-auto mb-4">
                    <h2 class="text-3xl font-bold">Student Portal</h2>
                    <p class="text-gray-600">Sign in to access your courses</p>
                </div>
                
                <div class="bg-white rounded-lg shadow-lg p-8">
                    <div id="alertBox" class="hidden mb-4 p-4 rounded-lg"></div>
                    
                    <form id="loginForm" class="space-y-6">
                        <div>
                            <label class="block font-semibold mb-2">Email Address</label>
                            <input type="email" id="email" required class="w-full border border-gray-300 rounded px-4 py-2">
                        </div>
                        <div>
                            <label class="block font-semibold mb-2">Password</label>
                            <div class="relative">
                                <input type="password" id="password" required class="w-full border border-gray-300 rounded px-4 py-2 pr-12">
                                <button type="button" onclick="togglePasswordVisibility('password', 'toggleIconStudent')" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                                    <i id="toggleIconStudent" class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div class="flex items-center justify-between">
                            <label class="flex items-center">
                                <input type="checkbox" id="rememberMe" class="mr-2">
                                <span class="text-sm">Remember me</span>
                            </label>
                            <a href="#" class="text-sm text-blue-600 hover:underline">Forgot password?</a>
                        </div>
                        <button type="submit" id="loginBtn" class="w-full brand-bg text-white py-3 rounded-lg hover:bg-blue-800 transition font-semibold">
                            <i class="fas fa-sign-in-alt mr-2"></i>Sign In
                        </button>
                    </form>
                    <p class="text-center text-sm text-gray-600 mt-6">
                        Don't have an account? <a href="/apply" class="text-blue-600 hover:underline font-semibold">Apply Now</a>
                    </p>
                </div>
                
                <div class="text-center mt-6">
                    <a href="/" class="text-gray-600 hover:text-gray-800"><i class="fas fa-arrow-left mr-2"></i>Back to Home</a>
                </div>
            </div>
        </div>
        
        <script>
            function togglePasswordVisibility(inputId, iconId) {
                const input = document.getElementById(inputId);
                const icon = document.getElementById(iconId);
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            }
        </script>
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/student-login.js"></script>
    </body>
    </html>
  `)
})

// ==================== STUDENT PORTAL ROUTES ====================

// Student Dashboard
app.get('/student/dashboard', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Student Dashboard - VonWillingh Online</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          .brand-bg { background-color: ${BRAND_COLORS.primary}; }
          .brand-text { color: ${BRAND_COLORS.primary}; }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Navigation -->
        <nav class="brand-bg text-white shadow-lg">
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between py-4">
                    <div class="flex items-center space-x-4">
                        <img src="/static/vonwillingh-logo.png" alt="VonWillingh Online Logo" class="h-12 w-12">
                        <div>
                            <h1 class="text-xl font-bold">VonWillingh Online</h1>
                            <p class="text-sm opacity-90">Student Portal</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-6">
                        <span id="studentName" class="font-semibold"></span>
                        <button id="logoutBtn" class="hover:bg-blue-800 px-4 py-2 rounded transition">
                            <i class="fas fa-sign-out-alt mr-2"></i>Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <div class="container mx-auto px-4 py-8">
            <!-- Welcome Section -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-2xl font-bold mb-2">Welcome back, <span id="welcomeName"></span>!</h2>
                <p class="text-gray-600">Here's an overview of your learning journey</p>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 text-sm">Enrolled Courses</p>
                            <p id="enrolledCount" class="text-3xl font-bold brand-text">0</p>
                        </div>
                        <div class="brand-bg text-white w-12 h-12 rounded-full flex items-center justify-center">
                            <i class="fas fa-book"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 text-sm">In Progress</p>
                            <p id="inProgressCount" class="text-3xl font-bold text-yellow-600">0</p>
                        </div>
                        <div class="bg-yellow-500 text-white w-12 h-12 rounded-full flex items-center justify-center">
                            <i class="fas fa-hourglass-half"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 text-sm">Completed</p>
                            <p id="completedCount" class="text-3xl font-bold text-yellow-700">0</p>
                        </div>
                        <div class="bg-yellow-700 text-white w-12 h-12 rounded-full flex items-center justify-center">
                            <i class="fas fa-check-circle"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- My Courses -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-xl font-bold mb-4">My Courses</h3>
                
                <div id="loadingCourses" class="text-center py-8">
                    <i class="fas fa-spinner fa-spin text-3xl text-gray-400"></i>
                    <p class="text-gray-600 mt-2">Loading your courses...</p>
                </div>
                
                <div id="coursesContainer" class="hidden space-y-4"></div>
                
                <div id="noCoursesMessage" class="hidden text-center py-8 text-gray-600">
                    <i class="fas fa-inbox text-5xl mb-4 text-gray-300"></i>
                    <p>You are not enrolled in any courses yet.</p>
                    <a href="/courses" class="inline-block mt-4 brand-bg text-white px-6 py-2 rounded hover:bg-blue-800 transition">
                        Browse Courses
                    </a>
                </div>
            </div>
        </div>

        <!-- Hidden images for certificate generation -->
        <img id="vonwillinghLogoImage" src="/static/vonwillingh-logo.png" style="display: none;" crossorigin="anonymous">
        <img id="signature1Image" src="/static/signature-mjgumede.png" style="display: none;" crossorigin="anonymous">
        <img id="signature2Image" src="/static/signature-svonwillingh.png" style="display: none;" crossorigin="anonymous">

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
        <script src="/static/certificate-generator.js"></script>
        <script src="/static/student-dashboard.js"></script>
    </body>
    </html>
  `)
})

// Change Password Page
app.get('/student/change-password', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Change Password - VonWillingh Online</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          .brand-bg { background-color: ${BRAND_COLORS.primary}; }
        </style>
    </head>
    <body class="bg-gray-50">
        <div class="min-h-screen flex items-center justify-center px-4">
            <div class="max-w-md w-full">
                <div class="text-center mb-8">
                    <img src="/static/vonwillingh-logo.png" alt="VonWillingh Online Logo" class="h-48 w-48 mx-auto mb-4">
                    <h2 class="text-3xl font-bold">Change Password</h2>
                    <p class="text-gray-600">Please create a new permanent password</p>
                </div>
                
                <div class="bg-white rounded-lg shadow-lg p-8">
                    <div class="bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded-lg mb-6">
                        <i class="fas fa-exclamation-triangle mr-2"></i>
                        You are using a temporary password. Please change it to continue.
                    </div>
                    
                    <div id="alertBox" class="hidden mb-4 p-4 rounded-lg"></div>
                    
                    <form id="changePasswordForm" class="space-y-6">
                        <div>
                            <label class="block font-semibold mb-2">Current Password</label>
                            <div class="relative">
                                <input type="password" id="currentPassword" required class="w-full border border-gray-300 rounded px-4 py-2 pr-12">
                                <button type="button" onclick="togglePasswordVisibility('currentPassword', 'toggleIconCurrent')" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                                    <i id="toggleIconCurrent" class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div>
                            <label class="block font-semibold mb-2">New Password</label>
                            <div class="relative">
                                <input type="password" id="newPassword" required minlength="8" class="w-full border border-gray-300 rounded px-4 py-2 pr-12">
                                <button type="button" onclick="togglePasswordVisibility('newPassword', 'toggleIconNew')" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                                    <i id="toggleIconNew" class="fas fa-eye"></i>
                                </button>
                            </div>
                            <p class="text-sm text-gray-600 mt-1">Minimum 8 characters</p>
                        </div>
                        <div>
                            <label class="block font-semibold mb-2">Confirm New Password</label>
                            <div class="relative">
                                <input type="password" id="confirmPassword" required minlength="8" class="w-full border border-gray-300 rounded px-4 py-2 pr-12">
                                <button type="button" onclick="togglePasswordVisibility('confirmPassword', 'toggleIconConfirm')" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                                    <i id="toggleIconConfirm" class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <button type="submit" id="changeBtn" class="w-full brand-bg text-white py-3 rounded-lg hover:bg-blue-800 transition font-semibold">
                            <i class="fas fa-key mr-2"></i>Change Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
        
        <script>
            function togglePasswordVisibility(inputId, iconId) {
                const input = document.getElementById(inputId);
                const icon = document.getElementById(iconId);
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            }
        </script>
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/change-password.js"></script>
    </body>
    </html>
  `)
})

// Course Detail Page
app.get('/student/course/:courseId', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Course - VonWillingh Online</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          .brand-bg { background-color: ${BRAND_COLORS.primary}; }
          .brand-text { color: ${BRAND_COLORS.primary}; }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Navigation -->
        <nav class="brand-bg text-white shadow-lg">
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between py-4">
                    <div class="flex items-center space-x-4">
                        <img src="/static/vonwillingh-logo.png" alt="VonWillingh Online Logo" class="h-12 w-12">
                        <div>
                            <h1 class="text-xl font-bold">VonWillingh Online</h1>
                            <p class="text-sm opacity-90">Course Content</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-6">
                        <a href="/student/dashboard" class="hover:bg-blue-800 px-4 py-2 rounded transition">
                            <i class="fas fa-arrow-left mr-2"></i>Dashboard
                        </a>
                    </div>
                </div>
            </div>
        </nav>

        <div class="container mx-auto px-4 py-8">
            <!-- Course Header -->
            <div id="courseHeader" class="bg-white rounded-lg shadow-md p-6 mb-6">
                <div id="loadingHeader" class="text-center py-4">
                    <i class="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
                </div>
            </div>

            <!-- Progress Bar -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="font-semibold">Your Progress</h3>
                    <span id="progressText" class="text-sm text-gray-600">0% Complete</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                    <div id="progressBar" class="brand-bg h-3 rounded-full transition-all duration-500" style="width: 0%"></div>
                </div>
                <p id="progressDetails" class="text-sm text-gray-600 mt-2">0 of 0 modules completed</p>
            </div>

            <!-- Modules List -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-xl font-bold mb-4">Course Modules</h3>
                
                <div id="loadingModules" class="text-center py-8">
                    <i class="fas fa-spinner fa-spin text-3xl text-gray-400"></i>
                    <p class="text-gray-600 mt-2">Loading modules...</p>
                </div>
                
                <div id="modulesContainer" class="hidden space-y-3"></div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/course-detail.js"></script>
    </body>
    </html>
  `)
})

// Module Viewer Page
app.get('/student/module/:moduleId', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Module - VonWillingh Online</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          .brand-bg { background-color: ${BRAND_COLORS.primary}; }
          .brand-text { color: ${BRAND_COLORS.primary}; }
          .module-content { line-height: 1.8; }
          .module-content h2 { font-size: 1.5rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 1rem; }
          .module-content h3 { font-size: 1.25rem; font-weight: bold; margin-top: 1.25rem; margin-bottom: 0.75rem; }
          .module-content p { margin-bottom: 1rem; }
          .module-content ul, .module-content ol { margin-left: 2rem; margin-bottom: 1rem; }
          .module-content li { margin-bottom: 0.5rem; }
          /* Hide repeated quiz text patterns */
          .module-content p:has(> strong:contains("Question")),
          .module-content p:contains("**Question"),
          .module-content p:contains("**Options:**"),
          .module-content p:contains("**Correct Answer:**") {
            display: none;
          }
        </style>
    </head>
    <body class="bg-gray-50">
        <div id="loadingScreen" class="min-h-screen flex items-center justify-center">
            <div class="text-center">
                <i class="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600">Loading module...</p>
            </div>
        </div>

        <div id="moduleContent" class="hidden">
            <!-- Navigation -->
            <nav class="brand-bg text-white shadow-lg">
                <div class="container mx-auto px-4">
                    <div class="flex items-center justify-between py-4">
                        <div class="flex items-center space-x-4">
                            <img src="/static/vonwillingh-logo.png" alt="VonWillingh Online Logo" class="h-12 w-12">
                            <div>
                                <p class="text-sm opacity-90" id="courseName">Course</p>
                                <h1 class="text-lg font-bold" id="moduleTitle">Module</h1>
                            </div>
                        </div>
                        <div class="flex items-center space-x-4">
                            <span id="modulePosition" class="text-sm">Module 1 of 5</span>
                            <button id="backToCourseBtn" class="hover:bg-blue-800 px-4 py-2 rounded transition">
                                <i class="fas fa-arrow-left mr-2"></i>Back to Course
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div class="container mx-auto px-4 py-8 max-w-4xl">
                <!-- Module Header -->
                <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 id="moduleHeading" class="text-2xl font-bold mb-2">Module Title</h2>
                    <p id="moduleDescription" class="text-gray-600"></p>
                </div>

                <!-- Module Content -->
                <div class="bg-white rounded-lg shadow-md p-8 mb-6">
                    <div id="moduleContentArea" class="module-content"></div>
                </div>

                <!-- Quiz Section -->
                <div id="quizSection" class="bg-white rounded-lg shadow-md p-8 mb-6 hidden">
                    <div class="border-t-4 border-blue-600 -m-8 p-8">
                        <h2 class="text-2xl font-bold mb-4 flex items-center">
                            <i class="fas fa-clipboard-check text-blue-600 mr-3"></i>
                            Module Quiz
                        </h2>
                        <p class="text-gray-600 mb-6">
                            Test your knowledge with this 30-question quiz. You need 70% to pass and unlock the next module.
                        </p>
                        <button id="startQuizBtn" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
                            <i class="fas fa-play mr-2"></i>Start Quiz
                        </button>
                    </div>
                </div>

                <!-- Quiz Modal -->
                <div id="quizModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50 p-4">
                    <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div class="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                            <h2 class="text-2xl font-bold">Module Quiz</h2>
                            <button id="closeQuizBtn" class="text-gray-500 hover:text-gray-700">
                                <i class="fas fa-times text-2xl"></i>
                            </button>
                        </div>
                        <div id="quizContainer" class="p-6"></div>
                    </div>
                </div>

                <!-- Navigation & Actions -->
                <div class="flex items-center justify-between">
                    <button id="previousBtn" class="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                        <i class="fas fa-arrow-left mr-2"></i>Previous
                    </button>
                    
                    <button id="completeBtn" class="brand-bg text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition font-semibold">
                        <i class="fas fa-check-circle mr-2"></i>Mark as Complete
                    </button>
                    
                    <button id="nextBtn" class="brand-bg text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition font-semibold">
                        Next<i class="fas fa-arrow-right ml-2"></i>
                    </button>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/quiz-component.js"></script>
        <script src="/static/module-viewer.js"></script>
        <script src="/static/professional-module-renderer.js"></script>
        <script>
          // Initialize quiz when module loads
          document.addEventListener('DOMContentLoaded', function() {
            // Show quiz section after content loads
            setTimeout(() => {
              const quizSection = document.getElementById('quizSection');
              if (quizSection) quizSection.classList.remove('hidden');
            }, 1000);

            // Start quiz button
            document.getElementById('startQuizBtn')?.addEventListener('click', function() {
              const urlParams = new URLSearchParams(window.location.search);
              const moduleId = window.location.pathname.split('/').pop();
              const currentSession = JSON.parse(sessionStorage.getItem('currentSession') || '{}');
              
              // Show modal
              const modal = document.getElementById('quizModal');
              if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                
                // Initialize quiz component
                window.quizComponent = new QuizComponent('quizContainer', moduleId, currentSession.studentId, currentSession.enrollmentId);
                window.quizComponent.init();
              }
            });

            // Close quiz button
            document.getElementById('closeQuizBtn')?.addEventListener('click', function() {
              const modal = document.getElementById('quizModal');
              if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
              }
            });
          });
        </script>
    </body>
    </html>
  `)
})

// ==================== PAYMENT SYSTEM ROUTES ====================

// Payment Instructions Page (for approved students)
app.get('/payment-instructions/:applicationId', async (c) => {
  try {
    const applicationId = c.req.param('applicationId')
    const supabase = getSupabaseAdminClient(c.env)
    
    // Get application details
    const { data: application, error } = await supabase
      .from('applications')
      .select(`
        *,
        students:student_id (full_name, email, phone),
        courses:course_id (name, price)
      `)
      .eq('id', applicationId)
      .single()
    
    if (error || !application) {
      return c.html('<h1>Application not found</h1>', 404)
    }
    
    if (application.status !== 'approved') {
      return c.html('<h1>This application has not been approved yet</h1>', 403)
    }
    
    const studentName = application.students?.full_name || 'Student'
    const courseName = application.courses?.name || 'Course'
    const amount = application.courses?.price || 0
    const paymentReference = application.students?.full_name || applicationId.substring(0, 8)
    
    return c.html(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Instructions - VonWillingh Online</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
          <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
          <style>
            .brand-bg { background-color: #1B4B8D; }
            .brand-text { color: #1B4B8D; }
          </style>
      </head>
      <body class="bg-gray-100">
          <div class="min-h-screen py-12 px-4">
              <div class="max-w-4xl mx-auto">
                  <!-- Header -->
                  <div class="bg-white rounded-lg shadow-lg p-8 mb-6">
                      <div class="text-center mb-6">
                          <div class="text-5xl text-yellow-700 mb-4">
                              <i class="fas fa-check-circle"></i>
                          </div>
                          <h1 class="text-3xl font-bold brand-text mb-2">
                              Congratulations, ${studentName}!
                          </h1>
                          <p class="text-xl text-gray-600">
                              Your application has been approved
                          </p>
                      </div>
                      
                      <div class="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
                          <div class="flex items-start">
                              <i class="fas fa-info-circle text-blue-500 text-2xl mr-4 mt-1"></i>
                              <div>
                                  <h3 class="font-bold text-lg mb-2">Next Step: Complete Your Payment</h3>
                                  <p class="text-gray-700">
                                      To secure your place and activate your student account, please complete the payment below.
                                  </p>
                              </div>
                          </div>
                      </div>
                      
                      <div class="grid md:grid-cols-2 gap-6 mb-6">
                          <div class="bg-gray-50 p-4 rounded">
                              <p class="text-sm text-gray-600">Course</p>
                              <p class="font-bold text-lg brand-text">${courseName}</p>
                          </div>
                          <div class="bg-gray-50 p-4 rounded">
                              <p class="text-sm text-gray-600">Amount Due</p>
                              <p class="font-bold text-2xl text-yellow-700">R ${amount.toLocaleString()}</p>
                          </div>
                      </div>
                  </div>
                  
                  <!-- Bank Details -->
                  <div class="bg-white rounded-lg shadow-lg p-8 mb-6">
                      <h2 class="text-2xl font-bold brand-text mb-6">
                          <i class="fas fa-university mr-2"></i>Bank Transfer Details
                      </h2>
                      
                      <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 mb-6">
                          <div class="grid md:grid-cols-2 gap-4">
                              <div>
                                  <p class="text-sm text-gray-600 mb-1">Bank</p>
                                  <p class="font-bold text-lg">${c.env.BANK_NAME || 'Absa'}</p>
                              </div>
                              <div>
                                  <p class="text-sm text-gray-600 mb-1">Account Name</p>
                                  <p class="font-bold text-lg">${c.env.BANK_ACCOUNT_NAME || 'S Von Willingh'}</p>
                              </div>
                              <div>
                                  <p class="text-sm text-gray-600 mb-1">Account Number</p>
                                  <p class="font-bold text-xl text-blue-600">${c.env.BANK_ACCOUNT_NUMBER || '01163971026'}</p>
                              </div>
                              <div>
                                  <p class="text-sm text-gray-600 mb-1">Branch Code</p>
                                  <p class="font-bold text-xl text-blue-600">${c.env.BANK_BRANCH_CODE || '632005'}</p>
                              </div>
                              <div>
                                  <p class="text-sm text-gray-600 mb-1">Account Type</p>
                                  <p class="font-bold text-lg">${c.env.BANK_ACCOUNT_TYPE || 'Cheque'}</p>
                              </div>
                              <div>
                                  <p class="text-sm text-gray-600 mb-1">Payment Reference</p>
                                  <p class="font-bold text-xl text-red-600">${paymentReference}</p>
                              </div>
                          </div>
                      </div>
                      
                      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                          <div class="flex items-start">
                              <i class="fas fa-exclamation-triangle text-yellow-600 text-xl mr-3 mt-1"></i>
                              <div>
                                  <p class="font-bold text-yellow-800">Important:</p>
                                  <p class="text-yellow-700">
                                      Please use <strong>${paymentReference}</strong> as your payment reference. 
                                      This helps us identify your payment quickly.
                                  </p>
                              </div>
                          </div>
                      </div>
                      
                      <div class="space-y-3 text-gray-700">
                          <h3 class="font-bold text-lg mb-3">Payment Instructions:</h3>
                          <div class="flex items-start">
                              <span class="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">1</span>
                              <p>Transfer <strong>R ${amount.toLocaleString()}</strong> to the bank account above</p>
                          </div>
                          <div class="flex items-start">
                              <span class="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">2</span>
                              <p>Use <strong>${paymentReference}</strong> as your payment reference</p>
                          </div>
                          <div class="flex items-start">
                              <span class="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">3</span>
                              <p>Save your proof of payment (bank slip or screenshot)</p>
                          </div>
                          <div class="flex items-start">
                              <span class="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">4</span>
                              <p>Upload your proof below</p>
                          </div>
                      </div>
                  </div>
                  
                  <!-- Upload Proof -->
                  <div class="bg-white rounded-lg shadow-lg p-8">
                      <h2 class="text-2xl font-bold brand-text mb-6">
                          <i class="fas fa-upload mr-2"></i>Upload Proof of Payment
                      </h2>
                      
                      <div id="alert" class="hidden mb-4"></div>
                      
                      ${application.payment_status === 'proof_uploaded' || application.payment_status === 'verified' ? `
                        <div class="bg-yellow-50 border border-yellow-300 rounded-lg p-6 text-center">
                            <i class="fas fa-check-circle text-yellow-700 text-4xl mb-3"></i>
                            <h3 class="font-bold text-xl text-yellow-900 mb-2">
                                ${application.payment_status === 'verified' ? 'Payment Verified!' : 'Proof Uploaded Successfully!'}
                            </h3>
                            <p class="text-yellow-800">
                                ${application.payment_status === 'verified' 
                                  ? 'Your payment has been verified. Check your email for login credentials.'
                                  : 'We will verify your payment within 1-2 business days. You will receive an email with your login credentials once verified.'
                                }
                            </p>
                        </div>
                      ` : `
                        <form id="paymentUploadForm" class="space-y-6">
                            <input type="hidden" id="applicationId" value="${applicationId}">
                            
                            <div>
                                <label class="block font-semibold mb-2">Select Proof of Payment</label>
                                <input type="file" id="proofFile" accept=".pdf,.jpg,.jpeg,.png" required
                                       class="w-full border border-gray-300 rounded px-4 py-3">
                                <p class="text-sm text-gray-500 mt-2">
                                    Accepted formats: PDF, JPG, PNG (Max 5MB)
                                </p>
                            </div>
                            
                            <button type="submit" id="uploadBtn" class="w-full brand-bg text-white py-3 rounded-lg hover:bg-blue-800 transition font-semibold text-lg">
                                <i class="fas fa-upload mr-2"></i>Upload Proof of Payment
                            </button>
                        </form>
                      `}
                      
                      <div class="mt-6 text-center">
                          <a href="/" class="text-gray-600 hover:text-gray-800">
                              <i class="fas fa-arrow-left mr-2"></i>Back to Home
                          </a>
                      </div>
                  </div>
              </div>
          </div>
          
          <script src="/static/payment-upload.js"></script>
      </body>
      </html>
    `)
  } catch (error: any) {
    return c.html(`<h1>Error: ${error.message}</h1>`, 500)
  }
})

// Admin Payments Page
app.get('/admin-payments', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Management - VonWillingh Online</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <style>
          .brand-bg { background-color: #1B4B8D; }
          .brand-text { color: #1B4B8D; }
        </style>
    </head>
    <body class="bg-gray-100">
        <nav class="brand-bg text-white shadow-lg">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center space-x-4">
                        <i class="fas fa-money-check-alt text-2xl"></i>
                        <h1 class="text-xl font-bold">Payment Management</h1>
                    </div>
                    <div class="flex items-center space-x-4">
                        <a href="/admin-dashboard" class="hover:bg-white/10 px-3 py-2 rounded">
                            <i class="fas fa-th-large mr-2"></i>Dashboard
                        </a>
                        <a href="/admin-courses" class="hover:bg-white/10 px-3 py-2 rounded">
                            <i class="fas fa-graduation-cap mr-2"></i>Courses
                        </a>
                        <button id="logoutBtn" class="bg-white/20 hover:bg-white/30 px-4 py-2 rounded transition">
                            <i class="fas fa-sign-out-alt mr-2"></i>Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Statistics -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">Total Payments</p>
                            <p id="totalPayments" class="text-3xl font-bold brand-text">0</p>
                        </div>
                        <i class="fas fa-wallet text-4xl text-gray-300"></i>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">Pending Verification</p>
                            <p id="pendingPayments" class="text-3xl font-bold text-yellow-600">0</p>
                        </div>
                        <i class="fas fa-hourglass-half text-4xl text-yellow-200"></i>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">Verified</p>
                            <p id="verifiedPayments" class="text-3xl font-bold text-yellow-700">0</p>
                        </div>
                        <i class="fas fa-check-circle text-4xl text-green-200"></i>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">Rejected</p>
                            <p id="rejectedPayments" class="text-3xl font-bold text-red-600">0</p>
                        </div>
                        <i class="fas fa-times-circle text-4xl text-red-200"></i>
                    </div>
                </div>
            </div>

            <!-- Filters -->
            <div class="bg-white rounded-lg shadow p-6 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-semibold mb-2">Filter by Status</label>
                        <select id="statusFilter" class="w-full border border-gray-300 rounded px-4 py-2">
                            <option value="">All Statuses</option>
                            <option value="proof_uploaded">Pending Verification</option>
                            <option value="verified">Verified</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                    <div class="flex items-end">
                        <button id="refreshBtn" class="w-full brand-bg text-white px-4 py-2 rounded hover:bg-blue-800 transition">
                            <i class="fas fa-sync-alt mr-2"></i>Refresh
                        </button>
                    </div>
                </div>
            </div>

            <!-- Payments Table -->
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="p-6 border-b">
                    <h2 class="text-xl font-bold brand-text">
                        <i class="fas fa-list mr-2"></i>Payment Submissions
                    </h2>
                </div>
                <div id="loadingDiv" class="p-8 text-center">
                    <i class="fas fa-spinner fa-spin text-4xl text-gray-400"></i>
                    <p class="text-gray-500 mt-4">Loading payments...</p>
                </div>
                <div id="paymentsContainer" class="hidden">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="paymentsTableBody" class="bg-white divide-y divide-gray-200">
                            </tbody>
                        </table>
                    </div>
                </div>
                <div id="emptyDiv" class="hidden p-8 text-center text-gray-500">
                    <i class="fas fa-inbox text-4xl mb-4"></i>
                    <p>No payments found</p>
                </div>
            </div>
        </div>
        
        <script src="/static/admin-payments.js?v=2"></script>
    </body>
    </html>
  `)
})

// Admin Login Page
app.get('/admin-login', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Login - VonWillingh Online</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <style>
          .brand-bg { background-color: ${BRAND_COLORS.primary}; }
        </style>
    </head>
    <body class="bg-gray-50">
        <div class="min-h-screen flex items-center justify-center px-4">
            <div class="max-w-md w-full">
                <div class="text-center mb-8">
                    <div class="text-5xl text-gray-700 mb-4"><i class="fas fa-user-shield"></i></div>
                    <h2 class="text-3xl font-bold">Admin Portal</h2>
                    <p class="text-gray-600">Authorized access only</p>
                </div>
                
                <div id="alert" class="hidden mb-4"></div>
                
                <div class="bg-white rounded-lg shadow-lg p-8">
                    <form id="loginForm" class="space-y-6">
                        <div>
                            <label class="block font-semibold mb-2">Admin Email</label>
                            <input type="email" id="email" required class="w-full border border-gray-300 rounded px-4 py-2">
                        </div>
                        <div>
                            <label class="block font-semibold mb-2">Password</label>
                            <div class="relative">
                                <input type="password" id="password" required class="w-full border border-gray-300 rounded px-4 py-2 pr-12">
                                <button type="button" onclick="togglePasswordVisibility('password', 'toggleIcon')" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                                    <i id="toggleIcon" class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <button type="submit" id="submitBtn" class="w-full brand-bg text-white py-3 rounded-lg hover:bg-blue-800 transition font-semibold">
                            <i class="fas fa-lock mr-2"></i>Sign In to Admin Panel
                        </button>
                    </form>
                </div>
                
                <div class="text-center mt-6">
                    <a href="/" class="text-gray-600 hover:text-gray-800"><i class="fas fa-arrow-left mr-2"></i>Back to Home</a>
                </div>
            </div>
        </div>
        <script>
            function togglePasswordVisibility(inputId, iconId) {
                const input = document.getElementById(inputId);
                const icon = document.getElementById(iconId);
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            }
        </script>
        <script src="/static/admin-login.js"></script>
    </body>
    </html>
  `)
})

// Admin Dashboard Page  
app.get('/admin-dashboard', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Dashboard - VonWillingh Online</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <style>
          .brand-bg { background-color: ${BRAND_COLORS.primary}; }
          .brand-text { color: ${BRAND_COLORS.primary}; }
        </style>
    </head>
    <body class="bg-gray-100">
        <nav class="brand-bg text-white shadow-lg">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center space-x-4">
                        <i class="fas fa-user-shield text-2xl"></i>
                        <h1 class="text-xl font-bold">Admin Dashboard</h1>
                    </div>
                    <div class="flex items-center space-x-4">
                        <a href="/admin-payments" class="hover:bg-white/10 px-3 py-2 rounded">
                            <i class="fas fa-money-check-alt mr-2"></i>Payments
                        </a>
                        <a href="/admin-courses" class="hover:bg-white/10 px-3 py-2 rounded">
                            <i class="fas fa-graduation-cap mr-2"></i>Courses
                        </a>
                        <a href="/admin/courses/import" class="hover:bg-white/10 px-3 py-2 rounded">
                            <i class="fas fa-file-import mr-2"></i>Import Course
                        </a>
                        <a href="/admin-sessions" class="hover:bg-white/10 px-3 py-2 rounded">
                            <i class="fas fa-user-clock mr-2"></i>Sessions
                        </a>
                        <button id="logoutBtn" class="bg-white/20 hover:bg-white/30 px-4 py-2 rounded transition">
                            <i class="fas fa-sign-out-alt mr-2"></i>Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">Total Applications</p>
                            <p id="totalApps" class="text-3xl font-bold brand-text">0</p>
                        </div>
                        <i class="fas fa-file-alt text-4xl text-gray-300"></i>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">Pending</p>
                            <p id="pendingApps" class="text-3xl font-bold text-yellow-600">0</p>
                        </div>
                        <i class="fas fa-clock text-4xl text-yellow-200"></i>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">Approved</p>
                            <p id="approvedApps" class="text-3xl font-bold text-yellow-700">0</p>
                        </div>
                        <i class="fas fa-check-circle text-4xl text-green-200"></i>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">Rejected</p>
                            <p id="rejectedApps" class="text-3xl font-bold text-red-600">0</p>
                        </div>
                        <i class="fas fa-times-circle text-4xl text-red-200"></i>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm font-semibold mb-2">Filter by Status</label>
                        <select id="statusFilter" class="w-full border border-gray-300 rounded px-4 py-2">
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold mb-2">Search by Email</label>
                        <input type="text" id="emailSearch" placeholder="student@example.com" class="w-full border border-gray-300 rounded px-4 py-2">
                    </div>
                    <div class="flex items-end">
                        <button id="refreshBtn" class="w-full brand-bg text-white px-4 py-2 rounded hover:bg-blue-800 transition">
                            <i class="fas fa-sync-alt mr-2"></i>Refresh
                        </button>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="p-6 border-b">
                    <h2 class="text-xl font-bold brand-text">
                        <i class="fas fa-list mr-2"></i>Applications
                    </h2>
                </div>
                <div id="loadingDiv" class="p-8 text-center">
                    <i class="fas fa-spinner fa-spin text-4xl text-gray-400"></i>
                    <p class="text-gray-500 mt-4">Loading applications...</p>
                </div>
                <div id="applicationsContainer" class="hidden">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="applicationsTableBody" class="bg-white divide-y divide-gray-200">
                            </tbody>
                        </table>
                    </div>
                </div>
                <div id="emptyDiv" class="hidden p-8 text-center text-gray-500">
                    <i class="fas fa-inbox text-4xl mb-4"></i>
                    <p>No applications found</p>
                </div>
            </div>
        </div>
        <script src="/static/admin-dashboard.js"></script>
    </body>
    </html>
  `)
})

// Admin Session Monitoring Page
app.get('/admin-sessions', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Student Session Monitoring - VonWillingh Online</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <style>
          .brand-bg { background-color: ${BRAND_COLORS.primary}; }
          .brand-text { color: ${BRAND_COLORS.primary}; }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Navigation Bar -->
        <nav class="brand-bg text-white shadow-lg">
            <div class="max-w-7xl mx-auto px-4">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center space-x-4">
                        <i class="fas fa-user-shield text-2xl"></i>
                        <span class="text-xl font-semibold">Student Session Monitoring</span>
                    </div>
                    <div class="flex items-center space-x-4">
                        <a href="/admin-dashboard" class="px-4 py-2 hover:bg-white hover:bg-opacity-10 rounded transition">
                            <i class="fas fa-th-large mr-2"></i>Dashboard
                        </a>
                        <button onclick="window.location.href='/admin-login'" class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition">
                            <i class="fas fa-sign-out-alt mr-2"></i>Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <div class="max-w-7xl mx-auto px-4 py-8">
            <!-- Alert -->
            <div id="alert" class="hidden mb-4"></div>

            <!-- Header -->
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-bold text-gray-900">Student Login Activity</h1>
                <button id="refreshBtn" onclick="refreshSessions()" class="px-4 py-2 brand-bg text-white rounded-lg hover:opacity-90 transition flex items-center">
                    <i class="fas fa-sync-alt mr-2"></i>Refresh
                </button>
            </div>

            <!-- Statistics Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="text-gray-600 mb-2">Total Sessions</div>
                    <div id="totalSessions" class="text-4xl font-bold text-gray-900">0</div>
                </div>
                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="text-gray-600 mb-2">Active Now</div>
                    <div id="activeSessions" class="text-4xl font-bold text-green-600">0</div>
                </div>
                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="text-gray-600 mb-2">Ended</div>
                    <div id="endedSessions" class="text-4xl font-bold text-blue-600">0</div>
                </div>
                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="text-gray-600 mb-2">Expired</div>
                    <div id="expiredSessions" class="text-4xl font-bold text-gray-600">0</div>
                </div>
            </div>

            <!-- Filters -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select id="statusFilter" class="w-full border border-gray-300 rounded-lg px-4 py-2">
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="ended">Ended</option>
                            <option value="expired">Expired</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
                        <input type="text" id="searchInput" placeholder="Search by name or email..." 
                               class="w-full border border-gray-300 rounded-lg px-4 py-2">
                    </div>
                </div>
            </div>

            <!-- Sessions Table -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Login Time</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logout Time</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody id="sessionsTable" class="bg-white divide-y divide-gray-200">
                            <!-- Sessions will be loaded here -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <script src="/static/session-monitoring.js"></script>
    </body>
    </html>
  `)
})

// Admin Course Import Page
app.get('/admin/courses/import', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Import Course - VonWillingh Online</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <style>
          .brand-bg { background-color: ${BRAND_COLORS.primary}; }
          .brand-text { color: ${BRAND_COLORS.primary}; }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Navigation Bar -->
        <nav class="brand-bg text-white shadow-lg">
            <div class="max-w-7xl mx-auto px-4">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center space-x-4">
                        <i class="fas fa-file-import text-2xl"></i>
                        <span class="text-xl font-semibold">Import Course</span>
                    </div>
                    <div class="flex items-center space-x-4">
                        <a href="/admin-dashboard" class="px-4 py-2 hover:bg-white hover:bg-opacity-10 rounded transition">
                            <i class="fas fa-th-large mr-2"></i>Dashboard
                        </a>
                        <a href="/admin-courses" class="px-4 py-2 hover:bg-white hover:bg-opacity-10 rounded transition">
                            <i class="fas fa-graduation-cap mr-2"></i>Courses
                        </a>
                        <button onclick="window.location.href='/admin-login'" class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition">
                            <i class="fas fa-sign-out-alt mr-2"></i>Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <div class="max-w-5xl mx-auto px-4 py-8">
            <!-- Alert -->
            <div id="alert" class="hidden"></div>

            <!-- Header -->
            <div class="mb-6">
                <h1 class="text-3xl font-bold text-gray-900">Import Course from JSON</h1>
                <p class="text-gray-600 mt-2">Upload a JSON file to import a complete course with modules and quizzes</p>
            </div>

            <!-- Instructions -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 class="font-semibold text-blue-900 mb-2">
                    <i class="fas fa-info-circle mr-2"></i>JSON File Format
                </h3>
                <div class="text-sm text-blue-800 space-y-1">
                    <p>• File must contain <code class="bg-blue-100 px-1 rounded">course</code> and <code class="bg-blue-100 px-1 rounded">modules</code> properties</p>
                    <p>• <strong>Course fields:</strong> name, code, level, description, duration, price, category (optional)</p>
                    <p>• <strong>Module fields:</strong> title, description, order_number, content, quiz (optional)</p>
                    <p>• <strong>Quiz format:</strong> { questions: [{ question, options, correct_answer }] }</p>
                </div>
            </div>

            <!-- File Upload Section -->
            <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Upload JSON File</h3>
                
                <!-- Drop Zone -->
                <div id="dropZone" class="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition cursor-pointer">
                    <i class="fas fa-cloud-upload-alt text-6xl text-gray-400 mb-4"></i>
                    <p class="text-lg font-medium text-gray-700 mb-2">Drag and drop your JSON file here</p>
                    <p class="text-sm text-gray-500 mb-4">or</p>
                    <button id="browseBtn" class="px-6 py-3 brand-bg text-white rounded-lg hover:opacity-90 transition">
                        <i class="fas fa-folder-open mr-2"></i>Browse Files
                    </button>
                    <input type="file" id="fileInput" accept=".json" class="hidden">
                    <p class="text-xs text-gray-400 mt-4">Supported: JSON files up to 5MB</p>
                </div>

                <!-- File Info -->
                <div id="fileInfo" class="hidden mt-4 p-4 bg-gray-50 rounded-lg">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <i class="fas fa-file-code text-2xl text-blue-500"></i>
                            <div>
                                <p id="fileName" class="font-medium text-gray-900"></p>
                                <p id="fileSize" class="text-sm text-gray-500"></p>
                            </div>
                        </div>
                        <button onclick="resetForm()" class="text-red-600 hover:text-red-700">
                            <i class="fas fa-times-circle text-xl"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Preview Section -->
            <div id="previewSection" class="hidden bg-white rounded-lg shadow-lg p-6 mb-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                    <i class="fas fa-eye mr-2"></i>Course Preview
                </h3>
                <div id="previewContent"></div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end space-x-4">
                <button id="cancelBtn" class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                    <i class="fas fa-times mr-2"></i>Cancel
                </button>
                <button id="importBtn" disabled class="px-6 py-3 brand-bg text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed">
                    <i class="fas fa-download mr-2"></i>Import Course
                </button>
            </div>
        </div>

        <script src="/static/course-import.js"></script>
    </body>
    </html>
  `)
})

// API endpoint - Import Course
app.post('/api/admin/courses/import', async (c) => {
  try {
    const body = await c.req.json()
    const { course, modules, importMode = 'create' } = body
    
    console.log('📥 Course import request:', course.name, 'Mode:', importMode)
    
    const supabase = getSupabaseAdminClient(c.env)
    
    // Validate required fields
    if (!course || !modules || !Array.isArray(modules) || modules.length === 0) {
      return c.json({ success: false, message: 'Invalid course data structure' }, 400)
    }
    
    // Validate import mode
    if (!['create', 'update', 'append'].includes(importMode)) {
      return c.json({ success: false, message: 'Invalid import mode. Use: create, update, or append' }, 400)
    }
    
    // Check for existing course
    const { data: existingCourse } = await supabase
      .from('courses')
      .select('id, name, modules_count')
      .eq('name', course.name)
      .single()
    
    // Handle different import modes
    if (existingCourse && importMode === 'create') {
      return c.json({ 
        success: false, 
        message: `Course "${course.name}" already exists (ID: ${existingCourse.id}). Choose 'Update' to replace modules or 'Append' to add new modules.` 
      }, 409)
    }
    
    if (!existingCourse && (importMode === 'update' || importMode === 'append')) {
      return c.json({ 
        success: false, 
        message: `Course "${course.name}" does not exist. Choose 'Create New' mode to create it.` 
      }, 404)
    }
    
    let targetCourse
    let actionMessage = ''
    
    // MODE 1: CREATE NEW COURSE
    if (importMode === 'create') {
      const { data: maxIdResult } = await supabase
        .from('courses')
        .select('id')
        .order('id', { ascending: false })
        .limit(1)
      
      const nextId = maxIdResult && maxIdResult.length > 0 ? maxIdResult[0].id + 1 : 1
      console.log(`📝 Next course ID will be: ${nextId}`)
      
      const { data: insertedCourse, error: courseError } = await supabase
        .from('courses')
        .insert({
          id: nextId,
          name: course.name,
          code: course.code || `COURSE${nextId}`,
          category: course.category || 'General',
          level: course.level,
          modules_count: modules.length,
          price: parseFloat(course.price),
          description: course.description
        })
        .select()
        .single()
      
      if (courseError) {
        console.error('❌ Course insert error:', courseError)
        return c.json({ 
          success: false, 
          message: 'Failed to create course: ' + courseError.message 
        }, 500)
      }
      
      targetCourse = insertedCourse
      actionMessage = 'created'
      console.log('✅ Course created:', insertedCourse.id)
    }
    
    // MODE 2: UPDATE EXISTING COURSE (REPLACE MODULES)
    else if (importMode === 'update') {
      const { data: updatedCourse, error: updateError } = await supabase
        .from('courses')
        .update({
          category: course.category || 'General',
          level: course.level,
          modules_count: modules.length,
          price: parseFloat(course.price),
          description: course.description
        })
        .eq('id', existingCourse.id)
        .select()
        .single()
      
      if (updateError) {
        console.error('❌ Course update error:', updateError)
        return c.json({ 
          success: false, 
          message: 'Failed to update course: ' + updateError.message 
        }, 500)
      }
      
      // Delete existing modules
      const { error: deleteError } = await supabase
        .from('modules')
        .delete()
        .eq('course_id', existingCourse.id)
      
      if (deleteError) {
        console.error('❌ Module delete error:', deleteError)
      }
      
      targetCourse = updatedCourse
      actionMessage = 'updated (all modules replaced)'
      console.log('✅ Course updated, old modules deleted:', updatedCourse.id)
    }
    
    // MODE 3: APPEND MODULES TO EXISTING COURSE
    else if (importMode === 'append') {
      // Get current max module order
      const { data: existingModules } = await supabase
        .from('modules')
        .select('order_number')
        .eq('course_id', existingCourse.id)
        .order('order_number', { ascending: false })
        .limit(1)
      
      const maxOrderIndex = existingModules && existingModules.length > 0 ? existingModules[0].order_number : 0
      const startOrderIndex = maxOrderIndex + 1
      
      // Update module order numbers to continue from last module
      modules.forEach((module, index) => {
        module.order_number = startOrderIndex + index
      })
      
      // Update course modules_count
      const newModulesCount = (existingCourse.modules_count || 0) + modules.length
      const { data: updatedCourse, error: updateError } = await supabase
        .from('courses')
        .update({
          modules_count: newModulesCount
        })
        .eq('id', existingCourse.id)
        .select()
        .single()
      
      if (updateError) {
        console.error('❌ Course update error:', updateError)
        return c.json({ 
          success: false, 
          message: 'Failed to update course: ' + updateError.message 
        }, 500)
      }
      
      targetCourse = updatedCourse
      actionMessage = `updated (${modules.length} new modules added, starting from #${startOrderIndex})`
      console.log(`✅ Appending ${modules.length} modules to course:`, updatedCourse.id)
    }
    
    // Insert modules
    const moduleInserts = modules.map((module, index) => ({
      course_id: targetCourse.id,
      title: module.title,
      description: module.description,
      order_number: module.order_number || (index + 1),
      content: module.content,
      content_type: module.content_type || 'lesson',
      duration_minutes: module.duration_minutes || null,
      video_url: module.video_url || null
    }))
    
    const { data: insertedModules, error: modulesError } = await supabase
      .from('modules')
      .insert(moduleInserts)
      .select()
    
    if (modulesError) {
      console.error('❌ Modules insert error:', modulesError)
      
      // Check if it's a schema/table error
      if (modulesError.message.includes('content') || modulesError.message.includes('schema cache')) {
        if (importMode === 'create') {
          await supabase.from('courses').delete().eq('id', targetCourse.id)
        }
        
        return c.json({ 
          success: false, 
          message: 'Modules table is not properly set up. Please run PHASE5_DATABASE_SCHEMA.sql in Supabase. (Changes rolled back)' 
        }, 500)
      }
      
      // Rollback only if we created a new course
      if (importMode === 'create') {
        await supabase.from('courses').delete().eq('id', targetCourse.id)
      }
      
      return c.json({ 
        success: false, 
        message: 'Failed to insert modules: ' + modulesError.message 
      }, 500)
    }
    
    console.log(`✅ Inserted ${insertedModules.length} modules`)
    
    // Add quiz content to modules
    for (let i = 0; i < modules.length; i++) {
      const module = modules[i]
      if (module.quiz && module.quiz.questions) {
        const moduleId = insertedModules[i].id
        
        const quizSection = `

---
## Quiz

${module.quiz.questions.map((q, idx) => `
### Question ${idx + 1}
${q.question}

**Options:**
${q.options.map((opt, optIdx) => `${String.fromCharCode(65 + optIdx)}) ${opt}`).join('\n')}

**Correct Answer:** ${q.correct_answer}
`).join('\n')}
`
        
        await supabase
          .from('modules')
          .update({
            content: insertedModules[i].content + quizSection
          })
          .eq('id', moduleId)
      }
    }
    
    return c.json({
      success: true,
      message: `Course "${course.name}" ${actionMessage}! Added ${insertedModules.length} modules. Total: ${targetCourse.modules_count} modules.`,
      courseId: targetCourse.id,
      courseName: targetCourse.name,
      modulesAdded: insertedModules.length,
      totalModules: targetCourse.modules_count,
      mode: importMode
    })
    
  } catch (error: any) {
    console.error('❌ Import error:', error)
    return c.json({ 
      success: false, 
      message: 'Import failed: ' + error.message 
    }, 500)
  }
})

// ============================================
// EXTERNAL API ENDPOINT FOR COURSE IMPORT
// ============================================
// This endpoint allows external apps to push courses directly to the LMS
// Usage: POST https://vonwillingh-online-lms.pages.dev/api/courses/external-import
// Headers: { "X-API-Key": "YOUR_API_KEY", "Content-Type": "application/json" }
// Body: { course: {...}, modules: [...] }

app.post('/api/courses/external-import', async (c) => {
  try {
    // 1. AUTHENTICATE - Check API Key
    const apiKey = c.req.header('X-API-Key')
    const validApiKey = c.env.COURSE_IMPORT_API_KEY || 'vonwillingh-lms-import-key-2026'
    
    if (!apiKey || apiKey !== validApiKey) {
      console.warn('⚠️ Unauthorized import attempt from:', c.req.header('CF-Connecting-IP'))
      return c.json({ 
        success: false, 
        message: 'Unauthorized: Invalid or missing API key',
        error: 'INVALID_API_KEY'
      }, 401)
    }
    
    console.log('✅ External import authenticated')
    
    // 2. PARSE REQUEST BODY
    const body = await c.req.json()
    const { course, modules } = body
    
    // 3. VALIDATE DATA STRUCTURE
    if (!course || !modules || !Array.isArray(modules) || modules.length === 0) {
      return c.json({ 
        success: false, 
        message: 'Invalid data structure. Required: { course: {...}, modules: [...] }',
        error: 'INVALID_DATA_STRUCTURE'
      }, 400)
    }
    
    // 4. VALIDATE REQUIRED COURSE FIELDS
    const requiredCourseFields = ['name', 'code', 'level', 'description', 'duration', 'price']
    const missingFields = requiredCourseFields.filter(field => {
      if (field === 'price') {
        return course.price === undefined || course.price === null
      }
      return !course[field]
    })
    
    if (missingFields.length > 0) {
      return c.json({ 
        success: false, 
        message: `Missing required course fields: ${missingFields.join(', ')}`,
        error: 'MISSING_COURSE_FIELDS',
        missing_fields: missingFields
      }, 400)
    }
    
    // 5. VALIDATE COURSE CODE FORMAT
    if (!/^[A-Za-z0-9_-]+$/.test(course.code)) {
      return c.json({ 
        success: false, 
        message: 'Course code must contain only letters, numbers, dashes, and underscores',
        error: 'INVALID_COURSE_CODE'
      }, 400)
    }
    
    // 6. VALIDATE COURSE LEVEL
    const validLevels = ['Certificate', 'Diploma', 'Advanced Diploma', 'Bachelor']
    if (!validLevels.includes(course.level)) {
      return c.json({ 
        success: false, 
        message: `Course level must be one of: ${validLevels.join(', ')}`,
        error: 'INVALID_COURSE_LEVEL',
        valid_levels: validLevels
      }, 400)
    }
    
    // 7. VALIDATE PRICE
    const price = parseFloat(course.price)
    if (isNaN(price) || price < 0) {
      return c.json({ 
        success: false, 
        message: 'Course price must be a positive number',
        error: 'INVALID_PRICE'
      }, 400)
    }
    
    // 8. VALIDATE MODULES
    const requiredModuleFields = ['title', 'description', 'order_number', 'content']
    for (let i = 0; i < modules.length; i++) {
      const module = modules[i]
      const missingModuleFields = requiredModuleFields.filter(field => !module[field])
      
      if (missingModuleFields.length > 0) {
        return c.json({ 
          success: false, 
          message: `Module ${i + 1} is missing required fields: ${missingModuleFields.join(', ')}`,
          error: 'MISSING_MODULE_FIELDS',
          module_index: i,
          missing_fields: missingModuleFields
        }, 400)
      }
      
      if (typeof module.order_number !== 'number' || module.order_number < 1) {
        return c.json({ 
          success: false, 
          message: `Module ${i + 1}: order_number must be a positive integer`,
          error: 'INVALID_MODULE_ORDER',
          module_index: i
        }, 400)
      }
    }
    
    console.log('📥 External course import request:', course.name, `(${modules.length} modules)`)
    
    // 9. GET SUPABASE CLIENT
    const supabase = getSupabaseAdminClient(c.env)
    
    // 10. CHECK FOR EXISTING COURSE BY CODE
    const { data: existingCourse } = await supabase
      .from('courses')
      .select('id, name, code')
      .eq('code', course.code)
      .single()
    
    if (existingCourse) {
      return c.json({ 
        success: false, 
        message: `Course with code "${course.code}" already exists (Name: "${existingCourse.name}", ID: ${existingCourse.id})`,
        error: 'COURSE_EXISTS',
        existing_course: {
          id: existingCourse.id,
          name: existingCourse.name,
          code: existingCourse.code
        }
      }, 409)
    }
    
    // 11. GET NEXT COURSE ID
    const { data: maxIdResult } = await supabase
      .from('courses')
      .select('id')
      .order('id', { ascending: false })
      .limit(1)
    
    const nextId = maxIdResult && maxIdResult.length > 0 ? maxIdResult[0].id + 1 : 1
    console.log('📝 Next course ID will be:', nextId)
    
    // 12. CREATE COURSE
    const { data: insertedCourse, error: courseError } = await supabase
      .from('courses')
      .insert({
        id: nextId,
        name: course.name,
        code: course.code,
        category: course.category || 'General',
        level: course.level,
        modules_count: modules.length,
        price: price,
        description: course.description
      })
      .select()
      .single()
    
    if (courseError) {
      console.error('❌ Course insert error:', courseError)
      return c.json({ 
        success: false, 
        message: 'Failed to create course: ' + courseError.message,
        error: 'DATABASE_ERROR'
      }, 500)
    }
    
    console.log('✅ Course created:', insertedCourse.id, '-', insertedCourse.name)
    
    // 13. INSERT MODULES
    const moduleInserts = modules.map((module, index) => ({
      course_id: insertedCourse.id,
      title: module.title,
      description: module.description,
      order_number: module.order_number || (index + 1),
      content: module.content,
      content_type: module.content_type || 'lesson',
      duration_minutes: module.duration_minutes || null,
      video_url: module.video_url || null
    }))
    
    const { data: insertedModules, error: modulesError } = await supabase
      .from('modules')
      .insert(moduleInserts)
      .select()
    
    if (modulesError) {
      console.error('❌ Modules insert error:', modulesError)
      
      // Rollback: Delete the course
      await supabase.from('courses').delete().eq('id', insertedCourse.id)
      
      return c.json({ 
        success: false, 
        message: 'Failed to insert modules: ' + modulesError.message,
        error: 'DATABASE_ERROR'
      }, 500)
    }
    
    console.log(`✅ ${insertedModules.length} modules inserted`)
    
    // 14. APPEND QUIZZES TO MODULE CONTENT (if any)
    for (let i = 0; i < modules.length; i++) {
      const module = modules[i]
      if (module.quiz && module.quiz.questions && module.quiz.questions.length > 0) {
        const moduleId = insertedModules[i].id
        const quiz = module.quiz
        
        // Build quiz Markdown section
        let quizSection = `\n\n---\n\n## 📝 Module Quiz\n\n`
        quizSection += `**Passing Score:** ${quiz.passing_score || 70}%\n\n`
        quizSection += `**Maximum Attempts:** ${quiz.max_attempts || 3}\n\n`
        quizSection += `### Questions:\n\n`
        
        quiz.questions.forEach((q: any, qIndex: number) => {
          quizSection += `**${qIndex + 1}. ${q.question}**\n\n`
          q.options.forEach((opt: string, optIndex: number) => {
            const letter = String.fromCharCode(65 + optIndex)
            const isCorrect = opt === q.correct_answer ? ' ✅' : ''
            quizSection += `${letter}) ${opt}${isCorrect}\n\n`
          })
        })
        
        // Update module content with quiz
        await supabase
          .from('modules')
          .update({
            content: insertedModules[i].content + quizSection
          })
          .eq('id', moduleId)
      }
    }
    
    // 15. SUCCESS RESPONSE
    return c.json({
      success: true,
      message: `Course "${course.name}" created successfully with ${insertedModules.length} modules`,
      data: {
        course_id: insertedCourse.id,
        course_name: insertedCourse.name,
        course_code: insertedCourse.code,
        modules_count: insertedModules.length,
        price: price,
        level: course.level,
        duration: course.duration,
        course_url: `https://vonwillingh-online-lms.pages.dev/courses`
      }
    })
    
  } catch (error: any) {
    console.error('❌ External import error:', error)
    return c.json({ 
      success: false, 
      message: 'Import failed: ' + error.message,
      error: 'INTERNAL_ERROR'
    }, 500)
  }
})

// API endpoint - Admin Login
app.post('/api/admin/login', async (c) => {
  try {
    const { email, password } = await c.req.json()
    console.log('🔐 Admin login attempt:', email)
    const supabase = getSupabaseClient(c.env)
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      console.error('❌ Supabase auth error:', error.message, error.status)
      return c.json({ success: false, message: 'Invalid email or password' }, 401)
    }
    
    console.log('✅ Supabase auth successful for:', email)
    
    const adminClient = getSupabaseAdminClient(c.env)
    const { data: adminUser, error: adminError } = await adminClient
      .from('admin_users')
      .select('*')
      .eq('id', data.user.id)
      .single()
    
    if (adminError || !adminUser) {
      return c.json({ success: false, message: 'Access denied' }, 403)
    }
    
    return c.json({ success: true, message: 'Login successful', session: data.session })
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})

// API endpoint - Get Student Sessions (Session Monitoring)
app.get('/api/admin/sessions', async (c) => {
  try {
    const supabase = getSupabaseAdminClient(c.env)
    
    // Get all sessions with student details
    const { data: sessions, error } = await supabase
      .from('student_sessions')
      .select(`
        *,
        students:student_id (
          full_name,
          email
        )
      `)
      .order('login_time', { ascending: false })
    
    if (error) {
      console.error('❌ Error fetching sessions:', error)
      return c.json({ success: false, message: 'Failed to load sessions' }, 500)
    }
    
    // Format the response
    const formattedSessions = (sessions || []).map(session => ({
      id: session.id,
      student_name: session.students?.full_name || 'Unknown',
      student_email: session.students?.email || '',
      login_time: session.login_time,
      logout_time: session.logout_time,
      duration: session.duration,
      device_info: session.device_info,
      browser: session.browser,
      os: session.os,
      ip_address: session.ip_address,
      status: session.status,
      last_activity: session.last_activity
    }))
    
    return c.json({ success: true, sessions: formattedSessions })
  } catch (error: any) {
    console.error('❌ Session monitoring error:', error)
    return c.json({ success: false, message: error.message }, 500)
  }
})

// API endpoint - Approve Application
app.post('/api/admin/applications/:id/approve', async (c) => {
  try {
    const id = c.req.param('id')
    const supabase = getSupabaseAdminClient(c.env)
    
    // Get application details with student and course info
    const { data: application, error: fetchError } = await supabase
      .from('applications')
      .select(`
        *,
        students:student_id (full_name, email),
        courses:course_id (name, price)
      `)
      .eq('id', id)
      .single()
    
    if (fetchError || !application) {
      throw new Error('Application not found')
    }
    
    // Update application status
    const { error } = await supabase
      .from('applications')
      .update({ status: 'approved' })
      .eq('id', id)
    
    if (error) throw new Error(error.message)
    
    // Send approval email with payment instructions
    try {
      // Use the request URL to build the payment instructions URL dynamically
      const baseUrl = new URL(c.req.url).origin
      const paymentInstructionsUrl = `${baseUrl}/payment-instructions/${id}`
      
      await sendEmail(c.env, {
        to: application.students.email,
        subject: '🎉 Application Approved - Payment Instructions',
        html: getApplicationApprovedEmail(
          application.students.full_name,
          application.courses.name,
          application.courses.price,
          {
            bankName: c.env.BANK_NAME,
            accountName: c.env.BANK_ACCOUNT_NAME,
            accountNumber: c.env.BANK_ACCOUNT_NUMBER,
            branchCode: c.env.BANK_BRANCH_CODE,
            accountType: c.env.BANK_ACCOUNT_TYPE
          },
          paymentInstructionsUrl
        )
      })
      console.log('✅ Approval email sent to:', application.students.email)
    } catch (emailError) {
      console.error('❌ Failed to send approval email:', emailError)
      // Continue anyway - email failure shouldn't block approval
    }
    
    return c.json({ success: true, message: 'Application approved successfully' })
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})

// API endpoint - Reject Application
app.post('/api/admin/applications/:id/reject', async (c) => {
  try {
    const id = c.req.param('id')
    const { reason } = await c.req.json()
    const supabase = getSupabaseAdminClient(c.env)
    
    // Get application details with student and course info
    const { data: application, error: fetchError } = await supabase
      .from('applications')
      .select(`
        *,
        students:student_id (full_name, email),
        courses:course_id (name)
      `)
      .eq('id', id)
      .single()
    
    if (fetchError || !application) {
      throw new Error('Application not found')
    }
    
    // Update application status
    const { error } = await supabase
      .from('applications')
      .update({ status: 'rejected', rejection_reason: reason })
      .eq('id', id)
    
    if (error) throw new Error(error.message)
    
    // Send rejection email
    try {
      await sendEmail(c.env, {
        to: application.students.email,
        subject: 'Application Decision - VonWillingh Online',
        html: getApplicationRejectedEmail(
          application.students.full_name,
          application.courses.name,
          reason
        )
      })
      console.log('✅ Rejection email sent to:', application.students.email)
    } catch (emailError) {
      console.error('❌ Failed to send rejection email:', emailError)
      // Continue anyway - email failure shouldn't block rejection
    }
    
    return c.json({ success: true, message: 'Application rejected successfully' })
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})

// ==================== STUDENT API ENDPOINTS ====================

// API endpoint - student login
app.post('/api/student/login', async (c) => {
  try {
    const { email, password } = await c.req.json()
    console.log('Login attempt for:', email)
    
    const supabase = getSupabaseAdminClient(c.env)
    
    // Find student by email
    const { data: student, error } = await supabase
      .from('students')
      .select('id, full_name, email, password, temporary_password, account_status, last_login')
      .eq('email', email)
      .single()
    
    console.log('Student lookup result:', { found: !!student, error: error?.message })
    
    if (error || !student) {
      return c.json({ success: false, message: 'Invalid email or password' }, 401)
    }
    
    // Check account status
    if (student.account_status !== 'active') {
      return c.json({ 
        success: false, 
        message: 'Your account is not active. Please contact support.' 
      }, 403)
    }
    
    // Check if password matches (check both permanent and temporary)
    const passwordMatches = student.password === password || student.temporary_password === password
    console.log('Password match:', passwordMatches)
    
    if (!passwordMatches) {
      return c.json({ success: false, message: 'Invalid email or password' }, 401)
    }
    
    // Update last_login
    await supabase
      .from('students')
      .update({ last_login: new Date().toISOString() })
      .eq('id', student.id)
    
    // Track session with device info from headers
    const userAgent = c.req.header('user-agent') || 'Unknown'
    const ipAddress = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'Unknown'
    
    // Parse device info
    let deviceInfo = 'Desktop'
    let browser = 'Unknown'
    let os = 'Unknown'
    
    if (userAgent.includes('Mobile')) deviceInfo = 'Mobile'
    else if (userAgent.includes('Tablet')) deviceInfo = 'Tablet'
    
    if (userAgent.includes('Chrome')) browser = 'Chrome'
    else if (userAgent.includes('Firefox')) browser = 'Firefox'
    else if (userAgent.includes('Safari')) browser = 'Safari'
    else if (userAgent.includes('Edge')) browser = 'Edge'
    
    if (userAgent.includes('Windows')) os = 'Windows'
    else if (userAgent.includes('Mac')) os = 'macOS'
    else if (userAgent.includes('Linux')) os = 'Linux'
    else if (userAgent.includes('Android')) os = 'Android'
    else if (userAgent.includes('iOS')) os = 'iOS'
    
    // Generate unique session token
    const sessionToken = `session_${student.id}_${Date.now()}_${Math.random().toString(36).substring(7)}`
    
    // Try to create session record (but don't fail if table doesn't exist)
    try {
      await supabase
        .from('student_sessions')
        .insert({
          student_id: student.id,
          session_token: sessionToken,
          login_time: new Date().toISOString(),
          device_info: deviceInfo,
          browser: browser,
          os: os,
          ip_address: ipAddress,
          status: 'active'
        })
    } catch (sessionError) {
      // Log but don't fail login if sessions table doesn't exist
      console.log('Session tracking skipped:', sessionError)
    }
    
    // Check if using temporary password
    const isTemporaryPassword = student.temporary_password !== null
    
    // Return session data
    return c.json({
      success: true,
      message: 'Login successful',
      student: {
        id: student.id,
        full_name: student.full_name,
        email: student.email,
        isTemporaryPassword
      }
    })
    
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})

// API endpoint - get student dashboard data
app.get('/api/student/dashboard', async (c) => {
  try {
    const studentId = c.req.query('studentId')
    if (!studentId) {
      return c.json({ success: false, message: 'Student ID required' }, 400)
    }
    
    console.log('Dashboard request for studentId:', studentId)
    
    const supabase = getSupabaseAdminClient(c.env)
    
    // Get student info
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('id', studentId)
      .single()
    
    console.log('Student data:', student)
    console.log('Student error:', studentError)
    
    // Get enrollments
    const { data: rawEnrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select('*')
      .eq('student_id', studentId)
    
    console.log('Raw enrollments:', rawEnrollments)
    console.log('Enrollments error:', enrollmentsError)
    
    // Get course details for each enrollment
    const enrollments = []
    if (rawEnrollments && rawEnrollments.length > 0) {
      for (const enrollment of rawEnrollments) {
        const { data: course } = await supabase
          .from('courses')
          .select('id, name, code, level, description, price, duration')
          .eq('id', enrollment.course_id)
          .single()
        
        enrollments.push({
          ...enrollment,
          courses: course
        })
      }
    }
    
    console.log('Enrollments with courses:', enrollments)
    console.log('Enrollments count:', enrollments?.length || 0)
    
    return c.json({
      success: true,
      student,
      enrollments: enrollments || []
    })
    
  } catch (error: any) {
    console.error('Dashboard API error:', error)
    return c.json({ success: false, message: error.message }, 500)
  }
})

// API endpoint - change password
app.post('/api/student/change-password', async (c) => {
  try {
    const { studentId, currentPassword, newPassword } = await c.req.json()
    const supabase = getSupabaseAdminClient(c.env)
    
    // Verify current password
    const { data: student } = await supabase
      .from('students')
      .select('temporary_password')
      .eq('id', studentId)
      .single()
    
    if (!student || student.temporary_password !== currentPassword) {
      return c.json({ success: false, message: 'Current password is incorrect' }, 401)
    }
    
    // Update to new password and clear temporary flag
    await supabase
      .from('students')
      .update({
        password: newPassword,  // Store as permanent password
        temporary_password: null,  // Clear temporary flag
        account_status: 'active'
      })
      .eq('id', studentId)
    
    return c.json({
      success: true,
      message: 'Password changed successfully'
    })
    
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})

// ==================== PHASE 5: MODULE & PROGRESS API ENDPOINTS ====================

// API endpoint - get course details with modules
app.get('/api/student/course/:courseId', async (c) => {
  try {
    const courseId = c.req.param('courseId')
    const studentId = c.req.query('studentId')
    
    if (!studentId) {
      return c.json({ success: false, message: 'Student ID required' }, 400)
    }
    
    const supabase = getSupabaseAdminClient(c.env)
    
    // Get course details
    const { data: course } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single()
    
    // Get enrollment for this student
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('*')
      .eq('student_id', studentId)
      .eq('course_id', courseId)
      .single()
    
    if (!enrollment) {
      return c.json({ success: false, message: 'Not enrolled in this course' }, 403)
    }
    
    // Get all modules for this course
    const { data: modules } = await supabase
      .from('modules')
      .select('*')
      .eq('course_id', courseId)
      .eq('is_published', true)
      .order('order_number', { ascending: true })
    
    // Get student's progress for each module
    const { data: progress } = await supabase
      .from('module_progress')
      .select('*')
      .eq('student_id', studentId)
      .eq('enrollment_id', enrollment.id)
    
    // Merge progress with modules
    const modulesWithProgress = (modules || []).map(module => {
      const moduleProgress = (progress || []).find(p => p.module_id === module.id)
      return {
        ...module,
        progress: moduleProgress || { status: 'not_started' }
      }
    })
    
    return c.json({
      success: true,
      course,
      enrollment,
      modules: modulesWithProgress,
      totalModules: modules?.length || 0,
      completedModules: progress?.filter(p => p.status === 'completed').length || 0
    })
    
  } catch (error: any) {
    console.error('Course detail error:', error)
    return c.json({ success: false, message: error.message }, 500)
  }
})

// API endpoint - get single module content
app.get('/api/student/module/:moduleId', async (c) => {
  try {
    const moduleId = c.req.param('moduleId')
    const studentId = c.req.query('studentId')
    
    if (!studentId) {
      return c.json({ success: false, message: 'Student ID required' }, 400)
    }
    
    const supabase = getSupabaseAdminClient(c.env)
    
    // Get module details
    const { data: module } = await supabase
      .from('modules')
      .select('*, courses:course_id(id, name)')
      .eq('id', moduleId)
      .single()
    
    if (!module) {
      return c.json({ success: false, message: 'Module not found' }, 404)
    }
    
    // Get enrollment
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('*')
      .eq('student_id', studentId)
      .eq('course_id', module.course_id)
      .single()
    
    if (!enrollment) {
      return c.json({ success: false, message: 'Not enrolled in this course' }, 403)
    }
    
    // Get or create progress record
    let { data: progress } = await supabase
      .from('module_progress')
      .select('*')
      .eq('student_id', studentId)
      .eq('module_id', moduleId)
      .single()
    
    // If no progress exists, create it
    if (!progress) {
      const { data: newProgress } = await supabase
        .from('module_progress')
        .insert({
          student_id: studentId,
          enrollment_id: enrollment.id,
          module_id: moduleId,
          status: 'in_progress',
          started_at: new Date().toISOString()
        })
        .select()
        .single()
      
      progress = newProgress
    } else if (progress.status === 'not_started') {
      // Update to in_progress
      await supabase
        .from('module_progress')
        .update({
          status: 'in_progress',
          started_at: new Date().toISOString()
        })
        .eq('id', progress.id)
    }
    
    // Get previous and next modules
    const { data: allModules } = await supabase
      .from('modules')
      .select('id, title, order_number')
      .eq('course_id', module.course_id)
      .order('order_number', { ascending: true })
    
    const currentIndex = allModules?.findIndex(m => m.id === moduleId) || 0
    const previousModule = currentIndex > 0 ? allModules?.[currentIndex - 1] : null
    const nextModule = currentIndex < (allModules?.length || 0) - 1 ? allModules?.[currentIndex + 1] : null
    
    return c.json({
      success: true,
      module,
      progress,
      navigation: {
        previous: previousModule,
        next: nextModule,
        current: currentIndex + 1,
        total: allModules?.length || 0
      }
    })
    
  } catch (error: any) {
    console.error('Module detail error:', error)
    return c.json({ success: false, message: error.message }, 500)
  }
})

// API endpoint - mark module as complete
app.post('/api/student/module/:moduleId/complete', async (c) => {
  try {
    const moduleId = c.req.param('moduleId')
    const { studentId, enrollmentId } = await c.req.json()
    
    const supabase = getSupabaseAdminClient(c.env)
    
    // Update module progress
    await supabase
      .from('module_progress')
      .upsert({
        student_id: studentId,
        enrollment_id: enrollmentId,
        module_id: moduleId,
        status: 'completed',
        completed_at: new Date().toISOString()
      }, {
        onConflict: 'student_id,module_id'
      })
    
    // Get total modules and completed count for this enrollment
    const { data: module } = await supabase
      .from('modules')
      .select('course_id')
      .eq('id', moduleId)
      .single()
    
    const { data: allModules } = await supabase
      .from('modules')
      .select('id')
      .eq('course_id', module?.course_id)
    
    const { data: completedProgress } = await supabase
      .from('module_progress')
      .select('id')
      .eq('enrollment_id', enrollmentId)
      .eq('status', 'completed')
    
    const totalModules = allModules?.length || 0
    const completedModules = completedProgress?.length || 0
    const progressPercentage = totalModules > 0 ? (completedModules / totalModules) * 100 : 0
    
    // Update enrollment progress
    const updateData: any = {
      modules_completed: completedModules,
      total_modules: totalModules,
      progress_percentage: progressPercentage.toFixed(2),
      last_accessed_at: new Date().toISOString()
    }
    
    // If all modules completed, mark course as complete
    if (completedModules === totalModules && totalModules > 0) {
      updateData.completion_date = new Date().toISOString()
    }
    
    await supabase
      .from('enrollments')
      .update(updateData)
      .eq('id', enrollmentId)
    
    return c.json({
      success: true,
      message: 'Module marked as complete',
      progress: {
        completedModules,
        totalModules,
        progressPercentage: parseFloat(progressPercentage.toFixed(2)),
        courseComplete: completedModules === totalModules
      }
    })
    
  } catch (error: any) {
    console.error('Mark complete error:', error)
    return c.json({ success: false, message: error.message }, 500)
  }
})

// API endpoint - submit application
app.post('/api/applications', async (c) => {
  try {
    const data = await c.req.json()
    console.log('📝 Application Data Received:', {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      courseId: data.courseId
    })
    // Use admin client to bypass RLS for student creation
    const supabase = getSupabaseAdminClient(c.env)
    
    // Step 1: Create or update student record
    const { data: existingStudent } = await supabase
      .from('students')
      .select('id')
      .eq('email', data.email)
      .single()
    
    let studentId = existingStudent?.id
    
    if (studentId) {
      // Update existing student with latest information
      console.log('🔄 Updating existing student:', studentId, 'with name:', data.fullName)
      const { error: updateError } = await supabase
        .from('students')
        .update({
          full_name: data.fullName,
          phone: data.phone,
          address: data.address,
          date_of_birth: data.dob
        })
        .eq('id', studentId)
      
      if (updateError) {
        console.error('❌ Failed to update student record:', updateError)
        // Continue anyway with existing data
      } else {
        console.log('✅ Student updated successfully')
      }
    } else {
      // Create new student
      console.log('➕ Creating new student with name:', data.fullName)
      const { data: newStudent, error: studentError } = await supabase
        .from('students')
        .insert({
          full_name: data.fullName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          date_of_birth: data.dob
        })
        .select('id')
        .single()
      
      if (studentError) {
        throw new Error('Failed to create student record: ' + studentError.message)
      }
      
      studentId = newStudent.id
      console.log('✅ New student created:', studentId)
    }
    
    // Step 2: Create application record
    const { data: application, error: applicationError } = await supabase
      .from('applications')
      .insert({
        student_id: studentId,
        course_id: parseInt(data.courseId),
        motivation: data.motivation || null,
        status: 'pending'
      })
      .select('id')
      .single()
    
    if (applicationError) {
      throw new Error('Failed to create application: ' + applicationError.message)
    }
    
    // Send application received confirmation email
    try {
      // Get course name from database
      const { data: courseData } = await supabase
        .from('courses')
        .select('name')
        .eq('id', parseInt(data.courseId))
        .single()
      
      const courseName = courseData?.name || COURSES.find(c => c.id === parseInt(data.courseId))?.name || 'Your selected course'
      
      await sendEmail(c.env, {
        to: data.email,
        subject: 'Application Received - VonWillingh Online',
        html: getApplicationReceivedEmail(data.fullName, courseName)
      })
      console.log('Application received email sent to:', data.email)
    } catch (emailError) {
      // Log error but don't fail the request
      console.error('Failed to send application received email:', emailError)
    }
    
    return c.json({ 
      success: true, 
      message: 'Application submitted successfully! Check your email for confirmation.',
      applicationId: application.id
    })
    
  } catch (error: any) {
    console.error('Application submission error:', error)
    return c.json({ 
      success: false, 
      message: error.message || 'Failed to submit application. Please try again.',
      error: error.message
    }, 500)
  }
})

// API endpoint - get courses
app.get('/api/courses', (c) => {
  return c.json({ courses: COURSES })
})

// API endpoint - test email configuration (Debug)
app.get('/api/test-email', async (c) => {
  try {
    const email = c.req.query('email') || 'sarrol@vonwillingh.co.za'
    
    console.log('🧪 Testing email configuration...')
    console.log('📧 Recipient:', email)
    console.log('🔑 BREVO_API_KEY exists:', !!c.env.BREVO_API_KEY)
    console.log('🔑 BREVO_API_KEY starts with xkeysib-:', c.env.BREVO_API_KEY?.startsWith('xkeysib-'))
    console.log('📨 FROM_EMAIL:', c.env.FROM_EMAIL)
    console.log('📨 CONTACT_EMAIL:', c.env.CONTACT_EMAIL)
    
    const result = await sendEmail(c.env, {
      to: email,
      subject: 'Test Email - VonWillingh Online LMS',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #8B7355;">🧪 Test Email</h1>
          <p>This is a test email from VonWillingh Online LMS.</p>
          <p><strong>Email Service:</strong> Brevo (formerly Sendinblue)</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <p>If you received this email, the email configuration is working correctly! ✅</p>
        </div>
      `
    })
    
    return c.json({ 
      success: result,
      message: result ? 'Test email sent successfully! Check your inbox.' : 'Failed to send test email. Check logs.',
      config: {
        brevoKeySet: !!c.env.BREVO_API_KEY,
        brevoKeyValid: c.env.BREVO_API_KEY?.startsWith('xkeysib-'),
        fromEmail: c.env.FROM_EMAIL,
        recipient: email
      }
    })
  } catch (error: any) {
    console.error('❌ Test email error:', error)
    return c.json({ 
      success: false, 
      message: error.message,
      error: error.toString()
    }, 500)
  }
})

// API endpoint - get all applications (Admin)
app.get('/api/admin/applications', async (c) => {
  try {
    const supabase = getSupabaseAdminClient(c.env)
    
    const { data: applications, error } = await supabase
      .from('applications')
      .select(`
        *,
        students:student_id (
          full_name,
          email,
          phone,
          address,
          highest_qualification
        ),
        courses:course_id (
          name,
          level,
          price
        )
      `)
      .order('submitted_at', { ascending: false })
    
    if (error) {
      throw new Error(error.message)
    }
    
    return c.json({ 
      success: true,
      applications: applications || []
    })
    
  } catch (error: any) {
    return c.json({ 
      success: false, 
      message: error.message 
    }, 500)
  }
})

// API endpoint - get courses from database
app.get('/api/courses/db', async (c) => {
  try {
    const supabase = getSupabaseClient(c.env)
    
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .order('id', { ascending: true })
    
    if (error) {
      throw new Error(error.message)
    }
    
    return c.json({ 
      success: true,
      courses: courses || []
    })
    
  } catch (error: any) {
    return c.json({ 
      success: false, 
      message: error.message 
    }, 500)
  }
})

// ==================== PAYMENT API ENDPOINTS ====================

// Upload proof of payment
app.post('/api/payments/upload-proof', async (c) => {
  try {
    const supabase = getSupabaseAdminClient(c.env)
    const body = await c.req.parseBody()
    
    // Debug logging
    console.log('Upload request body keys:', Object.keys(body))
    console.log('applicationId:', body.applicationId)
    console.log('proofFile type:', typeof body.proofFile)
    console.log('proofFile:', body.proofFile)
    
    const applicationId = body.applicationId as string
    const file = body.proofFile as File
    
    if (!file) {
      console.error('No file found in request. Body keys:', Object.keys(body))
      return c.json({ success: false, message: 'No file provided' }, 400)
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return c.json({ success: false, message: 'File size exceeds 5MB limit' }, 400)
    }
    
    // Upload to Supabase Storage
    const fileName = `${applicationId}-${Date.now()}-${file.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('payment-proofs')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false
      })
    
    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`)
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('payment-proofs')
      .getPublicUrl(fileName)
    
    // Update application with proof URL
    const { error: updateError } = await supabase
      .from('applications')
      .update({
        payment_status: 'proof_uploaded',
        payment_proof_url: publicUrl,
        payment_uploaded_at: new Date().toISOString()
      })
      .eq('id', applicationId)
    
    if (updateError) {
      throw new Error(`Update failed: ${updateError.message}`)
    }
    
    // Get application details for payment record
    const { data: application } = await supabase
      .from('applications')
      .select('*, courses:course_id(price)')
      .eq('id', applicationId)
      .single()
    
    // Create payment record
    if (application) {
      await supabase
        .from('payments')
        .insert({
          student_id: application.student_id,
          course_id: application.course_id,
          application_id: applicationId,
          amount: application.courses?.price || 0,
          payment_method: 'eft',
          payment_status: 'proof_uploaded',
          proof_of_payment_url: publicUrl,
          bank_name: 'Absa',
          uploaded_at: new Date().toISOString()
        })
    }
    
    return c.json({ 
      success: true, 
      message: 'Proof of payment uploaded successfully',
      publicUrl 
    })
    
  } catch (error: any) {
    console.error('Upload error:', error)
    return c.json({ 
      success: false, 
      message: error.message || 'Failed to upload proof of payment'
    }, 500)
  }
})

// Get payments (for admin)
app.get('/api/admin/payments', async (c) => {
  try {
    const supabase = getSupabaseAdminClient(c.env)
    
    const { data: applications, error } = await supabase
      .from('applications')
      .select(`
        *,
        students:student_id (
          full_name,
          email,
          phone
        ),
        courses:course_id (
          name,
          price
        )
      `)
      .in('payment_status', ['proof_uploaded', 'verified', 'rejected'])
      .order('payment_uploaded_at', { ascending: false })
    
    if (error) {
      throw new Error(error.message)
    }
    
    return c.json({ 
      success: true,
      payments: applications || []
    })
    
  } catch (error: any) {
    return c.json({ 
      success: false, 
      message: error.message 
    }, 500)
  }
})

// Verify/confirm payment (admin only)
app.post('/api/admin/payments/verify', async (c) => {
  try {
    const supabase = getSupabaseAdminClient(c.env)
    const { applicationId, action, notes } = await c.req.json()
    
    if (!applicationId || !action) {
      return c.json({ success: false, message: 'Missing required fields' }, 400)
    }
    
    // Get application details
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select('*, students:student_id(email, full_name), courses:course_id(name, price)')
      .eq('id', applicationId)
      .single()
    
    if (appError || !application) {
      throw new Error('Application not found')
    }
    
    const newStatus = action === 'verify' ? 'verified' : 'rejected'
    
    // Update application payment status
    const { error: updateError } = await supabase
      .from('applications')
      .update({
        payment_status: newStatus,
        payment_verified_at: new Date().toISOString(),
        payment_notes: notes || null
      })
      .eq('id', applicationId)
    
    if (updateError) {
      throw new Error(updateError.message)
    }
    
    // Update payment record
    await supabase
      .from('payments')
      .update({
        payment_status: newStatus,
        verified_at: new Date().toISOString(),
        rejection_reason: action === 'reject' ? notes : null
      })
      .eq('application_id', applicationId)
    
    // If verified, create student credentials and update enrollment
    if (action === 'verify') {
      // Generate temporary password
      const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase()
      
      // Update student record with credentials
      const { error: studentUpdateError } = await supabase
        .from('students')
        .update({
          temporary_password: tempPassword,
          account_status: 'active'
        })
        .eq('id', application.student_id)
      
      if (studentUpdateError) {
        console.error('Student update error:', studentUpdateError)
        throw new Error(`Failed to update student credentials: ${studentUpdateError.message}`)
      }
      
      // Create enrollment
      const { error: enrollmentError } = await supabase
        .from('enrollments')
        .insert({
          student_id: application.student_id,
          course_id: application.course_id,
          payment_status: 'pending',  // Changed from 'paid' to match table constraint
          payment_amount: application.courses?.price || 0,
          payment_date: new Date().toISOString(),
          enrollment_date: new Date().toISOString()
        })
      
      if (enrollmentError) {
        console.error('Enrollment creation error:', enrollmentError)
        throw new Error(`Failed to create enrollment: ${enrollmentError.message}`)
      }
      
      // Send welcome email with credentials
      const loginUrl = `https://3001-i64xhl5zgmighole8jufo-2e1b9533.sandbox.novita.ai/student-login`
      try {
        await sendEmail(c.env, {
          to: application.students.email,
          subject: 'Welcome to VonWillingh Online - Your Login Credentials',
          html: getPaymentVerifiedEmail(
            application.students.full_name,
            application.courses.name,
            application.students.email,
            tempPassword,
            loginUrl
          )
        })
        console.log('Welcome email sent to:', application.students.email)
      } catch (emailError) {
        // Log error but don't fail the request
        console.error('Failed to send welcome email:', emailError)
      }
    }
    
    return c.json({ 
      success: true, 
      message: action === 'verify' ? 'Payment verified successfully' : 'Payment rejected'
    })
    
  } catch (error: any) {
    return c.json({ 
      success: false, 
      message: error.message 
    }, 500)
  }
})

// ==================== ADMIN COURSES MANAGEMENT ====================

// Admin Courses Page
app.get('/admin-courses', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Course Management - VonWillingh Online Admin</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          .brand-bg { background-color: ${BRAND_COLORS.primary}; }
          .brand-text { color: ${BRAND_COLORS.primary}; }
        </style>
    </head>
    <body class="bg-gray-100">
        <nav class="brand-bg text-white shadow-lg">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center space-x-4">
                        <i class="fas fa-graduation-cap text-2xl"></i>
                        <h1 class="text-xl font-bold">Course Management</h1>
                    </div>
                    <div class="flex items-center space-x-4">
                        <a href="/admin-dashboard" class="hover:bg-white/10 px-3 py-2 rounded">
                            <i class="fas fa-home mr-2"></i>Dashboard
                        </a>
                        <a href="/admin-payments" class="hover:bg-white/10 px-3 py-2 rounded">
                            <i class="fas fa-money-check-alt mr-2"></i>Payments
                        </a>
                        <button id="logoutBtn" class="bg-white/20 hover:bg-white/30 px-4 py-2 rounded transition">
                            <i class="fas fa-sign-out-alt mr-2"></i>Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">Total Courses</p>
                            <p id="totalCourses" class="text-3xl font-bold brand-text">0</p>
                        </div>
                        <i class="fas fa-book text-4xl text-gray-300"></i>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">With Content</p>
                            <p id="coursesWithContent" class="text-3xl font-bold text-yellow-700">0</p>
                        </div>
                        <i class="fas fa-check-circle text-4xl text-green-200"></i>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">Without Content</p>
                            <p id="coursesWithoutContent" class="text-3xl font-bold text-red-600">0</p>
                        </div>
                        <i class="fas fa-exclamation-circle text-4xl text-red-200"></i>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">Total Modules</p>
                            <p id="totalModules" class="text-3xl font-bold text-blue-600">0</p>
                        </div>
                        <i class="fas fa-list text-4xl text-blue-200"></i>
                    </div>
                </div>
            </div>

            <!-- Filters -->
            <div class="bg-white rounded-lg shadow p-6 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-sm font-semibold mb-2">Filter by Level</label>
                        <select id="levelFilter" class="w-full border border-gray-300 rounded px-4 py-2">
                            <option value="">All Levels</option>
                            <option value="Certificate">Certificate</option>
                            <option value="Diploma">Diploma</option>
                            <option value="Bachelor">Bachelor</option>
                            <option value="Honours">Honours</option>
                            <option value="Master">Master</option>
                            <option value="Doctorate">Doctorate</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold mb-2">Content Status</label>
                        <select id="contentFilter" class="w-full border border-gray-300 rounded px-4 py-2">
                            <option value="">All Courses</option>
                            <option value="with">With Content</option>
                            <option value="without">Without Content</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold mb-2">Search Course</label>
                        <input type="text" id="courseSearch" placeholder="Search by name..." class="w-full border border-gray-300 rounded px-4 py-2">
                    </div>
                    <div class="flex items-end">
                        <button id="refreshBtn" class="w-full brand-bg text-white px-4 py-2 rounded hover:bg-blue-800 transition">
                            <i class="fas fa-sync-alt mr-2"></i>Refresh
                        </button>
                    </div>
                </div>
            </div>

            <!-- Courses List -->
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="p-6 border-b flex justify-between items-center">
                    <h2 class="text-xl font-bold brand-text">
                        <i class="fas fa-list mr-2"></i>All Courses
                    </h2>
                    <div class="flex space-x-3">
                        <a href="/admin/courses/import" class="brand-bg text-white px-4 py-2 rounded hover:opacity-90 transition">
                            <i class="fas fa-file-import mr-2"></i>Import Course
                        </a>
                        <button id="addCourseBtn" class="brand-bg text-white px-4 py-2 rounded hover:opacity-90 transition">
                            <i class="fas fa-plus mr-2"></i>Add Course
                        </button>
                    </div>
                </div>
                <div id="loadingDiv" class="p-8 text-center">
                    <i class="fas fa-spinner fa-spin text-4xl text-gray-400"></i>
                    <p class="text-gray-500 mt-4">Loading courses...</p>
                </div>
                <div id="coursesContainer" class="hidden">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modules</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="coursesTableBody" class="bg-white divide-y divide-gray-200">
                            </tbody>
                        </table>
                    </div>
                </div>
                <div id="emptyDiv" class="hidden p-8 text-center text-gray-500">
                    <i class="fas fa-inbox text-4xl mb-4"></i>
                    <p>No courses found</p>
                </div>
            </div>
        </div>

        <!-- View Modules Modal -->
        <div id="modulesModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div class="p-6 border-b flex justify-between items-center flex-shrink-0">
                    <h3 class="text-xl font-bold brand-text">
                        <i class="fas fa-list-ul mr-2"></i><span id="modalCourseTitle">Course Modules</span>
                    </h3>
                    <button id="closeModalBtn" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>
                <div class="p-6 overflow-y-auto flex-1">
                    <div id="modulesContent">
                        <p class="text-center text-gray-500">Loading modules...</p>
                    </div>
                </div>
                <div class="p-6 border-t flex justify-between flex-shrink-0 bg-white">
                    <button id="addModuleBtn" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded transition font-semibold shadow-lg">
                        <i class="fas fa-plus mr-2"></i>Add Module
                    </button>
                    <button id="closeModalBtn2" class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded transition font-semibold shadow-lg">
                        <i class="fas fa-times mr-2"></i>Close
                    </button>
                </div>
            </div>
        </div>

        <script src="/static/admin-courses.js"></script>
    </body>
    </html>
  `)
})

// API: Get all courses with module counts
app.get('/api/admin/courses', async (c) => {
  try {
    const supabase = getSupabaseAdminClient(c.env)
    
    // Get all courses
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .order('id')
    
    if (coursesError) {
      throw new Error(coursesError.message)
    }
    
    // Get module counts for each course
    const coursesWithModules = await Promise.all(
      courses.map(async (course) => {
        const { data: modules, error: modulesError } = await supabase
          .from('modules')
          .select('id')
          .eq('course_id', course.id)
        
        return {
          ...course,
          module_count: modules?.length || 0,
          has_content: (modules?.length || 0) > 0
        }
      })
    )
    
    return c.json({ 
      success: true,
      courses: coursesWithModules
    })
    
  } catch (error: any) {
    return c.json({ 
      success: false, 
      message: error.message 
    }, 500)
  }
})

// API: Get modules for a specific course
app.get('/api/admin/courses/:id/modules', async (c) => {
  try {
    const courseId = c.req.param('id')
    const supabase = getSupabaseAdminClient(c.env)
    
    // Get course details
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single()
    
    if (courseError || !course) {
      return c.json({ success: false, message: 'Course not found' }, 404)
    }
    
    // Get modules
    const { data: modules, error: modulesError } = await supabase
      .from('modules')
      .select('*')
      .eq('course_id', courseId)
      .order('order_number')
    
    if (modulesError) {
      throw new Error(modulesError.message)
    }
    
    return c.json({ 
      success: true,
      course,
      modules: modules || []
    })
    
  } catch (error: any) {
    return c.json({ 
      success: false, 
      message: error.message 
    }, 500)
  }
})

// API: Add a new module
app.post('/api/admin/courses/:id/modules', async (c) => {
  try {
    const courseId = c.req.param('id')
    const { title, description, content, duration_hours, video_url } = await c.req.json()
    const supabase = getSupabaseAdminClient(c.env)
    
    if (!title || !content) {
      return c.json({ success: false, message: 'Title and content are required' }, 400)
    }
    
    // Get next order_number
    const { data: existingModules } = await supabase
      .from('modules')
      .select('order_number')
      .eq('course_id', courseId)
      .order('order_number', { ascending: false })
      .limit(1)
    
    const nextOrder = existingModules && existingModules.length > 0 
      ? existingModules[0].order_number + 1 
      : 1
    
    // Insert module
    const { data: module, error: insertError } = await supabase
      .from('modules')
      .insert({
        course_id: parseInt(courseId),
        title,
        description: description || null,
        content,
        order_number: nextOrder,
        duration_hours: duration_hours || null,
        video_url: video_url || null
      })
      .select()
      .single()
    
    if (insertError) {
      throw new Error(insertError.message)
    }
    
    return c.json({ 
      success: true,
      message: 'Module added successfully',
      module
    })
    
  } catch (error: any) {
    return c.json({ 
      success: false, 
      message: error.message 
    }, 500)
  }
})

// API: Update a module
app.put('/api/admin/modules/:id', async (c) => {
  try {
    const moduleId = c.req.param('id')
    const { title, description, content, duration_hours, video_url, order_number } = await c.req.json()
    const supabase = getSupabaseAdminClient(c.env)
    
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (content !== undefined) updateData.content = content
    if (duration_hours !== undefined) updateData.duration_hours = duration_hours
    if (video_url !== undefined) updateData.video_url = video_url
    if (order_number !== undefined) updateData.order_number = order_number
    
    const { data: module, error: updateError } = await supabase
      .from('modules')
      .update(updateData)
      .eq('id', moduleId)
      .select()
      .single()
    
    if (updateError) {
      throw new Error(updateError.message)
    }
    
    return c.json({ 
      success: true,
      message: 'Module updated successfully',
      module
    })
    
  } catch (error: any) {
    return c.json({ 
      success: false, 
      message: error.message 
    }, 500)
  }
})

// API: Delete a module
app.delete('/api/admin/modules/:id', async (c) => {
  try {
    const moduleId = c.req.param('id')
    const supabase = getSupabaseAdminClient(c.env)
    
    const { error: deleteError } = await supabase
      .from('modules')
      .delete()
      .eq('id', moduleId)
    
    if (deleteError) {
      throw new Error(deleteError.message)
    }
    
    return c.json({ 
      success: true,
      message: 'Module deleted successfully'
    })
    
  } catch (error: any) {
    return c.json({ 
      success: false, 
      message: error.message 
    }, 500)
  }
})

// API: Delete a course
app.delete('/api/admin/courses/:id', async (c) => {
  try {
    const courseId = c.req.param('id')
    const supabase = getSupabaseAdminClient(c.env)
    
    console.log('🗑️ Deleting course:', courseId)
    
    // Get course details before deletion for logging
    const { data: course } = await supabase
      .from('courses')
      .select('name')
      .eq('id', courseId)
      .single()
    
    if (!course) {
      return c.json({ 
        success: false, 
        message: 'Course not found' 
      }, 404)
    }
    
    // Delete course (modules will be deleted automatically due to CASCADE)
    const { error: deleteError } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId)
    
    if (deleteError) {
      console.error('❌ Delete course error:', deleteError)
      throw new Error(deleteError.message)
    }
    
    console.log(`✅ Course deleted: ${course.name} (ID: ${courseId})`)
    
    return c.json({ 
      success: true,
      message: `Course "${course.name}" deleted successfully`
    })
    
  } catch (error: any) {
    console.error('❌ Delete course error:', error)
    return c.json({ 
      success: false, 
      message: error.message 
    }, 500)
  }
})

// ==================== CERTIFICATE API ENDPOINTS ====================

// Generate and save certificate
app.post('/api/student/certificate/generate', async (c) => {
  try {
    // Use admin client for storage upload (needs service role permissions)
    const supabase = getSupabaseAdminClient(c.env)
    const body = await c.req.json()
    const { studentId, courseId, certificateBlob } = body
    
    if (!studentId || !courseId || !certificateBlob) {
      return c.json({ success: false, message: 'Missing required fields' }, 400)
    }
    
    // Get enrollment info
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select(`
        *,
        students:student_id (
          full_name,
          email
        ),
        courses:course_id (
          name,
          level
        )
      `)
      .eq('student_id', studentId)
      .eq('course_id', courseId)
      .single()
    
    if (enrollmentError || !enrollment) {
      return c.json({ success: false, message: 'Enrollment not found' }, 404)
    }
    
    // Generate certificate ID
    const certificateId = `VW-${courseId}-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().substring(8)}`
    
    // Convert base64 blob to Uint8Array for upload
    const base64Data = certificateBlob.split(',')[1]
    
    // Decode base64 to binary string
    const binaryString = atob(base64Data)
    
    // Convert binary string to Uint8Array
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    
    // Upload to Supabase Storage
    const fileName = `${studentId}_${courseId}_${Date.now()}.pdf`
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('Certificates')
      .upload(fileName, bytes, {
        contentType: 'application/pdf',
        upsert: false
      })
    
    if (uploadError) {
      console.error('Certificate upload error:', uploadError)
      return c.json({ success: false, message: 'Failed to upload certificate' }, 500)
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('Certificates')
      .getPublicUrl(fileName)
    
    // Update enrollment with certificate info
    const { error: updateError } = await supabase
      .from('enrollments')
      .update({
        certificate_url: publicUrl,
        certificate_id: certificateId,
        completion_date: new Date().toISOString()
      })
      .eq('student_id', studentId)
      .eq('course_id', courseId)
    
    if (updateError) {
      console.error('Enrollment update error:', updateError)
      return c.json({ success: false, message: 'Failed to update enrollment' }, 500)
    }
    
    // Send course completion email with certificate link
    try {
      const dashboardUrl = 'https://3001-i64xhl5zgmighole8jufo-2e1b9533.sandbox.novita.ai/student/dashboard'
      
      await sendEmail(c.env, {
        to: enrollment.students.email,
        subject: '🏆 Congratulations! Course Completed - Certificate Ready',
        html: getCourseCompletionEmail(
          enrollment.students.full_name,
          enrollment.courses.name,
          new Date().toISOString(),
          publicUrl,
          dashboardUrl
        )
      })
      console.log('✅ Course completion email sent to:', enrollment.students.email)
    } catch (emailError) {
      console.error('❌ Failed to send completion email:', emailError)
      // Continue anyway - email failure shouldn't block certificate generation
    }
    
    return c.json({
      success: true,
      message: 'Certificate generated successfully',
      certificate: {
        url: publicUrl,
        id: certificateId
      }
    })
    
  } catch (error: any) {
    console.error('Certificate generation error:', error)
    return c.json({ 
      success: false, 
      message: error.message 
    }, 500)
  }
})

// Get student certificate
app.get('/api/student/certificate/:studentId/:courseId', async (c) => {
  try {
    const supabase = getSupabaseClient(c.env)
    const { studentId, courseId } = c.req.param()
    
    const { data: enrollment, error } = await supabase
      .from('enrollments')
      .select('certificate_url, certificate_id, completion_date')
      .eq('student_id', studentId)
      .eq('course_id', courseId)
      .single()
    
    if (error || !enrollment) {
      return c.json({ success: false, message: 'Certificate not found' }, 404)
    }
    
    return c.json({
      success: true,
      certificate: {
        url: enrollment.certificate_url,
        id: enrollment.certificate_id,
        completion_date: enrollment.completion_date
      }
    })
    
  } catch (error: any) {
    return c.json({ 
      success: false, 
      message: error.message 
    }, 500)
  }
})

// ==================== QUIZ API ROUTES ====================

// Get quiz questions for a module
app.get('/api/student/module/:moduleId/quiz', async (c) => {
  try {
    const moduleId = c.req.param('moduleId')
    const studentId = c.req.query('studentId')
    
    console.log('[QUIZ API] Request:', { moduleId, studentId })
    
    if (!studentId) {
      return c.json({ success: false, message: 'Student ID required' }, 400)
    }
    
    // Check if environment variables are set
    if (!c.env.SUPABASE_URL || !c.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('[QUIZ API] Missing Supabase environment variables')
      return c.json({ 
        success: false, 
        message: 'Server configuration error: Missing Supabase credentials. Please contact administrator.' 
      }, 500)
    }
    
    const supabase = getSupabaseAdminClient(c.env)
    
    // Get quiz questions for the module
    const { data: questions, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('module_id', moduleId)
      .order('order_number', { ascending: true })
    
    console.log('[QUIZ API] Supabase response:', { questionCount: questions?.length, error: error?.message })
    
    if (error) {
      console.error('[QUIZ API] Supabase error:', error)
      return c.json({ success: false, message: `Database error: ${error.message}` }, 500)
    }
    
    // Check if no questions found
    if (!questions || questions.length === 0) {
      console.warn('[QUIZ API] No questions found for module:', moduleId)
      return c.json({ 
        success: false, 
        message: `No quiz questions found for module ${moduleId}. Please ensure questions are added in the database.` 
      }, 404)
    }
    
    console.log('[QUIZ API] Success - returning', questions.length, 'questions')
    return c.json({ 
      success: true, 
      questions: questions 
    })
  } catch (error: any) {
    console.error('[QUIZ API] Unexpected error:', error)
    return c.json({ 
      success: false, 
      message: `Server error: ${error.message || 'Unknown error'}` 
    }, 500)
  }
})

// Get quiz attempts for a student and module
app.get('/api/student/module/:moduleId/quiz/attempts', async (c) => {
  try {
    const moduleId = c.req.param('moduleId')
    const studentId = c.req.query('studentId')
    
    console.log('[QUIZ ATTEMPTS API] Request:', { moduleId, studentId })
    
    if (!studentId) {
      return c.json({ success: false, message: 'Student ID required' }, 400)
    }
    
    const supabase = getSupabaseAdminClient(c.env)
    
    // Get quiz attempts
    const { data: attempts, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('student_id', studentId)
      .eq('module_id', moduleId)
      .order('created_at', { ascending: false })
    
    console.log('[QUIZ ATTEMPTS API] Response:', { count: attempts?.length, error: error?.message })
    
    if (error) {
      console.error('[QUIZ ATTEMPTS API] Error:', error)
      // If table doesn't exist, return empty array instead of error
      if (error.message?.includes('does not exist') || error.code === '42P01') {
        console.warn('[QUIZ ATTEMPTS API] Table does not exist, returning empty array')
        return c.json({ 
          success: true, 
          attempts: [] 
        })
      }
      return c.json({ success: false, message: `Database error: ${error.message}` }, 500)
    }
    
    console.log('[QUIZ ATTEMPTS API] Success - returning', attempts?.length || 0, 'attempts')
    return c.json({ 
      success: true, 
      attempts: attempts || [] 
    })
  } catch (error: any) {
    console.error('[QUIZ ATTEMPTS API] Unexpected error:', error)
    return c.json({ 
      success: false, 
      message: `Server error: ${error.message || 'Unknown error'}` 
    }, 500)
  }
})

// Submit quiz answers
app.post('/api/student/module/:moduleId/quiz/submit', async (c) => {
  try {
    const moduleId = c.req.param('moduleId')
    const body = await c.req.json()
    const { studentId, enrollmentId, answers, timeSpentSeconds } = body
    
    if (!studentId || !answers) {
      return c.json({ success: false, message: 'Missing required fields' }, 400)
    }
    
    const supabase = getSupabaseAdminClient(c.env)
    
    // Get quiz questions
    const { data: questions } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('module_id', moduleId)
      .order('order_number', { ascending: true })
    
    if (!questions || questions.length === 0) {
      return c.json({ success: false, message: 'No quiz questions found' }, 404)
    }
    
    // Grade the quiz
    const results: any = {}
    let correctCount = 0
    const questionsAttempted = Object.keys(answers)
    
    questionsAttempted.forEach(questionId => {
      const question = questions.find(q => q.id === questionId)
      if (question) {
        const isCorrect = answers[questionId] === question.correct_answer
        results[questionId] = isCorrect
        if (isCorrect) correctCount++
      }
    })
    
    const totalQuestions = questionsAttempted.length
    const wrongCount = totalQuestions - correctCount
    const percentage = Math.round((correctCount / totalQuestions) * 100)
    const passed = percentage >= 70
    
    // Get attempt number
    const { data: previousAttempts } = await supabase
      .from('quiz_attempts')
      .select('attempt_number')
      .eq('student_id', studentId)
      .eq('module_id', moduleId)
      .order('attempt_number', { ascending: false })
      .limit(1)
    
    const attemptNumber = previousAttempts && previousAttempts.length > 0 
      ? previousAttempts[0].attempt_number + 1 
      : 1
    
    // Save attempt
    const { data: attempt, error } = await supabase
      .from('quiz_attempts')
      .insert({
        student_id: studentId,
        module_id: moduleId,
        enrollment_id: enrollmentId,
        total_questions: totalQuestions,
        correct_answers: correctCount,
        wrong_answers: wrongCount,
        percentage: percentage,
        passed: passed,
        attempt_number: attemptNumber,
        questions_attempted: questionsAttempted,
        answers: answers,
        results: results,
        time_spent_seconds: timeSpentSeconds,
        started_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) {
      return c.json({ success: false, message: error.message }, 500)
    }
    
    return c.json({ 
      success: true, 
      attempt: attempt 
    })
  } catch (error: any) {
    return c.json({ 
      success: false, 
      message: error.message 
    }, 500)
  }
})

// Diagnostic endpoint to check quiz setup
app.get('/api/diagnostic/quiz-check', async (c) => {
  try {
    const supabase = getSupabaseAdminClient(c.env)
    
    // Get ADVBUS001 Module 1 first
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, code, name')
      .eq('code', 'ADVBUS001')
      .single()
    
    if (courseError || !course) {
      return c.json({
        success: false,
        message: 'ADVBUS001 course not found',
        error: courseError?.message
      })
    }
    
    const { data: module, error: moduleError } = await supabase
      .from('modules')
      .select('id, title, order_number')
      .eq('course_id', course.id)
      .eq('order_number', 1)
      .single()
    
    if (moduleError || !module) {
      return c.json({
        success: false,
        message: 'Module 1 not found for ADVBUS001',
        courseFound: course,
        error: moduleError?.message
      })
    }
    
    // Now check for quiz questions
    const { data: questions, error: questionsError } = await supabase
      .from('quiz_questions')
      .select('id, question_text, module_id, order_number, difficulty_level')
      .eq('module_id', module.id)
      .order('order_number', { ascending: true })
    
    return c.json({
      success: true,
      course: {
        id: course.id,
        code: course.code,
        name: course.name
      },
      module: {
        id: module.id,
        title: module.title,
        order_number: module.order_number
      },
      quizQuestions: {
        count: questions?.length || 0,
        sample: questions?.slice(0, 3).map(q => ({
          order: q.order_number,
          difficulty: q.difficulty_level,
          question: q.question_text?.substring(0, 50) + '...'
        }))
      },
      errors: {
        questionsError: questionsError?.message
      }
    })
  } catch (error: any) {
    return c.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, 500)
  }
})

export default app
