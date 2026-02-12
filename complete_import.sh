#!/bin/bash

# Complete Course Import Script - Imports Course, Module, and Quiz Questions
# Uses Supabase REST API directly

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Supabase credentials
SUPABASE_URL="https://laqauvikkazfpurknfkf.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhcWF1dmlrYW96ZnB1cmtuZ2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NTg1NjksImV4cCI6MjA4NTUzNDU2OX0.Lte-s41-oBz8GsjQISJ_RgG9ZDE2couNVVP6b12aJl8"

echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    COMPLETE COURSE IMPORT - TEST MODULE${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}\n"

# Step 1: Check if course exists
echo -e "${YELLOW}📋 Step 1: Checking for existing course...${NC}"
COURSE_CHECK=$(curl -s -X GET \
  "${SUPABASE_URL}/rest/v1/courses?code=eq.TESTLEAD001&select=id" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}")

COURSE_ID=$(echo "$COURSE_CHECK" | grep -o '"id":"[^"]*"' | sed 's/"id":"//;s/"$//' | head -1)

if [ -z "$COURSE_ID" ]; then
  echo -e "${GREEN}✅ No existing course found. Creating new course...${NC}"
  
  # Create new course
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
  
  COURSE_ID=$(echo "$COURSE_RESPONSE" | grep -o '"id":"[^"]*"' | sed 's/"id":"//;s/"$//')
  echo -e "${GREEN}✅ Course created with ID: ${COURSE_ID}${NC}\n"
else
  echo -e "${YELLOW}⚠️  Course exists with ID: ${COURSE_ID}${NC}"
  echo -e "${YELLOW}🗑️  Deleting existing modules and quiz questions...${NC}"
  
  # Delete existing quiz questions
  curl -s -X DELETE \
    "${SUPABASE_URL}/rest/v1/quiz_questions?module_id=in.(select%20id%20from%20modules%20where%20course_id='${COURSE_ID}')" \
    -H "apikey: ${SUPABASE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_KEY}" > /dev/null
  
  # Delete existing modules
  curl -s -X DELETE \
    "${SUPABASE_URL}/rest/v1/modules?course_id=eq.${COURSE_ID}" \
    -H "apikey: ${SUPABASE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_KEY}" > /dev/null
  
  echo -e "${GREEN}✅ Cleaned up existing data${NC}\n"
fi

# Step 2: Insert Module
echo -e "${YELLOW}📚 Step 2: Inserting module...${NC}"

MODULE_CONTENT="<div style='font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px;'><div style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px;'><h1 style='margin: 0; font-size: 2.5em;'>Module 1: Introduction to Leadership Principles</h1><p style='margin: 10px 0 0 0; font-size: 1.2em; opacity: 0.9;'>Building the foundation for effective leadership in South African businesses</p></div><div style='background: #e8f5e9; border-left: 5px solid #4caf50; padding: 20px; margin-bottom: 30px; border-radius: 5px;'><h3 style='margin-top: 0; color: #2e7d32;'>🎯 Learning Objectives</h3><ul style='line-height: 1.8;'><li>Understand core leadership theories and their practical applications</li><li>Identify different leadership styles and when to use them</li><li>Develop effective communication skills for diverse teams</li><li>Apply leadership principles in South African business contexts</li><li>Build trust and credibility as an emerging leader</li></ul></div><h2 style='color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;'>1. What is Leadership?</h2><p style='line-height: 1.8; font-size: 1.1em;'>Leadership is the art of motivating a group of people to act toward achieving a common goal. In a business setting, this means directing workers and colleagues with a strategy to meet the company's needs. Unlike management, which focuses on maintaining systems and processes, leadership is about inspiring change and innovation.</p><div style='background: #fff3e0; border-left: 5px solid #ff9800; padding: 20px; margin: 20px 0; border-radius: 5px;'><h4 style='margin-top: 0; color: #e65100;'>💡 South African Context</h4><p style='line-height: 1.8;'>In South Africa's diverse workplace, effective leadership requires understanding Ubuntu philosophy.</p></div></div>"

