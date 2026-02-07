-- ==================================================
-- FIXED SQL - Removes semesters_count field
-- ==================================================

DO $$
DECLARE
  new_course_id INTEGER;
BEGIN
  -- Get next course ID
  SELECT COALESCE(MAX(id), 0) + 1 INTO new_course_id FROM courses;
  
  RAISE NOTICE 'Creating course with ID: %', new_course_id;
  
  -- Insert Course (WITHOUT semesters_count)
  INSERT INTO courses (
    id,
    name,
    code,
    level,
    category,
    description,
    price,
    modules_count
  ) VALUES (
    new_course_id,
    'AI Basics for SA Small Business Owners',
    'AIBIZ001',
    'Certificate',
    'Artificial Intelligence',
    'Learn AI basics for your business',
    0,
    4
  );
  
  RAISE NOTICE '✅ Course created with ID: %', new_course_id;
  
  -- Insert Module 1
  INSERT INTO modules (
    course_id,
    module_number,
    title,
    description,
    content,
    content_type,
    duration_minutes,
    order_index,
    is_published
  ) VALUES (
    new_course_id,
    1,
    'Module 1: What is AI and Why Should You Care?',
    'Demystify artificial intelligence and discover how it is already helping SA small businesses save time and money.',
    '<h1>What is AI?</h1><p>Artificial Intelligence is software that can learn and make decisions. In this module, you will learn how to use AI tools to save time and grow your business.</p>',
    'lesson',
    45,
    1,
    true
  );
  
  -- Insert Module 2
  INSERT INTO modules (
    course_id,
    module_number,
    title,
    description,
    content,
    content_type,
    duration_minutes,
    order_index,
    is_published
  ) VALUES (
    new_course_id,
    2,
    'Module 2: ChatGPT - Your 24/7 Business Assistant',
    'Master ChatGPT to handle customer queries, create content, and automate repetitive tasks.',
    '<h1>ChatGPT for Business</h1><p>Learn how to use ChatGPT to automate customer service, create marketing content, and handle administrative tasks.</p>',
    'lesson',
    60,
    2,
    true
  );
  
  -- Insert Module 3
  INSERT INTO modules (
    course_id,
    module_number,
    title,
    description,
    content,
    content_type,
    duration_minutes,
    order_index,
    is_published
  ) VALUES (
    new_course_id,
    3,
    'Module 3: Canva AI - Professional Design Made Easy',
    'Create stunning marketing materials using Canva AI-powered design tools.',
    '<h1>Canva AI Design</h1><p>Discover how to create professional social media posts, flyers, and marketing materials using Canva AI features.</p>',
    'lesson',
    60,
    3,
    true
  );
  
  -- Insert Module 4
  INSERT INTO modules (
    course_id,
    module_number,
    title,
    description,
    content,
    content_type,
    duration_minutes,
    order_index,
    is_published
  ) VALUES (
    new_course_id,
    4,
    'Module 4: Putting It All Together',
    'Build your complete AI-powered business workflow and action plan.',
    '<h1>Your AI System</h1><p>Now that you know the tools, lets put them together into a complete system that saves you 10+ hours per week.</p>',
    'lesson',
    45,
    4,
    true
  );
  
  RAISE NOTICE '✅ All 4 modules created successfully!';
  
END $$;

-- Verify
SELECT id, name, code, level, price, modules_count
FROM courses
WHERE code = 'AIBIZ001';
