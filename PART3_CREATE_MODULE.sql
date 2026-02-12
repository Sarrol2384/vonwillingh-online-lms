-- ============================================================
-- PART 3: CREATE MODULE (with simplified content for testing)
-- ============================================================

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
  (SELECT id FROM courses WHERE code = 'TESTLEAD001'),
  'Module 1: Introduction to Leadership Principles',
  'Explore fundamental leadership concepts including leadership styles, team dynamics, and effective communication strategies.',
  1,
  '<div style=''font-family: Arial, sans-serif; padding: 20px;''>
<h1>Module 1: Introduction to Leadership Principles</h1>
<h2>Learning Objectives</h2>
<ul>
<li>Understand core leadership theories</li>
<li>Identify different leadership styles</li>
<li>Develop effective communication skills</li>
<li>Apply leadership principles in business</li>
</ul>
<h2>1. What is Leadership?</h2>
<p>Leadership is the art of motivating a group of people to act toward achieving a common goal. In a business setting, this means directing workers and colleagues with a strategy to meet company needs.</p>
<h2>2. Leadership Styles</h2>
<p><strong>Democratic Leadership:</strong> Involves team members in decision-making and encourages participation.</p>
<p><strong>Autocratic Leadership:</strong> Leader makes decisions independently with clear direction.</p>
<p><strong>Transformational Leadership:</strong> Inspires through shared vision and personal example.</p>
<p><strong>Servant Leadership:</strong> Focuses on serving and developing team members.</p>
<h2>3. Emotional Intelligence</h2>
<p>Five key components according to Daniel Goleman:</p>
<ol>
<li>Self-awareness - Understanding your own emotions</li>
<li>Self-regulation - Managing your emotions effectively</li>
<li>Motivation - Internal drive to achieve</li>
<li>Empathy - Understanding others emotions</li>
<li>Social skills - Building relationships</li>
</ol>
<h2>4. Ubuntu Philosophy</h2>
<p>Ubuntu emphasizes ''I am because we are'' - focusing on collective success and community building in South African business contexts.</p>
<h2>5. Case Study</h2>
<p>Thabo, a manufacturing business owner, succeeded by building trust through authentic engagement, involving employees in decisions, and leading by example during challenging times.</p>
<h2>Key Takeaways</h2>
<ul>
<li>Leadership inspires change while management maintains stability</li>
<li>Different situations require different leadership styles</li>
<li>Emotional intelligence is crucial for leadership success</li>
<li>Ubuntu philosophy emphasizes collective success</li>
<li>Trust and authenticity are foundations of great leadership</li>
</ul>
</div>',
  'lesson',
  '',
  45
);

-- Verify module created
SELECT 
  'Module created!' AS status,
  m.id AS module_id,
  m.title,
  c.code AS course_code
FROM modules m
JOIN courses c ON c.id = m.course_id
WHERE c.code = 'TESTLEAD001';
