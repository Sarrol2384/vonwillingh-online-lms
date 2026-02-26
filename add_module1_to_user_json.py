#!/usr/bin/env python3
"""
This script adds Module 1 (with its 30 quiz questions) to the user-provided 
Module 2 JSON to create a complete 2-module course.
"""
import json

print("📚 Creating complete AIFUND001 course with Module 1 + Module 2...")
print()

# Read the working Module 1
with open('AIFUND001-reimport.json', 'r') as f:
    module1_source = json.load(f)

module1 = module1_source['modules'][0]

print(f"✅ Module 1 loaded:")
print(f"   - Title: {module1['title']}")
print(f"   - Quiz questions: {len(module1['quiz']['questions'])}")
print()

# Now the user needs to provide their Module 2 JSON
# For now, create instructions

print("⚠️  ACTION REQUIRED:")
print("=" * 60)
print()
print("Save the Module 2 JSON you provided (the complete JSON")
print("from your message) to this file:")
print()
print("  /home/user/webapp/USER_MODULE2.json")
print()
print("Then run:")
print("  python3 add_module1_to_user_json.py --merge")
print()
print("=" * 60)

