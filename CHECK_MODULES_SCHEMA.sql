-- Run this in Supabase SQL Editor to see your ACTUAL schema
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'modules'
ORDER BY ordinal_position;
