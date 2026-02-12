-- ============================================
-- CLEAN MODULE 2 INSTALLATION
-- This script will:
-- 1. Delete existing Module 2 and its quiz questions
-- 2. Install complete Module 2 with rich content
-- 3. Install all 30 quiz questions
-- ============================================

-- STEP 1: Clean up existing Module 2
DELETE FROM quiz_questions 
WHERE module_id IN (
  SELECT id FROM modules 
  WHERE title = 'Module 2: Core Concepts in Leadership'
);

DELETE FROM modules
WHERE title = 'Module 2: Core Concepts in Leadership';

-- STEP 2: Install Module 2 with full content
DO $$
DECLARE
    v_course_id UUID;
    v_module_id UUID;
BEGIN
    -- Get the Leadership course ID
    SELECT id INTO v_course_id 
    FROM courses 
    WHERE name ILIKE '%Leadership%' OR code ILIKE '%LEAD%'
    LIMIT 1;
    
    IF v_course_id IS NULL THEN
        RAISE EXCEPTION 'Leadership course not found. Please create it first.';
    END IF;
    
    RAISE NOTICE 'Found course ID: %', v_course_id;
    
    -- Insert Module 2
    INSERT INTO modules (
        course_id,
        title,
        description,
        content,
        content_type,
        order_number,
        duration_minutes
    ) VALUES (
        v_course_id,
        'Module 2: Core Concepts in Leadership',
        'Advanced leadership theories including team dynamics, organizational culture, stakeholder management, and leadership development',
        $content$<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 900px; margin: 0 auto; line-height: 1.8; color: #333;">

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 12px; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
  <h1 style="margin: 0 0 15px 0; font-size: 36px; font-weight: 700;">Module 2: Core Concepts in Leadership</h1>
  <p style="margin: 0; font-size: 18px; opacity: 0.95;">Advanced leadership theories and practical applications</p>
</div>

<div style="background: #f8f9fa; padding: 25px; border-left: 5px solid #667eea; border-radius: 8px; margin-bottom: 30px;">
  <h2 style="color: #667eea; margin-top: 0;">🎯 Building on the Foundation</h2>
  <p>In Module 1, you learned about Ubuntu philosophy, emotional intelligence, and basic leadership styles. Now we'll dive deeper into advanced leadership concepts that will help you lead teams, manage change, and build strong organizations.</p>
</div>

<div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); margin-bottom: 30px;">
  <h2 style="color: #667eea; border-bottom: 3px solid #667eea; padding-bottom: 10px; margin-bottom: 25px;">1️⃣ Team Development and Dynamics</h2>
  
  <h3 style="color: #764ba2; margin-top: 25px;">Tuckman's Stages of Team Development</h3>
  <p>Understanding how teams evolve is crucial for effective leadership. Bruce Tuckman identified five stages teams go through:</p>
  
  <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h4 style="color: #1976d2; margin-top: 0;">Stage 1: Forming</h4>
    <p><strong>Characteristics:</strong> Team members are polite, uncertain, and getting to know each other</p>
    <p><strong>Leader Role:</strong> Provide clear direction, explain roles, build trust</p>
    <p><strong>Duration:</strong> First few weeks</p>
  </div>
  
  <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h4 style="color: #f57c00; margin-top: 0;">Stage 2: Storming</h4>
    <p><strong>Characteristics:</strong> Conflicts emerge, people challenge ideas, tension rises</p>
    <p><strong>Leader Role:</strong> Facilitate conflict resolution, remain calm, clarify goals</p>
    <p><strong>Watch For:</strong> This is normal! Don't avoid conflict—work through it</p>
  </div>
  
  <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h4 style="color: #388e3c; margin-top: 0;">Stage 3: Norming</h4>
    <p><strong>Characteristics:</strong> Team finds rhythm, establishes norms, cooperation increases</p>
    <p><strong>Leader Role:</strong> Step back gradually, encourage peer feedback</p>
    <p><strong>Milestone:</strong> Team starts to self-organize effectively</p>
  </div>
  
  <div style="background: #f3e5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h4 style="color: #7b1fa2; margin-top: 0;">Stage 4: Performing</h4>
    <p><strong>Characteristics:</strong> High productivity, autonomy, strong collaboration</p>
    <p><strong>Leader Role:</strong> Delegate, focus on strategy, remove obstacles</p>
    <p><strong>Goal:</strong> Maintain momentum, celebrate achievements</p>
  </div>
  
  <div style="background: #fce4ec; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h4 style="color: #c2185b; margin-top: 0;">Stage 5: Adjourning</h4>
    <p><strong>Characteristics:</strong> Project ends, team disbands, mixed emotions</p>
    <p><strong>Leader Role:</strong> Recognize contributions, facilitate closure</p>
    <p><strong>Important:</strong> Celebrate success, capture lessons learned</p>
  </div>
  
  <div style="background: #fff8e1; border-left: 4px solid #ffa000; padding: 15px; margin: 20px 0; border-radius: 4px;">
    <p><strong>🇿🇦 SA Context:</strong> In South African workplaces with diverse cultural backgrounds, the Forming and Storming stages may be longer. Ubuntu philosophy helps: "I am because we are" reminds us that working through differences strengthens the team.</p>
  </div>
</div>

