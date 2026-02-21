-- =====================================================
-- FINAL WORKING VERSION - ADDS MISSING COLUMNS FIRST
-- =====================================================
-- This version:
-- 1. Adds missing columns to modules table FIRST
-- 2. THEN creates progression tables
-- 3. THEN configures Module 1
-- =====================================================

-- Step 1: Add ALL missing columns to modules table FIRST
ALTER TABLE modules ADD COLUMN IF NOT EXISTS has_quiz BOOLEAN DEFAULT FALSE;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS quiz_title TEXT;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS quiz_description TEXT;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE modules ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Step 2: Create module_progression_rules table
CREATE TABLE IF NOT EXISTS module_progression_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    next_module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    requires_quiz_pass BOOLEAN DEFAULT FALSE,
    minimum_quiz_score DECIMAL(5,2) DEFAULT 70.00,
    max_quiz_attempts INTEGER DEFAULT 3,
    requires_content_completion BOOLEAN DEFAULT TRUE,
    minimum_content_time_seconds INTEGER DEFAULT 1800,
    requires_scroll_to_bottom BOOLEAN DEFAULT TRUE,
    is_required_for_next BOOLEAN DEFAULT TRUE,
    manual_override_allowed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(module_id)
);

CREATE INDEX IF NOT EXISTS idx_progression_rules_module ON module_progression_rules(module_id);
CREATE INDEX IF NOT EXISTS idx_progression_rules_course ON module_progression_rules(course_id);

-- Step 3: Create module_content_completion table
CREATE TABLE IF NOT EXISTS module_content_completion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    time_spent_seconds INTEGER DEFAULT 0,
    scrolled_to_bottom BOOLEAN DEFAULT FALSE,
    content_fully_viewed BOOLEAN DEFAULT FALSE,
    last_scroll_position INTEGER DEFAULT 0,
    total_scroll_height INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, module_id)
);

CREATE INDEX IF NOT EXISTS idx_content_completion_student ON module_content_completion(student_id);
CREATE INDEX IF NOT EXISTS idx_content_completion_module ON module_content_completion(module_id);

-- Step 4: Configure Module 1 automatically
DO $$
DECLARE
    v_course_id INTEGER;
    v_module1_id UUID;
    v_module2_id UUID;
BEGIN
    -- Find the course and modules
    SELECT 
        c.id,
        (SELECT m.id FROM modules m WHERE m.course_id = c.id AND m.title ILIKE '%Module 1%' ORDER BY m.created_at LIMIT 1),
        (SELECT m.id FROM modules m WHERE m.course_id = c.id AND m.title ILIKE '%Module 2%' ORDER BY m.created_at LIMIT 1)
    INTO v_course_id, v_module1_id, v_module2_id
    FROM courses c
    WHERE c.code = 'AIFUND001'
    LIMIT 1;
    
    IF v_module1_id IS NOT NULL THEN
        -- Insert progression rule
        INSERT INTO module_progression_rules (
            course_id, module_id, next_module_id,
            requires_quiz_pass, minimum_quiz_score, max_quiz_attempts,
            requires_content_completion, minimum_content_time_seconds,
            requires_scroll_to_bottom, is_required_for_next, manual_override_allowed
        ) VALUES (
            v_course_id, v_module1_id, v_module2_id,
            TRUE, 70.00, 3,
            TRUE, 1800,
            TRUE, TRUE, TRUE
        )
        ON CONFLICT (module_id) DO UPDATE SET
            requires_quiz_pass = EXCLUDED.requires_quiz_pass,
            minimum_quiz_score = EXCLUDED.minimum_quiz_score,
            max_quiz_attempts = EXCLUDED.max_quiz_attempts,
            requires_content_completion = EXCLUDED.requires_content_completion,
            minimum_content_time_seconds = EXCLUDED.minimum_content_time_seconds,
            requires_scroll_to_bottom = EXCLUDED.requires_scroll_to_bottom,
            is_required_for_next = EXCLUDED.is_required_for_next,
            manual_override_allowed = EXCLUDED.manual_override_allowed,
            updated_at = NOW();
        
        -- Update Module 1 (NOW these columns exist!)
        UPDATE modules
        SET 
            has_quiz = TRUE,
            quiz_title = 'Module 1: Introduction to AI for Small Business - Assessment',
            quiz_description = 'Test your knowledge with this 20-question quiz. You need 70% (14/20) to pass and unlock Module 2. You have 3 attempts.',
            updated_at = NOW()
        WHERE id = v_module1_id;
        
        RAISE NOTICE '========================================';
        RAISE NOTICE 'SUCCESS! Setup complete.';
        RAISE NOTICE '========================================';
        RAISE NOTICE 'Course ID: %', v_course_id;
        RAISE NOTICE 'Module 1 ID: %', v_module1_id;
        RAISE NOTICE 'Module 2 ID: %', COALESCE(v_module2_id::text, 'Not found');
        RAISE NOTICE '';
        RAISE NOTICE 'Configuration:';
        RAISE NOTICE '  - Passing score: 70%% (14/20)';
        RAISE NOTICE '  - Max attempts: 3';
        RAISE NOTICE '  - Content time: 30 minutes';
        RAISE NOTICE '  - Scroll required: Yes';
        RAISE NOTICE '';
        RAISE NOTICE 'Tables created:';
        RAISE NOTICE '  - module_progression_rules';
        RAISE NOTICE '  - module_content_completion';
        RAISE NOTICE '';
        RAISE NOTICE 'Columns added to modules table:';
        RAISE NOTICE '  - has_quiz, quiz_title, quiz_description';
        RAISE NOTICE '  - created_at, updated_at';
        RAISE NOTICE '';
        RAISE NOTICE 'READY TO TEST!';
        RAISE NOTICE '';
        RAISE NOTICE 'To enable test mode (60 seconds instead of 30 min):';
        RAISE NOTICE 'UPDATE module_progression_rules SET minimum_content_time_seconds = 60;';
    ELSE
        RAISE EXCEPTION 'Module 1 not found in course AIFUND001';
    END IF;
END $$;
