#!/usr/bin/env python3
"""
Direct course import to Supabase using REST API
This bypasses all browser/CORS issues
"""

import json
import requests
import sys

# Supabase configuration
SUPABASE_URL = "https://laqauvikkazfpurknfkf.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhcWF1dmlrYW96ZnB1cmtuZ2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NTg1NjksImV4cCI6MjA4NTUzNDU2OX0.Lte-s41-oBz8GsjQISJ_RgG9ZDE2couNVVP6b12aJl8"

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

def log(msg):
    print(msg)
    sys.stdout.flush()

def import_course(json_file):
    log("🚀 Starting import...")
    
    # Load JSON
    with open(json_file, 'r') as f:
        data = json.load(f)
    
    course_data = data['course']
    modules_data = data['modules']
    
    log(f"📚 Course: {course_data['name']}")
    log(f"📄 Modules: {len(modules_data)}")
    
    # Check existing course
    log("\n🔍 Checking for existing course...")
    response = requests.get(
        f"{SUPABASE_URL}/rest/v1/courses",
        params={"code": f"eq.{course_data['code']}", "select": "id"},
        headers=headers
    )
    
    existing_courses = response.json()
    
    if existing_courses:
        course_id = existing_courses[0]['id']
        log(f"⚠️  Course exists: {course_id}")
        
        # Delete old modules
        log("Deleting old modules...")
        modules_resp = requests.get(
            f"{SUPABASE_URL}/rest/v1/modules",
            params={"course_id": f"eq.{course_id}", "select": "id"},
            headers=headers
        )
        old_modules = modules_resp.json()
        
        if old_modules:
            module_ids = [m['id'] for m in old_modules]
            
            # Delete quiz questions
            for mid in module_ids:
                requests.delete(
                    f"{SUPABASE_URL}/rest/v1/quiz_questions",
                    params={"module_id": f"eq.{mid}"},
                    headers=headers
                )
            
            # Delete modules
            requests.delete(
                f"{SUPABASE_URL}/rest/v1/modules",
                params={"course_id": f"eq.{course_id}"},
                headers=headers
            )
            log("✅ Old data deleted")
        
        # Update course
        requests.patch(
            f"{SUPABASE_URL}/rest/v1/courses",
            params={"id": f"eq.{course_id}"},
            headers=headers,
            json={
                "name": course_data['name'],
                "level": course_data['level'],
                "category": course_data['category'],
                "description": course_data['description'],
                "duration": course_data['duration'],
                "price": course_data.get('price', 0)
            }
        )
        log("✅ Course updated")
    else:
        log("📝 Creating new course...")
        response = requests.post(
            f"{SUPABASE_URL}/rest/v1/courses",
            headers=headers,
            json={
                "name": course_data['name'],
                "code": course_data['code'],
                "level": course_data['level'],
                "category": course_data['category'],
                "description": course_data['description'],
                "duration": course_data['duration'],
                "price": course_data.get('price', 0)
            }
        )
        
        new_course = response.json()[0]
        course_id = new_course['id']
        log(f"✅ Course created: {course_id}")
    
    # Import modules
    log(f"\n📚 Importing {len(modules_data)} modules...")
    for idx, module in enumerate(modules_data, 1):
        log(f"\n[{idx}/{len(modules_data)}] {module['title']}")
        
        # Create module
        module_response = requests.post(
            f"{SUPABASE_URL}/rest/v1/modules",
            headers=headers,
            json={
                "course_id": course_id,
                "title": module['title'],
                "description": module.get('description', ''),
                "order_number": module['order_number'],
                "content": module.get('content', ''),
                "content_type": module.get('content_type', 'lesson'),
                "duration_minutes": module.get('duration_minutes'),
                "video_url": module.get('video_url')
            }
        )
        
        new_module = module_response.json()[0]
        module_id = new_module['id']
        log(f"  ✅ Module created")
        
        # Import quiz questions
        if 'quiz' in module and 'questions' in module['quiz']:
            questions = module['quiz']['questions']
            log(f"  🎯 Importing {len(questions)} quiz questions...")
            
            quiz_data = []
            for q in questions:
                quiz_data.append({
                    "module_id": module_id,
                    "question_text": q['question'],
                    "question_type": "true_false" if q['type'] == 'true_false' else 'single_choice',
                    "options": q['options'],
                    "correct_answer": q['correct_answer'],
                    "points": 2,
                    "order_number": q['id'],
                    "hint_feedback": "Think carefully about this question",
                    "correct_feedback": "Correct!",
                    "detailed_explanation": q.get('explanation', '')
                })
            
            requests.post(
                f"{SUPABASE_URL}/rest/v1/quiz_questions",
                headers=headers,
                json=quiz_data
            )
            log(f"  ✅ {len(quiz_data)} questions imported")
    
    log("\n🎉 IMPORT COMPLETE!")
    log(f"\n✅ Course: {course_data['name']} ({course_data['code']})")
    log(f"✅ Modules: {len(modules_data)}")
    log(f"\n🌐 View at: https://vonwillingh-online-lms.pages.dev/courses")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 import_to_supabase.py <json_file>")
        sys.exit(1)
    
    import_course(sys.argv[1])
