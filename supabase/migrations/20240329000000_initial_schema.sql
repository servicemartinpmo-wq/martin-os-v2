-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. USERS & IDENTITY
-- ==========================================
CREATE TABLE users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'observer', -- builder, observer
  tier TEXT DEFAULT 'community', -- community, contributor_free, contributor_paid, enterprise
  camera_mode BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 2. PROJECTS & INITIATIVES (PMO-Ops / Martin OS)
-- ==========================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'planned', -- planned, in-progress, blocked, complete
  type TEXT DEFAULT 'Operational', -- Transformative, Operational
  tags TEXT[],
  public_visibility BOOLEAN DEFAULT false,
  priority_score INTEGER DEFAULT 0,
  strategic_alignment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 3. TASKS & TICKETS (Tech-Ops / PMO)
-- ==========================================
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  title TEXT NOT NULL,
  description TEXT,
  assignee_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'todo', -- todo, in-progress, blocked, done
  priority TEXT DEFAULT 'medium', -- low, medium, high, critical
  system_context TEXT, -- e.g., 'Auth Service', 'Payment Gateway'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 4. EXECUTION LOGS (miidle - The Messy Middle)
-- ==========================================
CREATE TABLE execution_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id),
  user_id UUID REFERENCES users(id),
  action_type TEXT NOT NULL, -- create, edit, delete, automate, decision, cursor_agent_sync
  tool TEXT, -- Manual, Automation, Cursor Agent
  duration_seconds INTEGER,
  error_flag BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb, -- Store workflow steps, agent payloads, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE execution_logs ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 5. BUILD STORIES & WRITE-UPS (miidle)
-- ==========================================
CREATE TABLE build_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  creator_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  summary TEXT,
  content_video TEXT,
  content_audio TEXT,
  content_writeup TEXT,
  tags TEXT[],
  outcome_metrics JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'draft', -- draft, published
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE build_stories ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- RLS POLICIES (Prototyping Defaults)
-- ==========================================

-- Users can read all public profiles, but only update their own
CREATE POLICY "Public profiles are viewable by everyone." ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON users FOR UPDATE USING (auth.uid() = id);

-- Projects: Viewable if public or if owner
CREATE POLICY "Projects viewable by everyone if public" ON projects FOR SELECT USING (public_visibility = true OR auth.uid() = owner_id);
CREATE POLICY "Users can insert their own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update their own projects" ON projects FOR UPDATE USING (auth.uid() = owner_id);

-- Tasks: Viewable if project is viewable
CREATE POLICY "Tasks viewable by project access" ON tasks FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = tasks.project_id AND (projects.public_visibility = true OR projects.owner_id = auth.uid()))
);
CREATE POLICY "Users can manage tasks for their projects" ON tasks FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = tasks.project_id AND projects.owner_id = auth.uid())
);

-- Execution Logs: Viewable by project access, insertable by agents/users
CREATE POLICY "Logs viewable by project access" ON execution_logs FOR SELECT USING (true);
CREATE POLICY "Users can insert logs" ON execution_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 6. CONNECTORS (Tech-Ops)
-- ==========================================
CREATE TABLE connectors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'Healthy',
  last_checked TIMESTAMPTZ DEFAULT NOW(),
  response_time INTEGER DEFAULT 0
);
ALTER TABLE connectors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Connectors viewable by everyone" ON connectors FOR SELECT USING (true);

-- ==========================================
-- 7. FRAMEWORKS (Resource Hub)
-- ==========================================
CREATE TABLE frameworks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  execution_module TEXT,
  outputs_to TEXT[],
  status_relevance TEXT,
  temporal_context TEXT,
  dependencies TEXT[],
  notes TEXT
);
ALTER TABLE frameworks ENABLE ROW LEVEL SECURITY;-- ==========================================
-- 8. SIGNALS & INSIGHTS (Executive Dashboard)
-- ==========================================
CREATE TABLE IF NOT EXISTS signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT, -- info, warning, critical
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signals viewable by everyone" ON signals FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Insights viewable by everyone" ON insights FOR SELECT USING (true);

-- ==========================================
-- 9. ONBOARDING & PRICING (Landing Page)
-- ==========================================
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price_monthly INTEGER NOT NULL,
  features TEXT[]
);
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Plans viewable by everyone" ON plans FOR SELECT USING (true);

-- ==========================================
-- 10. INTAKE & WORKSPACE SETUP
-- ==========================================
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  industry TEXT,
  size TEXT,
  revenue_range TEXT
);
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS intake_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  pain_points TEXT[],
  tools TEXT[],
  goals TEXT[],
  maturity_score INTEGER
);
ALTER TABLE intake_responses ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id),
  mode TEXT NOT NULL, -- Founder, SMB, Office Manager
  health_score NUMERIC DEFAULT 100
);
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id),
  type TEXT NOT NULL,
  status TEXT DEFAULT 'active'
);
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 11. HEALTH SCORE ENGINE
-- ==========================================
CREATE OR REPLACE FUNCTION calculate_company_health_score(ws_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    task_velocity FLOAT;
    risk_count INT;
    health_score NUMERIC;
BEGIN
    -- 1. Calculate Velocity (Completed tasks vs Overdue)
    SELECT COUNT(*) FILTER (WHERE status = 'done')::FLOAT / NULLIF(COUNT(*), 0)
    INTO task_velocity FROM tasks WHERE project_id IN (SELECT id FROM projects WHERE owner_id IN (SELECT id FROM users));

    -- 2. Count active risks
    SELECT COUNT(*) INTO risk_count FROM operational_signals 
    WHERE status != 'executed' AND priority_score > 0.8;

    -- 3. The Mega Algorithm (0-100)
    health_score := (task_velocity * 70) - (risk_count * 5) + 30;
    
    RETURN LEAST(GREATEST(health_score, 0), 100);
END;
$$ LANGUAGE plpgsql;


-- ==========================================
-- 13. SYSTEM HEALTH MONITORING
-- ==========================================
CREATE TABLE IF NOT EXISTS public.system_health_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    function_name TEXT,
    status TEXT, -- 'healthy', 'degraded', 'down'
    latency_ms INT,
    error_payload JSONB,
    ai_remedy_suggestion TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 1. Unified Operational Signals (The Webhook Entrypoint)
CREATE TABLE IF NOT EXISTS public.operational_signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_app TEXT NOT NULL CHECK (source_app IN ('pmo_ops', 'tech_ops', 'miidle')),
    signal_type TEXT NOT NULL,
    context_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'unprocessed' CHECK (status IN ('unprocessed', 'classified', 'diagnosed', 'executed', 'failed')),
    priority_score NUMERIC(5,2),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Brain Memory Logs (The Learning Loop)
CREATE TABLE IF NOT EXISTS public.memory_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    signal_id UUID REFERENCES public.operational_signals(id) ON DELETE CASCADE,
    input_payload JSONB,
    classification JSONB,
    decision_trace JSONB,
    output_payload JSONB,
    success BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Knowledge Base & RAG (The Context)
CREATE TABLE IF NOT EXISTS public.knowledge_bases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_app TEXT NOT NULL CHECK (source_app IN ('pmo_ops', 'tech_ops', 'miidle')),
    framework_name TEXT NOT NULL,
    decision_rules JSONB NOT NULL,
    active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.knowledge_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    knowledge_base_id UUID REFERENCES public.knowledge_bases(id) ON DELETE CASCADE,
    chunk_text TEXT NOT NULL,
    embedding vector(1536),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Add basic indexing for RAG
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_embedding 
ON public.knowledge_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

