-- ==========================================
-- 18. LOGGING & ANALYTICS TABLES
-- ==========================================

-- action_runs table
CREATE TABLE IF NOT EXISTS public.action_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action_id TEXT NOT NULL,
    user_id TEXT,
    status TEXT,
    payload JSONB DEFAULT '{}'::jsonb,
    result JSONB DEFAULT '{}'::jsonb,
    error TEXT,
    request_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ai_runs table
CREATE TABLE IF NOT EXISTS public.ai_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT,
    success BOOLEAN,
    error TEXT,
    request_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- system_events table
CREATE TABLE IF NOT EXISTS public.system_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    request_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 19. OS CORE TABLES (Missing from previous migrations)
-- ==========================================

-- os_blueprints table
CREATE TABLE IF NOT EXISTS public.os_blueprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    path TEXT UNIQUE NOT NULL,
    title TEXT,
    layout TEXT,
    components JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- os_org_mapping table
CREATE TABLE IF NOT EXISTS public.os_org_mapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_key TEXT UNIQUE NOT NULL,
    display_title TEXT,
    domains TEXT[],
    pref_channel TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- os_departments table
CREATE TABLE IF NOT EXISTS public.os_departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    maturity_score INTEGER DEFAULT 0,
    health_status TEXT DEFAULT 'Healthy',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- os_initiatives table
CREATE TABLE IF NOT EXISTS public.os_initiatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    priority_score INTEGER DEFAULT 0,
    impact_score INTEGER DEFAULT 0,
    effort_score INTEGER DEFAULT 0,
    framework_tag TEXT,
    budget NUMERIC DEFAULT 0,
    spent NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- os_dependencies table
CREATE TABLE IF NOT EXISTS public.os_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dependent_initiative_id UUID REFERENCES public.os_initiatives(id) ON DELETE CASCADE,
    provider_dept_id UUID REFERENCES public.os_departments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 20. RLS POLICIES FOR NEW TABLES
-- ==========================================

ALTER TABLE public.action_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.os_blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.os_org_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.os_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.os_initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.os_dependencies ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all logging and OS data
CREATE POLICY "Allow authenticated read for action_runs" ON public.action_runs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read for ai_runs" ON public.ai_runs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read for system_events" ON public.system_events FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read for os_blueprints" ON public.os_blueprints FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read for os_org_mapping" ON public.os_org_mapping FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read for os_departments" ON public.os_departments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read for os_initiatives" ON public.os_initiatives FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read for os_dependencies" ON public.os_dependencies FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert into logging tables
CREATE POLICY "Allow authenticated insert for action_runs" ON public.action_runs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert for ai_runs" ON public.ai_runs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert for system_events" ON public.system_events FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to manage OS data (for demo/prototyping)
CREATE POLICY "Allow authenticated manage for os_blueprints" ON public.os_blueprints FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated manage for os_org_mapping" ON public.os_org_mapping FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated manage for os_departments" ON public.os_departments FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated manage for os_initiatives" ON public.os_initiatives FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated manage for os_dependencies" ON public.os_dependencies FOR ALL USING (auth.role() = 'authenticated');

-- ==========================================
-- 21. SEED DATA FOR ORG MAPPING
-- ==========================================

INSERT INTO public.os_org_mapping (role_key, display_title, domains, pref_channel)
VALUES 
    ('HR_LEAD', 'Head of People', ARRAY['HR', 'Recruiting', 'Culture'], 'Slack'),
    ('OPS_LEAD', 'Operations Director', ARRAY['Operations', 'Supplies', 'Logistics'], 'Email'),
    ('TECH_LEAD', 'CTO', ARRAY['Technology', 'Infrastructure', 'Security'], 'Slack'),
    ('FINANCE_LEAD', 'CFO', ARRAY['Finance', 'Budget', 'Audit'], 'Email')
ON CONFLICT (role_key) DO NOTHING;

-- ==========================================
-- 22. ENABLE REALTIME FOR OS TABLES
-- ==========================================

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.os_initiatives;
        ALTER PUBLICATION supabase_realtime ADD TABLE public.os_departments;
    END IF;
EXCEPTION
    WHEN others THEN
        NULL;
END $$;
