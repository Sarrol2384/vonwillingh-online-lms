-- ============================================================
-- COMPLETE TEST COURSE IMPORT - SQL SOLUTION
-- Run this entire script in Supabase SQL Editor
-- ============================================================

-- Step 1: Clean up existing test course (if any)
DELETE FROM quiz_questions 
WHERE module_id IN (
  SELECT id FROM modules 
  WHERE course_id IN (SELECT id FROM courses WHERE code = 'TESTLEAD001')
);

DELETE FROM modules WHERE course_id IN (SELECT id FROM courses WHERE code = 'TESTLEAD001');
DELETE FROM courses WHERE code = 'TESTLEAD001';

-- Step 2: Create the test course
INSERT INTO courses (name, code, level, category, description, duration, price)
VALUES (
  'Test: Business Leadership Fundamentals',
  'TESTLEAD001',
  'Certificate',
  'Leadership',
  'A simple test course to verify the JSON structure for professional leadership content with proper formatting and quiz separation.',
  '2 weeks',
  0
)
RETURNING id AS course_id;

-- Note the course_id from above, or use this query to get it:
-- SELECT id FROM courses WHERE code = 'TESTLEAD001';

-- Step 3: Create Module 1
-- IMPORTANT: Replace 'YOUR_COURSE_ID_HERE' with the actual course UUID from Step 2
INSERT INTO modules (
  course_id,
  title,
  description,
  order_number,
  content,
  content_type,
  video_url,
  duration_minutes
)
VALUES (
  (SELECT id FROM courses WHERE code = 'TESTLEAD001'),  -- This gets the course_id automatically
  'Module 1: Introduction to Leadership Principles',
  'Explore fundamental leadership concepts including leadership styles, team dynamics, and effective communication strategies for South African business contexts.',
  1,
  '<div style=''font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px;''>
<div style=''background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px;''>
<h1 style=''margin: 0; font-size: 2.5em;''>Module 1: Introduction to Leadership Principles</h1>
<p style=''margin: 10px 0 0 0; font-size: 1.2em; opacity: 0.9;''>Building the foundation for effective leadership in South African businesses</p>
</div>

<div style=''background: #e8f5e9; border-left: 5px solid #4caf50; padding: 20px; margin-bottom: 30px; border-radius: 5px;''>
<h3 style=''margin-top: 0; color: #2e7d32;''>🎯 Learning Objectives</h3>
<ul style=''line-height: 1.8;''>
<li>Understand core leadership theories and their practical applications</li>
<li>Identify different leadership styles and when to use them</li>
<li>Develop effective communication skills for diverse teams</li>
<li>Apply leadership principles in South African business contexts</li>
<li>Build trust and credibility as an emerging leader</li>
</ul>
</div>

<h2 style=''color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;''>1. What is Leadership?</h2>
<p style=''line-height: 1.8; font-size: 1.1em;''>Leadership is the art of motivating a group of people to act toward achieving a common goal. In a business setting, this means directing workers and colleagues with a strategy to meet the company''s needs. Unlike management, which focuses on maintaining systems and processes, leadership is about inspiring change and innovation.</p>

<div style=''background: #fff3e0; border-left: 5px solid #ff9800; padding: 20px; margin: 20px 0; border-radius: 5px;''>
<h4 style=''margin-top: 0; color: #e65100;''>💡 South African Context</h4>
<p style=''line-height: 1.8;''>In South Africa''s diverse workplace, effective leadership requires understanding Ubuntu philosophy - ''I am because we are.'' This emphasizes collective success, community building, and inclusive decision-making. Leaders must navigate diverse cultures, languages, and backgrounds while building unified teams.</p>
</div>

<h2 style=''color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;''>2. Leadership vs Management</h2>
<p style=''line-height: 1.8;''>While often used interchangeably, leadership and management serve distinct purposes:</p>
<table style=''width: 100%; border-collapse: collapse; margin: 20px 0;''>
<tr style=''background: #f5f5f5;''>
<th style=''padding: 12px; text-align: left; border: 1px solid #ddd;''>Leadership</th>
<th style=''padding: 12px; text-align: left; border: 1px solid #ddd;''>Management</th>
</tr>
<tr>
<td style=''padding: 12px; border: 1px solid #ddd;''>Sets vision and direction</td>
<td style=''padding: 12px; border: 1px solid #ddd;''>Implements plans and processes</td>
</tr>
<tr style=''background: #f9f9f9;''>
<td style=''padding: 12px; border: 1px solid #ddd;''>Inspires and motivates</td>
<td style=''padding: 12px; border: 1px solid #ddd;''>Organizes and controls</td>
</tr>
<tr>
<td style=''padding: 12px; border: 1px solid #ddd;''>Drives change</td>
<td style=''padding: 12px; border: 1px solid #ddd;''>Maintains stability</td>
</tr>
<tr style=''background: #f9f9f9;''>
<td style=''padding: 12px; border: 1px solid #ddd;''>Focuses on people</td>
<td style=''padding: 12px; border: 1px solid #ddd;''>Focuses on tasks</td>
</tr>
</table>

<h2 style=''color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;''>3. Leadership Styles</h2>
<p style=''line-height: 1.8;''>Effective leaders adapt their style to the situation and team needs. Here are the main leadership styles:</p>

<div style=''background: #f5f5f5; padding: 15px; margin: 15px 0; border-left: 4px solid #667eea;''>
<h4 style=''margin-top: 0; color: #667eea;''>🏛️ Democratic Leadership</h4>
<p>Involves team members in decision-making and encourages participation. Best for: Creative projects, team development, building engagement.</p>
<p><strong>Example:</strong> A Johannesburg design agency where the creative director holds brainstorming sessions, values everyone''s input, and makes decisions collaboratively.</p>
</div>

<div style=''background: #f5f5f5; padding: 15px; margin: 15px 0; border-left: 4px solid #e91e63;''>
<h4 style=''margin-top: 0; color: #e91e63;''>⚡ Autocratic Leadership</h4>
<p>Leader makes decisions independently with clear direction. Best for: Crisis situations, time-sensitive decisions, inexperienced teams.</p>
<p><strong>Example:</strong> A Cape Town restaurant manager during lunch rush making quick decisions about seating and kitchen priorities.</p>
</div>

<div style=''background: #f5f5f5; padding: 15px; margin: 15px 0; border-left: 4px solid #4caf50;''>
<h4 style=''margin-top: 0; color: #4caf50;''>🚀 Transformational Leadership</h4>
<p>Inspires through shared vision and personal example. Best for: Growth phases, cultural change, innovation initiatives.</p>
<p><strong>Example:</strong> A Durban tech startup founder who inspires the team with a vision of becoming Africa''s leading fintech platform.</p>
</div>

<div style=''background: #f5f5f5; padding: 15px; margin: 15px 0; border-left: 4px solid #ff9800;''>
<h4 style=''margin-top: 0; color: #ff9800;''>🤝 Servant Leadership</h4>
<p>Focuses on serving and developing team members. Best for: Long-term team building, high-trust environments, service organizations.</p>
<p><strong>Example:</strong> An NGO director in Pretoria who prioritizes staff well-being and professional development, removing obstacles to help them succeed.</p>
</div>

<h2 style=''color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;''>4. Emotional Intelligence in Leadership</h2>
<p style=''line-height: 1.8;''>Daniel Goleman''s research shows that Emotional Intelligence (EQ) is more important than IQ for leadership success. The five components are:</p>

<ol style=''line-height: 1.8; font-size: 1.05em;''>
<li><strong>Self-awareness:</strong> Understanding your own emotions, strengths, weaknesses, values, and impact on others.</li>
<li><strong>Self-regulation:</strong> Managing disruptive emotions and impulses, maintaining composure under pressure.</li>
<li><strong>Motivation:</strong> Internal drive to achieve beyond external rewards, resilience in face of setbacks.</li>
<li><strong>Empathy:</strong> Understanding others'' emotions, perspectives, and concerns.</li>
<li><strong>Social skills:</strong> Building relationships, influencing, communicating effectively, resolving conflicts.</li>
</ol>

<div style=''background: #e3f2fd; border-left: 5px solid #2196f3; padding: 20px; margin: 20px 0; border-radius: 5px;''>
<h4 style=''margin-top: 0; color: #1565c0;''>💼 Applying EQ in South African Business</h4>
<p style=''line-height: 1.8;''>In South Africa''s multicultural environment, high EQ is essential. Leaders must navigate:</p>
<ul>
<li>11 official languages and diverse communication styles</li>
<li>Different cultural approaches to hierarchy and authority</li>
<li>Historical contexts affecting workplace dynamics</li>
<li>Load shedding and infrastructure challenges requiring empathy and flexibility</li>
</ul>
</div>

<h2 style=''color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;''>5. Ubuntu Philosophy in Leadership</h2>
<p style=''line-height: 1.8;''>Ubuntu - ''I am because we are'' - is a foundational African philosophy with profound implications for leadership:</p>

<ul style=''line-height: 1.8;''>
<li><strong>Collective Success:</strong> Individual achievement is meaningless without group success</li>
<li><strong>Shared Responsibility:</strong> Problems and solutions belong to everyone</li>
<li><strong>Inclusive Decision-Making:</strong> Everyone''s voice matters in important decisions</li>
<li><strong>Compassion and Humanity:</strong> Treating everyone with dignity and respect</li>
<li><strong>Community Building:</strong> Creating connections and mutual support</li>
</ul>

<p style=''line-height: 1.8; font-style: italic; background: #fff3e0; padding: 15px; border-radius: 5px;''>''Ubuntu leadership means seeing yourself as part of a greater whole, where your success as a leader is measured by how well your team thrives, not just your personal achievements.'' - Dr. Mamphela Ramphele</p>

<h2 style=''color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;''>6. Case Study: Thabo''s Manufacturing Turnaround</h2>
<p style=''line-height: 1.8;''>Thabo inherited a struggling manufacturing business in Ekurhuleni with low morale, high turnover, and declining quality. Instead of implementing top-down changes, he applied leadership principles:</p>

<div style=''background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;''>
<h4 style=''color: #667eea;''>What Thabo Did:</h4>
<ol style=''line-height: 1.8;''>
<li><strong>Listened First:</strong> Spent 3 weeks on the factory floor, talking to every employee about their concerns</li>
<li><strong>Built Trust:</strong> Worked alongside employees during load shedding, showing he wasn''t above manual work</li>
<li><strong>Inclusive Decisions:</strong> Created improvement committees with representatives from all departments</li>
<li><strong>Recognized Contributions:</strong> Implemented employee recognition program celebrating both individual and team achievements</li>
<li><strong>Developed People:</strong> Invested in training and created clear career progression paths</li>
</ol>

<h4 style=''color: #4caf50; margin-top: 20px;''>Results After 18 Months:</h4>
<ul style=''line-height: 1.8;''>
<li>Employee turnover dropped from 45% to 12%</li>
<li>Product defects reduced by 67%</li>
<li>Production efficiency increased by 34%</li>
<li>Employee satisfaction scores rose from 3.2 to 8.1 out of 10</li>
<li>Company became profitable again</li>
</ul>
</div>

<p style=''line-height: 1.8; font-weight: bold; color: #667eea;''>Key Lesson: Authentic leadership that values people and builds trust creates sustainable organizational success.</p>

<div style=''background: #e8f5e9; border-left: 5px solid #4caf50; padding: 20px; margin: 30px 0; border-radius: 5px;''>
<h3 style=''margin-top: 0; color: #2e7d32;''>✨ Key Takeaways</h3>
<ul style=''line-height: 1.8;''>
<li>Leadership is about inspiring change while management maintains stability - both are necessary</li>
<li>Effective leaders adapt their style to situations and team needs</li>
<li>Emotional Intelligence (EQ) is more important than IQ for leadership success</li>
<li>Ubuntu philosophy emphasizes collective success over individual achievement</li>
<li>Trust and authenticity are the foundation of great leadership</li>
<li>In South Africa''s diverse context, cultural awareness and empathy are essential</li>
<li>Leading by example and genuine engagement build credibility</li>
</ul>
</div>

<div style=''background: #fff3e0; padding: 20px; margin: 20px 0; border-radius: 5px;''>
<h3 style=''margin-top: 0; color: #e65100;''>📚 Additional Resources</h3>
<ul style=''line-height: 1.8;''>
<li><a href=''https://www.mindtools.com/pages/article/newLDR_84.htm'' style=''color: #1976d2;''>Leadership Styles Overview - Mind Tools</a></li>
<li><a href=''https://www.verywellmind.com/what-is-emotional-intelligence-2795423'' style=''color: #1976d2;''>Emotional Intelligence in Leadership</a></li>
<li><a href=''https://www.skillsportal.co.za/content/ubuntu-and-leadership'' style=''color: #1976d2;''>Ubuntu Philosophy and Leadership</a></li>
<li><a href=''https://hbr.org/2004/01/what-makes-a-leader'' style=''color: #1976d2;''>What Makes a Leader - Harvard Business Review</a></li>
</ul>
</div>

<p style=''text-align: center; font-size: 1.2em; color: #667eea; margin: 40px 0; font-weight: bold;''>Ready to test your understanding? Complete the quiz to earn your module certificate!</p>
</div>',
  'lesson',
  '',
  45
)
RETURNING id AS module_id;

