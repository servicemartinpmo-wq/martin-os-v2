-- Miidle backend foundation (additive only)
-- Capture -> Structure -> Intelligence -> Expression -> Graph

create table if not exists public.execution_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  project_id uuid not null,
  task_id text,
  action_type text not null,
  tool_used text,
  timestamp timestamptz not null default now(),
  duration_seconds int,
  status text not null default 'in_progress',
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.execution_artifacts (
  id uuid primary key default gen_random_uuid(),
  execution_id uuid not null references public.execution_logs(id) on delete cascade,
  artifact_type text not null,
  artifact_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.structured_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  project_id uuid not null,
  start_time timestamptz not null,
  end_time timestamptz,
  summary text
);

create table if not exists public.structured_steps (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.structured_sessions(id) on delete cascade,
  step_order int not null,
  action_type text not null,
  description text,
  duration int,
  is_failure boolean not null default false,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  description text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.project_contributors (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null,
  role text not null,
  contribution_weight numeric(5,2) not null default 0
);

create table if not exists public.skill_inferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  skill_name text not null,
  confidence_score numeric(5,2) not null default 0,
  source text not null,
  created_at timestamptz not null default now()
);

alter table public.build_stories
  add column if not exists project_id uuid,
  add column if not exists summary text,
  add column if not exists problem text,
  add column if not exists execution text,
  add column if not exists failures text,
  add column if not exists solution text,
  add column if not exists outcome text;

alter table public.story_assets
  add column if not exists type text,
  add column if not exists url text,
  add column if not exists metadata jsonb default '{}'::jsonb;

alter table public.feed_items
  add column if not exists story_id uuid,
  add column if not exists user_id uuid,
  add column if not exists hook_text text,
  add column if not exists outcome_summary text,
  add column if not exists score numeric(8,2) default 0;

alter table public.engagement_signals
  add column if not exists story_id uuid,
  add column if not exists user_id uuid;

alter table public.workflow_templates
  add column if not exists source_story_id uuid,
  add column if not exists created_by uuid,
  add column if not exists template_data jsonb default '{}'::jsonb;

alter table public.remix_links
  add column if not exists parent_template_id uuid,
  add column if not exists child_project_id uuid,
  add column if not exists user_id uuid;

alter table public.project_metrics
  add column if not exists complexity_score int default 0,
  add column if not exists outcome_score int default 0;

-- RLS-ready policies (safe no-op if repeated)
alter table public.execution_logs enable row level security;
alter table public.execution_artifacts enable row level security;
alter table public.structured_sessions enable row level security;
alter table public.structured_steps enable row level security;
alter table public.projects enable row level security;
alter table public.project_contributors enable row level security;
alter table public.skill_inferences enable row level security;

drop policy if exists "execution_logs_owner" on public.execution_logs;
create policy "execution_logs_owner" on public.execution_logs
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "projects_owner" on public.projects;
create policy "projects_owner" on public.projects
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "structured_sessions_owner" on public.structured_sessions;
create policy "structured_sessions_owner" on public.structured_sessions
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "skill_inferences_owner" on public.skill_inferences;
create policy "skill_inferences_owner" on public.skill_inferences
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
