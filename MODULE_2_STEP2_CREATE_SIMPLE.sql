-- ============================================
-- STEP 2: Create Module 2 with Content
-- ============================================

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
    
    -- Insert Module 2 with simple content first
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
        '<h1>Module 2: Core Concepts in Leadership</h1><p>This is a test module to verify insertion works.</p>',
        'lesson',
        2,
        50
    )
    RETURNING id INTO v_module_id;
    
    RAISE NOTICE 'Created Module 2 with ID: %', v_module_id;
    RAISE NOTICE 'SUCCESS!';
END $$;
