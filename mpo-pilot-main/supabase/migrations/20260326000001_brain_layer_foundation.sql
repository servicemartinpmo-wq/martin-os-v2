-- Brain layer foundation for ChatGPT + Gemini orchestration
-- Deterministic storage, retrieval, routing, and learning tables.

create extension if not exists vector;
create extension if not exists pg_trgm;
create extension if not exists pgcrypto;

create table if not exists public.brain_prompts (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  active_version text not null default 'v1',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.brain_prompt_versions (
  id uuid primary key default gen_random_uuid(),
  prompt_id uuid not null references public.brain_prompts(id) on delete cascade,
  version text not null,
  content text not null,
  model_target text not null default 'gemini' check (model_target in ('gemini', 'chatgpt', 'both')),
  success_rate numeric(6,4),
  total_runs integer not null default 0,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  unique (prompt_id, version)
);

create table if not exists public.brain_frameworks (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  framework_name text not null,
  framework_json jsonb not null default '{}',
  version text not null default 'v1',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.brain_workflows (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  workflow_key text not null,
  trigger_type text not null default 'event',
  workflow_json jsonb not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, workflow_key)
);

create table if not exists public.brain_runs (
  id uuid primary key default gen_random_uuid(),
  request_id text not null,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  input_payload jsonb not null,
  state text not null default 'queued' check (state in ('queued', 'running', 'waiting_review', 'retrying', 'completed', 'failed', 'fallback')),
  chosen_model text check (chosen_model in ('gemini', 'chatgpt')),
  confidence numeric(6,4),
  trace jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, request_id)
);

