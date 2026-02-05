/**
 * VonWillingh LMS - External Import Integration
 * 
 * Add this code to your GenSpark Course Creator app
 * to enable direct course publishing to the LMS
 */

// ============================================
// CONFIGURATION
// ============================================

const LMS_CONFIG = {
  apiUrl: 'https://vonwillingh-online-lms.pages.dev/api/courses/external-import',
  apiKey: 'vonwillingh-lms-import-key-2026'
}

// ============================================
// MAIN FUNCTION: Publish Course to LMS
// ============================================

/**
 * Publishes a course directly to VonWillingh LMS
 * @param {Object} courseData - The course data with structure { course: {...}, modules: [...] }
 * @returns {Promise<Object>} - API response
 */
async function publishCourseToLMS(courseData) {
  try {
    console.log('📤 Publishing course to LMS:', courseData.course.name)
    
    // Validate data before sending
    if (!validateCourseData(courseData)) {
      throw new Error('Invalid course data structure')
    }
    
    // Make API call
    const response = await fetch(LMS_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': LMS_CONFIG.apiKey
      },
      body: JSON.stringify(courseData)
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.message || `HTTP ${response.status}`)
    }
    
    console.log('✅ Course published successfully!')
    console.log('📦 Course ID:', result.data.course_id)
    console.log('🔗 Course URL:', result.data.course_url)
    
    return result
    
  } catch (error) {
    console.error('❌ Failed to publish course:', error.message)
    throw error
  }
}

// ============================================
// VALIDATION HELPER
// ============================================

function validateCourseData(data) {
  // Check main structure
  if (!data.course || !data.modules) {
    console.error('Missing course or modules property')
    return false
  }
  
  // Check required course fields
  const requiredCourseFields = ['name', 'code', 'level', 'description', 'duration', 'price']
  for (const field of requiredCourseFields) {
    if (field === 'price') {
      if (data.course.price === undefined || data.course.price === null) {
        console.error('Missing required course field: price')
        return false
      }
    } else if (!data.course[field]) {
      console.error('Missing required course field:', field)
      return false
    }
  }
  
  // Check modules
  if (!Array.isArray(data.modules) || data.modules.length === 0) {
    console.error('Modules must be a non-empty array')
    return false
  }
  
  // Check required module fields
  const requiredModuleFields = ['title', 'description', 'order_number', 'content']
  for (let i = 0; i < data.modules.length; i++) {
    for (const field of requiredModuleFields) {
      if (!data.modules[i][field]) {
        console.error(`Module ${i + 1} missing required field: ${field}`)
        return false
      }
    }
  }
  
  return true
}

// ============================================
// EXAMPLE USAGE
// ============================================

// Example 1: Publish a simple course
async function example1() {
  const courseData = {
    course: {
      name: "AI Basics for Small Business Owners",
      code: "AIFREE001",
      level: "Certificate",
      category: "Artificial Intelligence & Technology",
      description: "Learn AI basics and practical tools for your business",
      duration: "2 weeks",
      price: 0
    },
    modules: [
      {
        title: "Understanding AI",
        description: "Learn what AI is and how it can benefit your business",
        order_number: 1,
        content: `
          <h2>What is Artificial Intelligence?</h2>
          <p>Artificial Intelligence (AI) is technology that enables computers to perform tasks that typically require human intelligence.</p>
          
          <h3>Key Concepts:</h3>
          <ul>
            <li>Machine Learning</li>
            <li>Natural Language Processing</li>
            <li>Computer Vision</li>
          </ul>
        `,
        duration_minutes: 30
      },
      {
        title: "AI Tools for Business",
        description: "Discover practical AI tools you can use today",
        order_number: 2,
        content: `
          <h2>Free AI Tools for Your Business</h2>
          
          <h3>1. ChatGPT</h3>
          <p>Use ChatGPT for content writing, customer support, and brainstorming.</p>
          
          <h3>2. Canva AI</h3>
          <p>Create professional designs with AI-powered templates.</p>
          
          <h3>3. Grammarly</h3>
          <p>Improve your writing with AI-powered grammar checking.</p>
        `,
        duration_minutes: 45
      }
    ]
  }
  
  try {
    const result = await publishCourseToLMS(courseData)
    console.log('Success!', result)
    alert(`Course published! ID: ${result.data.course_id}`)
  } catch (error) {
    console.error('Error:', error)
    alert('Failed to publish course: ' + error.message)
  }
}

