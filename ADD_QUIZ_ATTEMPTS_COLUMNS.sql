-- =====================================================
-- ADD MISSING COLUMNS TO quiz_attempts TABLE
-- =====================================================
-- Use this if the table exists but is missing columns
-- This is the "safe" approach that won't delete data
-- =====================================================

-- Add enrollment_id column (the one causing the error)
ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE;

-- Add other potentially missing columns
ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS total_questions INTEGER;

ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS correct_answers INTEGER DEFAULT 0;

ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS wrong_answers INTEGER DEFAULT 0;

ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS questions_attempted INTEGER DEFAULT 0;

ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS percentage DECIMAL(5,2) DEFAULT 0;

ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS passed BOOLEAN DEFAULT false;

ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS attempt_number INTEGER DEFAULT 1;

ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS time_spent_seconds INTEGER DEFAULT 0;

ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS answers JSONB;

ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS results JSONB;

ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student 
ON quiz_attempts(student_id);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_module 
ON quiz_attempts(module_id);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_enrollment 
ON quiz_attempts(enrollment_id);

-- Verify the schema
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'quiz_attempts'
ORDER BY ordinal_position;

-- Check if enrollment_id column exists
SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ enrollment_id column EXISTS'
    ELSE '❌ enrollment_id column MISSING'
  END AS enrollment_id_status
FROM information_schema.columns
WHERE table_name = 'quiz_attempts' 
  AND column_name = 'enrollment_id';

-- Success message
SELECT '✅ Missing columns added to quiz_attempts table!' AS status;
