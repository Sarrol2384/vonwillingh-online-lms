-- ============================================
-- Leadership Course - Module Content Creation
-- Creates Module 1 and Module 2 with full learning content
-- ============================================

DO $$
DECLARE
    v_course_id INTEGER;
    v_module1_id INTEGER;
    v_module2_id INTEGER;
BEGIN
    -- Get the Leadership course ID (assumes course already exists)
    -- Adjust the course name if needed
    SELECT id INTO v_course_id 
    FROM courses 
    WHERE name LIKE '%Leadership%' OR code LIKE '%LEAD%'
    LIMIT 1;
    
    IF v_course_id IS NULL THEN
        RAISE EXCEPTION 'Leadership course not found. Please create the course first.';
    END IF;
    
    RAISE NOTICE 'Using course ID: %', v_course_id;
    
    -- ============================================
    -- MODULE 1: Introduction to Leadership
    -- ============================================
    
    INSERT INTO modules (
        course_id,
        module_number,
        title,
        description,
        content,
        content_type,
        order_index,
        duration
    ) VALUES (
        v_course_id,
        1,
        'Module 1: Introduction to Leadership',
        'Foundation concepts of leadership including Ubuntu philosophy, emotional intelligence, and leadership styles',
        '<h1>Module 1: Introduction to Leadership</h1>

<h2>Welcome to Leadership Excellence</h2>
<p>Leadership is not about titles or authority - it''s about influence, service, and making a positive impact. In this module, you''ll explore foundational leadership concepts with a focus on South African context and Ubuntu philosophy.</p>

<h2>1. Ubuntu Leadership Philosophy</h2>

<h3>What is Ubuntu?</h3>
<p><strong>"Ubuntu"</strong> - A traditional African philosophy meaning <em>"I am because we are"</em></p>

<p>Ubuntu leadership emphasizes:</p>
<ul>
<li><strong>Collective responsibility</strong> - Shared decision-making and accountability</li>
<li><strong>Community building</strong> - Creating strong, supportive teams</li>
<li><strong>Human dignity</strong> - Respecting every person''s inherent worth</li>
<li><strong>Mutual support</strong> - We rise by lifting others</li>
</ul>

<div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 20px 0;">
<strong>🎯 Real Impact:</strong> Organizations practicing Ubuntu leadership report ~40% higher engagement, ~35% lower turnover, and ~30% higher innovation rates.
</div>

<h3>Ubuntu in Modern Workplaces</h3>
<p><strong>Key Practices:</strong></p>
<ol>
<li><strong>Inclusive Decision-Making:</strong> Involve team members in important decisions</li>
<li><strong>Mentorship Culture:</strong> Senior staff guide and develop junior colleagues</li>
<li><strong>Conflict Resolution:</strong> Focus on restoration, not punishment</li>
<li><strong>Celebration of Success:</strong> Recognize team achievements, not just individual wins</li>
</ol>

<h2>2. Leadership Styles</h2>

<h3>Transformational Leadership</h3>
<p><strong>Focus:</strong> Inspiring and motivating teams to achieve extraordinary outcomes</p>
<p><strong>Key Behaviors:</strong></p>
<ul>
<li>Idealized influence - Lead by example</li>
<li>Inspirational motivation - Communicate compelling vision</li>
<li>Intellectual stimulation - Encourage innovation</li>
<li>Individualized consideration - Support personal development</li>
</ul>

<p><strong>Best for:</strong> Change initiatives, innovation projects, long-term development</p>

<h3>Transactional Leadership</h3>
<p><strong>Focus:</strong> Clear structures, rewards for performance, corrective actions</p>
<p><strong>Key Behaviors:</strong></p>
<ul>
<li>Contingent rewards - Clear expectations and recognition</li>
<li>Management by exception - Intervene when standards not met</li>
<li>Task-focused - Emphasis on completing objectives</li>
</ul>

<p><strong>Best for:</strong> Routine operations, compliance-critical work, short-term goals</p>

<h3>Servant Leadership</h3>
<p><strong>Focus:</strong> Leaders serve their teams to help them grow and perform</p>
<p><strong>Key Behaviors:</strong></p>
<ul>
<li>Listening - Truly hear team concerns and ideas</li>
<li>Empathy - Understand and relate to others'' feelings</li>
<li>Healing - Help people overcome personal problems</li>
<li>Stewardship - Responsible use of resources and authority</li>
</ul>

<p><strong>South African Context:</strong> Aligns strongly with Ubuntu philosophy - particularly effective in building trust across diverse teams.</p>

<h3>Authentic Leadership</h3>
<p><strong>Focus:</strong> Being genuine, transparent, and values-driven</p>
<p><strong>Key Behaviors:</strong></p>
<ul>
<li>Self-awareness - Know your strengths and weaknesses</li>
<li>Relational transparency - Open and honest communication</li>
<li>Balanced processing - Consider multiple perspectives</li>
<li>Internalized moral perspective - Act according to values, not external pressure</li>
</ul>

<h2>3. Emotional Intelligence (EQ)</h2>

<h3>The Five Components</h3>

<p><strong>1. Self-Awareness</strong></p>
<ul>
<li>Recognize your emotions as they happen</li>
<li>Understand how your feelings affect your performance</li>
<li>Know your strengths and limitations</li>
</ul>

<p><strong>2. Self-Regulation</strong></p>
<ul>
<li>Manage disruptive emotions and impulses</li>
<li>Maintain standards of honesty and integrity</li>
<li>Take responsibility for your performance</li>
</ul>

<p><strong>3. Motivation</strong></p>
<ul>
<li>Strive to improve or meet excellence standards</li>
<li>Commit to organizational goals</li>
<li>Show initiative and optimism</li>
</ul>

<p><strong>4. Empathy</strong></p>
<ul>
<li>Sense others'' feelings and perspectives</li>
<li>Take active interest in their concerns</li>
<li>Anticipate, recognize, and meet needs</li>
</ul>

<p><strong>5. Social Skills</strong></p>
<ul>
<li>Influence others effectively</li>
<li>Build and maintain relationships</li>
<li>Collaborate and cooperate</li>
<li>Manage conflict constructively</li>
</ul>

<div style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
<strong>💡 Research Finding:</strong> EQ accounts for 58% of job performance across all types of jobs. Leaders with high EQ create teams with 20% higher productivity.
</div>

<h2>4. Intergenerational Leadership</h2>

<h3>Understanding Generational Differences</h3>

<p><strong>Baby Boomers (1946-1964):</strong></p>
<ul>
<li>Value: Loyalty, hard work, face-to-face communication</li>
<li>Leadership style: Hierarchical, process-oriented</li>
</ul>

<p><strong>Generation X (1965-1980):</strong></p>
<ul>
<li>Value: Work-life balance, independence, results</li>
<li>Leadership style: Pragmatic, flexible</li>
</ul>

<p><strong>Millennials (1981-1996):</strong></p>
<ul>
<li>Value: Purpose, feedback, technology</li>
<li>Leadership style: Collaborative, transparent</li>
</ul>

<p><strong>Generation Z (1997+):</strong></p>
<ul>
<li>Value: Diversity, authenticity, innovation</li>
<li>Leadership style: Digital-first, entrepreneurial</li>
</ul>

<h3>Leading Across Generations</h3>
<ol>
<li><strong>Communicate in Multiple Ways:</strong> Email, Slack, face-to-face, video calls</li>
<li><strong>Respect Different Work Styles:</strong> Some prefer autonomy, others need structure</li>
<li><strong>Create Mentorship Programs:</strong> Reverse mentoring benefits everyone</li>
<li><strong>Focus on Strengths:</strong> Leverage what each generation does best</li>
<li><strong>Build Bridge Builders:</strong> Identify people who connect well across age groups</li>
</ol>

<h2>5. Leading Change in South Africa</h2>

<h3>Change Management Principles</h3>

<p><strong>The Three Stages of Change:</strong></p>
<ol>
<li><strong>Unfreezing:</strong> Create awareness of need for change</li>
<li><strong>Changing:</strong> Implement new ways of working</li>
<li><strong>Refreezing:</strong> Solidify change as the new normal</li>
</ol>

<p><strong>South African Context Considerations:</strong></p>
<ul>
<li><strong>Historical Context:</strong> Be sensitive to past inequalities and trauma</li>
<li><strong>Cultural Diversity:</strong> 11 official languages, multiple cultures</li>
<li><strong>Economic Challenges:</strong> Change must be practical and resource-conscious</li>
<li><strong>Skills Gaps:</strong> Provide training and support during transitions</li>
</ul>

<h3>Building Trust During Change</h3>
<ol>
<li><strong>Communicate transparently:</strong> Why change is needed, what it means</li>
<li><strong>Involve stakeholders:</strong> Get input from affected people</li>
<li><strong>Provide support:</strong> Training, resources, emotional support</li>
<li><strong>Celebrate small wins:</strong> Recognize progress along the way</li>
<li><strong>Be patient:</strong> Change takes time, especially in diverse settings</li>
</ol>

<h2>Key Takeaways</h2>

<div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
<h3 style="margin-top: 0;">✅ Remember:</h3>
<ul>
<li><strong>Ubuntu philosophy</strong> emphasizes collective responsibility and shared success</li>
<li><strong>No single leadership style</strong> is best - adapt to context and people</li>
<li><strong>Emotional intelligence</strong> is more important than IQ for leadership success</li>
<li><strong>Generational diversity</strong> is a strength when managed inclusively</li>
<li><strong>Change management</strong> requires cultural sensitivity and stakeholder involvement</li>
</ul>
</div>

<h2>Prepare for Your Quiz</h2>
<p>The quiz for this module will test your understanding of:</p>
<ul>
<li>Ubuntu leadership principles and practices</li>
<li>Different leadership styles and when to use them</li>
<li>Components of emotional intelligence</li>
<li>Intergenerational team management</li>
<li>Change management in diverse contexts</li>
</ul>

<p><strong>You need 70% to pass. Good luck!</strong> 🎯</p>',
        'lesson',
        1,
        '45 minutes'
    ) RETURNING id INTO v_module1_id;
    
    RAISE NOTICE 'Created Module 1 with ID: %', v_module1_id;
    
    -- ============================================
    -- MODULE 2: Core Concepts in Leadership
    -- ============================================
    
    INSERT INTO modules (
        course_id,
        module_number,
        title,
        description,
        content,
        content_type,
        order_index,
        duration
    ) VALUES (
        v_course_id,
        2,
        'Module 2: Core Concepts in Leadership',
        'Advanced leadership theories including team dynamics, organizational culture, stakeholder management, and leadership development',
        '<h1>Module 2: Core Concepts in Leadership</h1>

<h2>Building on the Foundation</h2>
<p>In Module 1, you learned foundational leadership concepts. Now we''ll dive deeper into advanced topics that will help you lead effectively in complex organizational environments.</p>

<h2>1. Team Development and Dynamics</h2>

<h3>Tuckman''s Stages of Team Development</h3>

<p><strong>Stage 1: Forming</strong></p>
<ul>
<li><strong>Characteristics:</strong> Politeness, uncertainty, testing boundaries</li>
<li><strong>Leader Role:</strong> Provide clear direction, set expectations, build trust</li>
<li><strong>Duration:</strong> Varies, but typically first few weeks</li>
</ul>

<p><strong>Stage 2: Storming</strong></p>
<ul>
<li><strong>Characteristics:</strong> Conflict, resistance, competition for influence</li>
<li><strong>Leader Role:</strong> Facilitate conflict resolution, maintain focus on goals</li>
<li><strong>Watch For:</strong> This is normal! Don''t avoid conflict - work through it</li>
</ul>

<p><strong>Stage 3: Norming</strong></p>
<ul>
<li><strong>Characteristics:</strong> Cooperation, agreed processes, mutual respect</li>
<li><strong>Leader Role:</strong> Step back slightly, encourage team ownership</li>
<li><strong>Milestone:</strong> Team starts to self-organize effectively</li>
</ul>

<p><strong>Stage 4: Performing</strong></p>
<ul>
<li><strong>Characteristics:</strong> High productivity, strong relationships, autonomy</li>
<li><strong>Leader Role:</strong> Coach, delegate, remove obstacles</li>
<li><strong>Goal:</strong> Maintain momentum, celebrate achievements</li>
</ul>

<p><strong>Stage 5: Adjourning</strong></p>
<ul>
<li><strong>Characteristics:</strong> Project completion, team disbanding</li>
<li><strong>Leader Role:</strong> Acknowledge contributions, facilitate closure</li>
<li><strong>Important:</strong> Celebrate success, capture lessons learned</li>
</ul>

<div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; margin: 20px 0;">
<strong>💡 SA Context:</strong> In diverse South African teams, the Storming stage may last longer due to different cultural communication styles. Be patient and use Ubuntu principles to build understanding.
</div>

<h2>2. Situational Leadership Model</h2>

<h3>Matching Leadership Style to Team Readiness</h3>

<p><strong>S1: Directing (High Directive, Low Supportive)</strong></p>
<ul>
<li><strong>Use when:</strong> Team members are willing but lack skill/experience</li>
<li><strong>Behaviors:</strong> Clear instructions, close supervision, frequent feedback</li>
<li><strong>Example:</strong> New employees learning company systems</li>
</ul>

<p><strong>S2: Coaching (High Directive, High Supportive)</strong></p>
<ul>
<li><strong>Use when:</strong> Team has some skill but low confidence or commitment</li>
<li><strong>Behaviors:</strong> Explain decisions, encourage input, provide support</li>
<li><strong>Example:</strong> Mid-level staff facing new challenges</li>
</ul>

<p><strong>S3: Supporting (Low Directive, High Supportive)</strong></p>
<ul>
<li><strong>Use when:</strong> Team is skilled but needs confidence boost</li>
<li><strong>Behaviors:</strong> Facilitate decisions, provide encouragement</li>
<li><strong>Example:</strong> Experienced team members taking on leadership roles</li>
</ul>

<p><strong>S4: Delegating (Low Directive, Low Supportive)</strong></p>
<ul>
<li><strong>Use when:</strong> Team is both skilled and motivated</li>
<li><strong>Behaviors:</strong> Turn over decisions, monitor progress minimally</li>
<li><strong>Example:</strong> High-performing senior professionals</li>
</ul>

<h3>Assessing Readiness Levels</h3>
<p><strong>Key Question:</strong> Can they do it? Will they do it?</p>
<ul>
<li><strong>Ability:</strong> Skills, knowledge, experience</li>
<li><strong>Willingness:</strong> Confidence, commitment, motivation</li>
</ul>

<h2>3. Path-Goal Leadership Theory</h2>

<h3>How Leaders Influence Performance and Satisfaction</h3>

<p><strong>Core Idea:</strong> Leaders help followers achieve goals by clarifying paths and removing obstacles.</p>

<p><strong>Four Leadership Behaviors:</strong></p>

<p><strong>1. Directive Leadership</strong></p>
<ul>
<li>Provide specific guidance and expectations</li>
<li><strong>Best for:</strong> Ambiguous tasks, inexperienced teams</li>
</ul>

<p><strong>2. Supportive Leadership</strong></p>
<ul>
<li>Show concern for well-being and needs</li>
<li><strong>Best for:</strong> Stressful or frustrating tasks</li>
</ul>

<p><strong>3. Participative Leadership</strong></p>
<ul>
<li>Consult with team, use their ideas</li>
<li><strong>Best for:</strong> Complex problems, experienced teams</li>
</ul>

<p><strong>4. Achievement-Oriented Leadership</strong></p>
<ul>
<li>Set challenging goals, expect high performance</li>
<li><strong>Best for:</strong> Skilled teams seeking growth</li>
</ul>

<h2>4. Organizational Culture and Leadership</h2>

<h3>Schein''s Three Levels of Culture</h3>

<p><strong>Level 1: Artifacts (Visible)</strong></p>
<ul>
<li>Dress code, office layout, rituals, language</li>
<li><strong>Example:</strong> Open office vs. private cubicles</li>
</ul>

<p><strong>Level 2: Espoused Values (Stated)</strong></p>
<ul>
<li>Mission, vision, official strategies</li>
<li><strong>Example:</strong> "We value innovation" in company materials</li>
</ul>

<p><strong>Level 3: Underlying Assumptions (Unconscious)</strong></p>
<ul>
<li>Deeply held beliefs about people, work, success</li>
<li><strong>Example:</strong> "Management knows best" vs. "Trust employees"</li>
</ul>

<h3>Creating a Positive Culture</h3>
<ol>
<li><strong>Model Desired Behaviors:</strong> Leaders set the cultural tone</li>
<li><strong>Hire for Culture Fit:</strong> Skills can be taught, values are harder to change</li>
<li><strong>Recognize and Reward:</strong> Celebrate behaviors that reflect your values</li>
<li><strong>Tell Stories:</strong> Share examples of your culture in action</li>
<li><strong>Be Consistent:</strong> Align words, policies, and actions</li>
</ol>

<div style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
<strong>🌍 South African Workplace Culture:</strong> Balance traditional hierarchical structures (respect for seniority) with modern collaborative approaches. Ubuntu values of community align well with inclusive, participative cultures.
</div>

<h2>5. Stakeholder Management</h2>

<h3>Stakeholder Theory</h3>
<p><strong>Core Principle:</strong> Organizations must consider ALL stakeholders, not just shareholders.</p>

<p><strong>Key Stakeholder Groups:</strong></p>
<ul>
<li><strong>Internal:</strong> Employees, managers, shareholders</li>
<li><strong>External:</strong> Customers, suppliers, communities, government</li>
<li><strong>Primary:</strong> Directly affected by business decisions</li>
<li><strong>Secondary:</strong> Indirectly affected or able to influence</li>
</ul>

<h3>Stakeholder Analysis Matrix</h3>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
<tr style="background: #e0e7ff;">
<th style="border: 1px solid #cbd5e1; padding: 10px;">Power/Interest</th>
<th style="border: 1px solid #cbd5e1; padding: 10px;">High Power</th>
<th style="border: 1px solid #cbd5e1; padding: 10px;">Low Power</th>
</tr>
<tr>
<td style="border: 1px solid #cbd5e1; padding: 10px;"><strong>High Interest</strong></td>
<td style="border: 1px solid #cbd5e1; padding: 10px;"><strong>Manage Closely</strong><br>Key players - engage actively</td>
<td style="border: 1px solid #cbd5e1; padding: 10px;"><strong>Keep Informed</strong><br>Show consideration</td>
</tr>
<tr>
<td style="border: 1px solid #cbd5e1; padding: 10px;"><strong>Low Interest</strong></td>
<td style="border: 1px solid #cbd5e1; padding: 10px;"><strong>Keep Satisfied</strong><br>Meet needs, avoid conflict</td>
<td style="border: 1px solid #cbd5e1; padding: 10px;"><strong>Monitor</strong><br>Minimal effort</td>
</tr>
</table>

<h3>Engagement Strategies</h3>
<ol>
<li><strong>Identify Stakeholders:</strong> Who is affected? Who has influence?</li>
<li><strong>Assess Interests:</strong> What do they care about?</li>
<li><strong>Determine Influence:</strong> How much power do they have?</li>
<li><strong>Develop Strategy:</strong> How will you engage each group?</li>
<li><strong>Communicate:</strong> Tailor messages to each stakeholder</li>
<li><strong>Monitor and Adjust:</strong> Relationships and interests change</li>
</ol>

<h2>6. Leader-Member Exchange (LMX) Theory</h2>

<h3>Understanding Dyadic Relationships</h3>

<p><strong>Core Concept:</strong> Leaders develop different relationships with each team member.</p>

<p><strong>High-Quality LMX Relationships:</strong></p>
<ul>
<li>Based on trust, respect, mutual obligation</li>
<li>More autonomy, support, information sharing</li>
<li>Higher job satisfaction and performance</li>
</ul>

<p><strong>Low-Quality LMX Relationships:</strong></p>
<ul>
<li>Based on formal job descriptions</li>
<li>Limited interaction beyond requirements</li>
<li>Lower satisfaction and motivation</li>
</ul>

<h3>Avoiding the "In-Group/Out-Group" Trap</h3>
<ol>
<li><strong>Be Aware:</strong> Recognize your natural tendencies</li>
<li><strong>Invest Equally:</strong> Spend quality time with all team members</li>
<li><strong>Provide Opportunities:</strong> Give everyone a chance to shine</li>
<li><strong>Be Fair:</strong> Apply standards consistently</li>
<li><strong>Build Trust:</strong> Show reliability and care for everyone</li>
</ol>

<div style="background: #fee2e2; padding: 15px; border-left: 4px solid #ef4444; margin: 20px 0;">
<strong>⚠️ Warning:</strong> In diverse South African workplaces, be especially mindful that in-group favoritism doesn''t follow racial, language, or gender lines. Ubuntu principles demand equal dignity for all.
</div>

<h2>7. Level 5 Leadership (Jim Collins)</h2>

<h3>The Leadership Hierarchy</h3>

<p><strong>Level 1: Highly Capable Individual</strong></p>
<ul>
<li>Contributes talent, knowledge, skills</li>
</ul>

<p><strong>Level 2: Contributing Team Member</strong></p>
<ul>
<li>Works well with others toward team goals</li>
</ul>

<p><strong>Level 3: Competent Manager</strong></p>
<ul>
<li>Organizes people and resources effectively</li>
</ul>

<p><strong>Level 4: Effective Leader</strong></p>
<ul>
<li>Catalyzes commitment to compelling vision</li>
</ul>

<p><strong>Level 5: Executive</strong></p>
<ul>
<li><strong>Personal Humility + Professional Will</strong></li>
<li>Builds enduring greatness through paradoxical blend of traits</li>
<li>Credits others for success, takes personal responsibility for problems</li>
<li>Focuses on organizational success, not personal glory</li>
</ul>

<h2>8. Learning Organizations (Peter Senge)</h2>

<h3>The Five Disciplines</h3>

<p><strong>1. Systems Thinking</strong></p>
<ul>
<li>See the big picture and interdependencies</li>
<li>Understand how actions create consequences over time</li>
</ul>

<p><strong>2. Personal Mastery</strong></p>
<ul>
<li>Continually clarify and deepen personal vision</li>
<li>Focus energy, develop patience, see reality objectively</li>
</ul>

<p><strong>3. Mental Models</strong></p>
<ul>
<li>Reflect on internal pictures of how the world works</li>
<li>Challenge assumptions, improve decision-making</li>
</ul>

<p><strong>4. Building Shared Vision</strong></p>
<ul>
<li>Create genuine commitment rather than compliance</li>
<li>Unite people around common purpose</li>
</ul>

<p><strong>5. Team Learning</strong></p>
<ul>
<li>Dialogue and discussion techniques</li>
<li>Collective intelligence exceeds individual intelligence</li>
</ul>

<h2>9. Change Management: Kotter''s 8-Step Model</h2>

<ol>
<li><strong>Create Urgency:</strong> Help others see the need for change</li>
<li><strong>Form Powerful Coalition:</strong> Assemble group with power to lead change</li>
<li><strong>Create Vision:</strong> Develop clear vision and strategy</li>
<li><strong>Communicate Vision:</strong> Use every channel to share vision</li>
<li><strong>Empower Action:</strong> Remove obstacles, enable risk-taking</li>
<li><strong>Generate Short-Term Wins:</strong> Plan for and celebrate early victories</li>
<li><strong>Consolidate Gains:</strong> Use credibility to change structures/policies</li>
<li><strong>Anchor in Culture:</strong> Make change stick in organizational DNA</li>
</ol>

<h2>10. Diversity and Inclusion Leadership</h2>

<h3>Understanding Social Identity Theory</h3>
<p>People categorize themselves and others into groups, leading to in-group favoritism. Leaders must actively counteract this.</p>

<h3>Addressing Implicit Bias</h3>
<ul>
<li><strong>Acknowledge:</strong> Everyone has biases from life experiences</li>
<li><strong>Measure:</strong> Take Implicit Association Tests (IATs)</li>
<li><strong>Slow Down:</strong> Make important decisions with deliberation</li>
<li><strong>Seek Input:</strong> Get diverse perspectives before deciding</li>
<li><strong>Use Structured Processes:</strong> Remove bias from hiring, promotion</li>
</ul>

<h3>Creating Inclusive Environments</h3>
<ol>
<li><strong>Representation:</strong> Ensure diversity at all organizational levels</li>
<li><strong>Psychological Safety:</strong> People feel safe to speak up, take risks</li>
<li><strong>Fair Processes:</strong> Transparent, equitable policies and practices</li>
<li><strong>Belonging:</strong> Everyone feels valued and part of the team</li>
<li><strong>Growth:</strong> Equal access to development opportunities</li>
</ol>

<div style="background: #ecfdf5; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0;">
<strong>🇿🇦 South African Excellence:</strong> SA''s diversity is a competitive advantage. Leaders who harness perspectives from different cultures, languages, and backgrounds drive ~50% better innovation and ~30% higher team performance.
</div>

<h2>11. Virtual and Hybrid Team Leadership</h2>

<h3>Challenges of Remote Leadership</h3>
<ul>
<li>Communication barriers and time zone differences</li>
<li>Building trust without face-to-face interaction</li>
<li>Maintaining culture and team cohesion</li>
<li>Ensuring equitable treatment of remote vs. office workers</li>
</ul>

<h3>Best Practices</h3>
<ol>
<li><strong>Over-Communicate:</strong> Be more explicit and frequent</li>
<li><strong>Use Video:</strong> See faces, read body language when possible</li>
<li><strong>Document Everything:</strong> Write decisions, action items, rationales</li>
<li><strong>Create Rituals:</strong> Regular team calls, virtual coffee chats</li>
<li><strong>Measure Outcomes:</strong> Focus on results, not hours worked</li>
<li><strong>Invest in Tools:</strong> Collaboration platforms, project management software</li>
</ol>

<h2>12. Providing Effective Feedback</h2>

<h3>The SBI Model</h3>

<p><strong>Situation:</strong> When and where did it happen?</p>
<p><strong>Behavior:</strong> What specific actions did you observe?</p>
<p><strong>Impact:</strong> What was the effect on you, the team, or the work?</p>

<p><strong>Example:</strong></p>
<p><em>"Yesterday in the client meeting (Situation), you interrupted Sarah three times when she was presenting (Behavior). This made Sarah lose confidence and the client questioned our team cohesion (Impact)."</em></p>

<h3>Growth vs. Fixed Mindset Feedback</h3>

<p><strong>Fixed Mindset (Avoid):</strong></p>
<ul>
<li>"You''re not a natural leader"</li>
<li>"Some people just can''t present well"</li>
</ul>

<p><strong>Growth Mindset (Encourage):</strong></p>
<ul>
<li>"You''re developing your leadership skills - I see progress"</li>
<li>"Presentation is a skill you''re building - let''s work on it together"</li>
</ul>

<h2>Key Takeaways</h2>

<div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
<h3 style="margin-top: 0;">✅ Remember:</h3>
<ul>
<li><strong>Teams develop</strong> through predictable stages - guide them through Storming</li>
<li><strong>Adapt your style</strong> based on team readiness and task requirements</li>
<li><strong>Culture matters</strong> - leaders shape organizational culture through actions</li>
<li><strong>Stakeholders</strong> require different engagement strategies based on power/interest</li>
<li><strong>Continuous learning</strong> is essential for leaders and organizations</li>
<li><strong>Diversity and inclusion</strong> require active leadership, not just good intentions</li>
<li><strong>Effective feedback</strong> focuses on behavior and growth, not personality</li>
</ul>
</div>

<h2>Prepare for Your Quiz</h2>
<p>The quiz for this module will test your understanding of:</p>
<ul>
<li>Team development stages (Tuckman''s model)</li>
<li>Situational leadership and Path-Goal theory</li>
<li>Organizational culture (Schein''s levels)</li>
<li>Stakeholder analysis and management</li>
<li>LMX theory and Level 5 leadership</li>
<li>Learning organizations and change management (Kotter)</li>
<li>Diversity, inclusion, and bias mitigation</li>
<li>Virtual/hybrid team leadership</li>
<li>Effective feedback techniques</li>
</ul>

<p><strong>You need 70% to pass. Good luck!</strong> 🎯</p>',
        'lesson',
        2,
        '50 minutes'
    ) RETURNING id INTO v_module2_id;
    
    RAISE NOTICE 'Created Module 2 with ID: %', v_module2_id;
    
    -- Success message
    RAISE NOTICE '========================================';
    RAISE NOTICE 'SUCCESS! Leadership course modules created';
    RAISE NOTICE 'Course ID: %', v_course_id;
    RAISE NOTICE 'Module 1 ID: %', v_module1_id;
    RAISE NOTICE 'Module 2 ID: %', v_module2_id;
    RAISE NOTICE '========================================';
    
END $$;
