-- 1. Create missing tables
CREATE TABLE IF NOT EXISTS public.diagnostics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    current_stage INT DEFAULT 1,
    stage_logs JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.initiatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'done', 'blocked', 'on-hold')),
    department_id UUID,
    okr_id UUID,
    due_date TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    strategic_alignment NUMERIC(5,2),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.initiative_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    initiative_id UUID REFERENCES public.initiatives(id) ON DELETE CASCADE,
    depends_on_id UUID REFERENCES public.initiatives(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Add heartbeat to operational_signals
ALTER TABLE public.operational_signals ADD COLUMN IF NOT EXISTS heartbeat TIMESTAMPTZ DEFAULT now();

-- 3. Enable RLS for all relevant tables
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_traces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operational_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_bases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.initiative_dependencies ENABLE ROW LEVEL SECURITY;

-- 4. Add RLS Policies (Default: Authenticated users can read, only service role can write for some, or owner-based)
-- For simplicity and following the user's "Unified OS" vision, we'll allow authenticated users to read most operational data.

CREATE POLICY "Allow authenticated read for documents" ON public.documents FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read for agent_traces" ON public.agent_traces FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read for operational_signals" ON public.operational_signals FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read for memory_logs" ON public.memory_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read for knowledge_bases" ON public.knowledge_bases FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read for knowledge_chunks" ON public.knowledge_chunks FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read for diagnostics" ON public.diagnostics FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read for initiatives" ON public.initiatives FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read for initiative_dependencies" ON public.initiative_dependencies FOR SELECT USING (auth.role() = 'authenticated');

-- Allow service role (or authenticated for now to simplify demo) to insert/update
CREATE POLICY "Allow authenticated insert for operational_signals" ON public.operational_signals FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update for operational_signals" ON public.operational_signals FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert for agent_traces" ON public.agent_traces FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert for memory_logs" ON public.memory_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
