import json

# Read the working Module 1
with open('AIFUND001-reimport.json', 'r') as f:
    module1_course = json.load(f)

# Module 2 content from user message will be added via Python
# This is a massive JSON so I'll write it programmatically

print("Creating complete AIFUND001 course with Module 1 + Module 2...")
print(f"Module 1 has {len(module1_course['modules'][0]['quiz']['questions'])} quiz questions")
print("Now please provide the Module 2 quiz questions in a separate file or I'll extract from your message")

