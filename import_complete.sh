#!/bin/bash

# Simple Complete Course Import
set -e

SUPABASE_URL="https://laqauvikkazfpurknfkf.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhcWF1dmlrYW96ZnB1cmtuZ2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NTg1NjksImV4cCI6MjA4NTUzNDU2OX0.Lte-s41-oBz8GsjQISJ_RgG9ZDE2couNVVP6b12aJl8"

echo "🚀 Starting complete import..."
echo ""

# Step 1: Get or create course
echo "📋 Step 1: Getting course ID..."
COURSE_RESPONSE=$(curl -s "${SUPABASE_URL}/rest/v1/courses?code=eq.TESTLEAD001&select=id" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}")

COURSE_ID=$(echo "$COURSE_RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data[0]['id'] if data else '')" 2>/dev/null || echo "")

if [ -z "$COURSE_ID" ]; then
  echo "  Creating new course..."
  COURSE_RESPONSE=$(curl -s -X POST "${SUPABASE_URL}/rest/v1/courses" \
    -H "apikey: ${SUPABASE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_KEY}" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=representation" \
    -d '{
      "name": "Test: Business Leadership Fundamentals",
      "code": "TESTLEAD001",
      "level": "Certificate",
      "category": "Leadership",
      "description": "A simple test course to verify the JSON structure.",
      "duration": "2 weeks",
      "price": 0
    }')
  
  COURSE_ID=$(echo "$COURSE_RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data[0]['id'] if isinstance(data, list) else data.get('id', ''))")
fi

echo "✅ Course ID: $COURSE_ID"
echo ""

# Step 2: Clean existing modules
echo "🧹 Step 2: Cleaning existing modules..."
curl -s -X DELETE "${SUPABASE_URL}/rest/v1/modules?course_id=eq.${COURSE_ID}" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" > /dev/null
echo "✅ Cleaned"
echo ""

# Step 3: Create module
echo "📚 Step 3: Creating module..."

# Read the module content from the JSON file
MODULE_CONTENT='<div style="font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px;"><h1>Module 1: Introduction to Leadership Principles</h1><p>Building the foundation for effective leadership in South African businesses</p><h2>Learning Objectives</h2><ul><li>Understand core leadership theories and their practical applications</li><li>Identify different leadership styles and when to use them</li><li>Develop effective communication skills for diverse teams</li><li>Apply leadership principles in South African business contexts</li><li>Build trust and credibility as an emerging leader</li></ul><h2>1. What is Leadership?</h2><p>Leadership is the art of motivating a group of people to act toward achieving a common goal. In a business setting, this means directing workers and colleagues with a strategy to meet company needs. Unlike management, which focuses on maintaining systems and processes, leadership is about inspiring change and innovation.</p><h2>2. Leadership vs Management</h2><p>While leadership and management are related, they serve different purposes. Management maintains order and consistency, while leadership drives change and innovation. Great organizations need both strong management and strong leadership to succeed.</p><h2>3. Leadership Styles</h2><p>There are several common leadership styles including:</p><ul><li><strong>Democratic Leadership</strong> - Involves team members in decision-making</li><li><strong>Autocratic Leadership</strong> - Leader makes decisions independently</li><li><strong>Transformational Leadership</strong> - Inspires and motivates through shared vision</li><li><strong>Servant Leadership</strong> - Focuses on serving the team</li></ul><h2>4. Emotional Intelligence in Leadership</h2><p>Emotional Intelligence (EQ) consists of five key components according to Daniel Goleman:</p><ul><li>Self-awareness - Understanding your own emotions</li><li>Self-regulation - Managing your emotions effectively</li><li>Motivation - Internal drive to achieve</li><li>Empathy - Understanding others emotions</li><li>Social skills - Building relationships and influence</li></ul><h2>5. Ubuntu Philosophy in South African Leadership</h2><p>Ubuntu philosophy emphasizes "I am because we are" - focusing on collective success, community building, and interconnectedness rather than individual achievement. This is particularly relevant in South African business contexts where diverse teams work together.</p><h2>6. Case Study: Thabo Success Story</h2><p>Thabo, a manufacturing business owner, succeeded by spending time understanding his employees concerns, involving them in decisions, and demonstrating commitment by working alongside them during challenging times. This built trust and engagement, leading to business turnaround.</p><h2>Key Takeaways</h2><ul><li>Leadership is about inspiring change and innovation</li><li>Different situations require different leadership styles</li><li>Emotional intelligence is crucial for effective leadership</li><li>Ubuntu philosophy emphasizes collective success</li><li>Trust and authenticity are foundation of great leadership</li></ul></div>'

MODULE_RESPONSE=$(curl -s -X POST "${SUPABASE_URL}/rest/v1/modules" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  --data-binary @- <<EOF
{
  "course_id": "${COURSE_ID}",
  "title": "Module 1: Introduction to Leadership Principles",
  "description": "Explore fundamental leadership concepts including leadership styles, team dynamics, and effective communication strategies.",
  "order_number": 1,
  "content": $(echo "$MODULE_CONTENT" | python3 -c "import sys, json; print(json.dumps(sys.stdin.read()))"),
  "content_type": "lesson",
  "video_url": "",
  "duration_minutes": 45
}
EOF
)

