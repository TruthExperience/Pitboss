-- ================================
-- DRIVERS
-- ================================
create table if not exists drivers (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid,
  name text not null,
  division text,
  team text,
  license_level text,
  exams_passed int default 0,
  advisor_score int default 0,
  created_at timestamptz default now()
);

-- ================================
-- DRIVER ACTIVITY
-- ================================
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

-- ================================
-- DRIVER CERTIFICATIONS
-- ================================
create table if not exists driver_certifications (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid references drivers(id) on delete cascade,
  cert_name text not null,
  earned_at timestamptz default now()
);

create index if not exists idx_driver_certifications_driver_id
  on driver_certifications(driver_id);

-- ================================
-- EXAM QUESTIONS
-- ================================
create table if not exists exam_questions (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  choices text[] not null,
  answer text not null,
  created_at timestamptz default now()
);

-- ================================
-- EXAM RESULTS
-- ================================
create table if not exists exam_results (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid references drivers(id) on delete cascade,
  score int not null,
  weak_areas jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_exam_results_driver_id
  on exam_results(driver_id);

-- ================================
-- ADVISOR SESSIONS
-- ================================
create table if not exists advisor_sessions (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid references drivers(id) on delete cascade,
  question text not null,
  answer text not null,
  created_at timestamptz default now()
);

create index if not exists idx_advisor_sessions_driver_id
  on advisor_sessions(driver_id);

-- ================================
-- TELEMETRY ANALYSIS
-- ================================
create table if not exists telemetry_analysis (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid references drivers(id) on delete cascade,
  summary text,
  metrics jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_telemetry_analysis_driver_id
  on telemetry_analysis(driver_id);

-- ================================
-- TRIGGER: EXAM COUNT
-- ================================
create or replace function increment_exam_count()
returns trigger as $$
begin
  update driver_activity
  set exams_taken = exams_taken + 1,
      updated_at = now()
  where driver_id = new.driver_id;
  return new;
end;
```blockmath
 language plpgsql;

create trigger trg_exam_count
after insert on exam_results
for each row execute function increment_exam_count();

-- ================================
-- TRIGGER: ADVISOR COUNT
-- ================================
create or replace function increment_advisor_count()
returns trigger as
