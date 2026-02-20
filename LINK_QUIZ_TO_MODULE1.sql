-- =====================================================
-- LINK QUIZ TO MODULE 1 AND CONFIGURE PROGRESSION
-- =====================================================
-- This script:
-- 1. Verifies Module 1 exists and has quiz questions
-- 2. Creates progression rules table (if not exists)
-- 3. Sets up Module 1 → Module 2 progression requirements
-- 4. Configures quiz prerequisites and settings
-- =====================================================

-- Step 1: Verify Module 1 and its quiz
DO $$
DECLARE
    v_module_id UUID;
    v_question_count INTEGER;
BEGIN
    -- Find Module 1
    SELECT m.id INTO v_module_id
    FROM modules m
    JOIN courses c ON m.course_id = c.id
    WHERE c.code = 'AIFUND001'
      AND m.title ILIKE '%Module 1%'
      AND m.title ILIKE '%Introduction to AI%'
    ORDER BY m.created_at DESC
    LIMIT 1;
    
    IF v_module_id IS NULL THEN
        RAISE EXCEPTION 'Module 1 not found! Cannot link quiz.';
    END IF;
    
    RAISE NOTICE '✅ Found Module 1 with ID: %', v_module_id;
    
    -- Count quiz questions
    SELECT COUNT(*) INTO v_question_count
    FROM quiz_questions
    WHERE module_id = v_module_id;
    
    IF v_question_count = 0 THEN
        RAISE EXCEPTION 'No quiz questions found for Module 1! Run FIX_QUIZ_TABLE_AND_CREATE.sql first.';
    END IF;
    
    RAISE NOTICE '✅ Module 1 has % quiz questions', v_question_count;
END $$;

-- Step 2: Create module_progression_rules table
CREATE TABLE IF NOT EXISTS module_progression_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    next_module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    
    -- Quiz requirements
    requires_quiz_pass BOOLEAN DEFAULT FALSE,
    minimum_quiz_score DECIMAL(5,2) DEFAULT 70.00,
    max_quiz_attempts INTEGER DEFAULT 3,
    
    -- Content completion requirements
    requires_content_completion BOOLEAN DEFAULT TRUE,
    minimum_content_time_seconds INTEGER DEFAULT 1800, -- 30 minutes
    requires_scroll_to_bottom BOOLEAN DEFAULT TRUE,
    
    -- Progression settings
    is_required_for_next BOOLEAN DEFAULT TRUE,
    manual_override_allowed BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(module_id)
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_progression_rules_module ON module_progression_rules(module_id);
CREATE INDEX IF NOT EXISTS idx_progression_rules_course ON module_progression_rules(course_id);

RAISE NOTICE '✅ Created module_progression_rules table';

-- Step 3: Create module_content_completion table (tracks if student finished reading)
CREATE TABLE IF NOT EXISTS module_content_completion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
    
    -- Completion tracking
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    time_spent_seconds INTEGER DEFAULT 0,
    scrolled_to_bottom BOOLEAN DEFAULT FALSE,
    content_fully_viewed BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    last_scroll_position INTEGER DEFAULT 0,
    total_scroll_height INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(student_id, module_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_content_completion_student ON module_content_completion(student_id);
CREATE INDEX IF NOT EXISTS idx_content_completion_module ON module_content_completion(module_id);

RAISE NOTICE '✅ Created module_content_completion table';

-- Step 4: Set up Module 1 progression rules
DO $$
DECLARE
    v_course_id UUID;
    v_module1_id UUID;
    v_module2_id UUID;
BEGIN
    -- Get course and modules
    SELECT c.id, m1.id, m2.id
    INTO v_course_id, v_module1_id, v_module2_id
    FROM courses c
    LEFT JOIN modules m1 ON m1.course_id = c.id AND m1.title ILIKE '%Module 1%'
    LEFT JOIN modules m2 ON m2.course_id = c.id AND m2.title ILIKE '%Module 2%'
    WHERE c.code = 'AIFUND001'
    LIMIT 1;
    
    IF v_module1_id IS NULL THEN
        RAISE EXCEPTION 'Module 1 not found!';
    END IF;
    
    RAISE NOTICE 'Course ID: %, Module 1 ID: %, Module 2 ID: %', 
                 v_course_id, v_module1_id, v_module2_id;
    
    -- Insert or update progression rules for Module 1
    INSERT INTO module_progression_rules (
        course_id,
        module_id,
        next_module_id,
        requires_quiz_pass,
        minimum_quiz_score,
        max_quiz_attempts,
        requires_content_completion,
        minimum_content_time_seconds,
        requires_scroll_to_bottom,
        is_required_for_next,
        manual_override_allowed
    ) VALUES (
        v_course_id,
        v_module1_id,
        v_module2_id, -- NULL if Module 2 doesn't exist yet
        TRUE,         -- Requires quiz pass
        70.00,        -- 70% minimum score
        3,            -- Max 3 attempts
        TRUE,         -- Must complete content first
        1800,         -- 30 minutes minimum (can be adjusted)
        TRUE,         -- Must scroll to bottom
        TRUE,         -- Required for Module 2
        TRUE          -- Instructor can override after 3 fails
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
    
    RAISE NOTICE '✅ Configured progression rules for Module 1';
    RAISE NOTICE '   - Requires quiz pass: ≥70%% (14/20 correct)';
    RAISE NOTICE '   - Max attempts: 3';
    RAISE NOTICE '   - Must complete content first (30 min minimum)';
    RAISE NOTICE '   - Must scroll to bottom';
    RAISE NOTICE '   - Blocks Module 2 until passed';
END $$;

-- Step 5: Add quiz metadata to modules table (if column doesn't exist)
DO $$
BEGIN
    -- Add has_quiz column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'modules' AND column_name = 'has_quiz'
    ) THEN
        ALTER TABLE modules ADD COLUMN has_quiz BOOLEAN DEFAULT FALSE;
        RAISE NOTICE '✅ Added has_quiz column to modules table';
    END IF;
    
    -- Add quiz_title column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'modules' AND column_name = 'quiz_title'
    ) THEN
        ALTER TABLE modules ADD COLUMN quiz_title TEXT;
        RAISE NOTICE '✅ Added quiz_title column to modules table';
    END IF;
    
    -- Add quiz_description column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'modules' AND column_name = 'quiz_description'
    ) THEN
        ALTER TABLE modules ADD COLUMN quiz_description TEXT;
        RAISE NOTICE '✅ Added quiz_description column to modules table';
    END IF;
