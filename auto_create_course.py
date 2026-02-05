#!/usr/bin/env python3
"""
AUTO COURSE CREATOR FOR VONWILLINGH LMS

This script creates courses directly in your LMS database.
No downloads, no uploads, no manual imports!

Usage: python3 auto_create_course.py
"""

import json
import requests

# API Configuration
API_URL = "https://vonwillingh-online-lms.pages.dev/api/courses/external-import"
API_KEY = "vonwillingh-lms-import-key-2026"

# Course data (you can modify or generate with AI)
course_data = {
    "course": {
        "name": "Digital Marketing for South African Small Businesses",
        "code": "DIGIMKT001",
        "level": "Certificate",
        "description": "Master digital marketing strategies tailored for South African small businesses. Learn Facebook, Instagram, Google My Business, and more!",
        "duration": "4 weeks",
        "price": 1500,
        "category": "Digital Marketing"
    },
    "modules": [
        {
            "title": "Module 1: Digital Marketing Fundamentals",
            "description": "Build your marketing foundation",
            "order_number": 1,
            "content": "<h2>Welcome!</h2><p>Digital marketing content here...</p>",
            "resources": [
                "Facebook Business: https://business.facebook.com",
                "Google My Business: https://www.google.com/business/"
            ],
            "quiz": {
                "passing_score": 70,
                "max_attempts": 3,
                "questions": [
                    {
                        "question": "What is digital marketing?",
                        "options": [
                            "Promoting online only",
                            "Using digital channels to reach customers",
                            "Building websites",
                            "Social media only"
                        ],
                        "correct_answer": "Using digital channels to reach customers"
                    }
                ]
            }
        }
    ]
}


def create_course():
    """Create course in VonWillingh LMS via API"""
    
    print("🚀 Creating course in VonWillingh LMS...")
    print(f"📝 Course: {course_data['course']['name']}")
    print(f"📚 Modules: {len(course_data['modules'])}")
    print("")
    
    try:
        # Make API request
        response = requests.post(
            API_URL,
            headers={
                "Content-Type": "application/json",
                "X-API-Key": API_KEY
            },
            json=course_data
        )
        
        result = response.json()
        
        if result.get('success'):
            print("✅ SUCCESS!")
            print("━" * 50)
            print(f"📦 Course ID: {result['data']['course_id']}")
            print(f"📝 Course Name: {result['data']['course_name']}")
            print(f"📚 Modules: {result['data']['modules_count']}")
            print(f"💰 Price: R{result['data']['price']}")
            print(f"🔗 View at: {result['data']['course_url']}")
            print("━" * 50)
            
        else:
            print(f"❌ ERROR: {result.get('message')}")
            if result.get('error'):
                print(f"Error code: {result['error']}")
                
    except requests.exceptions.RequestException as e:
        print(f"❌ FAILED: {e}")
    except Exception as e:
        print(f"❌ ERROR: {e}")


def create_from_json_file(filename):
    """Load course data from JSON file and create"""
    
    print(f"📄 Loading course from {filename}...")
    
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            course_data = json.load(f)
        
        print("✅ JSON loaded successfully")
        print("")
        
        # Update global course_data
        globals()['course_data'] = course_data
        
        # Create the course
        create_course()
        
    except FileNotFoundError:
        print(f"❌ File not found: {filename}")
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON: {e}")
    except Exception as e:
        print(f"❌ ERROR: {e}")


# Example usage with multiple courses
def create_multiple_courses(course_list):
    """Create multiple courses at once"""
    
    print(f"🚀 Creating {len(course_list)} courses...")
    print("")
    
    success_count = 0
    failed_count = 0
    
    for i, course in enumerate(course_list, 1):
        print(f"[{i}/{len(course_list)}] Creating: {course['course']['name']}")
        
        try:
            response = requests.post(
                API_URL,
                headers={
                    "Content-Type": "application/json",
                    "X-API-Key": API_KEY
                },
                json=course
            )
            
            result = response.json()
            
            if result.get('success'):
                print(f"  ✅ Created! ID: {result['data']['course_id']}")
                success_count += 1
            else:
                print(f"  ❌ Failed: {result.get('message')}")
                failed_count += 1
                
        except Exception as e:
            print(f"  ❌ Error: {e}")
            failed_count += 1
        
        print("")
    
    print("━" * 50)
    print(f"✅ Success: {success_count}")
    print(f"❌ Failed: {failed_count}")
    print("━" * 50)


if __name__ == "__main__":
    # Option 1: Create single course from code
    create_course()
    
    # Option 2: Create from JSON file (uncomment to use)
    # create_from_json_file("AUTO_GENERATED_COURSE.json")
    
    # Option 3: Create multiple courses (uncomment to use)
    # courses = [course_data, course_data_2, course_data_3]
    # create_multiple_courses(courses)