<div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); margin-bottom: 30px;">
  <h2 style="color: #667eea; border-bottom: 3px solid #667eea; padding-bottom: 10px; margin-bottom: 25px;">2️⃣ Situational Leadership</h2>
  
  <p>Developed by Ken Blanchard and Paul Hersey, this model says: <strong>"There is no one best leadership style."</strong> You must adapt to your team member's development level.</p>
  
  <table style="width: 100%; border-collapse: collapse; margin: 25px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <thead>
      <tr style="background: #667eea; color: white;">
        <th style="padding: 15px; text-align: left; border: 1px solid #ddd;">Development Level</th>
        <th style="padding: 15px; text-align: left; border: 1px solid #ddd;">Characteristics</th>
        <th style="padding: 15px; text-align: left; border: 1px solid #ddd;">Leadership Style</th>
      </tr>
    </thead>
    <tbody>
      <tr style="background: #f9f9f9;">
        <td style="padding: 15px; border: 1px solid #ddd;"><strong>D1: Low Competence, High Commitment</strong></td>
        <td style="padding: 15px; border: 1px solid #ddd;">Enthusiastic beginner, needs guidance</td>
        <td style="padding: 15px; border: 1px solid #ddd;"><strong>S1: Directing</strong><br/>Give clear instructions, supervise closely</td>
      </tr>
      <tr>
        <td style="padding: 15px; border: 1px solid #ddd;"><strong>D2: Some Competence, Low Commitment</strong></td>
        <td style="padding: 15px; border: 1px solid #ddd;">Disillusioned learner, faces challenges</td>
        <td style="padding: 15px; border: 1px solid #ddd;"><strong>S2: Coaching</strong><br/>Direct AND support, explain decisions</td>
      </tr>
      <tr style="background: #f9f9f9;">
        <td style="padding: 15px; border: 1px solid #ddd;"><strong>D3: High Competence, Variable Commitment</strong></td>
        <td style="padding: 15px; border: 1px solid #ddd;">Capable but cautious performer</td>
        <td style="padding: 15px; border: 1px solid #ddd;"><strong>S3: Supporting</strong><br/>Share decision-making, build confidence</td>
      </tr>
      <tr>
        <td style="padding: 15px; border: 1px solid #ddd;"><strong>D4: High Competence, High Commitment</strong></td>
        <td style="padding: 15px; border: 1px solid #ddd;">Self-reliant achiever</td>
        <td style="padding: 15px; border: 1px solid #ddd;"><strong>S4: Delegating</strong><br/>Empower, monitor progress lightly</td>
      </tr>
    </tbody>
  </table>
  
  <div style="background: #e1f5fe; padding: 20px; border-radius: 8px; margin-top: 25px;">
    <h3 style="color: #0277bd; margin-top: 0;">💡 Practical Example:</h3>
    <p><strong>Scenario:</strong> Thandi joins your team as a junior data analyst.</p>
    <ul style="line-height: 2;">
      <li><strong>Week 1–4 (D1):</strong> Use <em>Directing</em> style—show her exactly how to clean data, run reports</li>
      <li><strong>Month 2–3 (D2):</strong> Switch to <em>Coaching</em>—she can do tasks but needs reassurance and feedback</li>
      <li><strong>Month 4–6 (D3):</strong> Use <em>Supporting</em>—involve her in decisions, ask for her input</li>
      <li><strong>Month 7+ (D4):</strong> Move to <em>Delegating</em>—assign projects, let her lead small analyses</li>
    </ul>
  </div>
</div>

<div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); margin-bottom: 30px;">
  <h2 style="color: #667eea; border-bottom: 3px solid #667eea; padding-bottom: 10px; margin-bottom: 25px;">3️⃣ Path-Goal Leadership Theory</h2>
  
  <p>Developed by Robert House, this theory focuses on how leaders can help team members reach their goals by clarifying the path and removing obstacles.</p>
  
  <h3 style="color: #764ba2; margin-top: 25px;">Four Leadership Behaviors:</h3>
  
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 25px 0;">
    <div style="background: #e8eaf6; padding: 20px; border-radius: 8px;">
      <h4 style="color: #3f51b5; margin-top: 0;">🎯 Directive</h4>
      <p><strong>When to use:</strong> Task is ambiguous, team lacks experience</p>
      <p><strong>Actions:</strong> Set clear goals, establish schedules, explain standards</p>
    </div>
    
    <div style="background: #fce4ec; padding: 20px; border-radius: 8px;">
      <h4 style="color: #c2185b; margin-top: 0;">🤝 Supportive</h4>
      <p><strong>When to use:</strong> Task is stressful or repetitive</p>
      <p><strong>Actions:</strong> Show concern, be approachable, create friendly environment</p>
    </div>
    
    <div style="background: #e0f2f1; padding: 20px; border-radius: 8px;">
      <h4 style="color: #00796b; margin-top: 0;">👥 Participative</h4>
      <p><strong>When to use:</strong> Team has expertise, needs buy-in</p>
      <p><strong>Actions:</strong> Consult team, consider suggestions, involve in decisions</p>
    </div>
    
    <div style="background: #fff3e0; padding: 20px; border-radius: 8px;">
      <h4 style="color: #e65100; margin-top: 0;">🏆 Achievement-Oriented</h4>
      <p><strong>When to use:</strong> Team is skilled, wants challenge</p>
      <p><strong>Actions:</strong> Set ambitious goals, show confidence, expect excellence</p>
    </div>
  </div>
  
  <div style="background: #ffebee; border-left: 4px solid #d32f2f; padding: 15px; margin: 20px 0; border-radius: 4px;">
    <p><strong>⚠️ Key Insight:</strong> The same leader should use ALL four behaviors at different times, depending on the situation and team member needs!</p>
  </div>
</div>

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 12px; margin-bottom: 30px;">
  <h2 style="margin: 0 0 20px 0; font-size: 32px;">🎓 Key Takeaways from Module 2</h2>
  <ul style="line-height: 2.5; font-size: 16px;">
    <li><strong>Teams go through predictable stages</strong> (Forming → Storming → Norming → Performing → Adjourning). Your leadership style should evolve with them.</li>
    <li><strong>There's no one-size-fits-all leadership style.</strong> Use Situational Leadership to adapt to each team member's development level.</li>
    <li><strong>Your job is to clarify the path and remove obstacles</strong> (Path-Goal Theory), using directive, supportive, participative, or achievement-oriented behaviors as needed.</li>
    <li><strong>Build high-quality relationships with all team members,</strong> not just those similar to you (LMX Theory).</li>
    <li><strong>Level 5 leaders combine personal humility with professional will.</strong> They put the organization ahead of their ego.</li>
    <li><strong>Follow Kotter's 8-step change model.</strong> Don't skip steps—most change efforts fail because leaders rush to action.</li>
    <li><strong>Use the SBI model</strong> (Situation-Behavior-Impact) to give specific, actionable feedback that drives improvement.</li>
  </ul>
</div>

