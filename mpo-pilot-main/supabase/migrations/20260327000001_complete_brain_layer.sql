-- ================================================================================
-- COMPLETE BRAIN LAYER IMPLEMENTATION
-- Multi-Domain Operations Platform: PMO_OPS, TECH_OPS, MIIDDLE
-- Brain Engines: Classification, Retrieval, Decision, Execution, Memory
-- ================================================================================
-- Migration: 20260327000001_complete_brain_layer.sql
-- Author: Brain Layer Architecture System
-- Date: 2026-03-27
-- ================================================================================

-- ============================================================================
-- SECTION 1: SHARED CORE HELPER FUNCTIONS
-- ============================================================================

-- Ensure extensions are available
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Helper: safely create a policy (idempotent)
CREATE OR REPLACE FUNCTION public._create_policy_if_not_exists(
  p_table text, p_name text, p_cmd text, p_expr text
)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = p_table AND policyname = p_name) THEN
    BEGIN
      IF upper(p_cmd) = 'INSERT' THEN
        EXECUTE format('CREATE POLICY %I ON public.%I FOR INSERT TO authenticated WITH CHECK (%s);', p_name, p_table, p_expr);
      ELSE
        EXECUTE format('CREATE POLICY %I ON public.%I FOR %s TO authenticated USING (%s);', p_name, p_table, p_cmd, p_expr);
      END IF;
    EXCEPTION WHEN others THEN
      RAISE NOTICE 'Skipping policy % on %: %', p_name, p_table, SQLERRM;
    END;
  END IF;
END;
$$;

-- Helper: set timestamps
CREATE OR REPLACE FUNCTION public.brain_set_timestamps()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ============================================================================
-- SECTION 2: DOMAIN SCHEMAS - PMO_OPS
-- ============================================================================

-- Create pmo_ops schema if not exists
CREATE SCHEMA IF NOT EXISTS pmo_ops;

-- PMO_OPS: Brain Engine Tables

-- 2.1 CLASSIFICATION ENGINE
CREATE TABLE IF NOT EXISTS pmo_ops.classification_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  label_id TEXT NOT NULL,
  label_name TEXT NOT NULL,
  label_type TEXT NOT NULL CHECK (label_type IN ('ticket','action','question','idea','initiative','risk','signal')),
  rule_pattern JSONB NOT NULL DEFAULT '{}',
  weight NUMERIC(4,3) NOT NULL DEFAULT 1.0,
  active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pmo_ops.classification_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL,
  request_id TEXT NOT NULL,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  primary_label TEXT NOT NULL,
  confidence_tier TEXT NOT NULL CHECK (confidence_tier IN ('high','medium','low')),
  score_breakdown JSONB NOT NULL DEFAULT '{}',
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.2 RETRIEVAL ENGINE (RAG)
CREATE TABLE IF NOT EXISTS pmo_ops.knowledge_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  domain TEXT NOT NULL DEFAULT 'pmo',
  source_type TEXT NOT NULL DEFAULT 'document',
  source_uri TEXT,
  trust_level NUMERIC(4,3) NOT NULL DEFAULT 0.600,
  effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_to DATE NOT NULL DEFAULT '9999-12-31'::DATE,
  tags JSONB NOT NULL DEFAULT '[]',
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pmo_ops.knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES pmo_ops.knowledge_documents(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  chunk_text TEXT NOT NULL,
  token_count INTEGER NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}',
  embedding vector(1536),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (document_id, chunk_index)
);

-- 2.3 DECISION ENGINE
CREATE TABLE IF NOT EXISTS pmo_ops.decision_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  rule_name TEXT NOT NULL,
  condition_expression JSONB NOT NULL DEFAULT '{}',
  action_output JSONB NOT NULL DEFAULT '{}',
  priority_weight NUMERIC(4,3) NOT NULL DEFAULT 1.0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pmo_ops.decision_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL,
  request_id TEXT NOT NULL,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  classification JSONB NOT NULL DEFAULT '{}',
  priority_score NUMERIC(5,2) NOT NULL,
  risk_score NUMERIC(5,2) NOT NULL,
  confidence_score NUMERIC(6,4) NOT NULL,
  decision_payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.4 EXECUTION ENGINE (WORKFLOWS)
CREATE TABLE IF NOT EXISTS pmo_ops.workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  workflow_key TEXT NOT NULL,
  workflow_name TEXT NOT NULL,
  trigger_type TEXT NOT NULL DEFAULT 'event' CHECK (trigger_type IN ('event','schedule','manual')),
  workflow_json JSONB NOT NULL DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (profile_id, workflow_key)
);

CREATE TABLE IF NOT EXISTS pmo_ops.workflow_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL,
  request_id TEXT NOT NULL,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  workflow_key TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'queued' CHECK (state IN ('queued','running','waiting_review','retrying','completed','failed','fallback')),
  attempt_count INTEGER NOT NULL DEFAULT 0,
  last_error_code TEXT,
  timeline JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pmo_ops.tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  tool_name TEXT NOT NULL,
  tool_type TEXT NOT NULL CHECK (tool_type IN ('update_db','trigger_function','call_api','send_notification')),
  target TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (profile_id, tool_name)
);