-- Step 4: Create Quiz Questions
-- IMPORTANT: Get the module_id from Step 3, or use:
-- SELECT id FROM modules WHERE course_id = (SELECT id FROM courses WHERE code = 'TESTLEAD001');

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
  'Leadership is about setting vision and inspiring people toward goals, while management focuses on implementing processes and maintaining systems. Both are important and complementary.'
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
  'Democratic leadership, also called participative leadership, involves team members in the decision-making process, fostering engagement and shared ownership of outcomes.'
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
  'In the context of South African business, Ubuntu philosophy emphasizes individual achievement over team success.',
  'true_false',
  ARRAY['True', 'False'],
  'False',
  2,
  'Ubuntu philosophy emphasizes ''I am because we are'' - focusing on collective success, community building, and interconnectedness rather than individual achievement.'
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
  'Daniel Goleman identified these five components as essential for emotional intelligence: understanding yourself, managing your emotions, staying motivated, understanding others, and building relationships.'
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
  'Thabo succeeded by spending time understanding his employees'' concerns, involving them in decisions, and demonstrating commitment by working alongside them during challenging times. This built trust and engagement.'
);

-- Step 5: Verify the import
SELECT 
  '✅ IMPORT COMPLETE!' AS status,
  c.name AS course_name,
  c.code AS course_code,
  m.title AS module_title,
  COUNT(q.id) AS quiz_questions,
  SUM(q.points) AS total_points
FROM courses c
JOIN modules m ON m.course_id = c.id
LEFT JOIN quiz_questions q ON q.module_id = m.id
WHERE c.code = 'TESTLEAD001'
GROUP BY c.id, c.name, c.code, m.id, m.title;

-- ============================================================
-- INSTRUCTIONS:
-- 1. Copy this ENTIRE script
-- 2. Go to your Supabase Dashboard → SQL Editor
-- 3. Paste the script
-- 4. Click "Run"
-- 5. Check the results - you should see:
--    - status: "✅ IMPORT COMPLETE!"
--    - course_name: "Test: Business Leadership Fundamentals"
--    - course_code: "TESTLEAD001"
--    - module_title: "Module 1: Introduction to Leadership Principles"
--    - quiz_questions: 5
--    - total_points: 10
--
-- 6. Go to: https://vonwillingh-online-lms.pages.dev/courses
-- 7. You should now see the test course!
-- ============================================================
