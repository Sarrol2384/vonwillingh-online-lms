-- Check Module 1 structure that's working
SELECT 
  id,
  title,
  description,
  content_type,
  order_number,
  duration_minutes,
  LENGTH(content) as content_length,
  LEFT(content, 500) as content_preview
FROM modules 
WHERE title ILIKE '%Module 1%' AND title ILIKE '%Leadership%'
LIMIT 1;

-- Also check how many quiz questions Module 1 has
SELECT 
  COUNT(*) as total_questions,
  module_id
FROM quiz_questions
WHERE module_id IN (SELECT id FROM modules WHERE title ILIKE '%Module 1%' AND title ILIKE '%Leadership%')
GROUP BY module_id;
