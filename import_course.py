#!/usr/bin/env python3
"""
Complete Course Import Script
Imports course, module, and quiz questions to Supabase
"""

import requests
import json
import sys

# Supabase configuration
# Using the correct URL from the conversation history
SUPABASE_URL = "https://dgcobxtkzewzkrzpfcdr.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhcWF1dmlrYW96ZnB1cmtuZ2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NTg1NjksImV4cCI6MjA4NTUzNDU2OX0.Lte-s41-oBz8GsjQISJ_RgG9ZDE2couNVVP6b12aJl8"

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

def print_step(step, message):
    """Print formatted step message"""
    print(f"\n{'='*60}")
    print(f"  STEP {step}: {message}")
    print(f"{'='*60}\n")

def get_or_create_course():
    """Get existing course or create new one"""
    print_step(1, "GETTING OR CREATING COURSE")
    
    # Check if course exists
    response = requests.get(
        f"{SUPABASE_URL}/rest/v1/courses?code=eq.TESTLEAD001&select=id",
        headers=HEADERS
    )
    
    if response.status_code == 200 and response.json():
        course_id = response.json()[0]['id']
        print(f"✅ Found existing course: {course_id}")
        
        # Clean existing modules
        print("  🧹 Cleaning existing modules...")
        requests.delete(
            f"{SUPABASE_URL}/rest/v1/modules?course_id=eq.{course_id}",
            headers=HEADERS
        )
        print("  ✅ Cleaned")
        
        return course_id
    
    # Create new course
    print("  📝 Creating new course...")
    course_data = {
        "name": "Test: Business Leadership Fundamentals",
        "code": "TESTLEAD001",
        "level": "Certificate",
        "category": "Leadership",
        "description": "A simple test course to verify the JSON structure for professional leadership content.",
        "duration": "2 weeks",
        "price": 0
    }
    
    response = requests.post(
        f"{SUPABASE_URL}/rest/v1/courses",
        headers=HEADERS,
        json=course_data
    )
    
    if response.status_code in [200, 201]:
        course_id = response.json()[0]['id']
        print(f"✅ Created course: {course_id}")
        return course_id
    else:
        print(f"❌ Failed to create course: {response.text}")
        sys.exit(1)

def create_module(course_id):
    """Create module with content"""
    print_step(2, "CREATING MODULE")
    
    module_content = """<div style='font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px;'>
<div style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px;'>
<h1 style='margin: 0; font-size: 2.5em;'>Module 1: Introduction to Leadership Principles</h1>
<p style='margin: 10px 0 0 0; font-size: 1.2em; opacity: 0.9;'>Building the foundation for effective leadership</p>
</div>

<div style='background: #e8f5e9; border-left: 5px solid #4caf50; padding: 20px; margin-bottom: 30px; border-radius: 5px;'>
<h3 style='margin-top: 0; color: #2e7d32;'>🎯 Learning Objectives</h3>
<ul style='line-height: 1.8;'>
<li>Understand core leadership theories</li>
<li>Identify different leadership styles</li>
<li>Develop effective communication skills</li>
<li>Apply leadership principles in business</li>
<li>Build trust and credibility as a leader</li>
</ul>
</div>

<h2 style='color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;'>1. What is Leadership?</h2>
<p style='line-height: 1.8; font-size: 1.1em;'>Leadership is the art of motivating a group of people to act toward achieving a common goal. Unlike management which focuses on maintaining systems, leadership is about inspiring change and innovation.</p>

<h2 style='color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;'>2. Leadership Styles</h2>
<ul style='line-height: 1.8;'>
<li><strong>Democratic Leadership:</strong> Involves team members in decision-making</li>
<li><strong>Autocratic Leadership:</strong> Leader makes decisions independently</li>
<li><strong>Transformational:</strong> Inspires through shared vision</li>
<li><strong>Servant Leadership:</strong> Focuses on serving the team</li>
</ul>

<h2 style='color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;'>3. Emotional Intelligence</h2>
<p style='line-height: 1.8;'>Daniel Goleman identified five key components:</p>
<ol style='line-height: 1.8;'>
<li><strong>Self-awareness:</strong> Understanding your emotions</li>
<li><strong>Self-regulation:</strong> Managing emotions effectively</li>
<li><strong>Motivation:</strong> Internal drive to achieve</li>
<li><strong>Empathy:</strong> Understanding others' emotions</li>
<li><strong>Social skills:</strong> Building relationships</li>
</ol>

<div style='background: #fff3e0; border-left: 5px solid #ff9800; padding: 20px; margin: 20px 0; border-radius: 5px;'>
<h4 style='margin-top: 0; color: #e65100;'>💡 Ubuntu Philosophy</h4>
<p style='line-height: 1.8;'>Ubuntu emphasizes 'I am because we are' - focusing on collective success and community building. This is particularly relevant in South African business contexts.</p>
</div>

<h2 style='color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;'>4. Case Study: Thabo's Success</h2>
<p style='line-height: 1.8;'>Thabo, a manufacturing business owner, succeeded by spending time understanding his employees' concerns, involving them in decisions, and demonstrating commitment by working alongside them during challenging times.</p>

<div style='background: #e3f2fd; border-left: 5px solid #2196f3; padding: 20px; margin: 20px 0; border-radius: 5px;'>
<h3 style='margin-top: 0; color: #1565c0;'>✨ Key Takeaways</h3>
<ul style='line-height: 1.8;'>
<li>Leadership inspires change while management maintains stability</li>
<li>Different situations require different leadership styles</li>
<li>Emotional intelligence is crucial for effective leadership</li>
<li>Ubuntu philosophy emphasizes collective success</li>
<li>Trust and authenticity are foundations of great leadership</li>
</ul>
</div>
</div>"""
    
    module_data = {
        "course_id": course_id,
        "title": "Module 1: Introduction to Leadership Principles",
        "description": "Explore fundamental leadership concepts including leadership styles, team dynamics, and effective communication strategies for South African business contexts.",
        "order_number": 1,
        "content": module_content,
        "content_type": "lesson",
        "video_url": "",
        "duration_minutes": 45
    }
    
    response = requests.post(
        f"{SUPABASE_URL}/rest/v1/modules",
        headers=HEADERS,
        json=module_data
    )
    
    if response.status_code in [200, 201]:
        module_id = response.json()[0]['id']
        print(f"✅ Created module: {module_id}")
        return module_id
    else:
        print(f"❌ Failed to create module: {response.text}")
        sys.exit(1)