-- 2.5 MEMORY + LEARNING SYSTEM
CREATE TABLE IF NOT EXISTS pmo_ops.memory_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL,
  request_id TEXT NOT NULL,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_payload JSONB NOT NULL DEFAULT '{}',
  quality_signal NUMERIC(6,4),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pmo_ops.memory_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL,
  request_id TEXT NOT NULL,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  success BOOLEAN NOT NULL DEFAULT false,
  time_to_resolve_seconds INTEGER,
  output_payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pmo_ops.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL,
  request_id TEXT NOT NULL,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  helpful BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- SECTION 3: DOMAIN SCHEMAS - TECH_OPS
-- ============================================================================

-- Create tech_ops schema if not exists
CREATE SCHEMA IF NOT EXISTS tech_ops;

-- TECH_OPS: Brain Engine Tables (same structure as pmo_ops)

-- 3.1 CLASSIFICATION ENGINE
CREATE TABLE IF NOT EXISTS tech_ops.classification_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  label_id TEXT NOT NULL,
  label_name TEXT NOT NULL,
  label_type TEXT NOT NULL CHECK (label_type IN ('ticket','action','question','incident','alert','maintenance')),
  rule_pattern JSONB NOT NULL DEFAULT '{}',
  weight NUMERIC(4,3) NOT NULL DEFAULT 1.0,
  active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tech_ops.classification_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL,
  request_id TEXT NOT NULL,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  primary_label TEXT NOT NULL,
  confidence_tier TEXT NOT NULL CHECK (confidence_tier IN ('high','medium','low')),
  score_breakdown JSONB NOT NULL DEFAULT '{}',
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.2 RETRIEVAL ENGINE (RAG)
CREATE TABLE IF NOT EXISTS tech_ops.knowledge_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  domain TEXT NOT NULL DEFAULT 'tech',
  source_type TEXT NOT NULL DEFAULT 'document',
  source_uri TEXT,
  trust_level NUMERIC(4,3) NOT NULL DEFAULT 0.600,
  effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_to DATE NOT NULL DEFAULT '9999-12-31'::DATE,
  tags JSONB NOT NULL DEFAULT '[]',
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tech_ops.knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES tech_ops.knowledge_documents(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  chunk_text TEXT NOT NULL,
  token_count INTEGER NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}',
  embedding vector(1536),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (document_id, chunk_index)
);

-- 3.3 DECISION ENGINE
CREATE TABLE IF NOT EXISTS tech_ops.decision_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  rule_name TEXT NOT NULL,
  condition_expression JSONB NOT NULL DEFAULT '{}',
  action_output JSONB NOT NULL DEFAULT '{}',
  priority_weight NUMERIC(4,3) NOT NULL DEFAULT 1.0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tech_ops.decision_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL,
  request_id TEXT NOT NULL,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  classification JSONB NOT NULL DEFAULT '{}',
  priority_score NUMERIC(5,2) NOT NULL,
  risk_score NUMERIC(5,2) NOT NULL,
  confidence_score NUMERIC(6,4) NOT NULL,
  decision_payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.4 EXECUTION ENGINE (WORKFLOWS)
CREATE TABLE IF NOT EXISTS tech_ops.workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  workflow_key TEXT NOT NULL,
  workflow_name TEXT NOT NULL,
  trigger_type TEXT NOT NULL DEFAULT 'event' CHECK (trigger_type IN ('event','schedule','manual')),
  workflow_json JSONB NOT NULL DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (profile_id, workflow_key)
);

CREATE TABLE IF NOT EXISTS tech_ops.workflow_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL,
  request_id TEXT NOT NULL,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  workflow_key TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'queued' CHECK (state IN ('queued','running','waiting_review','retrying','completed','failed','fallback')),
  attempt_count INTEGER NOT NULL DEFAULT 0,
  last_error_code TEXT,
  timeline JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tech_ops.tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  tool_name TEXT NOT NULL,
  tool_type TEXT NOT NULL CHECK (tool_type IN ('update_db','trigger_function','call_api','send_notification')),
  target TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (profile_id, tool_name)
);

-- 3.5 MEMORY + LEARNING SYSTEM
CREATE TABLE IF NOT EXISTS tech_ops.memory_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL,
  request_id TEXT NOT NULL,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_payload JSONB NOT NULL DEFAULT '{}',
  quality_signal NUMERIC(6,4),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tech_ops.memory_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL,
  request_id TEXT NOT NULL,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  success BOOLEAN NOT NULL DEFAULT false,
  time_to_resolve_seconds INTEGER,
  output_payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tech_ops.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL,
  request_id TEXT NOT NULL,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  helpful BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- SECTION 4: DOMAIN SCHEMAS - MIIDDLE
