-- decision_logs table
create table if not exists decision_logs (
  id uuid primary key default gen_random_uuid(),
  intent jsonb,
  decision jsonb,
  workflow jsonb,
  result jsonb,
  created_at timestamp default now()
);