# Create JSON payload for module (properly escaped)
MODULE_JSON=$(cat <<'EOF'
{
  "course_id": "COURSE_ID_PLACEHOLDER",
  "title": "Module 1: Introduction to Leadership Principles",
  "description": "Explore fundamental leadership concepts including leadership styles, team dynamics, and effective communication strategies for South African business contexts.",
  "order_number": 1,
  "content": "MODULE_CONTENT_PLACEHOLDER",
  "content_type": "lesson",
  "video_url": "",
  "duration_minutes": 45
}
EOF
)

# Replace placeholders
MODULE_JSON=$(echo "$MODULE_JSON" | sed "s/COURSE_ID_PLACEHOLDER/${COURSE_ID}/g")
MODULE_JSON=$(echo "$MODULE_JSON" | sed "s|MODULE_CONTENT_PLACEHOLDER|${MODULE_CONTENT}|g")

MODULE_RESPONSE=$(curl -s -X POST \
  "${SUPABASE_URL}/rest/v1/modules" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d "$MODULE_JSON")

MODULE_ID=$(echo "$MODULE_RESPONSE" | grep -o '"id":"[^"]*"' | sed 's/"id":"//;s/"$//')

if [ -z "$MODULE_ID" ]; then
  echo -e "${RED}❌ Failed to create module${NC}"
  echo "$MODULE_RESPONSE"
  exit 1
fi

echo -e "${GREEN}✅ Module created with ID: ${MODULE_ID}${NC}\n"

# Step 3: Insert Quiz Questions
echo -e "${YELLOW}🎯 Step 3: Inserting quiz questions...${NC}"

# Question 1
curl -s -X POST \
  "${SUPABASE_URL}/rest/v1/quiz_questions" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"module_id\": \"${MODULE_ID}\",
    \"question\": \"What is the key difference between leadership and management?\",
    \"type\": \"single_choice\",
    \"options\": [\"Leadership focuses on inspiring change while management maintains stability\", \"Leadership is easier than management\", \"Management requires more education than leadership\", \"Leadership is only for executives while management is for everyone\"],
    \"correct_answer\": \"Leadership focuses on inspiring change while management maintains stability\",
    \"points\": 2,
    \"hint\": \"Think about the fundamental purpose of each role.\",
    \"correct_feedback\": \"Excellent! Leadership inspires while management maintains.\",
    \"explanation\": \"Leadership is about setting vision and inspiring people toward goals, while management focuses on implementing processes and maintaining systems. Both are important and complementary.\"
  }" > /dev/null

echo -e "${GREEN}  ✅ Question 1 inserted${NC}"

# Question 2
curl -s -X POST \
  "${SUPABASE_URL}/rest/v1/quiz_questions" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"module_id\": \"${MODULE_ID}\",
    \"question\": \"Which leadership style involves team members in decision-making and encourages participation?\",
    \"type\": \"single_choice\",
    \"options\": [\"Autocratic Leadership\", \"Democratic Leadership\", \"Laissez-faire Leadership\", \"Transactional Leadership\"],
    \"correct_answer\": \"Democratic Leadership\",
    \"points\": 2,
    \"hint\": \"The name of this style relates to group participation.\",
    \"correct_feedback\": \"Perfect! Democratic leadership encourages participation.\",
    \"explanation\": \"Democratic leadership, also called participative leadership, involves team members in the decision-making process, fostering engagement and shared ownership of outcomes.\"
  }" > /dev/null

echo -e "${GREEN}  ✅ Question 2 inserted${NC}"

# Question 3
curl -s -X POST \
  "${SUPABASE_URL}/rest/v1/quiz_questions" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"module_id\": \"${MODULE_ID}\",
    \"question\": \"In the context of South African business, Ubuntu philosophy emphasizes individual achievement over team success.\",
    \"type\": \"true_false\",
    \"options\": [\"True\", \"False\"],
    \"correct_answer\": \"False\",
    \"points\": 2,
    \"hint\": \"Remember Ubuntu means 'I am because we are'.\",
    \"correct_feedback\": \"Correct! Ubuntu emphasizes collective success.\",
    \"explanation\": \"Ubuntu philosophy emphasizes 'I am because we are' - focusing on collective success, community building, and interconnectedness rather than individual achievement.\"
  }" > /dev/null

