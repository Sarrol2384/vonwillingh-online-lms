-- ============================================
-- MODULE 2: Core Concepts in Leadership
-- SQL INSERT Statement for Supabase
-- ============================================

DO $$
DECLARE
    v_course_id INTEGER;
    v_module_id INTEGER;
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
        duration
    ) VALUES (
        v_course_id,
        'Module 2: Core Concepts in Leadership',
        'Advanced leadership theories including team dynamics, organizational culture, stakeholder management, and leadership development',
        '<div style="font-family: ''Segoe UI'', Tahoma, Geneva, Verdana, sans-serif; max-width: 900px; margin: 0 auto; line-height: 1.8; color: #333;">

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 12px; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
  <h1 style="margin: 0 0 15px 0; font-size: 36px; font-weight: 700;">Module 2: Core Concepts in Leadership</h1>
  <p style="margin: 0; font-size: 18px; opacity: 0.95;">Advanced leadership theories and practical applications</p>
</div>

<div style="background: #f8f9fa; padding: 25px; border-left: 5px solid #667eea; border-radius: 8px; margin-bottom: 30px;">
  <h2 style="color: #667eea; margin-top: 0;">🎯 Building on the Foundation</h2>
  <p>In Module 1, you learned about Ubuntu philosophy, emotional intelligence, and basic leadership styles. Now we''ll dive deeper into advanced leadership concepts that will help you lead teams, manage change, and build strong organizations.</p>
</div>

<div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); margin-bottom: 30px;">
  <h2 style="color: #667eea; border-bottom: 3px solid #667eea; padding-bottom: 10px; margin-bottom: 25px;">1️⃣ Team Development and Dynamics</h2>
  
  <h3 style="color: #764ba2; margin-top: 25px;">Tuckman''s Stages of Team Development</h3>
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
    <p><strong>Watch For:</strong> This is normal! Don''t avoid conflict—work through it</p>
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
  
  <p>Developed by Ken Blanchard and Paul Hersey, this model says: <strong>"There is no one best leadership style."</strong> You must adapt to your team member''s development level.</p>
  
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
    <li><strong>There''s no one-size-fits-all leadership style.</strong> Use Situational Leadership to adapt to each team member''s development level.</li>
    <li><strong>Your job is to clarify the path and remove obstacles</strong> (Path-Goal Theory), using directive, supportive, participative, or achievement-oriented behaviors as needed.</li>
    <li><strong>Build high-quality relationships with all team members,</strong> not just those similar to you (LMX Theory).</li>
    <li><strong>Level 5 leaders combine personal humility with professional will.</strong> They put the organization ahead of their ego.</li>
    <li><strong>Follow Kotter''s 8-step change model.</strong> Don''t skip steps—most change efforts fail because leaders rush to action.</li>
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

</div>',
        'lesson',
        2,
        50
    )
    RETURNING id INTO v_module_id;
    
    RAISE NOTICE 'Created Module 2 with ID: %', v_module_id;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'SUCCESS!';
    RAISE NOTICE 'Module 2 ID: %', v_module_id;
    RAISE NOTICE '========================================';
END $$;
