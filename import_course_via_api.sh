#!/bin/bash

# Supabase credentials
SUPABASE_URL="https://laqauvikkazfpurknfkf.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhcWF1dmlrYW96ZnB1cmtuZ2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NTg1NjksImV4cCI6MjA4NTUzNDU2OX0.Lte-s41-oBz8GsjQISJ_RgG9ZDE2couNVVP6b12aJl8"

echo "🚀 Starting course import via Supabase REST API..."

# Step 1: Check if course exists
echo "🔍 Checking for existing course..."
EXISTING_COURSE=$(curl -s -X GET \
  "${SUPABASE_URL}/rest/v1/courses?code=eq.TESTLEAD001&select=id" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}")

echo "Response: $EXISTING_COURSE"

if echo "$EXISTING_COURSE" | grep -q '"id"'; then
  COURSE_ID=$(echo "$EXISTING_COURSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  echo "⚠️  Course exists with ID: $COURSE_ID"
  echo "Deleting old modules and quizzes..."
  
  # Get module IDs
  MODULES=$(curl -s -X GET \
    "${SUPABASE_URL}/rest/v1/modules?course_id=eq.${COURSE_ID}&select=id" \
    -H "apikey: ${SUPABASE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_KEY}")
  
  # Delete quiz questions for these modules
  curl -s -X DELETE \
    "${SUPABASE_URL}/rest/v1/quiz_questions?module_id=in.(${COURSE_ID})" \
    -H "apikey: ${SUPABASE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_KEY}"
  
  # Delete modules
  curl -s -X DELETE \
    "${SUPABASE_URL}/rest/v1/modules?course_id=eq.${COURSE_ID}" \
    -H "apikey: ${SUPABASE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_KEY}"
  
  echo "✅ Deleted old data"
  
  # Update course
  curl -s -X PATCH \
    "${SUPABASE_URL}/rest/v1/courses?id=eq.${COURSE_ID}" \
    -H "apikey: ${SUPABASE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_KEY}" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=minimal" \
    -d '{
      "name": "Test: Business Leadership Fundamentals",
      "level": "Certificate",
      "category": "Leadership",
      "description": "A simple test course to verify the JSON structure for professional leadership content with proper formatting and quiz separation.",
      "duration": "2 weeks",
      "price": 0
    }'
  
  echo "✅ Course updated"
else
  echo "📝 Creating new course..."
  COURSE_RESPONSE=$(curl -s -X POST \
    "${SUPABASE_URL}/rest/v1/courses" \
    -H "apikey: ${SUPABASE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_KEY}" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=representation" \
    -d '{
      "name": "Test: Business Leadership Fundamentals",
      "code": "TESTLEAD001",
      "level": "Certificate",
      "category": "Leadership",
      "description": "A simple test course to verify the JSON structure for professional leadership content with proper formatting and quiz separation.",
      "duration": "2 weeks",
      "price": 0
    }')
  
  COURSE_ID=$(echo "$COURSE_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  echo "✅ Course created with ID: $COURSE_ID"
fi

echo ""
echo "✅ Course ready! ID: $COURSE_ID"
echo ""
echo "Next: I'll create a simpler script to add the module and quiz..."

