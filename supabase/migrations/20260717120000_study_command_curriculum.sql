-- Study Command Center + curriculum enrichment schema.

-- Parent uniqueness for composite FKs (parent_id, user_id)
alter table public.phases add constraint phases_id_user_uidx unique (id, user_id);
alter table public.sections add constraint sections_id_user_uidx unique (id, user_id);
alter table public.items add constraint items_id_user_uidx unique (id, user_id);

-- phases
alter table public.phases
  add column status text not null default 'planned'
    check (status in ('planned', 'active', 'complete')),
  add column activated_at timestamptz,
  add column archived_at timestamptz,
  add column source_key text,
  add column source_revision text;

create unique index phases_one_active_per_user
  on public.phases (user_id)
  where status = 'active' and archived_at is null;

create unique index phases_source_key_per_user
  on public.phases (user_id, source_key)
  where source_key is not null;

-- sections
alter table public.sections
  add column kind text not null default 'custom'
    check (kind in ('topics', 'projects', 'outcomes', 'resources', 'custom')),
  add column source_key text,
  add column source_revision text;

create unique index sections_source_key_per_user
  on public.sections (user_id, source_key)
  where source_key is not null;

-- items
alter table public.items
  add column kind text not null default 'topic'
    check (kind in ('topic', 'project_task', 'milestone', 'reference')),
  add column estimated_minutes int check (estimated_minutes is null or estimated_minutes > 0),
  add column started_at timestamptz,
  add column source_key text,
  add column source_revision text;

create unique index items_source_key_per_user
  on public.items (user_id, source_key)
  where source_key is not null;

-- time_logs: sessions + optional item linkage
alter table public.time_logs
  add column item_id uuid,
  add column started_at timestamptz,
  add column ended_at timestamptz;

alter table public.time_logs
  add constraint time_logs_item_user_fk
  foreign key (item_id, user_id)
  references public.items (id, user_id)
  on delete set null;

alter table public.time_logs drop constraint if exists time_logs_minutes_check;
alter table public.time_logs add constraint time_logs_minutes_check check (
  minutes > 0
  or (minutes = 0 and started_at is not null and ended_at is null)
);

create index time_logs_item_idx on public.time_logs (item_id) where item_id is not null;
create index time_logs_open_session_idx
  on public.time_logs (user_id)
  where started_at is not null and ended_at is null;

-- user_preferences
create table public.user_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  pinned_item_id uuid,
  path_title text not null default 'AI Engineer Path',
  path_goal text,
  weekly_goal_min_minutes int not null default 360 check (weekly_goal_min_minutes > 0),
  weekly_goal_max_minutes int not null default 480 check (weekly_goal_max_minutes > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_preferences_weekly_range check (weekly_goal_max_minutes >= weekly_goal_min_minutes),
  constraint user_preferences_pinned_item_fk
    foreign key (pinned_item_id, user_id)
    references public.items (id, user_id)
    on delete set null
);

alter table public.user_preferences enable row level security;
create policy "owner_all" on public.user_preferences
  for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- resources
create table public.resources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  phase_id uuid not null,
  item_id uuid,
  title text not null,
  url text not null,
  provider text,
  resource_type text not null default 'other'
    check (resource_type in (
      'course', 'article', 'video', 'documentation', 'book', 'repository', 'other'
    )),
  status text not null default 'planned'
    check (status in ('planned', 'using', 'completed')),
  priority text not null default 'primary'
    check (priority in ('primary', 'selective', 'optional')),
  estimated_minutes int check (estimated_minutes is null or estimated_minutes > 0),
  description text,
  notes text,
  sort_order int not null default 0,
  source_key text,
  source_revision text,
  verified_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint resources_phase_user_fk
    foreign key (phase_id, user_id) references public.phases (id, user_id) on delete cascade,
  constraint resources_item_user_fk
    foreign key (item_id, user_id) references public.items (id, user_id) on delete set null
);

create index resources_phase_idx on public.resources (phase_id, sort_order);
create index resources_item_idx on public.resources (item_id) where item_id is not null;
create unique index resources_source_key_per_user
  on public.resources (user_id, source_key)
  where source_key is not null;