-- ============================================================================

-- Create miidle schema if not exists
CREATE SCHEMA IF NOT EXISTS miidle;

-- MIIDDLE: Brain Engine Tables (same structure)

-- 4.1 CLASSIFICATION ENGINE
CREATE TABLE IF NOT EXISTS miiddle.classification_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  label_id TEXT NOT NULL,
  label_name TEXT NOT NULL,
  label_type TEXT NOT NULL CHECK (label_type IN ('ticket','action','question','idea','automation','report')),
  rule_pattern JSONB NOT NULL DEFAULT '{}',
  weight NUMERIC(4,3) NOT NULL DEFAULT 1.0,
  active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS miiddle.classification_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL,
  request_id TEXT NOT NULL,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  primary_label TEXT NOT NULL,
  confidence_tier TEXT NOT NULL CHECK (confidence_tier IN ('high','medium','low')),
  score_breakdown JSONB NOT NULL DEFAULT '{}',
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.2 RETRIEVAL ENGINE (RAG)
CREATE TABLE IF NOT EXISTS miiddle.knowledge_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  domain TEXT NOT NULL DEFAULT 'miidle',
  source_type TEXT NOT NULL DEFAULT 'document',
  source_uri TEXT,
  trust_level NUMERIC(4,3) NOT NULL DEFAULT 0.600,
  effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_to DATE NOT NULL DEFAULT '9999-12-31'::DATE,
  tags JSONB NOT NULL DEFAULT '[]',
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS miiddle.knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES miiddle.knowledge_documents(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  chunk_text TEXT NOT NULL,
  token_count INTEGER NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}',
  embedding vector(1536),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (document_id, chunk_index)
);

-- 4.3 DECISION ENGINE
CREATE TABLE IF NOT EXISTS miiddle.decision_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  rule_name TEXT NOT NULL,
  condition_expression JSONB NOT NULL DEFAULT '{}',
  action_output JSONB NOT NULL DEFAULT '{}',
  priority_weight NUMERIC(4,3) NOT NULL DEFAULT 1.0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS miiddle.decision_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL,
  request_id TEXT NOT NULL,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  classification JSONB NOT NULL DEFAULT '{}',
  priority_score NUMERIC(5,2) NOT NULL,
  risk_score NUMERIC(5,2) NOT NULL,
  confidence_score NUMERIC(6,4) NOT NULL,
  decision_payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.4 EXECUTION ENGINE (WORKFLOWS)
CREATE TABLE IF NOT EXISTS miiddle.workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  workflow_key TEXT NOT NULL,
  workflow_name TEXT NOT NULL,
  trigger_type TEXT NOT NULL DEFAULT 'event' CHECK (trigger_type IN ('event','schedule','manual')),
  workflow_json JSONB NOT NULL DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (profile_id, workflow_key)
);

CREATE TABLE IF NOT EXISTS miiddle.workflow_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL,
  request_id TEXT NOT NULL,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  workflow_key TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'queued' CHECK (state IN ('queued','running','waiting_review','retrying','completed','failed','fallback')),
  attempt_count INTEGER NOT NULL DEFAULT 0,
  last_error_code TEXT,
  timeline JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS miiddle.tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  tool_name TEXT NOT NULL,
  tool_type TEXT NOT NULL CHECK (tool_type IN ('update_db','trigger_function','call_api','send_notification')),
  target TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (profile_id, tool_name)
);

-- 4.5 MEMORY + LEARNING SYSTEM
CREATE TABLE IF NOT EXISTS miiddle.memory_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL,
  request_id TEXT NOT NULL,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_payload JSONB NOT NULL DEFAULT '{}',
  quality_signal NUMERIC(6,4),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS miiddle.memory_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL,
  request_id TEXT NOT NULL,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  success BOOLEAN NOT NULL DEFAULT false,
  time_to_resolve_seconds INTEGER,
  output_payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS miiddle.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL,
  request_id TEXT NOT NULL,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  helpful BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- SECTION 5: TRIGGERS FOR ALL DOMAIN TABLES
-- ============================================================================

-- PMO_OPS triggers
CREATE TRIGGER pmo_ops_classification_rules_updated_at BEFORE UPDATE ON pmo_ops.classification_rules
  FOR EACH ROW EXECUTE FUNCTION public.brain_set_timestamps();
CREATE TRIGGER pmo_ops_knowledge_documents_updated_at BEFORE UPDATE ON pmo_ops.knowledge_documents
  FOR EACH ROW EXECUTE FUNCTION public.brain_set_timestamps();
CREATE TRIGGER pmo_ops_workflows_updated_at BEFORE UPDATE ON pmo_ops.workflows
  FOR EACH ROW EXECUTE FUNCTION public.brain_set_timestamps();
CREATE TRIGGER pmo_ops_tools_updated_at BEFORE UPDATE ON pmo_ops.tools
  FOR EACH ROW EXECUTE FUNCTION public.brain_set_timestamps();
