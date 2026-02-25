import requests
import json

# Fetch detailed quiz data for each module
course_id = 35

# Get module 1 quiz
module_1_quiz_response = requests.get(f"https://vonwillingh-online-lms.pages.dev/api/admin/courses/{course_id}/modules/54d06f4f-20ee-417e-b743-aec902255e94/quiz")
module_1_data = module_1_quiz_response.json()

# Get module 2 quiz
module_2_quiz_response = requests.get(f"https://vonwillingh-online-lms.pages.dev/api/admin/courses/{course_id}/modules/fa5b7b39-d36b-4de4-a702-8239efa4d907/quiz")
module_2_data = module_2_quiz_response.json()

print("=" * 80)
print("📝 QUIZ VERIFICATION REPORT")
print("=" * 80)

for module_name, quiz_data in [("Module 1", module_1_data), ("Module 2", module_2_data)]:
    if quiz_data.get("success"):
        quiz = quiz_data.get("quiz", {})
        questions = quiz.get("questions", [])
        
        print(f"\n{'=' * 80}")
        print(f"✅ {module_name}: {quiz.get('title')}")
        print(f"{'=' * 80}")
        print(f"Total Questions: {len(questions)}")
        print(f"Passing Score: {quiz.get('passing_score')}%")
        print(f"Max Attempts: {quiz.get('max_attempts')}")
        print(f"Time Limit: {quiz.get('time_limit_minutes')} minutes\n")
        
        # Categorize by question type
        types = {}
        for q in questions:
            qtype = q.get("question_type", "unknown")
            types[qtype] = types.get(qtype, 0) + 1
        
        print("Question Breakdown:")
        for qtype, count in sorted(types.items()):
            print(f"  • {qtype}: {count}")
        
        # Show sample questions
        if questions:
            print(f"\n📋 Sample Questions:")
            
            # Q1 (multiple_choice)
            q1 = questions[0] if len(questions) > 0 else None
            if q1:
                print(f"\n  Q1 (Order {q1.get('order_number')}): {q1.get('question_text')[:80]}...")
                print(f"     Type: {q1.get('question_type')} | Points: {q1.get('points')}")
                print(f"     Correct Answer: {q1.get('correct_answer', q1.get('correct_answers'))}")
            
            # Q16 (true_false)
            q16 = [q for q in questions if q.get('order_number') == 16]
            if q16:
                q16 = q16[0]
                print(f"\n  Q16 (Order {q16.get('order_number')}): {q16.get('question_text')[:80]}...")
                print(f"     Type: {q16.get('question_type')} | Points: {q16.get('points')}")
                print(f"     Correct Answer: {q16.get('correct_answer', q16.get('correct_answers'))}")
            
            # Q24 (multiple_select)
            q24 = [q for q in questions if q.get('order_number') == 24]
            if q24:
                q24 = q24[0]
                print(f"\n  Q24 (Order {q24.get('order_number')}): {q24.get('question_text')[:80]}...")
                print(f"     Type: {q24.get('question_type')} | Points: {q24.get('points')}")
                print(f"     Correct Answers: {q24.get('correct_answers')}")
    else:
        print(f"\n❌ {module_name}: Failed to retrieve quiz data")
        print(f"   Error: {quiz_data.get('message', 'Unknown error')}")

print(f"\n{'=' * 80}")
print("✅ VERIFICATION COMPLETE")
print("=" * 80)
