-- AI Engineer Learning Tracker schema. Run once in the Supabase SQL editor.

create table public.phases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  description text,
  notes text,
  sort_order int not null default 0,
  target_start date,
  target_end date,
  created_at timestamptz not null default now()
);

create table public.sections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  phase_id uuid not null references public.phases (id) on delete cascade,
  title text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  section_id uuid not null references public.sections (id) on delete cascade,
  title text not null,
  url text,
  provider text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  notes text,
  completed_at timestamptz,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.time_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  phase_id uuid not null references public.phases (id) on delete cascade,
  logged_on date not null default current_date,
  minutes int not null check (minutes > 0),
  note text,
  created_at timestamptz not null default now()
);

create index sections_phase_idx on public.sections (phase_id, sort_order);
create index items_section_idx on public.items (section_id, sort_order);
create index items_completed_idx on public.items (completed_at desc) where status = 'done';
create index time_logs_phase_idx on public.time_logs (phase_id, logged_on);

alter table public.phases enable row level security;
alter table public.sections enable row level security;
alter table public.items enable row level security;
alter table public.time_logs enable row level security;

create policy "owner_all" on public.phases
  for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "owner_all" on public.sections
  for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "owner_all" on public.items
  for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "owner_all" on public.time_logs
  for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
