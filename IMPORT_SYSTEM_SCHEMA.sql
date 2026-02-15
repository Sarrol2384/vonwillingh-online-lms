-- ============================================================
-- COURSE IMPORT SYSTEM - Database Schema Setup
-- ============================================================
-- Run this in Supabase SQL Editor to set up import functionality
-- ============================================================

-- 1. Create admin_users table for authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create admin_sessions table for auth tokens
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create import_logs table to track all imports
CREATE TABLE IF NOT EXISTS import_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES admin_users(id),
  course_id INTEGER REFERENCES courses(id) ON DELETE SET NULL,
  course_name TEXT NOT NULL,
  modules_count INTEGER DEFAULT 0,
  status TEXT NOT NULL, -- 'success', 'partial', 'failed'
  error_message TEXT,
  import_data JSONB, -- Store the original JSON for reference
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_import_logs_admin_user ON import_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_import_logs_course ON import_logs(course_id);
CREATE INDEX IF NOT EXISTS idx_import_logs_created ON import_logs(created_at DESC);

-- 5. Create default admin user (CHANGE PASSWORD IN PRODUCTION!)
-- Password: 'admin123' (hashed with bcrypt)
INSERT INTO admin_users (email, password_hash, full_name, role)
VALUES (
  'admin@vonwillingh.com',
  '$2a$10$rBV2KX9Ck6fPwCJQ9lZE0.J4vQZJxKVQZE0YGX9xKVPCJQ9lZE0J4',
  'System Administrator',
  'admin'
)
ON CONFLICT (email) DO NOTHING;

-- 6. Verify setup
SELECT 
  '✅ Import system schema created!' AS status,
  (SELECT COUNT(*) FROM admin_users) AS admin_users,
  (SELECT COUNT(*) FROM admin_sessions) AS active_sessions,
  (SELECT COUNT(*) FROM import_logs) AS import_logs;

-- ============================================================
-- NOTES:
-- 1. Change the default admin password immediately!
-- 2. Admin can import courses via /api/admin/courses/import
-- 3. All imports are logged in import_logs table
-- 4. Session tokens expire after 24 hours
-- ============================================================
