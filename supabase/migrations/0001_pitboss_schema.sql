create table if not exists drivers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  division text,
  team text,
  created_at timestamptz default now()
);
create table if not exists driver_activity (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid references drivers(id) on delete cascade,
  exams_taken int default 0,
  advisor_sessions int default 0,
  telemetry_uploads int default 0,
  updated_at timestamptz default now()
);

create index if not exists idx_driver_activity_driver_id
  on driver_activity(driver_id);
create table if not exists driver_certifications (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid references drivers(id) on delete cascade,
  cert_name text not null,
  earned_at timestamptz default now()
);

create index if not exists idx_driver_certs_driver_id
  on driver_certifications(driver_id);
create table if not exists exam_results (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid references drivers(id) on delete cascade,
  score int not null,
  weak_areas jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_exam_results_driver_id
  on exam_results(driver_id);
create table if not exists advisor_sessions (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid references drivers(id) on delete cascade,
  question text not null,
  answer text not null,
  created_at timestamptz default now()
);

create index if not exists idx_advisor_sessions_driver_id
  on advisor_sessions(driver_id);
create table if not exists telemetry_analysis (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid references drivers(id) on delete cascade,
  summary text,
  metrics jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_telemetry_analysis_driver_id
  on telemetry_analysis(driver_id);
create or replace function increment_exam_count()
returns trigger as $$
begin
  update driver_activity
  set exams_taken = exams_taken + 1,
      updated_at = now()
  where driver_id = new.driver_id;
  return new;
end;
$$ language plpgsql;

create trigger trg_exam_count
after insert on exam_results
for each row execute function increment_exam_count();
create or replace function increment_advisor_count()
returns trigger as $$
begin
  update driver_activity
  set advisor_sessions = advisor_sessions + 1,
      updated_at = now()
  where driver_id = new.driver_id;
  return new;
end;
$$ language plpgsql;

create trigger trg_advisor_count
after insert on advisor_sessions
for each row execute function increment_advisor_count();
create or replace function increment_telemetry_count()
returns trigger as $$
begin
  update driver_activity
  set telemetry_uploads = telemetry_uploads + 1,
      updated_at = now()
  where driver_id = new.driver_id;
  return new;
end;
$$ language plpgsql;

create trigger trg_telemetry_count
after insert on telemetry_analysis
for each row execute function increment_telemetry_count();
insert into drivers (id, name, division, team)
values ('00000000-0000-0000-0000-000000000001', 'Test Driver', 'F2', 'PitBoss Racing')
on conflict do nothing;

insert into driver_activity (driver_id)
values ('00000000-0000-0000-0000-000000000001')
on conflict do nothing;
