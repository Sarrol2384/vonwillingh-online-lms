#!/bin/bash

# ============================================
# VonWillingh LMS - API Import Test Script
# ============================================
# This script tests the external course import API

API_URL="https://vonwillingh-online-lms.pages.dev/api/courses/external-import"
API_KEY="vonwillingh-lms-import-key-2026"

echo "🚀 Testing VonWillingh LMS External Import API"
echo "================================================"
echo ""
echo "📡 API Endpoint: $API_URL"
echo "🔑 API Key: $API_KEY"
echo ""

# Test 1: Simple course with 1 module (no quiz)
echo "Test 1: Creating a simple course..."
echo "-----------------------------------"

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{
    "course": {
      "name": "API Test Course",
      "code": "APITEST001",
      "level": "Certificate",
      "category": "Test Category",
      "description": "This is a test course created via API",
      "duration": "1 week",
      "price": 0
    },
    "modules": [
      {
        "title": "Introduction to API Testing",
        "description": "Learn how to test APIs",
        "order_number": 1,
        "content": "<h2>Welcome to API Testing</h2><p>This module was created via the external import API.</p><h3>What You Will Learn:</h3><ul><li>How to use the API</li><li>How to authenticate</li><li>How to handle responses</li></ul>"
      }
    ]
  }')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "HTTP Status: $HTTP_CODE"
echo "Response:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

if [ "$HTTP_CODE" -eq 200 ]; then
  echo "✅ Test 1 PASSED"
else
  echo "❌ Test 1 FAILED"
fi

echo ""
echo "================================================"
echo ""

# Test 2: Course with quiz
echo "Test 2: Creating a course with a quiz..."
echo "-----------------------------------"

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{
    "course": {
      "name": "API Quiz Test Course",
      "code": "APIQUIZ001",
      "level": "Certificate",
      "category": "Test Category",
      "description": "A test course with quiz",
      "duration": "1 week",
      "price": 0
    },
    "modules": [
      {
        "title": "Module with Quiz",
        "description": "Test quiz functionality",
        "order_number": 1,
        "content": "<h2>API Testing Basics</h2><p>Complete the quiz below to test your knowledge.</p>",
        "quiz": {
          "passing_score": 70,
          "max_attempts": 3,
          "questions": [
            {
              "question": "What HTTP method is used to create a resource?",
              "options": ["GET", "POST", "PUT", "DELETE"],
              "correct_answer": "POST"
            },
            {
              "question": "What status code indicates success?",
              "options": ["404", "500", "200", "401"],
              "correct_answer": "200"
            }
          ]
        }
      }
    ]
  }')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "HTTP Status: $HTTP_CODE"
echo "Response:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

if [ "$HTTP_CODE" -eq 200 ]; then
  echo "✅ Test 2 PASSED"
else
  echo "❌ Test 2 FAILED"
fi

echo ""
echo "================================================"
echo ""

# Test 3: Invalid API Key
echo "Test 3: Testing invalid API key (should fail)..."
echo "-----------------------------------"

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: invalid-key-12345" \
  -d '{
    "course": {
      "name": "Should Fail",
      "code": "FAIL001",
      "level": "Certificate",
      "description": "Should not be created",
      "duration": "1 week",
      "price": 0
    },
    "modules": [
      {
        "title": "Module 1",
        "description": "Test",
        "order_number": 1,
        "content": "<p>Test</p>"
      }
    ]
  }')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "HTTP Status: $HTTP_CODE"
echo "Response:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

if [ "$HTTP_CODE" -eq 401 ]; then
  echo "✅ Test 3 PASSED (correctly rejected invalid API key)"
else
  echo "❌ Test 3 FAILED (should have returned 401)"
fi

echo ""
echo "================================================"
echo ""

# Test 4: Duplicate course code (should fail)
echo "Test 4: Testing duplicate course code (should fail)..."
echo "-----------------------------------"

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{
    "course": {
      "name": "Duplicate Course",
      "code": "APITEST001",
      "level": "Certificate",
      "description": "This should fail due to duplicate code",
      "duration": "1 week",
      "price": 0
    },
    "modules": [
      {
        "title": "Module 1",
        "description": "Test",
        "order_number": 1,
        "content": "<p>Test</p>"
      }
    ]
  }')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "HTTP Status: $HTTP_CODE"
echo "Response:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

if [ "$HTTP_CODE" -eq 409 ]; then
  echo "✅ Test 4 PASSED (correctly detected duplicate)"
else
  echo "❌ Test 4 FAILED (should have returned 409)"
fi

echo ""
echo "================================================"
echo ""
echo "🎉 Testing Complete!"
echo ""
echo "Summary:"
echo "- Test 1 (Simple Course): Check above"
echo "- Test 2 (Course with Quiz): Check above"
echo "- Test 3 (Invalid API Key): Check above"
echo "- Test 4 (Duplicate Code): Check above"
echo ""
echo "📊 View created courses at:"
echo "   https://vonwillingh-online-lms.pages.dev/courses"
echo ""
