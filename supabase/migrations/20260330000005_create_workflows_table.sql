-- workflows table
create table if not exists workflows (
  id uuid primary key default gen_random_uuid(),
  action text unique,
  steps jsonb,
  created_at timestamp default now()
);
