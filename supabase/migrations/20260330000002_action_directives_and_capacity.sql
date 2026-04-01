-- ==========================================
-- 14. ACTION DIRECTIVES (Logic Module)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.action_directives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    detail TEXT,
    status TEXT DEFAULT 'On Track' CHECK (status IN ('On Track', 'Needs Attention', 'Delayed')),
    priority_tier INTEGER DEFAULT 2 CHECK (priority_tier IN (1, 2, 3)),
    mocha_role TEXT,
    department TEXT,
    owner_id UUID REFERENCES public.users(id),
    deadline TEXT,
    initiative_id UUID REFERENCES public.projects(id),
    original_message_link TEXT,
    category TEXT DEFAULT 'Action Items',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.action_directives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Action directives viewable by everyone" ON public.action_directives FOR SELECT USING (true);
CREATE POLICY "Action directives insertable by authenticated users" ON public.action_directives FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Action directives updatable by authenticated users" ON public.action_directives FOR UPDATE USING (auth.uid() IS NOT NULL);

-- ==========================================
-- 15. TEAM CAPACITY (Real-time Sync)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.team_capacity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) UNIQUE,
    full_name TEXT,
    role TEXT,
    department TEXT,
    load_percentage INTEGER DEFAULT 0 CHECK (load_percentage >= 0 AND load_percentage <= 100),
    status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'Busy', 'Ooo', 'Focus')),
    current_task TEXT,
    last_updated TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.team_capacity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team capacity viewable by everyone" ON public.team_capacity FOR SELECT USING (true);
CREATE POLICY "Team capacity updatable by authenticated users" ON public.team_capacity FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Enable Realtime for these tables
-- Note: We check if the publication exists first, usually it does in Supabase
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE public.action_directives;
ALTER PUBLICATION supabase_realtime ADD TABLE public.team_capacity;
