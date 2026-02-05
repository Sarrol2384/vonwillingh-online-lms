#!/usr/bin/env node

/**
 * AUTO COURSE CREATOR
 * 
 * This script creates courses directly in the VonWillingh LMS database
 * No JSON downloads, no manual imports - fully automated!
 * 
 * Usage: node auto-create-course.js
 */

// Course data - you can modify this or generate with AI
const courseData = {
  course: {
    name: "Digital Marketing for South African Small Businesses",
    code: "DIGIMKT001",
    level: "Certificate",
    description: "Master digital marketing strategies tailored for South African small businesses.",
    duration: "4 weeks",
    price: 1500,
    category: "Digital Marketing"
  },
  modules: [
    {
      title: "Module 1: Digital Marketing Fundamentals",
      description: "Build your marketing foundation",
      order_number: 1,
      content: "<h2>Welcome to Digital Marketing!</h2><p>Content here...</p>",
      quiz: {
        passing_score: 70,
        max_attempts: 3,
        questions: [
          {
            question: "What is digital marketing?",
            options: ["A", "B", "C", "D"],
            correct_answer: "B"
          }
        ]
      }
    }
  ]
}

/**
 * Create course via API
 */
async function createCourse() {
  const API_URL = 'https://vonwillingh-online-lms.pages.dev/api/courses/external-import'
  const API_KEY = 'vonwillingh-lms-import-key-2026'
  
  console.log('🚀 Creating course in VonWillingh LMS...')
  console.log('📝 Course:', courseData.course.name)
  console.log('📚 Modules:', courseData.modules.length)
  console.log('')
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      body: JSON.stringify(courseData)
    })
    
    const result = await response.json()
    
    if (result.success) {
      console.log('✅ SUCCESS!')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('📦 Course ID:', result.data.course_id)
      console.log('📝 Course Name:', result.data.course_name)
      console.log('📚 Modules:', result.data.modules_count)
      console.log('💰 Price: R', result.data.price)
      console.log('🔗 View at:', result.data.course_url)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    } else {
      console.error('❌ ERROR:', result.message)
      if (result.error) {
        console.error('Error code:', result.error)
      }
    }
    
  } catch (error) {
    console.error('❌ FAILED:', error.message)
  }
}

// Run it!
createCourse()