CREATE TRIGGER pmo_ops_decision_rules_updated_at BEFORE UPDATE ON pmo_ops.decision_rules
  FOR EACH ROW EXECUTE FUNCTION public.brain_set_timestamps();
CREATE TRIGGER pmo_ops_workflow_runs_updated_at BEFORE UPDATE ON pmo_ops.workflow_runs
  FOR EACH ROW EXECUTE FUNCTION public.brain_set_timestamps();

-- TECH_OPS triggers
CREATE TRIGGER tech_ops_classification_rules_updated_at BEFORE UPDATE ON tech_ops.classification_rules
  FOR EACH ROW EXECUTE FUNCTION public.brain_set_timestamps();
CREATE TRIGGER tech_ops_knowledge_documents_updated_at BEFORE UPDATE ON tech_ops.knowledge_documents
  FOR EACH ROW EXECUTE FUNCTION public.brain_set_timestamps();
CREATE TRIGGER tech_ops_workflows_updated_at BEFORE UPDATE ON tech_ops.workflows
  FOR EACH ROW EXECUTE FUNCTION public.brain_set_timestamps();
CREATE TRIGGER tech_ops_tools_updated_at BEFORE UPDATE ON tech_ops.tools
  FOR EACH ROW EXECUTE FUNCTION public.brain_set_timestamps();
CREATE TRIGGER tech_ops_decision_rules_updated_at BEFORE UPDATE ON tech_ops.decision_rules
  FOR EACH ROW EXECUTE FUNCTION public.brain_set_timestamps();
CREATE TRIGGER tech_ops_workflow_runs_updated_at BEFORE UPDATE ON tech_ops.workflow_runs
  FOR EACH ROW EXECUTE FUNCTION public.brain_set_timestamps();

-- MIIDDLE triggers
CREATE TRIGGER miiddle_classification_rules_updated_at BEFORE UPDATE ON miiddle.classification_rules
  FOR EACH ROW EXECUTE FUNCTION public.brain_set_timestamps();
CREATE TRIGGER miiddle_knowledge_documents_updated_at BEFORE UPDATE ON miiddle.knowledge_documents
  FOR EACH ROW EXECUTE FUNCTION public.brain_set_timestamps();
CREATE TRIGGER miiddle_workflows_updated_at BEFORE UPDATE ON miiddle.workflows
  FOR EACH ROW EXECUTE FUNCTION public.brain_set_timestamps();
CREATE TRIGGER miiddle_tools_updated_at BEFORE UPDATE ON miiddle.tools
  FOR EACH ROW EXECUTE FUNCTION public.brain_set_timestamps();
CREATE TRIGGER miiddle_decision_rules_updated_at BEFORE UPDATE ON miiddle.decision_rules
  FOR EACH ROW EXECUTE FUNCTION public.brain_set_timestamps();
CREATE TRIGGER miiddle_workflow_runs_updated_at BEFORE UPDATE ON miiddle.workflow_runs
  FOR EACH ROW EXECUTE FUNCTION public.brain_set_timestamps();

-- ============================================================================
-- SECTION 6: INDEXES
-- ============================================================================

