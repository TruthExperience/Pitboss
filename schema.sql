-- PitBoss Phase 1 Schema
-- Run this in your Supabase SQL editor

create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- LEAGUES
-- ─────────────────────────────────────────────
create table leagues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  abbreviation text,
  description text,
  created_at timestamptz default now()
);

insert into leagues (name, abbreviation) values
  ('Truth Racing League', 'TRL'),
  ('World Series Championship', 'WSC');

-- ─────────────────────────────────────────────
-- MEMBERS
-- ─────────────────────────────────────────────
create table members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  discord_id text unique,
  username text not null,
  email text unique not null,
  role text not null default 'member' check (role in ('member', 'steward', 'race_director', 'commissioner', 'admin')),
  league_id uuid references leagues(id),
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─────────────────────────────────────────────
-- CERTIFICATION TYPES
-- ─────────────────────────────────────────────
create table certification_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  league_id uuid references leagues(id),
  passing_score integer not null default 80,
  created_at timestamptz default now()
);

insert into certification_types (name, description, passing_score) values
  ('Driver Certification', 'Basic driver rules and conduct certification', 80),
  ('Steward Certification', 'Race steward incident review certification', 85),
  ('Race Director Certification', 'Advanced race direction and management certification', 90);

-- ─────────────────────────────────────────────
-- CERTIFICATIONS
-- ─────────────────────────────────────────────
create table certifications (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references members(id) on delete cascade,
  certification_type_id uuid references certification_types(id),
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'passed', 'failed', 'expired')),
  score integer,
  issued_at timestamptz,
  expires_at timestamptz,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────
alter table members enable row level security;
alter table certifications enable row level security;
alter table leagues enable row level security;
alter table certification_types enable row level security;

-- Leagues: public read
create policy "Leagues are viewable by everyone"
  on leagues for select using (true);

-- Certification types: public read
create policy "Cert types are viewable by everyone"
  on certification_types for select using (true);

-- Members: users can read all, only edit own
create policy "Members are viewable by authenticated users"
  on members for select using (auth.role() = 'authenticated');

create policy "Members can update own profile"
  on members for update using (auth.uid() = user_id);

create policy "Members can insert own profile"
  on members for insert with check (auth.uid() = user_id);

-- Certifications: members can view own, admins view all
create policy "Members can view own certifications"
  on certifications for select using (
    member_id in (select id from members where user_id = auth.uid())
  );

create policy "Admins can view all certifications"
  on certifications for select using (
    exists (
      select 1 from members
      where user_id = auth.uid()
      and role in ('admin', 'commissioner', 'race_director')
    )
  );

-- ─────────────────────────────────────────────
-- FUNCTIONS
-- ─────────────────────────────────────────────

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger members_updated_at
  before update on members
  for each row execute function update_updated_at();

create trigger certifications_updated_at
  before update on certifications
  for each row execute function update_updated_at();
