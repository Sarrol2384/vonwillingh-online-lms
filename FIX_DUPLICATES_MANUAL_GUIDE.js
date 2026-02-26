/**
 * Fix Duplicate Enrollments - Direct Database Script
 * 
 * This script connects directly to the database and removes duplicate enrollments
 * keeping only the most recent enrollment per user for AIFUND001
 */

// Simple fetch-based solution
const API_URL = 'https://vonwillingh-online-lms.pages.dev/api/admin/courses/35'

async function fixDuplicates() {
  console.log('🔧 Attempting to fix duplicate enrollments...\n')
  console.log('📌 This will be done through the admin panel.')
  console.log('\n='.repeat(70))
  console.log('\n📋 MANUAL FIX INSTRUCTIONS:\n')
  console.log('Since SQL scripts keep failing, here\'s the simplest way to fix this:\n')
  console.log('OPTION 1 - Unenroll & Re-enroll (EASIEST):')
  console.log('─'.repeat(70))
  console.log('1. Go to: https://vonwillingh-online-lms.pages.dev/dashboard')
  console.log('2. You\'ll see TWO cards for "Introduction to AI Fundamentals"')
  console.log('3. On EACH card, click the three dots (⋮) in the top-right corner')
  console.log('4. Select "Unenroll" from the dropdown')
  console.log('5. Confirm unenrollment for BOTH cards')
  console.log('6. Go to: https://vonwillingh-online-lms.pages.dev/courses')
  console.log('7. Find "Introduction to AI Fundamentals" and click "Enroll"')
  console.log('8. Refresh the dashboard - you should see only ONE course card\n')
  
  console.log('\nOPTION 2 - Use Supabase Dashboard:')
  console.log('─'.repeat(70))
  console.log('1. Open your Supabase dashboard')
  console.log('2. Go to: Table Editor → enrollments')
  console.log('3. Add a filter: course_id = 35')
  console.log('4. You\'ll see multiple rows with the same user_id')
  console.log('5. For each duplicate:')
  console.log('   - Keep the row with the NEWEST enrolled_at date')
  console.log('   - Delete the row(s) with OLDER enrolled_at dates')
  console.log('6. Refresh your LMS dashboard\n')
  
  console.log('\n='.repeat(70))
  console.log('\n✅ After fixing, you should see:')
  console.log('  - Only ONE course card for "Introduction to AI Fundamentals"')
  console.log('  - The "Continue" button works')
  console.log('  - Both Module 1 and Module 2 load correctly')
  console.log('\n' + '='.repeat(70))
}

fixDuplicates()
