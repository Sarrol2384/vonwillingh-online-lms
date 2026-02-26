#!/usr/bin/env node

/**
 * Fix Duplicate Enrollments Script
 * 
 * This script calls the API endpoint to automatically fix duplicate enrollments
 * for AIFUND001 course (course_id: 35)
 */

const API_URL = 'https://vonwillingh-online-lms.pages.dev/api/admin/fix-duplicate-enrollments'
const ADMIN_PASSWORD = 'vonwillingh2024' // From import-api-simple.ts

async function fixDuplicateEnrollments() {
  console.log('🔧 Fixing Duplicate Enrollments...\n')
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Password': ADMIN_PASSWORD
      },
      body: JSON.stringify({
        course_id: 35 // AIFUND001
      })
    })
    
    const data = await response.json()
    
    if (data.success) {
      console.log('✅ SUCCESS!\n')
      console.log(`Message: ${data.message}`)
      
      if (data.deleted > 0) {
        console.log(`\nDetails:`)
        console.log(`  - Total enrollments before: ${data.total_enrollments_before}`)
        console.log(`  - Unique users: ${data.unique_users}`)
        console.log(`  - Duplicate enrollments deleted: ${data.deleted}`)
        console.log(`  - Remaining enrollments: ${data.remaining}`)
        console.log(`\n✨ Each user now has exactly 1 enrollment for this course`)
      } else {
        console.log('\n✅ No duplicates were found - everything is already clean!')
      }
      
      console.log('\n📋 Next Steps:')
      console.log('  1. Refresh your browser (hard refresh: Ctrl+Shift+R)')
      console.log('  2. You should see only ONE course card for "Introduction to AI Fundamentals"')
      console.log('  3. Click "Continue" to access the course modules')
      
    } else {
      console.error('❌ ERROR:', data.message)
      
      if (response.status === 401) {
        console.error('\n🔐 Authentication failed - the admin password may have changed')
      }
      
      process.exit(1)
    }
    
  } catch (error) {
    console.error('❌ ERROR calling API:', error.message)
    console.error('\nPlease check:')
    console.error('  - Is the website running?')
    console.error('  - Do you have internet connection?')
    console.error('  - Is the URL correct?')
    process.exit(1)
  }
}

// Run the fix
fixDuplicateEnrollments()
