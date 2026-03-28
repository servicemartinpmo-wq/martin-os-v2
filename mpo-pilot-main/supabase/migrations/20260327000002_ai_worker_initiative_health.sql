-- ============================================================================
-- AI WORKERS: INITIATIVE HEALTH MONITORING (SLICE A)
-- ============================================================================
-- This migration is additive and introduces dedicated AI worker runtime tables
-- for the signal -> diagnose -> recommend -> execute loop.

CREATE TABLE IF NOT EXISTS public.ai_worker_workflow_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL CHECK (domain IN ('pmo_ops', 'tech_ops', 'miiddle')),
  workflow_key TEXT NOT NULL,
  workflow_name TEXT NOT NULL,
  trigger_signal_codes JSONB NOT NULL DEFAULT '[]'::jsonb,
  workflow_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (domain, workflow_key)
);

CREATE TABLE IF NOT EXISTS public.ai_worker_workflow_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id TEXT NOT NULL,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  domain TEXT NOT NULL CHECK (domain IN ('pmo_ops', 'tech_ops', 'miiddle')),
  workflow_key TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'queued'
    CHECK (state IN ('queued', 'running', 'waiting_review', 'retrying', 'completed', 'failed', 'fallback')),
  attempt_count INTEGER NOT NULL DEFAULT 0,
  priority_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  initiative_id TEXT,
  timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
  diagnostic_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommendation_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  action_item_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  last_error_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_worker_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id TEXT NOT NULL,
  workflow_run_id UUID REFERENCES public.ai_worker_workflow_runs(id) ON DELETE SET NULL,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  domain TEXT NOT NULL CHECK (domain IN ('pmo_ops', 'tech_ops', 'miiddle')),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('organization', 'department', 'initiative', 'project', 'task', 'kpi', 'team')),
  entity_id TEXT NOT NULL,
  signal_type TEXT NOT NULL CHECK (signal_type IN ('operational', 'strategic', 'behavioral', 'risk')),
  signal_code TEXT NOT NULL,
  severity NUMERIC(5,2) NOT NULL DEFAULT 0,
  confidence_score NUMERIC(6,4) NOT NULL DEFAULT 0,
  reason_codes JSONB NOT NULL DEFAULT '[]'::jsonb,
  evidence JSONB NOT NULL DEFAULT '{}'::jsonb,
  processed BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'processed', 'dismissed', 'escalated')),
  triggered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_worker_diagnostics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id TEXT NOT NULL,
  workflow_run_id UUID NOT NULL REFERENCES public.ai_worker_workflow_runs(id) ON DELETE CASCADE,
  signal_id UUID NOT NULL REFERENCES public.ai_worker_signals(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  domain TEXT NOT NULL CHECK (domain IN ('pmo_ops', 'tech_ops', 'miiddle')),
  framework_bundle TEXT NOT NULL DEFAULT 'PMBOK+TOC+Lean',
  root_causes JSONB NOT NULL DEFAULT '[]'::jsonb,
  confidence_score NUMERIC(6,4) NOT NULL DEFAULT 0,
  summary TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_worker_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id TEXT NOT NULL,
  workflow_run_id UUID NOT NULL REFERENCES public.ai_worker_workflow_runs(id) ON DELETE CASCADE,
  signal_id UUID NOT NULL REFERENCES public.ai_worker_signals(id) ON DELETE CASCADE,
  diagnostic_id UUID NOT NULL REFERENCES public.ai_worker_diagnostics(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  domain TEXT NOT NULL CHECK (domain IN ('pmo_ops', 'tech_ops', 'miiddle')),
  action_type TEXT NOT NULL CHECK (action_type IN ('quick_fix', 'structural', 'strategic')),
  title TEXT NOT NULL,
  rationale TEXT NOT NULL,
  impact_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  effort_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  risk_reduction_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  expected_roi NUMERIC(12,2),
  time_to_impact_days INTEGER,
  owner_role TEXT,
  owner_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  auto_execute_eligible BOOLEAN NOT NULL DEFAULT false,
  confidence_score NUMERIC(6,4) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'accepted', 'rejected', 'executing', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_worker_action_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id TEXT NOT NULL,
  workflow_run_id UUID NOT NULL REFERENCES public.ai_worker_workflow_runs(id) ON DELETE CASCADE,
  signal_id UUID REFERENCES public.ai_worker_signals(id) ON DELETE SET NULL,
  recommendation_id UUID NOT NULL REFERENCES public.ai_worker_recommendations(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  domain TEXT NOT NULL CHECK (domain IN ('pmo_ops', 'tech_ops', 'miiddle')),
  initiative_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to TEXT,
  due_date DATE,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'in_progress', 'done', 'cancelled')),
  execution_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_worker_org_health_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id TEXT NOT NULL,
  workflow_run_id UUID NOT NULL REFERENCES public.ai_worker_workflow_runs(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  domain TEXT NOT NULL CHECK (domain IN ('pmo_ops', 'tech_ops', 'miiddle')),
  initiative_id TEXT,
  score NUMERIC(5,2) NOT NULL,
  ops_score NUMERIC(5,2) NOT NULL,
  revenue_score NUMERIC(5,2) NOT NULL,
  product_score NUMERIC(5,2) NOT NULL,
  team_score NUMERIC(5,2) NOT NULL,
  contributing_signal_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_worker_workflow_runs_profile_state
  ON public.ai_worker_workflow_runs(profile_id, state, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_worker_workflow_runs_request
  ON public.ai_worker_workflow_runs(request_id, domain, workflow_key);
CREATE INDEX IF NOT EXISTS idx_ai_worker_workflow_runs_initiative
  ON public.ai_worker_workflow_runs(initiative_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_worker_signals_request
  ON public.ai_worker_signals(request_id, profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_worker_signals_entity
  ON public.ai_worker_signals(entity_type, entity_id, triggered_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_worker_signals_code_status
  ON public.ai_worker_signals(signal_code, status, processed, triggered_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_worker_diagnostics_signal
  ON public.ai_worker_diagnostics(signal_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_worker_recommendations_signal
  ON public.ai_worker_recommendations(signal_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_worker_action_items_recommendation
  ON public.ai_worker_action_items(recommendation_id, status, due_date);
CREATE INDEX IF NOT EXISTS idx_ai_worker_action_items_initiative
  ON public.ai_worker_action_items(initiative_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_worker_health_scores_initiative
  ON public.ai_worker_org_health_scores(initiative_id, computed_at DESC);

ALTER TABLE public.ai_worker_workflow_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_worker_workflow_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_worker_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_worker_diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_worker_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_worker_action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_worker_org_health_scores ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  CREATE POLICY "Users manage ai worker templates"
    ON public.ai_worker_workflow_templates
    FOR ALL TO authenticated
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Users manage own ai worker workflow runs"
    ON public.ai_worker_workflow_runs
    FOR ALL TO authenticated
    USING (profile_id = auth.uid())
    WITH CHECK (profile_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Users manage own ai worker signals"
    ON public.ai_worker_signals
    FOR ALL TO authenticated
    USING (profile_id = auth.uid())
    WITH CHECK (profile_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Users manage own ai worker diagnostics"
    ON public.ai_worker_diagnostics
    FOR ALL TO authenticated
    USING (profile_id = auth.uid())
    WITH CHECK (profile_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Users manage own ai worker recommendations"
    ON public.ai_worker_recommendations
    FOR ALL TO authenticated
    USING (profile_id = auth.uid())
    WITH CHECK (profile_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Users manage own ai worker action items"
    ON public.ai_worker_action_items
    FOR ALL TO authenticated
    USING (profile_id = auth.uid())
    WITH CHECK (profile_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Users manage own ai worker org health scores"
    ON public.ai_worker_org_health_scores
    FOR ALL TO authenticated
    USING (profile_id = auth.uid())
    WITH CHECK (profile_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

INSERT INTO public.ai_worker_workflow_templates (
  domain,
  workflow_key,
  workflow_name,
  trigger_signal_codes,
  workflow_json
)
VALUES
  (
    'pmo_ops',
    'wf_pmo_035_initiative_health_diagnostics',
    'PMO Initiative Health Diagnostics',
    '["missed_deadline", "milestone_delay", "backlog_growth"]'::jsonb,
    '{"steps":["detect_signals","diagnose","recommend","execute","score_health"]}'::jsonb
  ),
  (
    'pmo_ops',
    'wf_pmo_032_risk_register',
    'PMO Risk Register Auto-Update',
    '["initiative_at_risk","kpi_decline"]'::jsonb,
    '{"steps":["detect_signals","diagnose","recommend","execute"]}'::jsonb
  ),
  (
    'pmo_ops',
    'wf_pmo_018_recovery_system',
    'PMO Recovery System',
    '["missed_deadline","overcapacity_team"]'::jsonb,
    '{"steps":["detect_signals","diagnose","recommend","execute","score_health"]}'::jsonb
  )
ON CONFLICT (domain, workflow_key) DO NOTHING;
