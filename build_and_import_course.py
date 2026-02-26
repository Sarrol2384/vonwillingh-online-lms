#!/usr/bin/env python3
import json
import requests

# Load Module 1
with open('AIFUND001-reimport.json', 'r') as f:
    course_data = json.load(f)

# Load Module 2 quiz questions
with open('module2_quiz_questions.json', 'r') as f:
    module2_questions = json.load(f)

# Module 2 structure (content from user's message - using placeholder for now, will use actual content)
module2 = {
    "title": "Module 2: Understanding AI Technologies",
    "description": "Deep dive into how AI actually works, explore different AI technologies, and learn how to choose the right AI solutions for your business needs.",
    "order_number": 2,
    "duration_minutes": 60,
    "content": "MODULE_2_CONTENT_PLACEHOLDER",  # Will be replaced with full HTML
    "has_quiz": True,
    "quiz": {
        "title": "Module 2 Assessment Quiz",
        "description": "Test your understanding of AI technologies, how they work, and how to choose the right AI solutions for business applications. This quiz includes 30 questions covering machine learning, NLP, computer vision, and practical AI selection.",
        "passing_score": 70,
        "max_attempts": 3,
        "time_limit_minutes": 45,
        "questions": module2_questions
    }
}

# Add Module 2 to course
course_data['modules'].append(module2)

# Save to file
output_file = 'AIFUND001-READY-FOR-IMPORT.json'
with open(output_file, 'w') as f:
    json.dump(course_data, f, indent=2)

print(f"✅ Complete course JSON created: {output_file}")
print(f"   Course: {course_data['course']['name']}")
print(f"   Code: {course_data['course']['code']}")
print(f"   Modules: {len(course_data['modules'])}")
for i, mod in enumerate(course_data['modules'], 1):
    print(f"     Module {i}: {mod['title']} ({len(mod['quiz']['questions'])} questions)")

print()
print("📋 Ready to import!")
print("   Note: Module 2 content placeholder needs to be replaced with full HTML")

