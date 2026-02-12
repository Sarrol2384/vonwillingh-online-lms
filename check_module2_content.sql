-- Check Module 2 content to see if quiz questions are embedded
SELECT 
  id,
  title,
  LENGTH(content) as content_length,
  CASE 
    WHEN content LIKE '%Question 1:%' THEN 'YES - Quiz questions found in content!'
    ELSE 'NO - Content looks clean'
  END as quiz_in_content,
  LEFT(content, 500) as content_preview
FROM modules 
WHERE title = 'Module 2: Core Concepts in Leadership'
  AND id = '199fe8ca-669d-4a60-a816-7fcc16e1d604';