-- PMO_OPS indexes
CREATE INDEX IF NOT EXISTS pmo_ops_class_runs_profile ON pmo_ops.classification_runs(profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS pmo_ops_class_runs_request ON pmo_ops.classification_runs(request_id);
CREATE INDEX IF NOT EXISTS pmo_ops_kb_docs_profile ON pmo_ops.knowledge_documents(profile_id);
CREATE INDEX IF NOT EXISTS pmo_ops_kb_chunks_doc ON pmo_ops.knowledge_chunks(document_id);
CREATE INDEX IF NOT EXISTS pmo_ops_kb_chunks_embedding ON pmo_ops.knowledge_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS pmo_ops_kb_chunks_text ON pmo_ops.knowledge_chunks USING gin (chunk_text gin_trgm_ops);
CREATE INDEX IF NOT EXISTS pmo_ops_decision_runs_profile ON pmo_ops.decision_runs(profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS pmo_ops_decision_runs_request ON pmo_ops.decision_runs(request_id);
CREATE INDEX IF NOT EXISTS pmo_ops_wf_runs_profile ON pmo_ops.workflow_runs(profile_id, state);
CREATE INDEX IF NOT EXISTS pmo_ops_wf_runs_request ON pmo_ops.workflow_runs(request_id);
CREATE INDEX IF NOT EXISTS pmo_ops_memory_events_profile ON pmo_ops.memory_events(profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS pmo_ops_memory_events_request ON pmo_ops.memory_events(request_id);

-- TECH_OPS indexes
CREATE INDEX IF NOT EXISTS tech_ops_class_runs_profile ON tech_ops.classification_runs(profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS tech_ops_class_runs_request ON tech_ops.classification_runs(request_id);
CREATE INDEX IF NOT EXISTS tech_ops_kb_docs_profile ON tech_ops.knowledge_documents(profile_id);
CREATE INDEX IF NOT EXISTS tech_ops_kb_chunks_doc ON tech_ops.knowledge_chunks(document_id);
CREATE INDEX IF NOT EXISTS tech_ops_kb_chunks_embedding ON tech_ops.knowledge_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS tech_ops_kb_chunks_text ON tech_ops.knowledge_chunks USING gin (chunk_text gin_trgm_ops);
CREATE INDEX IF NOT EXISTS tech_ops_decision_runs_profile ON tech_ops.decision_runs(profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS tech_ops_decision_runs_request ON tech_ops.decision_runs(request_id);
CREATE INDEX IF NOT EXISTS tech_ops_wf_runs_profile ON tech_ops.workflow_runs(profile_id, state);
CREATE INDEX IF NOT EXISTS tech_ops_wf_runs_request ON tech_ops.workflow_runs(request_id);
CREATE INDEX IF NOT EXISTS tech_ops_memory_events_profile ON tech_ops.memory_events(profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS tech_ops_memory_events_request ON tech_ops.memory_events(request_id);

-- MIIDDLE indexes
CREATE INDEX IF NOT EXISTS miiddle_class_runs_profile ON miiddle.classification_runs(profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS miiddle_class_runs_request ON miiddle.classification_runs(request_id);
CREATE INDEX IF NOT EXISTS miiddle_kb_docs_profile ON miiddle.knowledge_documents(profile_id);
CREATE INDEX IF NOT EXISTS miiddle_kb_chunks_doc ON miiddle.knowledge_chunks(document_id);
CREATE INDEX IF NOT EXISTS miiddle_kb_chunks_embedding ON miiddle.knowledge_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS miiddle_kb_chunks_text ON miiddle.knowledge_chunks USING gin (chunk_text gin_trgm_ops);
CREATE INDEX IF NOT EXISTS miiddle_decision_runs_profile ON miiddle.decision_runs(profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS miiddle_decision_runs_request ON miiddle.decision_runs(request_id);
CREATE INDEX IF NOT EXISTS miiddle_wf_runs_profile ON miiddle.workflow_runs(profile_id, state);
CREATE INDEX IF NOT EXISTS miiddle_wf_runs_request ON miiddle.workflow_runs(request_id);
CREATE INDEX IF NOT EXISTS miiddle_memory_events_profile ON miiddle.memory_events(profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS miiddle_memory_events_request ON miiddle.memory_events(request_id);

-- ============================================================================
-- SECTION 7: RLS POLICIES - PMO_OPS
-- ============================================================================

-- Enable RLS on all pmo_ops tables
ALTER TABLE pmo_ops.classification_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE pmo_ops.classification_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pmo_ops.knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE pmo_ops.knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pmo_ops.decision_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE pmo_ops.decision_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pmo_ops.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE pmo_ops.workflow_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pmo_ops.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE pmo_ops.memory_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE pmo_ops.memory_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pmo_ops.feedback ENABLE ROW LEVEL SECURITY;

-- PMO_OPS RLS policies (profile-scoped)
DROP POLICY IF EXISTS "pmo_class_rules_own" ON pmo_ops.classification_rules;
CREATE POLICY "pmo_class_rules_own" ON pmo_ops.classification_rules
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "pmo_class_runs_own" ON pmo_ops.classification_runs;
CREATE POLICY "pmo_class_runs_own" ON pmo_ops.classification_runs
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "pmo_kb_docs_own" ON pmo_ops.knowledge_documents;
CREATE POLICY "pmo_kb_docs_own" ON pmo_ops.knowledge_documents
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "pmo_kb_chunks_own" ON pmo_ops.knowledge_chunks;
CREATE POLICY "pmo_kb_chunks_own" ON pmo_ops.knowledge_chunks
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "pmo_decision_rules_own" ON pmo_ops.decision_rules;
CREATE POLICY "pmo_decision_rules_own" ON pmo_ops.decision_rules
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "pmo_decision_runs_own" ON pmo_ops.decision_runs;
CREATE POLICY "pmo_decision_runs_own" ON pmo_ops.decision_runs
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "pmo_workflows_own" ON pmo_ops.workflows;
CREATE POLICY "pmo_workflows_own" ON pmo_ops.workflows
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "pmo_workflow_runs_own" ON pmo_ops.workflow_runs;
CREATE POLICY "pmo_workflow_runs_own" ON pmo_ops.workflow_runs
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "pmo_tools_own" ON pmo_ops.tools;
CREATE POLICY "pmo_tools_own" ON pmo_ops.tools
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "pmo_memory_events_own" ON pmo_ops.memory_events;
CREATE POLICY "pmo_memory_events_own" ON pmo_ops.memory_events
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "pmo_memory_outcomes_own" ON pmo_ops.memory_outcomes;
CREATE POLICY "pmo_memory_outcomes_own" ON pmo_ops.memory_outcomes
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "pmo_feedback_own" ON pmo_ops.feedback;
CREATE POLICY "pmo_feedback_own" ON pmo_ops.feedback
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

-- ============================================================================
-- SECTION 8: RLS POLICIES - TECH_OPS
-- ============================================================================

-- Enable RLS on all tech_ops tables
ALTER TABLE tech_ops.classification_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_ops.classification_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_ops.knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_ops.knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_ops.decision_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_ops.decision_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_ops.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_ops.workflow_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_ops.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_ops.memory_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_ops.memory_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_ops.feedback ENABLE ROW LEVEL SECURITY;

-- TECH_OPS RLS policies (profile-scoped)
DROP POLICY IF EXISTS "tech_class_rules_own" ON tech_ops.classification_rules;
CREATE POLICY "tech_class_rules_own" ON tech_ops.classification_rules
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "tech_class_runs_own" ON tech_ops.classification_runs;
CREATE POLICY "tech_class_runs_own" ON tech_ops.classification_runs
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "tech_kb_docs_own" ON tech_ops.knowledge_documents;
CREATE POLICY "tech_kb_docs_own" ON tech_ops.knowledge_documents
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "tech_kb_chunks_own" ON tech_ops.knowledge_chunks;
CREATE POLICY "tech_kb_chunks_own" ON tech_ops.knowledge_chunks
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "tech_decision_rules_own" ON tech_ops.decision_rules;
CREATE POLICY "tech_decision_rules_own" ON tech_ops.decision_rules
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "tech_decision_runs_own" ON tech_ops.decision_runs;
CREATE POLICY "tech_decision_runs_own" ON tech_ops.decision_runs
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "tech_workflows_own" ON tech_ops.workflows;
CREATE POLICY "tech_workflows_own" ON tech_ops.workflows
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "tech_workflow_runs_own" ON tech_ops.workflow_runs;
CREATE POLICY "tech_workflow_runs_own" ON tech_ops.workflow_runs
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "tech_tools_own" ON tech_ops.tools;
CREATE POLICY "tech_tools_own" ON tech_ops.tools
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "tech_memory_events_own" ON tech_ops.memory_events;
CREATE POLICY "tech_memory_events_own" ON tech_ops.memory_events
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "tech_memory_outcomes_own" ON tech_ops.memory_outcomes;
CREATE POLICY "tech_memory_outcomes_own" ON tech_ops.memory_outcomes
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "tech_feedback_own" ON tech_ops.feedback;
CREATE POLICY "tech_feedback_own" ON tech_ops.feedback
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

-- ============================================================================
-- SECTION 9: RLS POLICIES - MIIDDLE
-- ============================================================================

-- Enable RLS on all miiddle tables
ALTER TABLE miiddle.classification_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE miiddle.classification_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE miiddle.knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE miiddle.knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE miiddle.decision_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE miiddle.decision_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE miiddle.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE miiddle.workflow_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE miiddle.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE miiddle.memory_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE miiddle.memory_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE miiddle.feedback ENABLE ROW LEVEL SECURITY;

-- MIIDDLE RLS policies (profile-scoped)
DROP POLICY IF EXISTS "miidle_class_rules_own" ON miiddle.classification_rules;
CREATE POLICY "miidle_class_rules_own" ON miiddle.classification_rules
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "miidle_class_runs_own" ON miiddle.classification_runs;
CREATE POLICY "miidle_class_runs_own" ON miiddle.classification_runs
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "miidle_kb_docs_own" ON miiddle.knowledge_documents;
CREATE POLICY "miidle_kb_docs_own" ON miiddle.knowledge_documents
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "miidle_kb_chunks_own" ON miiddle.knowledge_chunks;
CREATE POLICY "miidle_kb_chunks_own" ON miiddle.knowledge_chunks
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "miidle_decision_rules_own" ON miiddle.decision_rules;
CREATE POLICY "miidle_decision_rules_own" ON miiddle.decision_rules
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "miidle_decision_runs_own" ON miiddle.decision_runs;
CREATE POLICY "miidle_decision_runs_own" ON miiddle.decision_runs
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "miidle_workflows_own" ON miiddle.workflows;
CREATE POLICY "miidle_workflows_own" ON miiddle.workflows
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "miidle_workflow_runs_own" ON miiddle.workflow_runs;
CREATE POLICY "miidle_workflow_runs_own" ON miiddle.workflow_runs
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "miidle_tools_own" ON miiddle.tools;
CREATE POLICY "miidle_tools_own" ON miiddle.tools
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "miidle_memory_events_own" ON miiddle.memory_events;
CREATE POLICY "miidle_memory_events_own" ON miiddle.memory_events
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "miidle_memory_outcomes_own" ON miiddle.memory_outcomes;
CREATE POLICY "miidle_memory_outcomes_own" ON miiddle.memory_outcomes
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "miidle_feedback_own" ON miiddle.feedback;
CREATE POLICY "miidle_feedback_own" ON miiddle.feedback
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

-- ============================================================================
-- SECTION 10: HELPER FUNCTIONS FOR BRAIN LAYER
-- ============================================================================

-- Helper function to match knowledge chunks by embedding
CREATE OR REPLACE FUNCTION pmo_ops.match_kb_chunks(
  in_profile_id UUID,
  in_query_embedding vector(1536),
  in_top_k INTEGER DEFAULT 8
)
RETURNS TABLE (
  chunk_id UUID,
  document_id UUID,
  chunk_text TEXT,
  cosine_similarity NUMERIC,
  metadata JSONB
)
LANGUAGE SQL STABLE AS $$
  SELECT
    c.id AS chunk_id,
    c.document_id,
    c.chunk_text,
    (1 - (c.embedding <=> in_query_embedding))::NUMERIC AS cosine_similarity,
    c.metadata
  FROM pmo_ops.knowledge_chunks c
  WHERE c.profile_id = in_profile_id AND c.embedding IS NOT NULL
  ORDER BY c.embedding <=> in_query_embedding
  LIMIT GREATEST(in_top_k, 1);
$$;

CREATE OR REPLACE FUNCTION tech_ops.match_kb_chunks(
  in_profile_id UUID,
  in_query_embedding vector(1536),
  in_top_k INTEGER DEFAULT 8
)
RETURNS TABLE (
  chunk_id UUID,
  document_id UUID,
  chunk_text TEXT,
  cosine_similarity NUMERIC,
  metadata JSONB
)
LANGUAGE SQL STABLE AS $$
  SELECT
    c.id AS chunk_id,
    c.document_id,
    c.chunk_text,
    (1 - (c.embedding <=> in_query_embedding))::NUMERIC AS cosine_similarity,
    c.metadata
  FROM tech_ops.knowledge_chunks c
  WHERE c.profile_id = in_profile_id AND c.embedding IS NOT NULL
  ORDER BY c.embedding <=> in_query_embedding
  LIMIT GREATEST(in_top_k, 1);
$$;

CREATE OR REPLACE FUNCTION miiddle.match_kb_chunks(
  in_profile_id UUID,
  in_query_embedding vector(1536),
  in_top_k INTEGER DEFAULT 8
)
RETURNS TABLE (
  chunk_id UUID,
  document_id UUID,
  chunk_text TEXT,
  cosine_similarity NUMERIC,
  metadata JSONB
)
LANGUAGE SQL STABLE AS $$
  SELECT
    c.id AS chunk_id,
    c.document_id,
    c.chunk_text,
    (1 - (c.embedding <=> in_query_embedding))::NUMERIC AS cosine_similarity,
    c.metadata
  FROM miiddle.knowledge_chunks c
  WHERE c.profile_id = in_profile_id AND c.embedding IS NOT NULL
  ORDER BY c.embedding <=> in_query_embedding
  LIMIT GREATEST(in_top_k, 1);
$$;

-- ============================================================================
-- SECTION 11: SEED DATA - DEFAULT CLASSIFICATION RULES
-- ============================================================================

-- PMO_OPS default classification labels
INSERT INTO pmo_ops.classification_rules (profile_id, label_id, label_name, label_type, rule_pattern, weight)
VALUES
  ('00000000-0000-0000-0000-000000000000'::UUID, 'pmo_ticket', 'Project Ticket', 'ticket', '{"keywords": ["task", "issue", "problem", "fix"]}', 1.0),
  ('00000000-0000-0000-0000-000000000000'::UUID, 'pmo_action', 'Action Item', 'action', '{"keywords": ["create", "add", "update", "action"]}', 1.0),
  ('00000000-0000-0000-0000-000000000000'::UUID, 'pmo_question', 'Question', 'question', '{"keywords": ["how", "what", "why", "question", "?"]}', 1.0),
  ('00000000-0000-0000-0000-000000000000'::UUID, 'pmo_initiative', 'Initiative', 'initiative', '{"keywords": ["initiative", "project", "program", "campaign"]}', 1.0),
  ('00000000-0000-0000-0000-000000000000'::UUID, 'pmo_risk', 'Risk', 'risk', '{"keywords": ["risk", "mitigation", "threat", "danger"]}', 1.0)
ON CONFLICT DO NOTHING;

-- TECH_OPS default classification labels
INSERT INTO tech_ops.classification_rules (profile_id, label_id, label_name, label_type, rule_pattern, weight)
VALUES
  ('00000000-0000-0000-0000-000000000000'::UUID, 'tech_ticket', 'Support Ticket', 'ticket', '{"keywords": ["error", "bug", "issue", "broken"]}', 1.0),
  ('00000000-0000-0000-0000-000000000000'::UUID, 'tech_incident', 'Incident', 'incident', '{"keywords": ["incident", "outage", "down", "failure"]}', 1.0),
  ('00000000-0000-0000-0000-000000000000'::UUID, 'tech_alert', 'Alert', 'alert', '{"keywords": ["alert", "warning", "notification"]}', 1.0),
  ('00000000-0000-0000-0000-000000000000'::UUID, 'tech_maintenance', 'Maintenance', 'action', '{"keywords": ["maintenance", "update", "upgrade", "deploy"]}', 1.0)
ON CONFLICT DO NOTHING;

-- MIIDDLE default classification labels
INSERT INTO miiddle.classification_rules (profile_id, label_id, label_name, label_type, rule_pattern, weight)
VALUES
  ('00000000-0000-0000-0000-000000000000'::UUID, 'miidle_ticket', 'Task', 'ticket', '{"keywords": ["task", "todo", "item"]}', 1.0),
  ('00000000-0000-0000-0000-000000000000'::UUID, 'miidle_automation', 'Automation', 'automation', '{"keywords": ["automate", "workflow", "trigger", "schedule"]}', 1.0),
  ('00000000-0000-0000-0000-000000000000'::UUID, 'miiddle_report', 'Report', 'action', '{"keywords": ["report", "analysis", "summary", "metrics"]}', 1.0),
  ('00000000-0000-0000-0000-000000000000'::UUID, 'miiddle_idea', 'Idea', 'idea', '{"keywords": ["idea", "suggestion", "improvement"]}', 1.0)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SECTION 12: SEED DATA - DEFAULT WORKFLOWS
-- ============================================================================

-- PMO_OPS default workflows
INSERT INTO pmo_ops.workflows (profile_id, workflow_key, workflow_name, trigger_type, workflow_json)
VALUES
  ('00000000-0000-0000-0000-000000000000'::UUID, 'pmo_new_request', 'New Request Handling', 'event', '{"steps": ["classify", "retrieve", "decide", "execute", "store"]}'),
  ('00000000-0000-0000-0000-000000000000'::UUID, 'pmo_initiative_creation', 'Initiative Creation', 'manual', '{"steps": ["validate", "create", "notify", "track"]}')
ON CONFLICT (profile_id, workflow_key) DO NOTHING;

-- TECH_OPS default workflows
INSERT INTO tech_ops.workflows (profile_id, workflow_key, workflow_name, trigger_type, workflow_json)
VALUES
  ('00000000-0000-0000-0000-000000000000'::UUID, 'tech_incident_response', 'Incident Response', 'event', '{"steps": ["triage", "investigate", "mitigate", "resolve", "postmortem"]}'),
  ('00000000-0000-0000-0000-000000000000'::UUID, 'tech_alert_handling', 'Alert Handling', 'event', '{"steps": ["classify", "route", "respond", "close"]}')
ON CONFLICT (profile_id, workflow_key) DO NOTHING;

-- MIIDDLE default workflows
INSERT INTO miiddle.workflows (profile_id, workflow_key, workflow_name, trigger_type, workflow_json)
VALUES
  ('00000000-0000-0000-0000-000000000000'::UUID, 'miidle_task_processing', 'Task Processing', 'event', '{"steps": ["classify", "prioritize", "assign", "track", "complete"]}'),
  ('00000000-0000-0000-0000-000000000000'::UUID, 'miidle_report_generation', 'Report Generation', 'schedule', '{"steps": ["gather", "analyze", "format", "deliver"]}')
ON CONFLICT (profile_id, workflow_key) DO NOTHING;

-- ============================================================================
-- SECTION 13: VALIDATION QUERIES
-- ============================================================================

-- Verify schemas exist
DO $$
BEGIN
  RAISE NOTICE 'Schema Validation:';
  RAISE NOTICE '  pmo_ops schema: %', EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'pmo_ops');
  RAISE NOTICE '  tech_ops schema: %', EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'tech_ops');
  RAISE NOTICE '  miiddle schema: %', EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'miiddle');
END $$;

-- Verify tables exist
DO $$
BEGIN
  RAISE NOTICE 'Table Validation:';
  RAISE NOTICE '  pmo_ops.knowledge_documents: %', EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'pmo_ops' AND table_name = 'knowledge_documents');
  RAISE NOTICE '  pmo_ops.knowledge_chunks: %', EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'pmo_ops' AND table_name = 'knowledge_chunks');
  RAISE NOTICE '  tech_ops.knowledge_documents: %', EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'tech_ops' AND table_name = 'knowledge_documents');
  RAISE NOTICE '  miiddle.knowledge_documents: %', EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'miiddle' AND table_name = 'knowledge_documents');
END $$;

-- Verify RLS is enabled
DO $$
BEGIN
  RAISE NOTICE 'RLS Validation:';
  RAISE NOTICE '  pmo_ops.knowledge_documents RLS: %', EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'pmo_ops' AND tablename = 'knowledge_documents' AND rowsecurity = true);
  RAISE NOTICE '  tech_ops.knowledge_documents RLS: %', EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'tech_ops' AND tablename = 'knowledge_documents' AND rowsecurity = true);
  RAISE NOTICE '  miiddle.knowledge_documents RLS: %', EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'miiddle' AND tablename = 'knowledge_documents' AND rowsecurity = true);
END $$;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
