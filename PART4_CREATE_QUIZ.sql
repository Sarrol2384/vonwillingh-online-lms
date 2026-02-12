-- ============================================================
-- PART 4: CREATE QUIZ QUESTIONS
-- ============================================================

-- Question 1
INSERT INTO quiz_questions (
  module_id,
  question,
  type,
  options,
  correct_answer,
  points,
  explanation
)
VALUES (
  (SELECT id FROM modules WHERE course_id = (SELECT id FROM courses WHERE code = 'TESTLEAD001') AND order_number = 1),
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
  'Leadership is about setting vision and inspiring people toward goals, while management focuses on implementing processes and maintaining systems.'
);

-- Question 2
INSERT INTO quiz_questions (
  module_id,
  question,
  type,
  options,
  correct_answer,
  points,
  explanation
)
VALUES (
  (SELECT id FROM modules WHERE course_id = (SELECT id FROM courses WHERE code = 'TESTLEAD001') AND order_number = 1),
  'Which leadership style involves team members in decision-making?',
  'single_choice',
  ARRAY[
    'Autocratic Leadership',
    'Democratic Leadership',
    'Laissez-faire Leadership',
    'Transactional Leadership'
  ],
  'Democratic Leadership',
  2,
  'Democratic leadership involves team members in the decision-making process, fostering engagement and shared ownership.'
);

-- Question 3
INSERT INTO quiz_questions (
  module_id,
  question,
  type,
  options,
  correct_answer,
  points,
  explanation
)
VALUES (
  (SELECT id FROM modules WHERE course_id = (SELECT id FROM courses WHERE code = 'TESTLEAD001') AND order_number = 1),
  'Ubuntu philosophy emphasizes individual achievement over team success.',
  'true_false',
  ARRAY['True', 'False'],
  'False',
  2,
  'Ubuntu philosophy emphasizes ''I am because we are'' - focusing on collective success rather than individual achievement.'
);

-- Question 4
INSERT INTO quiz_questions (
  module_id,
  question,
  type,
  options,
  correct_answer,
  points,
  explanation
)
VALUES (
  (SELECT id FROM modules WHERE course_id = (SELECT id FROM courses WHERE code = 'TESTLEAD001') AND order_number = 1),
  'What are the five components of Emotional Intelligence?',
  'single_choice',
  ARRAY[
    'Self-awareness, Self-regulation, Motivation, Empathy, Social skills',
    'Intelligence, Creativity, Logic, Emotion, Reasoning',
    'Planning, Organizing, Leading, Controlling, Evaluating',
    'Vision, Mission, Values, Goals, Objectives'
  ],
  'Self-awareness, Self-regulation, Motivation, Empathy, Social skills',
  2,
  'Daniel Goleman identified these five components as essential for emotional intelligence.'
);

-- Question 5
INSERT INTO quiz_questions (
  module_id,
  question,
  type,
  options,
  correct_answer,
  points,
  explanation
)
VALUES (
  (SELECT id FROM modules WHERE course_id = (SELECT id FROM courses WHERE code = 'TESTLEAD001') AND order_number = 1),
  'What was the key factor in Thabo''s success?',
  'single_choice',
  ARRAY[
    'Implementing strict rules and discipline',
    'Building trust through authentic engagement and leading by example',
    'Cutting costs and reducing staff',
    'Hiring external consultants'
  ],
  'Building trust through authentic engagement and leading by example',
  2,
  'Thabo succeeded by building trust through authentic engagement, involving employees in decisions, and leading by example.'
);

-- Verify all questions created
SELECT 
  'Quiz questions created!' AS status,
  COUNT(*) AS total_questions,
  SUM(points) AS total_points
FROM quiz_questions
WHERE module_id IN (
  SELECT id FROM modules 
  WHERE course_id = (SELECT id FROM courses WHERE code = 'TESTLEAD001')
);