alter table public.resources enable row level security;
create policy "owner_all" on public.resources
  for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- achievement_criteria
create table public.achievement_criteria (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  item_id uuid not null,
  description text not null,
  is_required boolean not null default true,
  sort_order int not null default 0,
  achieved_at timestamptz,
  source_key text,
  source_revision text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint achievement_criteria_item_user_fk
    foreign key (item_id, user_id) references public.items (id, user_id) on delete cascade
);

create index achievement_criteria_item_idx on public.achievement_criteria (item_id, sort_order);
create unique index achievement_criteria_source_key_per_user
  on public.achievement_criteria (user_id, source_key)
  where source_key is not null;

alter table public.achievement_criteria
  add constraint achievement_criteria_id_user_uidx unique (id, user_id);

alter table public.achievement_criteria enable row level security;
create policy "owner_all" on public.achievement_criteria
  for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- evidence
create table public.evidence (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  item_id uuid not null,
  criterion_id uuid,
  kind text not null check (kind in ('note', 'link')),
  content text not null,
  label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint evidence_item_user_fk
    foreign key (item_id, user_id) references public.items (id, user_id) on delete cascade,
  constraint evidence_criterion_user_fk
    foreign key (criterion_id, user_id)
    references public.achievement_criteria (id, user_id)
    on delete set null
);

create index evidence_item_idx on public.evidence (item_id, created_at desc);

alter table public.evidence enable row level security;
create policy "owner_all" on public.evidence
  for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- Backfill section kinds from known titles
update public.sections set kind = 'topics'
  where lower(title) in ('learn', 'topics', 'core topics');
update public.sections set kind = 'projects'
  where lower(title) in ('build', 'projects', 'practice');
update public.sections set kind = 'outcomes'
  where lower(title) in ('exit criteria', 'outcomes', 'exit outcomes');
update public.sections set kind = 'resources'
  where lower(title) in ('courses', 'resources', 'courses/resources');

-- Item kinds from section kind
update public.items i
set kind = case s.kind
  when 'projects' then 'project_task'
  when 'outcomes' then 'milestone'
  when 'resources' then 'reference'
  else 'topic'
end
from public.sections s
where i.section_id = s.id;

-- Activate first incomplete phase per user when none active
with ranked as (
  select
    p.id,
    p.user_id,
    row_number() over (
      partition by p.user_id
      order by p.sort_order
    ) as rn
  from public.phases p
  where p.archived_at is null
    and not exists (
      select 1 from public.phases a
      where a.user_id = p.user_id and a.status = 'active' and a.archived_at is null
    )
    and exists (
      select 1
      from public.sections s
      join public.items i on i.section_id = s.id
      where s.phase_id = p.id
        and i.kind in ('topic', 'project_task', 'milestone')
        and i.status <> 'done'
    )
)
update public.phases p
set status = 'active', activated_at = coalesce(p.activated_at, now())
from ranked r
where p.id = r.id and r.rn = 1;

-- If still no active phase, activate the first non-archived phase
with ranked as (
  select
    p.id,
    row_number() over (partition by p.user_id order by p.sort_order) as rn
  from public.phases p
  where p.archived_at is null
    and not exists (
      select 1 from public.phases a
      where a.user_id = p.user_id and a.status = 'active' and a.archived_at is null
    )
)
update public.phases p
set status = 'active', activated_at = coalesce(p.activated_at, now())
from ranked r
where p.id = r.id and r.rn = 1;

-- Migrate item URLs to phase-level resources
insert into public.resources (
  user_id, phase_id, item_id, title, url, provider, resource_type, status, priority, sort_order
)
select
  i.user_id,
  s.phase_id,
  null,
  i.title,
  i.url,
  i.provider,
  'other',
  case when i.status = 'done' then 'completed' when i.status = 'in_progress' then 'using' else 'planned' end,
  'primary',
  i.sort_order
from public.items i
join public.sections s on s.id = i.section_id
where i.url is not null and length(trim(i.url)) > 0;

-- Copy non-empty item notes into note evidence
insert into public.evidence (user_id, item_id, kind, content, label)
select i.user_id, i.id, 'note', i.notes, 'Migrated note'
from public.items i
where i.notes is not null and length(trim(i.notes)) > 0;