echo -e "${GREEN}  ✅ Question 3 inserted${NC}"

# Question 4
curl -s -X POST \
  "${SUPABASE_URL}/rest/v1/quiz_questions" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"module_id\": \"${MODULE_ID}\",
    \"question\": \"What are the five components of Emotional Intelligence (EQ)?\",
    \"type\": \"single_choice\",
    \"options\": [\"Self-awareness, Self-regulation, Motivation, Empathy, Social skills\", \"Intelligence, Creativity, Logic, Emotion, Reasoning\", \"Planning, Organizing, Leading, Controlling, Evaluating\", \"Vision, Mission, Values, Goals, Objectives\"],
    \"correct_answer\": \"Self-awareness, Self-regulation, Motivation, Empathy, Social skills\",
    \"points\": 2,
    \"hint\": \"Think about understanding and managing emotions.\",
    \"correct_feedback\": \"Excellent! These are Goleman's five EQ components.\",
    \"explanation\": \"Daniel Goleman identified these five components as essential for emotional intelligence: understanding yourself, managing your emotions, staying motivated, understanding others, and building relationships.\"
  }" > /dev/null

echo -e "${GREEN}  ✅ Question 4 inserted${NC}"

# Question 5
curl -s -X POST \
  "${SUPABASE_URL}/rest/v1/quiz_questions" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"module_id\": \"${MODULE_ID}\",
    \"question\": \"According to the module, what was the key factor in Thabo's success in turning around his manufacturing business?\",
    \"type\": \"single_choice\",
    \"options\": [\"Implementing strict rules and discipline\", \"Building trust through authentic engagement and leading by example\", \"Cutting costs and reducing staff\", \"Hiring external consultants to make changes\"],
    \"correct_answer\": \"Building trust through authentic engagement and leading by example\",
    \"points\": 2,
    \"hint\": \"Consider the human-centered approach.\",
    \"correct_feedback\": \"Correct! Trust and engagement were key.\",
    \"explanation\": \"Thabo succeeded by spending time understanding his employees' concerns, involving them in decisions, and demonstrating commitment by working alongside them during challenging times. This built trust and engagement.\"
  }" > /dev/null

echo -e "${GREEN}  ✅ Question 5 inserted${NC}\n"

# Step 4: Verify import
echo -e "${YELLOW}🔍 Step 4: Verifying import...${NC}"

VERIFY=$(curl -s -X GET \
  "${SUPABASE_URL}/rest/v1/quiz_questions?module_id=eq.${MODULE_ID}&select=count" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Prefer: count=exact")

QUESTION_COUNT=$(echo "$VERIFY" | grep -o 'count":[0-9]*' | grep -o '[0-9]*')

echo -e "${GREEN}✅ Verification complete:${NC}"
echo -e "   Course ID: ${COURSE_ID}"
echo -e "   Module ID: ${MODULE_ID}"
echo -e "   Questions: ${QUESTION_COUNT}/5"

if [ "$QUESTION_COUNT" = "5" ]; then
  echo -e "\n${GREEN}════════════════════════════════════════════════════════${NC}"
  echo -e "${GREEN}    ✅ IMPORT COMPLETED SUCCESSFULLY!${NC}"
  echo -e "${GREEN}════════════════════════════════════════════════════════${NC}\n"
  echo -e "${BLUE}🌐 View your course at:${NC}"
  echo -e "${BLUE}   https://vonwillingh-online-lms.pages.dev/courses${NC}\n"
else
  echo -e "\n${RED}⚠️  Warning: Expected 5 questions but found ${QUESTION_COUNT}${NC}\n"
fi
