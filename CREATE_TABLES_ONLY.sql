-- =====================================================
-- MANUAL TABLE CREATION - MINIMAL VERSION
-- =====================================================
-- Just create the two tables needed for progression.
-- Skip all validation and quiz_questions checks.
-- =====================================================

-- Table 1: Module progression rules
CREATE TABLE IF NOT EXISTS module_progression_rules (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    module_id INTEGER NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    next_module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE,
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

-- Table 2: Student content completion tracking
CREATE TABLE IF NOT EXISTS module_content_completion (
    id SERIAL PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    module_id INTEGER NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    enrollment_id INTEGER REFERENCES enrollments(id) ON DELETE CASCADE,
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

-- Table 3: Add columns to modules (if needed)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'modules' AND column_name = 'has_quiz') THEN
        ALTER TABLE modules ADD COLUMN has_quiz BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'modules' AND column_name = 'quiz_title') THEN
        ALTER TABLE modules ADD COLUMN quiz_title TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'modules' AND column_name = 'quiz_description') THEN
        ALTER TABLE modules ADD COLUMN quiz_description TEXT;
    END IF;
END $$;

-- That's it. No validation, no checks. Just the tables.