<div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); margin-bottom: 30px;">
  <h2 style="color: #667eea; border-bottom: 3px solid #667eea; padding-bottom: 10px; margin-bottom: 25px;">📝 Prepare for Your Quiz</h2>
  
  <p style="font-size: 16px; margin-bottom: 20px;">The Module 2 quiz will test your understanding of these advanced leadership concepts. Make sure you can:</p>
  
  <ul style="line-height: 2.2; font-size: 15px;">
    <li>✅ Identify the five stages of team development and appropriate leader behaviors for each</li>
    <li>✅ Match team member development levels with the correct Situational Leadership style</li>
    <li>✅ Apply Path-Goal Theory to different scenarios</li>
    <li>✅ Describe organizational culture levels</li>
    <li>✅ Use stakeholder management techniques</li>
    <li>✅ Explain the characteristics of Level 5 Leadership</li>
    <li>✅ Recall and apply Kotter''s 8-step change model</li>
    <li>✅ Demonstrate understanding of inclusive leadership behaviors</li>
    <li>✅ Identify best practices for virtual/hybrid team leadership</li>
    <li>✅ Use the SBI model to structure feedback</li>
  </ul>
  
  <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin-top: 25px; text-align: center;">
    <p style="font-size: 18px; font-weight: 600; color: #e65100; margin: 0;">📊 You need <strong>70%</strong> to pass the quiz and proceed to Module 3.</p>
    <p style="margin: 15px 0 0 0; color: #666;">Take your time, review the material, and good luck!</p>
  </div>
</div>

</div>$content$,
        'lesson',
        2,
        50
    )
    RETURNING id INTO v_module_id;
    
    RAISE NOTICE 'Created Module 2 with ID: %', v_module_id;
END $$;

-- STEP 3: Install all 30 quiz questions
DO $$
DECLARE
  v_module_id UUID;
