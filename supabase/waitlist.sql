-- Run once in the Supabase SQL editor. Only the server may access this table.
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (length(email) <= 254 and email = lower(trim(email))),
  source text not null default 'coming-soon',
  consent_version text not null default 'launch-updates-v1',
  created_at timestamptz not null default now()
);
alter table public.waitlist enable row level security;
revoke all on public.waitlist from anon, authenticated;
grant select, insert on public.waitlist to service_role;
