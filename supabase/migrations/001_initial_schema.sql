-- 001_initial_schema.sql
-- Initial database schema for Blood Analysis app

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- 1. profiles — user profile linked to auth.users
-- ============================================
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  gender text check (gender in ('male', 'female')),
  birth_year int check (birth_year >= 1900 and birth_year <= extract(year from now())),
  created_at timestamptz not null default now()
);

-- ============================================
-- 2. blood_tests — individual test entries
-- ============================================
create table blood_tests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  test_date date not null,
  notes text,
  file_url text,
  created_at timestamptz not null default now()
);

create index idx_blood_tests_user_id on blood_tests(user_id);
create index idx_blood_tests_test_date on blood_tests(user_id, test_date desc);

-- ============================================
-- 3. blood_test_results — marker values per test
-- ============================================
create table blood_test_results (
  id uuid primary key default uuid_generate_v4(),
  test_id uuid not null references blood_tests(id) on delete cascade,
  marker_key text not null,
  value numeric not null,
  unit text not null,
  created_at timestamptz not null default now()
);

create index idx_blood_test_results_test_id on blood_test_results(test_id);

-- ============================================
-- 4. reference_ranges — standard reference values
-- ============================================
create table reference_ranges (
  id uuid primary key default uuid_generate_v4(),
  marker_key text not null,
  gender text not null check (gender in ('male', 'female', 'all')),
  min_value numeric not null,
  max_value numeric not null,
  unit text not null,
  unique (marker_key, gender)
);

-- ============================================
-- 5. Trigger: auto-create profile on user signup
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- 6. Row Level Security (RLS)
-- ============================================

-- profiles: user can only read/update their own profile
alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- blood_tests: user can only CRUD their own tests
alter table blood_tests enable row level security;

create policy "Users can view own tests"
  on blood_tests for select
  using (auth.uid() = user_id);

create policy "Users can insert own tests"
  on blood_tests for insert
  with check (auth.uid() = user_id);

create policy "Users can update own tests"
  on blood_tests for update
  using (auth.uid() = user_id);

create policy "Users can delete own tests"
  on blood_tests for delete
  using (auth.uid() = user_id);

-- blood_test_results: access via ownership of parent blood_test
alter table blood_test_results enable row level security;

create policy "Users can view own test results"
  on blood_test_results for select
  using (
    exists (
      select 1 from blood_tests
      where blood_tests.id = blood_test_results.test_id
        and blood_tests.user_id = auth.uid()
    )
  );

create policy "Users can insert own test results"
  on blood_test_results for insert
  with check (
    exists (
      select 1 from blood_tests
      where blood_tests.id = blood_test_results.test_id
        and blood_tests.user_id = auth.uid()
    )
  );

create policy "Users can delete own test results"
  on blood_test_results for delete
  using (
    exists (
      select 1 from blood_tests
      where blood_tests.id = blood_test_results.test_id
        and blood_tests.user_id = auth.uid()
    )
  );

-- reference_ranges: read-only for all authenticated users
alter table reference_ranges enable row level security;

create policy "Authenticated users can read reference ranges"
  on reference_ranges for select
  using (auth.role() = 'authenticated');

-- ============================================
-- 7. Seed: reference_ranges (14 markers × male/female)
-- ============================================
insert into reference_ranges (marker_key, gender, min_value, max_value, unit) values
  -- Hemoglobinas (g/L)
  ('hemoglobin',   'male',   130, 175, 'g/L'),
  ('hemoglobin',   'female', 120, 160, 'g/L'),
  -- Eritrocitai (×10¹²/L)
  ('rbc',          'male',   4.5, 5.9, '×10¹²/L'),
  ('rbc',          'female', 3.8, 5.2, '×10¹²/L'),
  -- Leukocitai (×10⁹/L)
  ('wbc',          'male',   4.0, 10.0, '×10⁹/L'),
  ('wbc',          'female', 4.0, 10.0, '×10⁹/L'),
  -- Trombocitai (×10⁹/L)
  ('plt',          'male',   150, 400, '×10⁹/L'),
  ('plt',          'female', 150, 400, '×10⁹/L'),
  -- Hematokritas (%)
  ('hematocrit',   'male',   40, 54, '%'),
  ('hematocrit',   'female', 36, 48, '%'),
  -- MCV (fL)
  ('mcv',          'male',   80, 100, 'fL'),
  ('mcv',          'female', 80, 100, 'fL'),
  -- MCH (pg)
  ('mch',          'male',   27, 33, 'pg'),
  ('mch',          'female', 27, 33, 'pg'),
  -- MCHC (g/L)
  ('mchc',         'male',   320, 360, 'g/L'),
  ('mchc',         'female', 320, 360, 'g/L'),
  -- Neutrofilai (%)
  ('neutrophils',  'male',   40, 70, '%'),
  ('neutrophils',  'female', 40, 70, '%'),
  -- Limfocitai (%)
  ('lymphocytes',  'male',   20, 45, '%'),
  ('lymphocytes',  'female', 20, 45, '%'),
  -- Monocitai (%)
  ('monocytes',    'male',   2, 10, '%'),
  ('monocytes',    'female', 2, 10, '%'),
  -- Eozinofilai (%)
  ('eosinophils',  'male',   1, 6, '%'),
  ('eosinophils',  'female', 1, 6, '%'),
  -- Bazofilai (%)
  ('basophils',    'male',   0, 2, '%'),
  ('basophils',    'female', 0, 2, '%'),
  -- ENG / ESR (mm/h)
  ('esr',          'male',   0, 15, 'mm/h'),
  ('esr',          'female', 0, 20, 'mm/h');
