-- ============================================================
-- RELOAD SUPABASE POSTGREST SCHEMA CACHE
-- ============================================================

-- This notifies PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';

-- Alternative: You can also do this via Supabase Dashboard:
-- Settings → API → Click "Reload Schema Cache" button

-- Wait a moment, then verify columns are visible
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'quiz_questions'
ORDER BY ordinal_position;