create table if not exists public.brain_decision_runs (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.brain_runs(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  classification jsonb not null default '{}',
  context_pack jsonb not null default '{}',
  decision jsonb not null default '{}',
  priority_score numeric(6,2),
  risk_score numeric(6,2),
  confidence_score numeric(6,4),
  created_at timestamptz not null default now()
);

create table if not exists public.brain_workflow_runs (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.brain_runs(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  workflow_key text not null,
  state text not null check (state in ('queued', 'running', 'waiting_review', 'retrying', 'completed', 'failed', 'fallback')),
  attempt_count integer not null default 0,
  last_error_code text,
  timeline jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.brain_outcomes (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.brain_runs(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  success boolean not null default false,
  feedback text,
  time_to_resolve_seconds integer,
  output_payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.brain_memory_logs (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references public.brain_runs(id) on delete set null,
  request_id text not null,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  stage text not null,
  status text not null,
  input_payload jsonb,
  output_payload jsonb,
  classification jsonb,
  decision_trace jsonb,
  chosen_model text check (chosen_model in ('gemini', 'chatgpt')),
  confidence numeric(6,4),
  success boolean,
  created_at timestamptz not null default now()
);

create table if not exists public.brain_knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  title text not null,
  domain text not null default 'general',
  source_type text not null default 'document',
  source_uri text,
  trust_level numeric(4,3) not null default 0.600,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.brain_knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.brain_knowledge_documents(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  chunk_index integer not null,
  chunk_text text not null,
  token_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  embedding vector(1536),
  created_at timestamptz not null default now(),
  unique (document_id, chunk_index)
);

create table if not exists public.brain_tool_registry (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  tool_name text not null,
  tool_type text not null check (tool_type in ('update_db', 'trigger_function', 'call_api')),
  target text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (profile_id, tool_name)
);

create or replace function public.brain_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_brain_prompts_updated_at on public.brain_prompts;
create trigger trg_brain_prompts_updated_at before update on public.brain_prompts
for each row execute function public.brain_set_updated_at();

drop trigger if exists trg_brain_frameworks_updated_at on public.brain_frameworks;
create trigger trg_brain_frameworks_updated_at before update on public.brain_frameworks
for each row execute function public.brain_set_updated_at();

drop trigger if exists trg_brain_workflows_updated_at on public.brain_workflows;
create trigger trg_brain_workflows_updated_at before update on public.brain_workflows
for each row execute function public.brain_set_updated_at();

drop trigger if exists trg_brain_runs_updated_at on public.brain_runs;
create trigger trg_brain_runs_updated_at before update on public.brain_runs
for each row execute function public.brain_set_updated_at();

drop trigger if exists trg_brain_workflow_runs_updated_at on public.brain_workflow_runs;
create trigger trg_brain_workflow_runs_updated_at before update on public.brain_workflow_runs
for each row execute function public.brain_set_updated_at();

create index if not exists idx_brain_prompt_versions_prompt_active on public.brain_prompt_versions(prompt_id, is_active);
create index if not exists idx_brain_frameworks_profile on public.brain_frameworks(profile_id, active);
create index if not exists idx_brain_workflows_profile on public.brain_workflows(profile_id, active);
create index if not exists idx_brain_runs_profile_request on public.brain_runs(profile_id, request_id);
create index if not exists idx_brain_runs_state on public.brain_runs(state, updated_at desc);
create index if not exists idx_brain_decision_runs_run on public.brain_decision_runs(run_id);
create index if not exists idx_brain_workflow_runs_run on public.brain_workflow_runs(run_id);
create index if not exists idx_brain_memory_logs_profile_created on public.brain_memory_logs(profile_id, created_at desc);
create index if not exists idx_brain_memory_logs_request on public.brain_memory_logs(request_id);
create index if not exists idx_brain_chunks_embedding on public.brain_knowledge_chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);
create index if not exists idx_brain_chunks_text on public.brain_knowledge_chunks using gin (chunk_text gin_trgm_ops);

create or replace function public.match_brain_chunks(
  in_profile_id uuid,
  in_query_embedding vector(1536),
  in_top_k int default 8
)
returns table (
  chunk_id uuid,
  document_id uuid,
  chunk_text text,
  cosine_similarity numeric,
  metadata jsonb
)
language sql
stable
as $$
  select
    c.id as chunk_id,
    c.document_id,
    c.chunk_text,
    (1 - (c.embedding <=> in_query_embedding))::numeric as cosine_similarity,
    c.metadata
  from public.brain_knowledge_chunks c
  where c.profile_id = in_profile_id and c.embedding is not null
  order by c.embedding <=> in_query_embedding
  limit greatest(in_top_k, 1);
$$;

alter table public.brain_prompts enable row level security;
alter table public.brain_prompt_versions enable row level security;
alter table public.brain_frameworks enable row level security;
alter table public.brain_workflows enable row level security;
alter table public.brain_runs enable row level security;
alter table public.brain_decision_runs enable row level security;
alter table public.brain_workflow_runs enable row level security;
alter table public.brain_outcomes enable row level security;
alter table public.brain_memory_logs enable row level security;
alter table public.brain_knowledge_documents enable row level security;
alter table public.brain_knowledge_chunks enable row level security;
alter table public.brain_tool_registry enable row level security;

drop policy if exists "brain_prompts_own" on public.brain_prompts;
create policy "brain_prompts_own" on public.brain_prompts
for all
using (auth.uid() is not null)
with check (auth.uid() is not null);

drop policy if exists "brain_prompt_versions_own" on public.brain_prompt_versions;
create policy "brain_prompt_versions_own" on public.brain_prompt_versions
for all
using (auth.uid() is not null)
with check (auth.uid() is not null);

drop policy if exists "brain_frameworks_own" on public.brain_frameworks;
create policy "brain_frameworks_own" on public.brain_frameworks
for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

drop policy if exists "brain_workflows_own" on public.brain_workflows;
create policy "brain_workflows_own" on public.brain_workflows
for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

drop policy if exists "brain_runs_own" on public.brain_runs;
create policy "brain_runs_own" on public.brain_runs
for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

drop policy if exists "brain_decision_runs_own" on public.brain_decision_runs;
create policy "brain_decision_runs_own" on public.brain_decision_runs
for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

drop policy if exists "brain_workflow_runs_own" on public.brain_workflow_runs;
create policy "brain_workflow_runs_own" on public.brain_workflow_runs
for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

drop policy if exists "brain_outcomes_own" on public.brain_outcomes;
create policy "brain_outcomes_own" on public.brain_outcomes
for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

drop policy if exists "brain_memory_logs_own" on public.brain_memory_logs;
create policy "brain_memory_logs_own" on public.brain_memory_logs
for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

drop policy if exists "brain_kb_docs_own" on public.brain_knowledge_documents;
create policy "brain_kb_docs_own" on public.brain_knowledge_documents
for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

drop policy if exists "brain_kb_chunks_own" on public.brain_knowledge_chunks;
create policy "brain_kb_chunks_own" on public.brain_knowledge_chunks
for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

drop policy if exists "brain_tools_own" on public.brain_tool_registry;
create policy "brain_tools_own" on public.brain_tool_registry
for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

insert into public.brain_prompts (name, description, active_version)
values
  ('classifier', 'Classifies input into deterministic routing labels', 'v1'),
  ('context_builder', 'Builds context pack from memory and knowledge', 'v1'),
  ('decision_engine', 'Produces action plan and confidence with strict JSON', 'v1'),
  ('executor', 'Converts decision output to executable action list', 'v1')
on conflict (name) do nothing;

insert into public.brain_prompt_versions (prompt_id, version, content, model_target, is_active)
select p.id, 'v1',
'Return JSON only: {"type":"ticket|action|question|automation","priority":"low|medium|high","intent":"diagnose|create|fix|analyze","domain":"tech|pmo|ops|general","complexity":"low|medium|high","confidence":0.0}',
'both', true
from public.brain_prompts p
where p.name = 'classifier'
and not exists (
  select 1 from public.brain_prompt_versions pv
  where pv.prompt_id = p.id and pv.version = 'v1'
);
