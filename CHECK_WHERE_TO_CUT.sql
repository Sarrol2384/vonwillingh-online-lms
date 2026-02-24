-- ============================================================
-- SIMPLE SOLUTION: Remove everything after educational content
-- ============================================================
-- We know the educational content ends around 210,000 characters
-- The plain-text quiz starts after that
-- Let's just keep the first 210,000 characters
-- ============================================================

-- STEP 1: Check current content
SELECT 
    m.title,
    LENGTH(m.content) AS total_length,
    -- Show content at position 209,000 to 210,000
    SUBSTRING(m.content, 209000, 1000) AS content_at_209k,
    -- Show content at position 210,000 to 211,000
    SUBSTRING(m.content, 210000, 1000) AS content_at_210k,
    -- Show content at position 211,000 to 212,000
    SUBSTRING(m.content, 211000, 1000) AS content_at_211k
FROM modules m
JOIN courses c ON m.course_id = c.id
WHERE c.code = 'AIFUND001' AND m.title ILIKE '%Module 1%';
