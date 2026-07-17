-- Enforce ownership on parent links so a row cannot reference another user's
-- phase/section. Postgres names the initial single-column FKs automatically.

alter table public.sections drop constraint if exists sections_phase_id_fkey;
alter table public.sections
  add constraint sections_phase_user_fk
  foreign key (phase_id, user_id)
  references public.phases (id, user_id)
  on delete cascade;

alter table public.items drop constraint if exists items_section_id_fkey;
alter table public.items
  add constraint items_section_user_fk
  foreign key (section_id, user_id)
  references public.sections (id, user_id)
  on delete cascade;

alter table public.time_logs drop constraint if exists time_logs_phase_id_fkey;
alter table public.time_logs
  add constraint time_logs_phase_user_fk
  foreign key (phase_id, user_id)
  references public.phases (id, user_id)
  on delete cascade;
