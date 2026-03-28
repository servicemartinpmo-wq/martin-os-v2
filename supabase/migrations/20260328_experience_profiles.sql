create table if not exists public.experience_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_key text not null unique,
  user_mode text,
  theme_preset_id text,
  layout_mode text,
  industry_id text,
  reduced_motion boolean,
  brand_profile jsonb,
  override_flags jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_experience_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_experience_profiles_updated_at on public.experience_profiles;

create trigger trg_experience_profiles_updated_at
before update on public.experience_profiles
for each row
execute function public.set_experience_profiles_updated_at();
