-- ============================================================
-- CAREFULLY INSPECT MODULE 1 CONTENT
-- ============================================================
-- Let's see EXACTLY what's at the quiz positions
-- ============================================================

-- Show what's around position 212,535 (where Question 19 was found)
SELECT 
    'Content around position 212535 (Question 19)' as location,
    SUBSTRING(m.content, 212400, 400) as content_preview
FROM modules m
JOIN courses c ON m.course_id = c.id
WHERE c.code = 'AIFUND001' 
  AND m.title ILIKE '%Module 1%';

-- Show what's around position 214,217 (where Question 20 was found)
SELECT 
    'Content around position 214217 (Question 20)' as location,
    SUBSTRING(m.content, 214100, 400) as content_preview
FROM modules m
JOIN courses c ON m.course_id = c.id
WHERE c.code = 'AIFUND001' 
  AND m.title ILIKE '%Module 1%';

-- Show what's around position 149,563 (Stellenbosch question)
SELECT 
    'Content around position 149563 (Stellenbosch)' as location,
    SUBSTRING(m.content, 149450, 400) as content_preview
FROM modules m
JOIN courses c ON m.course_id = c.id
WHERE c.code = 'AIFUND001' 
  AND m.title ILIKE '%Module 1%';

-- Let's look for the plain-text quiz pattern (the one WITHOUT radio buttons)
-- It should have patterns like: "A    34%" or "B    48%" (option letter + percentage)
SELECT 
    'Looking for percentage patterns (plain-text quiz)' as search,
    POSITION('34%' IN m.content) as pos_34_percent,
    POSITION('48%' IN m.content) as pos_48_percent,
    POSITION('67%' IN m.content) as pos_67_percent,
    POSITION('82%' IN m.content) as pos_82_percent
FROM modules m
JOIN courses c ON m.course_id = c.id
WHERE c.code = 'AIFUND001' 
  AND m.title ILIKE '%Module 1%';

-- Show content around the percentage patterns
SELECT 
    'Content around 34% (plain-text quiz indicator)' as location,
    SUBSTRING(m.content, POSITION('34%' IN m.content) - 200, 500) as content_preview
FROM modules m
JOIN courses c ON m.course_id = c.id
WHERE c.code = 'AIFUND001' 
  AND m.title ILIKE '%Module 1%'
  AND POSITION('34%' IN m.content) > 0;

-- Show the VERY END of the content (last 1000 chars)
SELECT 
    'LAST 1000 CHARACTERS OF MODULE CONTENT' as location,
    LENGTH(m.content) as total_length,
    SUBSTRING(m.content, LENGTH(m.content) - 1000, 1000) as last_1000_chars
FROM modules m
JOIN courses c ON m.course_id = c.id
WHERE c.code = 'AIFUND001' 
  AND m.title ILIKE '%Module 1%';
