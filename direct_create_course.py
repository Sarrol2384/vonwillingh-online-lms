#!/usr/bin/env python3
"""
Direct Course Creator - Creates course directly in Supabase
Bypasses API since it's not deployed yet
"""

import json
import os

# Read the course data
print("📄 Loading course data...")
with open('AUTO_GENERATED_COURSE.json', 'r', encoding='utf-8') as f:
    course_data = json.load(f)

course = course_data['course']
modules = course_data['modules']

print(f"✅ Loaded: {course['name']}")
print(f"📚 Modules: {len(modules)}")
print("")

# Since we need Supabase credentials which are in environment variables,
# let's create a SQL script instead that you can run in Supabase dashboard

print("🔧 Creating SQL script for Supabase...")

sql = f"""
-- ============================================
-- AUTO-GENERATED COURSE CREATION SCRIPT
-- Course: {course['name']}
-- ============================================

-- Step 1: Get next course ID
DO $$
DECLARE
    next_id INTEGER;
    new_course_id INTEGER;
BEGIN
    -- Get max ID
    SELECT COALESCE(MAX(id), 0) + 1 INTO next_id FROM courses;
    
    -- Insert course
    INSERT INTO courses (
        id,
        name,
        code,
        level,
        category,
        description,
        duration,
        price,
        modules_count,
        is_published
    ) VALUES (
        next_id,
        '{course['name'].replace("'", "''")}',
        '{course['code']}',
        '{course['level']}',
        '{course['category']}',
        '{course['description'].replace("'", "''")}',
        '{course['duration']}',
        {course['price']},
        {len(modules)},
        true
    ) RETURNING id INTO new_course_id;
    
    RAISE NOTICE 'Course created with ID: %', new_course_id;
    
"""

# Add modules
for i, module in enumerate(modules, 1):
    # Clean content for SQL
    content = module['content'].replace("'", "''")
    description = module['description'].replace("'", "''")
    title = module['title'].replace("'", "''")
    
    sql += f"""
    -- Module {i}: {module['title']}
    INSERT INTO modules (
        course_id,
        module_number,
        title,
        description,
        content,
        content_type,
        order_index,
        is_published
    ) VALUES (
        new_course_id,
        {module['order_number']},
        '{title}',
        '{description}',
        '{content}',
        'lesson',
        {module['order_number']},
        true
    );
    
"""

sql += """
END $$;

-- Verify the course was created
SELECT 
    id,
    name,
    code,
    price,
    modules_count
FROM courses 
WHERE code = 'DIGIMKT001';

-- View the modules
SELECT 
    m.id,
    m.module_number,
    m.title,
    c.name as course_name
FROM modules m
JOIN courses c ON m.course_id = c.id
WHERE c.code = 'DIGIMKT001'
ORDER BY m.module_number;
"""

# Save SQL script
with open('create_course.sql', 'w', encoding='utf-8') as f:
    f.write(sql)

print("✅ SQL script created: create_course.sql")
print("")
print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
print("📋 NEXT STEPS:")
print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
print("")
print("Option 1: Run in Supabase SQL Editor")
print("  1. Go to: https://supabase.com/dashboard")
print("  2. Open your project")
print("  3. Click 'SQL Editor' (left sidebar)")
print("  4. Click 'New query'")
print("  5. Copy-paste contents of create_course.sql")
print("  6. Click 'Run'")
print("  7. Course created! ✅")
print("")
print("Option 2: Wait for API (Recommended)")
print("  - Cloudflare should deploy within 10-15 minutes")
print("  - Then we can use the auto-create script")
print("")
print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