def create_quiz_questions(module_id):
    """Create quiz questions for the module"""
    print_step(3, "CREATING QUIZ QUESTIONS")
    
    questions = [
        {
            "question": "What is the key difference between leadership and management?",
            "type": "single_choice",
            "options": [
                "Leadership focuses on inspiring change while management maintains stability",
                "Leadership is easier than management",
                "Management requires more education than leadership",
                "Leadership is only for executives while management is for everyone"
            ],
            "correct_answer": "Leadership focuses on inspiring change while management maintains stability",
            "points": 2,
            "explanation": "Leadership is about setting vision and inspiring people toward goals, while management focuses on implementing processes and maintaining systems. Both are important and complementary."
        },
        {
            "question": "Which leadership style involves team members in decision-making and encourages participation?",
            "type": "single_choice",
            "options": [
                "Autocratic Leadership",
                "Democratic Leadership",
                "Laissez-faire Leadership",
                "Transactional Leadership"
            ],
            "correct_answer": "Democratic Leadership",
            "points": 2,
            "explanation": "Democratic leadership, also called participative leadership, involves team members in the decision-making process, fostering engagement and shared ownership of outcomes."
        },
        {
            "question": "In the context of South African business, Ubuntu philosophy emphasizes individual achievement over team success.",
            "type": "true_false",
            "options": ["True", "False"],
            "correct_answer": "False",
            "points": 2,
            "explanation": "Ubuntu philosophy emphasizes 'I am because we are' - focusing on collective success, community building, and interconnectedness rather than individual achievement."
        },
        {
            "question": "What are the five components of Emotional Intelligence (EQ)?",
            "type": "single_choice",
            "options": [
                "Self-awareness, Self-regulation, Motivation, Empathy, Social skills",
                "Intelligence, Creativity, Logic, Emotion, Reasoning",
                "Planning, Organizing, Leading, Controlling, Evaluating",
                "Vision, Mission, Values, Goals, Objectives"
            ],
            "correct_answer": "Self-awareness, Self-regulation, Motivation, Empathy, Social skills",
            "points": 2,
            "explanation": "Daniel Goleman identified these five components as essential for emotional intelligence: understanding yourself, managing your emotions, staying motivated, understanding others, and building relationships."
        },
        {
            "question": "According to the module, what was the key factor in Thabo's success in turning around his manufacturing business?",
            "type": "single_choice",
            "options": [
                "Implementing strict rules and discipline",
                "Building trust through authentic engagement and leading by example",
                "Cutting costs and reducing staff",
                "Hiring external consultants to make changes"
            ],
            "correct_answer": "Building trust through authentic engagement and leading by example",
            "points": 2,
            "explanation": "Thabo succeeded by spending time understanding his employees' concerns, involving them in decisions, and demonstrating commitment by working alongside them during challenging times. This built trust and engagement."
        }
    ]
    
    created_count = 0
    for i, q in enumerate(questions, 1):
        q['module_id'] = module_id
        response = requests.post(
            f"{SUPABASE_URL}/rest/v1/quiz_questions",
            headers=HEADERS,
            json=q
        )
        
        if response.status_code in [200, 201]:
            print(f"  ✅ Question {i}/5 created")
            created_count += 1
        else:
            print(f"  ❌ Question {i}/5 failed: {response.text}")
    
    print(f"\n✅ Created {created_count}/5 questions")
    return created_count

def verify_import(module_id):
    """Verify the import was successful"""
    print_step(4, "VERIFYING IMPORT")
    
    response = requests.get(
        f"{SUPABASE_URL}/rest/v1/quiz_questions?module_id=eq.{module_id}&select=id",
        headers=HEADERS
    )
    
    if response.status_code == 200:
        count = len(response.json())
        print(f"✅ Verified: {count} quiz questions found")
        return count
    else:
        print(f"❌ Verification failed: {response.text}")
        return 0

def main():
    """Main import function"""
    print("\n" + "="*60)
    print("  🚀 COMPLETE COURSE IMPORT TOOL")
    print("="*60)
    
    try:
        # Step 1: Get or create course
        course_id = get_or_create_course()
        
        # Step 2: Create module
        module_id = create_module(course_id)
        
        # Step 3: Create quiz questions
        question_count = create_quiz_questions(module_id)
        
        # Step 4: Verify
        verified_count = verify_import(module_id)
        
        # Final summary
        print("\n" + "="*60)
        print("  ✅ IMPORT COMPLETED SUCCESSFULLY!")
        print("="*60)
        print(f"\n📊 Summary:")
        print(f"  • Course ID: {course_id}")
        print(f"  • Module ID: {module_id}")
        print(f"  • Questions: {verified_count}/5")
        print(f"\n🌐 View your course at:")
        print(f"  https://vonwillingh-online-lms.pages.dev/courses")
        print()
        
        if verified_count == 5:
            print("✅ All checks passed! Course is ready to use.")
        else:
            print(f"⚠️  Warning: Expected 5 questions but found {verified_count}")
        
        return 0
        
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
