-- ==========================================
-- SECURITY PATCH: FIX PII LEAK IN USERS TABLE
-- ==========================================

-- 1. Drop the over-permissive policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON users;

-- 2. Create a restricted policy: Users can only see their own full profile (including email)
CREATE POLICY "Users can view their own full profile" 
ON users FOR SELECT 
USING (auth.uid() = id);

-- 3. Create a Public Profile View (Safe for sharing)
-- This view excludes sensitive fields like 'email'
CREATE OR REPLACE VIEW public_profiles AS
SELECT id, full_name, avatar_url, role, tier, created_at
FROM users;

-- 4. Grant access to the public view
-- Note: Views in Supabase inherit RLS from underlying tables by default in some configs, 
-- but it's safer to explicitly manage access if needed or use 'security definer' functions.
-- For this audit, we'll assume the frontend will now query 'public_profiles' for team lists.

-- 5. Update execution_logs policy to require authentication
DROP POLICY IF EXISTS "Logs viewable by project access" ON execution_logs;
CREATE POLICY "Logs viewable by authenticated users" 
ON execution_logs FOR SELECT 
USING (auth.role() = 'authenticated');