MODULE_ID=$(echo "$MODULE_RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data[0]['id'] if isinstance(data, list) else data.get('id', ''))")

if [ -z "$MODULE_ID" ]; then
  echo "❌ Failed to create module"
  echo "$MODULE_RESPONSE"
  exit 1
fi

echo "✅ Module ID: $MODULE_ID"
echo ""

# Step 4: Add quiz questions
echo "🎯 Step 4: Adding quiz questions..."

# Question 1
curl -s -X POST "${SUPABASE_URL}/rest/v1/quiz_questions" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Content-Type: application/json" \
  -d @- > /dev/null <<'EOF'
{
  "module_id": "MODULE_ID",
  "question": "What is the key difference between leadership and management?",
  "type": "single_choice",
  "options": ["Leadership focuses on inspiring change while management maintains stability", "Leadership is easier than management", "Management requires more education than leadership", "Leadership is only for executives while management is for everyone"],
  "correct_answer": "Leadership focuses on inspiring change while management maintains stability",
  "points": 2,
  "explanation": "Leadership is about setting vision and inspiring people toward goals, while management focuses on implementing processes and maintaining systems."
}
EOF

echo "  ✅ Question 1"

# Question 2
cat <<EOF | sed "s/MODULE_ID/${MODULE_ID}/g" | curl -s -X POST "${SUPABASE_URL}/rest/v1/quiz_questions" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Content-Type: application/json" \
  -d @- > /dev/null
{
  "module_id": "MODULE_ID",
  "question": "Which leadership style involves team members in decision-making?",
  "type": "single_choice",
  "options": ["Autocratic", "Democratic", "Laissez-faire", "Transactional"],
  "correct_answer": "Democratic",
  "points": 2,
  "explanation": "Democratic leadership involves team members in decision-making."
}
EOF

echo "  ✅ Question 2"

# Question 3
cat <<EOF | sed "s/MODULE_ID/${MODULE_ID}/g" | curl -s -X POST "${SUPABASE_URL}/rest/v1/quiz_questions" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Content-Type: application/json" \
  -d @- > /dev/null
{
  "module_id": "MODULE_ID",
  "question": "Ubuntu philosophy emphasizes individual achievement over team success.",
  "type": "true_false",
  "options": ["True", "False"],
  "correct_answer": "False",
  "points": 2,
  "explanation": "Ubuntu means 'I am because we are' - collective success."
}
EOF

echo "  ✅ Question 3"

# Question 4
cat <<EOF | sed "s/MODULE_ID/${MODULE_ID}/g" | curl -s -X POST "${SUPABASE_URL}/rest/v1/quiz_questions" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Content-Type: application/json" \
  -d @- > /dev/null
{
  "module_id": "MODULE_ID",
  "question": "What are the five components of Emotional Intelligence?",
  "type": "single_choice",
  "options": ["Self-awareness, Self-regulation, Motivation, Empathy, Social skills", "Intelligence, Creativity, Logic, Emotion, Reasoning", "Planning, Organizing, Leading, Controlling, Evaluating", "Vision, Mission, Values, Goals, Objectives"],
  "correct_answer": "Self-awareness, Self-regulation, Motivation, Empathy, Social skills",
  "points": 2,
  "explanation": "Daniel Goleman identified these five components as essential for emotional intelligence."
}
EOF

echo "  ✅ Question 4"

# Question 5
cat <<EOF | sed "s/MODULE_ID/${MODULE_ID}/g" | curl -s -X POST "${SUPABASE_URL}/rest/v1/quiz_questions" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Content-Type: application/json" \
  -d @- > /dev/null
{
  "module_id": "MODULE_ID",
  "question": "What was key to Thabo's success?",
  "type": "single_choice",
  "options": ["Strict rules", "Building trust and leading by example", "Cutting costs", "Hiring consultants"],
  "correct_answer": "Building trust and leading by example",
  "points": 2,
  "explanation": "Thabo succeeded by building trust through authentic engagement."
}
EOF

echo "  ✅ Question 5"
echo ""

# Verify
echo "🔍 Verifying..."
VERIFY=$(curl -s "${SUPABASE_URL}/rest/v1/quiz_questions?module_id=eq.${MODULE_ID}&select=id" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}")

COUNT=$(echo "$VERIFY" | python3 -c "import sys, json; print(len(json.load(sys.stdin)))")

echo ""
echo "════════════════════════════════════════"
echo "✅ IMPORT COMPLETE!"
echo "════════════════════════════════════════"
echo "Course: $COURSE_ID"
echo "Module: $MODULE_ID"
echo "Questions: $COUNT/5"
echo ""
echo "🌐 View at: https://vonwillingh-online-lms.pages.dev/courses"
echo ""
