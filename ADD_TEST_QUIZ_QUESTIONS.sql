-- Add Quiz Questions for TEST_SIMPLE_MODULE
-- Module: Module 1: Introduction to Leadership Principles

DO $$
DECLARE
  v_module_id UUID;
BEGIN
  -- Get the module ID
  SELECT id INTO v_module_id 
  FROM modules m
  JOIN courses c ON m.course_id = c.id
  WHERE c.code = 'TESTLEAD001'
    AND m.title = 'Module 1: Introduction to Leadership Principles';
  
  IF v_module_id IS NULL THEN
    RAISE EXCEPTION 'Module not found!';
  END IF;
  
  RAISE NOTICE 'Found module ID: %', v_module_id;
  
  -- Delete any existing quiz questions for this module (just in case)
  DELETE FROM quiz_questions WHERE module_id = v_module_id;
  
  -- Insert Question 1
  INSERT INTO quiz_questions (
    module_id, question_text, question_type, options, correct_answer,
    points, order_number, hint_feedback, correct_feedback, detailed_explanation
  ) VALUES (
    v_module_id,
    'What is the key difference between leadership and management?',
    'single_choice',
    ARRAY[
      'Leadership focuses on inspiring change while management maintains stability',
      'Leadership is easier than management',
      'Management requires more education than leadership',
      'Leadership is only for executives while management is for everyone'
    ],
    'Leadership focuses on inspiring change while management maintains stability',
    2,
    1,
    'Think about the focus and purpose of each role.',
    'Correct! Leadership inspires change; management maintains systems.',
    'Leadership is about setting vision and inspiring people toward goals, while management focuses on implementing processes and maintaining systems. Both are important and complementary.'
  );
  
  -- Insert Question 2
  INSERT INTO quiz_questions (
    module_id, question_text, question_type, options, correct_answer,
    points, order_number, hint_feedback, correct_feedback, detailed_explanation
  ) VALUES (
    v_module_id,
    'Which leadership style involves team members in decision-making and encourages participation?',
    'single_choice',
    ARRAY[
      'Autocratic Leadership',
      'Democratic Leadership',
      'Laissez-faire Leadership',
      'Transactional Leadership'
    ],
    'Democratic Leadership',
    2,
    2,
    'Consider which style values team input and shared decision-making.',
    'Correct! Democratic leadership involves the team in decisions.',
    'Democratic leadership, also called participative leadership, involves team members in the decision-making process, fostering engagement and shared ownership of outcomes.'
  );
  
  -- Insert Question 3
  INSERT INTO quiz_questions (
    module_id, question_text, question_type, options, correct_answer,
    points, order_number, hint_feedback, correct_feedback, detailed_explanation
  ) VALUES (
    v_module_id,
    'In the context of South African business, Ubuntu philosophy emphasizes individual achievement over team success.',
    'true_false',
    ARRAY['True', 'False'],
    'False',
    2,
    3,
    'Think about the meaning of Ubuntu: "I am because we are".',
    'Correct! Ubuntu emphasizes collective success.',
    'Ubuntu philosophy emphasizes ''I am because we are'' - focusing on collective success, community building, and interconnectedness rather than individual achievement.'
  );
  
  -- Insert Question 4
  INSERT INTO quiz_questions (
    module_id, question_text, question_type, options, correct_answer,
    points, order_number, hint_feedback, correct_feedback, detailed_explanation
  ) VALUES (
    v_module_id,
    'What are the five components of Emotional Intelligence (EQ)?',
    'single_choice',
    ARRAY[
      'Self-awareness, Self-regulation, Motivation, Empathy, Social skills',
      'Intelligence, Creativity, Logic, Emotion, Reasoning',
      'Planning, Organizing, Leading, Controlling, Evaluating',
      'Vision, Mission, Values, Goals, Objectives'
    ],
    'Self-awareness, Self-regulation, Motivation, Empathy, Social skills',
    2,
    4,
    'Think about Daniel Goleman''s five key components of EQ.',
    'Correct! These are the five components of Emotional Intelligence.',
    'Daniel Goleman identified these five components as essential for emotional intelligence: understanding yourself, managing your emotions, staying motivated, understanding others, and building relationships.'
  );
  
  -- Insert Question 5
  INSERT INTO quiz_questions (
    module_id, question_text, question_type, options, correct_answer,
    points, order_number, hint_feedback, correct_feedback, detailed_explanation
  ) VALUES (
    v_module_id,
    'According to the module, what was the key factor in Thabo''s success in turning around his manufacturing business?',
    'single_choice',
    ARRAY[
      'Implementing strict rules and discipline',
      'Building trust through authentic engagement and leading by example',
      'Cutting costs and reducing staff',
      'Hiring external consultants to make changes'
    ],
    'Building trust through authentic engagement and leading by example',
    2,
    5,
    'Recall how Thabo built relationships and trust with his team.',
    'Correct! Thabo succeeded through authentic engagement and trust-building.',
    'Thabo succeeded by spending time understanding his employees'' concerns, involving them in decisions, and demonstrating commitment by working alongside them during challenging times. This built trust and engagement.'
  );
  
  RAISE NOTICE 'Successfully inserted 5 quiz questions!';
  
END $$;

-- Verify the insertion
SELECT 
  'Quiz Questions Added!' as status,
  COUNT(*) as total_questions,
  SUM(points) as total_points
FROM quiz_questions
WHERE module_id IN (
  SELECT m.id FROM modules m
  JOIN courses c ON m.course_id = c.id
  WHERE c.code = 'TESTLEAD001'
);