// Example 2: Publish a course with quiz
async function example2() {
  const courseData = {
    course: {
      name: "Introduction to Digital Marketing",
      code: "DIGIMKT001",
      level: "Certificate",
      category: "Digital Marketing",
      description: "Learn the fundamentals of digital marketing",
      duration: "3 weeks",
      price: 1500
    },
    modules: [
      {
        title: "Digital Marketing Basics",
        description: "Understanding digital marketing channels",
        order_number: 1,
        content: `
          <h2>Welcome to Digital Marketing</h2>
          <p>Digital marketing is the practice of promoting products or services using digital technologies.</p>
          
          <h3>Main Channels:</h3>
          <ul>
            <li>Social Media Marketing</li>
            <li>Email Marketing</li>
            <li>Search Engine Optimization (SEO)</li>
            <li>Pay-Per-Click Advertising (PPC)</li>
          </ul>
        `,
        quiz: {
          passing_score: 70,
          max_attempts: 3,
          questions: [
            {
              question: "What does SEO stand for?",
              options: [
                "Search Engine Optimization",
                "Social Engagement Online",
                "Sales Enhancement Operation",
                "Secure Email Output"
              ],
              correct_answer: "Search Engine Optimization"
            },
            {
              question: "Which platform is best for B2B marketing?",
              options: [
                "TikTok",
                "Instagram",
                "LinkedIn",
                "Snapchat"
              ],
              correct_answer: "LinkedIn"
            },
            {
              question: "What is the main goal of content marketing?",
              options: [
                "Immediate sales",
                "Building brand awareness and trust",
                "Reducing costs",
                "Hiring employees"
              ],
              correct_answer: "Building brand awareness and trust"
            }
          ]
        }
      }
    ]
  }
  
  try {
    const result = await publishCourseToLMS(courseData)
    console.log('Success!', result)
  } catch (error) {
    console.error('Error:', error)
  }
}

// ============================================
// UI INTEGRATION
// ============================================

/**
 * Add this button to your Course Creator UI
 * Call this function when the button is clicked
 */
function addPublishButton() {
  // Example: Add button to your course creator UI
  const button = document.createElement('button')
  button.textContent = '🚀 Publish to LMS'
  button.className = 'btn-publish-lms'
  button.onclick = async () => {
    // Get your course data from your app state/form
    const courseData = getCurrentCourseData()
    
    // Show loading state
    button.disabled = true
    button.textContent = '⏳ Publishing...'
    
    try {
      const result = await publishCourseToLMS(courseData)
      
      // Show success message
      alert(`✅ Course published successfully!\n\nCourse ID: ${result.data.course_id}\nView at: ${result.data.course_url}`)
      button.textContent = '✅ Published!'
      
    } catch (error) {
      // Show error message
      alert(`❌ Failed to publish: ${error.message}`)
      button.textContent = '🚀 Publish to LMS'
      button.disabled = false
    }
  }
  
  // Append button to your UI
  document.getElementById('course-actions').appendChild(button)
}

/**
 * Replace this with your actual function to get course data
 */
function getCurrentCourseData() {
  // This is just a placeholder
  // Replace with your actual implementation
  return {
    course: {
      // ... your course data
    },
    modules: [
      // ... your modules
    ]
  }
}

// ============================================
// ERROR HANDLING
// ============================================

/**
 * Handles specific error codes from the API
 */
function handlePublishError(error, result) {
  if (result?.error === 'INVALID_API_KEY') {
    return 'Invalid API key. Please check your configuration.'
  }
  
  if (result?.error === 'COURSE_EXISTS') {
    return `A course with code "${result.existing_course?.code}" already exists.`
  }
  
  if (result?.error === 'MISSING_COURSE_FIELDS') {
    return `Missing required fields: ${result.missing_fields?.join(', ')}`
  }
  
  if (result?.error === 'INVALID_COURSE_LEVEL') {
    return `Invalid course level. Must be one of: ${result.valid_levels?.join(', ')}`
  }
  
  return error.message || 'An unknown error occurred'
}

// ============================================
// EXPORT FOR MODULE SYSTEMS
// ============================================

// For ES6 modules
export { publishCourseToLMS, validateCourseData }

// For CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { publishCourseToLMS, validateCourseData }
}

// ============================================
// READY TO USE!
// ============================================

console.log('✅ VonWillingh LMS Integration loaded')
console.log('📚 Use publishCourseToLMS(courseData) to publish courses')