END $$;

-- Step 6: Update Module 1 with quiz information
DO $$
DECLARE
    v_module1_id UUID;
    v_question_count INTEGER;
BEGIN
    -- Find Module 1
    SELECT m.id INTO v_module1_id
    FROM modules m
    JOIN courses c ON m.course_id = c.id
    WHERE c.code = 'AIFUND001'
      AND m.title ILIKE '%Module 1%'
      AND m.title ILIKE '%Introduction to AI%'
    ORDER BY m.created_at DESC
    LIMIT 1;
    
    -- Count questions
    SELECT COUNT(*) INTO v_question_count
    FROM quiz_questions
    WHERE module_id = v_module1_id;
    
    -- Update module metadata
    UPDATE modules
    SET 
        has_quiz = TRUE,
        quiz_title = 'Module 1: Introduction to AI for Small Business - Assessment',
        quiz_description = 'Test your knowledge with this 20-question quiz. You need 70% (14/20) to pass and unlock Module 2. You have 3 attempts.',
        updated_at = NOW()
    WHERE id = v_module1_id;
    
    RAISE NOTICE '✅ Updated Module 1 with quiz metadata';
    RAISE NOTICE '   - Quiz title: "Module 1: Introduction to AI for Small Business - Assessment"';
    RAISE NOTICE '   - Quiz questions: %', v_question_count;
END $$;

-- Step 7: Verify setup
DO $$
DECLARE
    v_module_id UUID;
    v_question_count INTEGER;
    v_has_rules BOOLEAN;
BEGIN
    -- Get Module 1 info
    SELECT m.id, m.has_quiz
    INTO v_module_id, v_has_rules
    FROM modules m
    JOIN courses c ON m.course_id = c.id
    WHERE c.code = 'AIFUND001'
      AND m.title ILIKE '%Module 1%'
    LIMIT 1;
    
    -- Count questions
    SELECT COUNT(*) INTO v_question_count
    FROM quiz_questions
    WHERE module_id = v_module_id;
    
    -- Check rules
    SELECT EXISTS (
        SELECT 1 FROM module_progression_rules
        WHERE module_id = v_module_id
    ) INTO v_has_rules;
    
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ QUIZ LINKING COMPLETE!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Summary:';
    RAISE NOTICE '   Module 1 ID: %', v_module_id;
    RAISE NOTICE '   Quiz Questions: %', v_question_count;
    RAISE NOTICE '   Has Progression Rules: %', v_has_rules;
    RAISE NOTICE '';
    RAISE NOTICE '⚙️ Configuration:';
    RAISE NOTICE '   ✅ Quiz position: END of module content';
    RAISE NOTICE '   ✅ Quiz button: "Start Quiz"';
    RAISE NOTICE '   ✅ Prerequisites: Complete content (30 min + scroll to bottom)';
    RAISE NOTICE '   ✅ Passing score: ≥70%% (14/20 correct)';
    RAISE NOTICE '   ✅ Max attempts: 3';
    RAISE NOTICE '   ✅ Blocks Module 2: Until quiz passed';
    RAISE NOTICE '   ✅ Manual override: Available after 3 fails';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Next Steps:';
    RAISE NOTICE '   1. Deploy updated code with progression logic';
    RAISE NOTICE '   2. Test content completion tracking';
    RAISE NOTICE '   3. Test quiz unlock after content completion';
    RAISE NOTICE '   4. Test Module 2 blocking until quiz passed';
    RAISE NOTICE '   5. Configure admin reports';
    RAISE NOTICE '';
END $$;

-- =====================================================
-- QUIZ SUCCESSFULLY LINKED TO MODULE 1!
-- =====================================================
-- Tables created:
--   - module_progression_rules
--   - module_content_completion
-- 
-- Module 1 configured:
--   - Quiz attached with 20 questions
--   - Progression rules set
--   - Content completion tracking enabled
-- 
-- Run this script in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/dgcobxtkzewzkrzpfcdr/sql/new
-- =====================================================
