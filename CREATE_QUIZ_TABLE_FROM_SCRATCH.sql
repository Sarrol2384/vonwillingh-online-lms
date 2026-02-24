-- ============================================================
-- CREATE QUIZ_QUESTIONS TABLE FROM SCRATCH
-- ============================================================
-- Use this if the table exists but has the wrong schema
-- ============================================================

-- Drop the existing table if it has wrong schema (CAUTION: removes all data)
-- Uncomment the next line if you want to start fresh
-- DROP TABLE IF EXISTS quiz_questions CASCADE;

-- Create the table with the correct schema
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'multiple_select')),
  option_a TEXT,
  option_b TEXT,
  option_c TEXT,
  option_d TEXT,
  option_e TEXT,
  correct_answer TEXT NOT NULL,
  points INTEGER DEFAULT 5,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_quiz_questions_module_id ON quiz_questions(module_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_order ON quiz_questions(module_id, order_number);

-- Verify the table was created
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'quiz_questions'
ORDER BY ordinal_position;

-- Show result
SELECT 
    '✅ quiz_questions table ready with ' || COUNT(*) || ' columns' AS status
FROM information_schema.columns
WHERE table_name = 'quiz_questions';
