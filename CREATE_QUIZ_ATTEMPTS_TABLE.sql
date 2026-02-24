-- =====================================================
-- CREATE OR UPDATE quiz_attempts TABLE
-- =====================================================
-- This table stores student quiz submission attempts
-- with all required fields for the LMS quiz system
-- =====================================================

-- Drop existing table if it has the wrong schema
-- (Comment this out if you want to preserve existing data)
-- DROP TABLE IF EXISTS quiz_attempts CASCADE;

-- Create quiz_attempts table with complete schema
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign Keys
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
  
  -- Quiz Results
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  wrong_answers INTEGER NOT NULL DEFAULT 0,
  questions_attempted INTEGER NOT NULL DEFAULT 0,
  percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  passed BOOLEAN NOT NULL DEFAULT false,
  
  -- Attempt Tracking
  attempt_number INTEGER NOT NULL DEFAULT 1,
  time_spent_seconds INTEGER DEFAULT 0,
  
  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- JSON Data
  answers JSONB,  -- Student answers: { "question_id": "answer" }
  results JSONB   -- Detailed results: { "question_id": { correct, answer, ... } }
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student 
ON quiz_attempts(student_id);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_module 
ON quiz_attempts(module_id);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_enrollment 
ON quiz_attempts(enrollment_id);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student_module 
ON quiz_attempts(student_id, module_id);

-- Add constraint to ensure attempt_number is positive
ALTER TABLE quiz_attempts 
ADD CONSTRAINT quiz_attempts_attempt_number_positive 
CHECK (attempt_number > 0);

-- Verify table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'quiz_attempts'
ORDER BY ordinal_position;

-- Success message
SELECT '✅ quiz_attempts table created/updated successfully!' AS status;
