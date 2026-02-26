import json

# Load the JSON file that was imported
with open('AIFUND001-READY-FOR-IMPORT.json', 'r') as f:
    data = json.load(f)

course = data['course']
modules = course['modules']

print("=" * 100)
print("📝 IMPORTED JSON VERIFICATION")
print("=" * 100)

print(f"\n✅ Course: {course['name']} (Code: {course['code']})")
print(f"   Price: {course['price']} {course['currency']} | Level: {course['level']} | Duration: {course['duration']}")
print(f"   Total Modules: {len(modules)}\n")

for module in modules:
    print(f"{'=' * 100}")
    print(f"📚 {module['title']}")
    print(f"{'=' * 100}")
    print(f"Order: {module['order']} | Duration: {module['duration_minutes']} minutes")
    print(f"Has Quiz: {module['has_quiz']}")
    
    if module.get('quiz'):
        quiz = module['quiz']
        questions = quiz.get('questions', [])
        
        print(f"\n🎯 Quiz: {quiz['title']}")
        print(f"   Description: {quiz['description'][:100]}...")
        print(f"   Passing Score: {quiz['passing_score']}%")
        print(f"   Max Attempts: {quiz['max_attempts']}")
        print(f"   Time Limit: {quiz['time_limit_minutes']} minutes")
        print(f"   Total Questions: {len(questions)}")
        
        # Count question types
        types = {}
        for q in questions:
            qtype = q.get('question_type', 'unknown')
            types[qtype] = types.get(qtype, 0) + 1
        
        print(f"\n   Question Breakdown:")
        for qtype, count in sorted(types.items()):
            print(f"      • {qtype}: {count}")
        
        # Show sample questions
        if questions:
            print(f"\n   📋 Sample Questions:")
            
            # Q1
            q1 = questions[0] if len(questions) > 0 else None
            if q1:
                print(f"\n      Q{q1.get('order_number')}: {q1.get('question_text')[:70]}...")
                print(f"         Type: {q1.get('question_type')} | Points: {q1.get('points')}")
                if q1.get('question_type') in ['multiple_choice', 'true_false']:
                    print(f"         Correct: {q1.get('correct_answer')}")
                else:
                    print(f"         Correct: {q1.get('correct_answers')}")
            
            # Q16
            q16 = [q for q in questions if q.get('order_number') == 16]
            if q16:
                q16 = q16[0]
                print(f"\n      Q{q16.get('order_number')}: {q16.get('question_text')[:70]}...")
                print(f"         Type: {q16.get('question_type')} | Points: {q16.get('points')}")
                if q16.get('question_type') in ['multiple_choice', 'true_false']:
                    print(f"         Correct: {q16.get('correct_answer')}")
                else:
                    print(f"         Correct: {q16.get('correct_answers')}")
            
            # Q24
            q24 = [q for q in questions if q.get('order_number') == 24]
            if q24:
                q24 = q24[0]
                print(f"\n      Q{q24.get('order_number')}: {q24.get('question_text')[:70]}...")
                print(f"         Type: {q24.get('question_type')} | Points: {q24.get('points')}")
                if q24.get('question_type') in ['multiple_choice', 'true_false']:
                    print(f"         Correct: {q24.get('correct_answer')}")
                else:
                    print(f"         Correct: {q24.get('correct_answers')}")
    print()

print("=" * 100)
print("✅ VERIFICATION COMPLETE - This is what was sent to the API")
print("=" * 100)