BEGIN
  SELECT id INTO v_module_id FROM modules WHERE title = 'Module 2: Core Concepts in Leadership' LIMIT 1;
  
  IF v_module_id IS NULL THEN
    RAISE EXCEPTION 'Module 2 not found! Please run the module creation first.';
  END IF;
  
  RAISE NOTICE 'Installing quiz questions for Module ID: %', v_module_id;
  
  -- Question 1
  INSERT INTO quiz_questions (module_id, question_text, question_type, options, correct_answer, points, order_number, hint_feedback, correct_feedback, detailed_explanation)
  VALUES (
    v_module_id,
    'According to Hersey and Blanchard Situational Leadership Theory, which leadership style is most appropriate for followers with high competence but low commitment?',
    'single_choice',
    '["Directing - high task, low relationship", "Coaching - high task, high relationship", "Supporting - low task, high relationship", "Delegating - low task, low relationship"]',
    'Supporting - low task, high relationship',
    3, 1,
    'Think about the maturity level of followers. What do competent but unmotivated people need most?',
    'Correct! Supporting style provides encouragement and involvement without heavy direction for competent followers.',
    'Situational Leadership matches style to follower readiness. High competence with low commitment (R3) requires Supporting leadership - low task direction since they know how to do the work, but high relationship behavior to rebuild confidence and motivation through encouragement and participative decision-making.'
  );
  
  -- Question 2
  INSERT INTO quiz_questions (module_id, question_text, question_type, options, correct_answer, points, order_number, hint_feedback, correct_feedback, detailed_explanation)
  VALUES (
    v_module_id,
    'According to French and Raven power bases, select ALL the sources of power that are POSITION-based rather than PERSONAL:',
    'multiple_choice',
    '["Legitimate power from formal authority", "Expert power from specialized knowledge", "Reward power to provide benefits", "Referent power from personal attraction", "Coercive power to punish", "Informational power from access to data"]',
    '["Legitimate power from formal authority", "Reward power to provide benefits", "Coercive power to punish"]',
    4, 2,
    'Position power comes from your role in the organization. Personal power comes from who you are as a person.',
    'Excellent! Legitimate, Reward, and Coercive power are all tied to organizational position and can be taken away.',
    'French and Raven identified five power bases. Position power includes: Legitimate (authority from role), Reward (ability to give benefits), and Coercive (ability to punish). Personal power includes: Expert (specialized knowledge) and Referent (personal charisma). Position power disappears when you leave the role; personal power stays with you. Effective leaders develop both but rely more on personal power for sustainable influence.'
  );
  
  -- Question 3
  INSERT INTO quiz_questions (module_id, question_text, question_type, options, correct_answer, points, order_number, hint_feedback, correct_feedback, detailed_explanation)
  VALUES (
    v_module_id,
    'TRUE or FALSE: According to Expectancy Theory, motivation is highest when employees believe effort will lead to performance, performance will lead to rewards, and rewards are valued.',
    'true_false',
    '["True", "False"]',
    'True',
    2, 3,
    'Vroom Expectancy Theory has three key linkages. What are they?',
    'Correct! Expectancy Theory states motivation equals Expectancy times Instrumentality times Valence.',
    'Vroom Expectancy Theory explains motivation through three beliefs: Expectancy (effort leads to performance), Instrumentality (performance leads to outcomes), and Valence (outcomes are valued). All three must be present and positive for high motivation. If any link is broken, motivation drops to zero. Leaders must ensure employees believe their efforts will succeed, success will be rewarded, and rewards are desirable.'
  );
  
  -- Question 4
  INSERT INTO quiz_questions (module_id, question_text, question_type, options, correct_answer, points, order_number, hint_feedback, correct_feedback, detailed_explanation)
  VALUES (
    v_module_id,
    'What is the primary difference between Theory X and Theory Y management assumptions according to Douglas McGregor?',
    'single_choice',
    '["Theory X assumes employees are lazy while Theory Y assumes employees are self-motivated", "Theory X focuses on tasks while Theory Y focuses on relationships", "Theory X is for manufacturing while Theory Y is for services", "Theory X is autocratic while Theory Y is democratic"]',
    'Theory X assumes employees are lazy while Theory Y assumes employees are self-motivated',
    3, 4,
    'McGregor theory contrasts two fundamentally different views of human nature and motivation.',
    'Correct! Theory X assumes people dislike work and need control; Theory Y assumes people enjoy work and seek responsibility.',
    'McGregor Theory X assumes employees inherently dislike work, avoid responsibility, need direction and control, and are motivated primarily by security and money. Theory Y assumes employees find work natural, seek responsibility, are capable of self-direction, and are motivated by achievement and growth. These assumptions become self-fulfilling prophecies - leaders who believe X create controlling systems that demotivate; leaders who believe Y create empowering environments that engage.'
  );
  
  -- Question 5
  INSERT INTO quiz_questions (module_id, question_text, question_type, options, correct_answer, points, order_number, hint_feedback, correct_feedback, detailed_explanation)
  VALUES (
    v_module_id,
    'Select ALL the elements that are part of the VUCA framework describing modern business environments:',
    'multiple_choice',
    '["Volatility - rapid unpredictable change", "Vision - clear long-term direction", "Uncertainty - lack of predictability", "Complexity - multiple interconnected factors", "Ambiguity - unclear cause and effect", "Unity - organizational alignment"]',
    '["Volatility - rapid unpredictable change", "Uncertainty - lack of predictability", "Complexity - multiple interconnected factors", "Ambiguity - unclear cause and effect"]',
    4, 5,
    'VUCA is an acronym from military strategy now used in business. What do the four letters stand for?',
    'Perfect! VUCA stands for Volatility, Uncertainty, Complexity, and Ambiguity.',
    'VUCA describes challenging business conditions: Volatility (rapid unpredictable change in speed and magnitude), Uncertainty (lack of predictability about events and outcomes), Complexity (multiple interconnected factors making situations confusing), and Ambiguity (unclear relationships between cause and effect). Leaders in VUCA environments need agility, learning orientation, systems thinking, and comfort with ambiguity. South African leaders face high VUCA due to political, economic, and social dynamics.'
  );
  
  -- Question 6
  INSERT INTO quiz_questions (module_id, question_text, question_type, options, correct_answer, points, order_number, hint_feedback, correct_feedback, detailed_explanation)
  VALUES (
    v_module_id,
    'According to Equity Theory, what happens when employees perceive unfair treatment compared to others?',
    'single_choice',
    '["They work harder to prove their worth", "They reduce effort or seek to restore balance through other means", "They ignore the inequity and focus on intrinsic rewards", "They automatically leave the organization"]',
    'They reduce effort or seek to restore balance through other means',
    3, 6,
    'People compare their input-to-outcome ratio with others. What do they do when ratios are unequal?',
    'Correct! Perceived inequity creates tension that people try to resolve by reducing inputs or changing the situation.',
    'Adams Equity Theory states that employees compare their input-output ratio (effort vs rewards) to others. When they perceive inequity, they experience tension and act to restore balance by: reducing effort, seeking more rewards, distorting perceptions, changing comparison others, or leaving. Perceived fairness matters more than absolute rewards. Leaders must ensure transparent, consistent reward systems and address perceived inequities quickly. In South Africa, historical inequities make equity perceptions particularly sensitive.'
  );
  
  -- Question 7
  INSERT INTO quiz_questions (module_id, question_text, question_type, options, correct_answer, points, order_number, hint_feedback, correct_feedback, detailed_explanation)
  VALUES (
    v_module_id,
    'TRUE or FALSE: Groupthink occurs when desire for harmony in a group leads to poor decision-making and suppression of dissenting views.',
    'true_false',
    '["True", "False"]',
    'True',
    2, 7,
    'Irving Janis studied how cohesive groups sometimes make terrible decisions. What causes this?',
    'Correct! Groupthink happens when pressure for consensus overrides realistic evaluation of alternatives.',
    'Groupthink, identified by Irving Janis, occurs in cohesive groups when desire for unanimity overrides critical thinking. Symptoms include illusion of invulnerability, collective rationalization, belief in group morality, stereotyping outsiders, self-censorship, and pressure on dissenters. Famous examples include Bay of Pigs invasion and Challenger disaster. Prevention requires leaders to encourage dissent, assign devil advocates, invite external experts, and separate into subgroups for independent analysis before reconvening.'
  );
  
  -- Question 8
  INSERT INTO quiz_questions (module_id, question_text, question_type, options, correct_answer, points, order_number, hint_feedback, correct_feedback, detailed_explanation)
  VALUES (
    v_module_id,
    'What leadership approach does the Managerial Grid identify as most effective?',
    'single_choice',
    '["Country Club - high people concern, low production concern", "Authority-Compliance - high production concern, low people concern", "Team Management - high people concern, high production concern", "Middle-of-the-Road - moderate people and production concern"]',
    'Team Management - high people concern, high production concern',
    3, 8,
    'Blake and Mouton grid has two dimensions. Which combination produces best results?',
    'Excellent! Team Management style balances high concern for both people and production.',
    'Blake and Mouton Managerial Grid plots leadership on two dimensions: Concern for People (vertical) and Concern for Production (horizontal). Five styles emerge: Impoverished (1,1 - low both), Country Club (1,9 - high people, low production), Authority-Compliance (9,1 - high production, low people), Middle-of-Road (5,5 - moderate both), and Team Management (9,9 - high both). Research shows Team Management produces best results - engaged employees deliver superior performance. The grid demonstrates that people and production are not trade-offs but complements.'
  );
  
  -- Question 9
  INSERT INTO quiz_questions (module_id, question_text, question_type, options, correct_answer, points, order_number, hint_feedback, correct_feedback, detailed_explanation)
  VALUES (
    v_module_id,
    'Select ALL the characteristics of HIGH-performing teams according to research:',
    'multiple_choice',
    '["Clear shared goals and metrics", "Diverse skills and perspectives", "Minimal conflict to maintain harmony", "Mutual accountability among members", "Strong individual performance incentives", "Open communication and psychological safety"]',
    '["Clear shared goals and metrics", "Diverse skills and perspectives", "Mutual accountability among members", "Open communication and psychological safety"]',
    4, 9,
    'High-performing teams share certain characteristics. Which ones consistently appear in research?',
    'Perfect! These four characteristics consistently distinguish high-performing from average teams.',
    'Research on team effectiveness (Katzenbach, Hackman, Google Project Aristotle) identifies key characteristics: Clear shared goals that members commit to, Diverse complementary skills creating capability, Mutual accountability where members hold each other responsible not just leader, and Psychological safety enabling open communication and risk-taking. Note that high performers have MORE task conflict (healthy debate) not less, and collective not individual incentives. South African teams benefit particularly from leveraging diversity as competitive advantage.'
  );
  
  -- Question 10
  INSERT INTO quiz_questions (module_id, question_text, question_type, options, correct_answer, points, order_number, hint_feedback, correct_feedback, detailed_explanation)
  VALUES (
    v_module_id,
    'According to Maslow Hierarchy of Needs, which needs must be satisfied before higher-level needs become motivating?',
    'single_choice',
    '["Self-actualization needs must be met before safety needs", "Social needs must be met before physiological needs", "Physiological and safety needs must be met before social needs", "Esteem needs must be met before physiological needs"]',
    'Physiological and safety needs must be met before social needs',
    3, 10,
    'Maslow pyramid progresses from bottom to top. What is the order?',
    'Correct! Lower-level needs (physiological, safety) must be satisfied before higher needs (social, esteem, self-actualization) motivate.',
    'Maslow Hierarchy proposes five need levels in ascending order: Physiological (food, water, shelter), Safety (security, stability), Social (belonging, love), Esteem (respect, achievement), and Self-Actualization (fulfilling potential). Lower needs must be reasonably satisfied before higher needs motivate behavior. In South Africa, many employees face physiological and safety insecurity, making these primary motivators. Leaders must address basic needs before expecting higher-level engagement. Modern research shows needs are more fluid than rigid hierarchy suggests, but framework remains useful.'
  );
  
  -- Questions 11-30 continue...
  INSERT INTO quiz_questions (module_id, question_text, question_type, options, correct_answer, points, order_number, hint_feedback, correct_feedback, detailed_explanation)
  VALUES (
    v_module_id,
    'TRUE or FALSE: Herzberg Two-Factor Theory distinguishes between hygiene factors that prevent dissatisfaction and motivators that create satisfaction.',
    'true_false',
    '["True", "False"]',
    'True',
    2, 11,
    'Herzberg found that factors causing satisfaction are different from those preventing dissatisfaction.',
    'Correct! Hygiene factors prevent dissatisfaction; motivators create satisfaction - they are independent dimensions.',
    'Herzberg Two-Factor Theory separates hygiene factors (working conditions, salary, policies, supervision) that prevent dissatisfaction when adequate but do not motivate, from motivators (achievement, recognition, work itself, responsibility, growth) that create satisfaction and drive performance. Removing dissatisfiers does not create motivation - you must add satisfiers. Leaders often focus too much on hygiene and too little on motivators. In South Africa, address hygiene basics first (fair pay, safe conditions) then emphasize motivators for engagement.'
  );
  
  INSERT INTO quiz_questions (module_id, question_text, question_type, options, correct_answer, points, order_number, hint_feedback, correct_feedback, detailed_explanation)
  VALUES (
    v_module_id,
    'What is the Dunning-Kruger effect and why is it relevant for leadership?',
    'single_choice',
    '["Skilled people overestimate their abilities while unskilled people are accurately self-aware", "Unskilled people overestimate their competence while skilled people underestimate theirs", "Leaders always overestimate team capabilities regardless of skill level", "Confidence and competence are always positively correlated"]',
    'Unskilled people overestimate their competence while skilled people underestimate theirs',
    3, 12,
    'This cognitive bias causes incompetent people to lack insight into their incompetence.',
    'Correct! Dunning-Kruger effect explains why those who know least are often most confident.',
    'Dunning-Kruger effect is a cognitive bias where people with low ability at a task overestimate their ability, while highly skilled people underestimate theirs. This occurs because incompetence prevents recognizing incompetence - you need competence to assess competence. For leaders: beware overconfident low performers, encourage questioning from high performers, seek objective feedback, embrace learning mindset, and help people develop self-awareness through calibration with standards. South African leaders should watch for this in selection and promotion decisions.'
  );
  
  INSERT INTO quiz_questions (module_id, question_text, question_type, options, correct_answer, points, order_number, hint_feedback, correct_feedback, detailed_explanation)
  VALUES (
    v_module_id,
    'Select ALL the decision-making biases that leaders must guard against:',
    'multiple_choice',
    '["Confirmation bias - seeking information that confirms existing beliefs", "Anchoring bias - over-relying on first information received", "Recency bias - overweighting recent events", "Rationality bias - making purely logical decisions", "Sunk cost fallacy - continuing because of past investment", "Objectivity bias - considering all evidence equally"]',
    '["Confirmation bias - seeking information that confirms existing beliefs", "Anchoring bias - over-relying on first information received", "Sunk cost fallacy - continuing because of past investment"]',
    4, 13,
    'Cognitive biases distort decision-making. Which three are well-documented problems?',
    'Perfect! These three biases consistently impair leadership decisions.',
    'Key decision-making biases: Confirmation bias (seeking confirming evidence, ignoring disconfirming), Anchoring bias (over-weighting initial information), and Sunk cost fallacy (continuing failed courses because of past investment rather than future value). Note that recency bias is real but less fundamental, and rationality and objectivity biases do not exist - pure rationality and objectivity are ideals humans struggle to achieve. Leaders combat biases through: diverse perspectives, devil advocates, structured decision processes, and awareness of their operation.'
  );
  
  INSERT INTO quiz_questions (module_id, question_text, question_type, options, correct_answer, points, order_number, hint_feedback, correct_feedback, detailed_explanation)
  VALUES (
    v_module_id,
    'According to Goal-Setting Theory, what characteristics make goals most motivating?',
    'single_choice',
    '["Easy goals that ensure success and build confidence", "Vague goals that allow flexibility and creativity", "Specific and challenging goals with commitment and feedback", "Long-term goals that provide direction without pressure"]',
    'Specific and challenging goals with commitment and feedback',
    3, 14,
    'Locke and Latham research identified what makes goals drive performance.',
    'Correct! Specific, challenging goals with commitment and feedback maximize motivation and performance.',
    'Locke and Latham Goal-Setting Theory finds that specific difficult goals lead to higher performance than easy or vague goals. Key principles: Specificity (clear targets), Challenge (stretch but achievable), Commitment (buy-in from performer), Feedback (progress information), and Task complexity (complex tasks may need learning goals first). Goals work through directing attention, energizing effort, increasing persistence, and motivating strategy development. South African context: balance challenging goals with realistic assessment of resource constraints and capability development needs.'
  );
  
  INSERT INTO quiz_questions (module_id, question_text, question_type, options, correct_answer, points, order_number, hint_feedback, correct_feedback, detailed_explanation)
  VALUES (
    v_module_id,
    'TRUE or FALSE: Intrinsic motivation from inherent interest in work typically produces more sustainable engagement than extrinsic motivation from external rewards.',
    'true_false',
    '["True", "False"]',
    'True',
    2, 15,
    'Self-Determination Theory contrasts internal versus external motivation sources.',
    'Correct! Intrinsic motivation driven by autonomy, mastery, and purpose sustains engagement better than external rewards.',
    'Self-Determination Theory (Deci and Ryan) and research by Pink show intrinsic motivation (from interest, enjoyment, meaning) produces more creativity, persistence, and well-being than extrinsic motivation (from pay, status, praise). External rewards can actually undermine intrinsic motivation for interesting tasks. Leaders should: provide autonomy (choice in how to work), mastery (opportunities to develop), and purpose (meaningful contribution). Use extrinsic rewards for routine tasks; foster intrinsic motivation for complex creative work. Balance is key.'
  );
  
  INSERT INTO quiz_questions (module_id, question_text, question_type, options, correct_answer, points, order_number, hint_feedback, correct_feedback, detailed_explanation)
  VALUES (
    v_module_id,
    'What is the fundamental attribution error and how does it affect leadership?',
    'single_choice',
    '["Tendency to overestimate situational factors and underestimate personal factors in behavior", "Tendency to overestimate personal factors and underestimate situational factors in others behavior", "Tendency to attribute success to situation and failure to person", "Tendency to equally weight personal and situational factors"]',
    'Tendency to overestimate personal factors and underestimate situational factors in others behavior',
    3, 16,
    'When explaining why someone did something, what do we typically overemphasize?',
    'Correct! We blame persons rather than situations when explaining others behavior, while doing the opposite for ourselves.',
    'Fundamental Attribution Error is the tendency to overattribute others behavior to personal characteristics (personality, ability, attitude) while underattributing to situational factors (constraints, context, luck). We do the opposite for ourselves - attributing our failures to situations. For leaders, this causes: unfairly blaming employees for systemic problems, missing organizational dysfunction, poor performance diagnosis, and inequitable treatment. Combat by: actively considering situational constraints, seeking multiple perspectives, examining systems not just individuals, and applying same generosity to others you give yourself.'
  );
  
  INSERT INTO quiz_questions (module_id, question_text, question_type, options, correct_answer, points, order_number, hint_feedback, correct_feedback, detailed_explanation)
  VALUES (
    v_module_id,
    'Select ALL the conflict management styles identified by Thomas-Kilmann:',
    'multiple_choice',
    '["Competing - assertive and uncooperative", "Collaborating - assertive and cooperative", "Compromising - moderate assertiveness and cooperation", "Accommodating - unassertive and cooperative", "Avoiding - unassertive and uncooperative", "Negotiating - high assertiveness variable cooperation"]',
    '["Competing - assertive and uncooperative", "Collaborating - assertive and cooperative", "Compromising - moderate assertiveness and cooperation", "Accommodating - unassertive and cooperative", "Avoiding - unassertive and uncooperative"]',
    4, 17,
    'Thomas-Kilmann Conflict Mode Instrument identifies five styles based on assertiveness and cooperativeness.',
    'Perfect! These five styles cover the spectrum of conflict response behaviors.',
    'Thomas-Kilmann five conflict styles: Competing (assertive/uncooperative - win/lose), Collaborating (assertive/cooperative - win/win), Compromising (moderate both - split the difference), Accommodating (unassertive/cooperative - lose/win), Avoiding (unassertive/uncooperative - no resolution). No style is always best - effectiveness depends on situation. Competing for quick vital decisions. Collaborating for integrative solutions. Compromising when time-pressed. Accommodating when relationship matters more than issue. Avoiding when costs exceed benefits. South African leaders should recognize cultural preferences and adapt flexibly.'
  );
  
  INSERT INTO quiz_questions (module_id, question_text, question_type, options, correct_answer, points, order_number, hint_feedback, correct_feedback, detailed_explanation)
  VALUES (
    v_module_id,
    'According to Trait Theory, which trait consistently correlates most strongly with leadership emergence and effectiveness?',
    'single_choice',
    '["Height and physical attractiveness", "Emotional intelligence and self-awareness", "Extraversion and social dominance", "Cognitive ability and intelligence"]',
    'Emotional intelligence and self-awareness',
    3, 18,
    'Modern research identifies which trait as the best predictor of leadership success?',
    'Correct! Emotional intelligence shows the strongest consistent relationship with leadership effectiveness.',
    'While early Trait Theory sought universal leadership traits, modern research shows emotional intelligence (self-awareness, self-regulation, motivation, empathy, social skills) correlates most strongly with leadership success. Cognitive ability matters for technical competence but EQ drives people effectiveness. Extraversion predicts emergence but not effectiveness. Physical traits have weak relationships. In diverse South African context, EQ is particularly critical for cross-cultural leadership, building trust, and managing complex interpersonal dynamics. Trait Theory limitations: traits alone insufficient, situational factors matter, skills can be developed.'
  );
  
  INSERT INTO quiz_questions (module_id, question_text, question_type, options, correct_answer, points, order_number, hint_feedback, correct_feedback, detailed_explanation)
  VALUES (
    v_module_id,
    'TRUE or FALSE: Contingency theories of leadership propose that effective leadership style depends on the situation rather than one best style for all contexts.',
    'true_false',
    '["True", "False"]',
    'True',
    2, 19,
    'Contingency theories contrast with universal trait or behavioral approaches.',
    'Correct! Contingency theories argue leadership effectiveness depends on fit between leader and situation.',
    'Contingency theories (Fiedler, House Path-Goal, Hersey-Blanchard Situational Leadership) propose no universally best leadership style - effectiveness depends on matching style to situational factors like follower maturity, task structure, leader-member relations, and environmental uncertainty. This explains why successful leaders in one context may fail in another. For South African leaders: assess situational factors (organizational culture, industry dynamics, team characteristics), develop flexibility to adapt style, recognize your natural tendencies and situations where you thrive, and build diverse leadership teams to cover situational range.'
  );
  
  INSERT INTO quiz_questions (module_id, question_text, question_type, options, correct_answer, points, order_number, hint_feedback, correct_feedback, detailed_explanation)
  VALUES (
    v_module_id,
    'What is the primary difference between power and authority in organizational leadership?',
    'single_choice',
    '["Power is formal and authority is informal", "Power is the ability to influence while authority is the right to command", "Authority requires force while power requires consent", "Power is individual while authority is collective"]',
    'Power is the ability to influence while authority is the right to command',
    3, 20,
    'Power is about capability; authority is about legitimacy.',
    'Correct! Power is the actual ability to influence; authority is the legitimate right to do so.',
    'Power is the capacity to influence others behavior through control of resources, expertise, relationships, or coercion. Authority is the legitimate right to make decisions and command compliance based on formal position in organizational hierarchy. You can have power without authority (informal leader) or authority without power (formal leader without respect). Most effective: combining legitimate authority with personal power from expertise and relationships. South African context: historical power imbalances make legitimacy and participative authority especially important for effective leadership.'
  );
  
  -- Questions 21-30
  INSERT INTO quiz_questions (module_id, question_text, question_type, options, correct_answer, points, order_number, hint_feedback, correct_feedback, detailed_explanation)
  VALUES (
    v_module_id,
    'Select ALL the components of effective organizational communication systems:',
    'multiple_choice',
    '["Formal channels for official information flow", "Informal networks for relationship building", "One-way top-down messaging for clarity", "Feedback mechanisms for two-way dialogue", "Centralized control of all messages", "Multiple channels for redundancy and reach"]',
    '["Formal channels for official information flow", "Informal networks for relationship building", "Feedback mechanisms for two-way dialogue", "Multiple channels for redundancy and reach"]',
    4, 21,
    'Effective communication requires both formal and informal elements, and multiple directions.',
    'Perfect! These four elements create robust organizational communication systems.',
    'Effective communication systems combine: Formal channels (official announcements, reports, policies) for transparency and record-keeping; Informal networks (hallway conversations, social connections) for trust and rapid information flow; Feedback mechanisms (surveys, town halls, open-door policies) enabling two-way dialogue; and Multiple channels (email, meetings, intranet, face-to-face) for redundancy and different preferences. Avoid: one-way communication suppressing input, and centralized control bottlenecking information. South African multilingual contexts require extra attention to accessibility and inclusive communication practices.'
  );
  
  INSERT INTO quiz_questions (module_id, question_text, question_type, options, correct_answer, points, order_number, hint_feedback, correct_feedback, detailed_explanation)
  VALUES (
    v_module_id,
    'According to Social Learning Theory, how do people primarily develop leadership behaviors?',
    'single_choice',
    '["Through formal classroom education and training programs", "Through observing and modeling behaviors of others", "Through genetic predisposition and innate personality", "Through trial and error experience only"]',
    'Through observing and modeling behaviors of others',
    3, 22,
    'Bandura theory emphasizes learning through observation and imitation.',
    'Correct! Social Learning Theory highlights observation, modeling, and vicarious reinforcement.',
    'Bandura Social Learning Theory proposes people learn behaviors by observing others (models), particularly those who are successful, powerful, or similar. Learning occurs through: attention to model, retention of behavior, reproduction when capable, and motivation from expected outcomes. For leadership development: role modeling by senior leaders is powerful, mentoring accelerates learning, exposure to diverse leaders broadens repertoire, and organizational culture shapes what behaviors are reinforced. South African leaders should consciously model desired behaviors and provide diverse role models for aspiring leaders.'
  );
  
  INSERT INTO quiz_questions (module_id, question_text, question_type, options, correct_answer, points, order_number, hint_feedback, correct_feedback, detailed_explanation)
  VALUES (
    v_module_id,
    'TRUE or FALSE: Transformational leadership produces higher follower performance and satisfaction than transactional leadership across most contexts.',
    'true_false',
    '["True", "False"]',
    'True',
    2, 23,
    'Meta-analyses comparing transformational and transactional leadership show clear patterns.',
    'Correct! Research consistently shows transformational leadership superiority across diverse contexts.',
    'Meta-analyses (Judge & Piccolo, 2004) show transformational leadership (inspiring vision, intellectual stimulation, individualized consideration) produces higher follower job performance, satisfaction, commitment, and organizational citizenship than transactional leadership (contingent rewards, management by exception). Effect sizes are moderate to large and consistent across industries, cultures, and levels. Transactional leadership still matters for baseline performance, but transformational adds significant value. South African context: transformational leadership particularly important for navigating change, building trust across diversity, and inspiring commitment during uncertainty.'
  );
  
  INSERT INTO quiz_questions (module_id, question_text, question_type, options, correct_answer, points, order_number, hint_feedback, correct_feedback, detailed_explanation)
  VALUES (
    v_module_id,
    'What is psychological contract and why does it matter for leadership?',
    'single_choice',
    '["Formal employment agreement specifying duties and compensation", "Unwritten mutual expectations between employee and organization", "Legal contract protecting psychological health and safety", "Performance management system with behavioral targets"]',
    'Unwritten mutual expectations between employee and organization',
    3, 24,
    'This concept describes implicit beliefs about reciprocal obligations.',
    'Correct! Psychological contract is the unwritten mutual expectations that govern employment relationship.',
    'Psychological contract refers to unwritten, implicit beliefs about mutual obligations between employee and organization - what each expects to give and receive beyond formal agreement. Includes expectations about job security, career development, work-life balance, autonomy, and fairness. When violated (broken promises, unmet expectations), employees experience betrayal, reduced trust, lower performance, and increased turnover. Leaders must: clarify expectations early, deliver on commitments, provide explanations for changes, and recognize that employees form psychological contracts whether leaders intend to or not. South African context: manage expectations honestly given economic constraints.'
  );
  
  INSERT INTO quiz_questions (module_id, question_text, question_type, options, correct_answer, points, order_number, hint_feedback, correct_feedback, detailed_explanation)
  VALUES (
    v_module_id,
    'Select ALL the principles of effective performance feedback:',
    'multiple_choice',
    '["Focus primarily on personality traits and character", "Provide feedback immediately after observing behavior", "Use specific examples rather than generalizations", "Deliver feedback publicly to reinforce accountability", "Balance positive and developmental feedback", "Create two-way dialogue not one-way critique"]',
    '["Provide feedback immediately after observing behavior", "Use specific examples rather than generalizations", "Balance positive and developmental feedback", "Create two-way dialogue not one-way critique"]',
    4, 25,
    'Effective feedback is timely, specific, balanced, and dialogic.',
    'Perfect! These four principles maximize feedback effectiveness.',
    'Effective feedback principles: Timeliness (immediate when emotions allow, creating clear link between behavior and feedback), Specificity (observable behaviors not personality, enabling action), Balance (recognize strengths not just weaknesses, 4:1 positive-negative ratio for high performers), and Dialogue (ask perspective not just tell, enabling learning). Avoid: personality focus triggering defensiveness, public criticism undermining dignity, delayed feedback losing relevance, and one-way monologues preventing understanding. South African context: adapt directness level to cultural communication styles while maintaining these core principles.'
  );
  
  INSERT INTO quiz_questions (module_id, question_text, question_type, options, correct_answer, points, order_number, hint_feedback, correct_feedback, detailed_explanation)
  VALUES (
    v_module_id,
    'According to Organizational Justice Theory, which type of justice matters most for employee trust in leadership?',
    'single_choice',
    '["Distributive justice - fairness of outcome allocation", "Procedural justice - fairness of decision-making processes", "Interactional justice - fairness of interpersonal treatment", "Retributive justice - fairness of punishment for wrongdoing"]',
    'Procedural justice - fairness of decision-making processes',
    3, 26,
    'Research shows which type of fairness most strongly predicts trust and commitment?',
    'Correct! Procedural justice - fair processes - matters most for building trust and acceptance of decisions.',
    'Organizational Justice Theory identifies three types: Distributive (fairness of outcomes), Procedural (fairness of processes), and Interactional (fairness of treatment). Research shows Procedural justice predicts trust most strongly because: fair processes signal consistent treatment across people and time, even unfavorable outcomes are accepted when process is fair, and procedures are visible while outcomes are private. Fair procedures include: voice (input opportunity), consistency, bias suppression, accuracy, correctability, and ethicality. South African context: historical procedural injustices make transparent fair processes essential for legitimacy and trust.'
  );
  
  INSERT INTO quiz_questions (module_id, question_text, question_type, options, correct_answer, points, order_number, hint_feedback, correct_feedback, detailed_explanation)
  VALUES (
    v_module_id,
    'TRUE or FALSE: Authentic leadership emphasizes being true to yourself even if it conflicts with organizational expectations or follower needs.',
    'true_false',
    '["True", "False"]',
    'False',
    2, 27,
    'Authentic leadership balances self-awareness with context and follower needs.',
    'Correct! Authentic leadership is not just being yourself - it requires balancing authenticity with leadership responsibilities.',
    'Common misconception: authentic leadership means complete transparency and never adapting behavior. Reality: authentic leadership requires self-awareness of values and strengths, but also: adapting communication to audience, considering follower needs and context, developing through feedback and growth, and exercising judgment about appropriate self-disclosure. Being authentic does not mean sharing everything, refusing to adapt, or ignoring organizational goals. Authentic leaders stay true to core values while flexing style to situations. South African context: authenticity means honoring your cultural identity while respecting others and organizational context.'
  );
  
  INSERT INTO quiz_questions (module_id, question_text, question_type, options, correct_answer, points, order_number, hint_feedback, correct_feedback, detailed_explanation)
  VALUES (
    v_module_id,
    'What is the halo effect and how does it impact leadership decisions?',
    'single_choice',
    '["Tendency to rate all aspects of performance highly for likeable employees", "Tendency to give positive feedback only to star performers", "Tendency to focus on recent rather than overall performance", "Tendency to compare employees to yourself rather than standards"]',
    'Tendency to rate all aspects of performance highly for likeable employees',
    3, 28,
    'This cognitive bias causes one positive trait to influence judgments of all other traits.',
    'Correct! Halo effect is when one positive characteristic colors perception of all characteristics.',
    'Halo effect occurs when one salient positive characteristic (attractiveness, likability, one strong skill) influences judgments of all other characteristics. Reverse is horns effect (one negative trait colors all). Impact on leadership: biased performance evaluations, unfair promotion decisions, overlooking weaknesses in favored employees, and dismissing strengths in disliked employees. Combat through: structured evaluation criteria, multiple evaluators, specific behavioral examples, separating evaluation dimensions, and awareness of the bias. South African leaders should watch for in-group favoritism based on shared identity creating halo effects.'
  );
  
  INSERT INTO quiz_questions (module_id, question_text, question_type, options, correct_answer, points, order_number, hint_feedback, correct_feedback, detailed_explanation)
  VALUES (
    v_module_id,
    'Select ALL the dimensions of organizational culture according to Schein:',
    'multiple_choice',
    '["Artifacts - visible structures and processes", "Espoused values - stated beliefs and strategies", "Basic underlying assumptions - unconscious taken-for-granted beliefs", "Financial performance - bottom-line results", "Market position - competitive standing", "Leadership style - executive behaviors"]',
    '["Artifacts - visible structures and processes", "Espoused values - stated beliefs and strategies", "Basic underlying assumptions - unconscious taken-for-granted beliefs"]',
    4, 29,
    'Schein three-level culture model goes from visible surface to invisible depth.',
    'Perfect! Schein identifies three levels: artifacts, espoused values, and basic assumptions.',
    'Edgar Schein three-level organizational culture model: Level 1 - Artifacts (visible structures, processes, behaviors, easy to observe but hard to interpret). Level 2 - Espoused Values (stated strategies, goals, philosophies, what organization claims to value). Level 3 - Basic Underlying Assumptions (unconscious taken-for-granted beliefs, perceptions, thoughts, feelings, the essence of culture). Culture change must address deepest level not just surface artifacts. Leaders shape culture through: what they pay attention to, how they react to crises, role modeling, reward allocation, and selection/promotion decisions. South African context: navigate multiple cultural frameworks respectfully.'
  );
  
  INSERT INTO quiz_questions (module_id, question_text, question_type, options, correct_answer, points, order_number, hint_feedback, correct_feedback, detailed_explanation)
  VALUES (
    v_module_id,
    'What is the primary purpose of active listening in leadership communication?',
    'single_choice',
    '["To prepare your response while the other person is talking", "To understand the speakers perspective and demonstrate respect", "To identify errors in the speakers logic and correct them", "To fill silence and show you are paying attention"]',
    'To understand the speakers perspective and demonstrate respect',
    3, 30,
    'Active listening is about understanding not just waiting to speak.',
    'Correct! Active listening seeks understanding and builds relationship through respect and attention.',
    'Active listening goes beyond hearing words to understanding meaning, emotion, and perspective. Elements include: paying full attention without distraction, withholding judgment during listening, reflecting back to verify understanding, asking clarifying questions, noting nonverbal cues, and demonstrating interest through posture and responses. Benefits: builds trust and psychological safety, uncovers important information, prevents misunderstandings, shows respect increasing speaker openness, and models communication norms. Common failures: planning response instead of listening, jumping to solutions prematurely, and interrupting. South African multilingual context makes active listening especially important for bridging communication differences.'
  );
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'SUCCESS! All 30 quiz questions installed.';
  RAISE NOTICE '========================================';
END $$;

-- Verify the installation
SELECT 
  'Module 2 Installation Complete!' as message,
  (SELECT COUNT(*) FROM modules WHERE title = 'Module 2: Core Concepts in Leadership') as module_count,
  (SELECT COUNT(*) FROM quiz_questions WHERE module_id IN (SELECT id FROM modules WHERE title = 'Module 2: Core Concepts in Leadership')) as quiz_question_count,
  (SELECT SUM(points) FROM quiz_questions WHERE module_id IN (SELECT id FROM modules WHERE title = 'Module 2: Core Concepts in Leadership')) as total_points;
