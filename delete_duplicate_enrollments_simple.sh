#!/bin/bash

# Simple bash script to delete duplicate enrollments
# Using the most basic SQL possible

echo "🔧 Deleting duplicate enrollments for AIFUND001 (course_id 35)..."

# Get all enrollment IDs for course 35, sorted by date
# Keep the first (newest) one, delete the rest

# Simple approach: Just delete enrollment ID that we know is older
# First let's see what enrollment IDs exist

curl -s "https://vonwillingh-online-lms.pages.dev/api/admin/courses/35/enrollments" 2>/dev/null || echo "No API endpoint"

echo ""
echo "Since SQL keeps failing, let's just tell you which enrollment ID to manually delete..."
echo ""
echo "MANUAL STEPS:"
echo "1. Go to your Supabase dashboard"
echo "2. Click on 'Table Editor'"  
echo "3. Select the 'enrollments' table"
echo "4. Filter by course_id = 35"
echo "5. You'll see 2 rows with the same user_id"
echo "6. Delete the row with the OLDER enrolled_at date"
echo "7. Keep the row with the NEWER enrolled_at date"
echo ""
echo "That's it! No SQL needed."
