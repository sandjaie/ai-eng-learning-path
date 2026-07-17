-- Composite FKs with ON DELETE SET NULL try to null every referencing column.
-- user_id is NOT NULL, so deleting a parent item fails. Use single-column FKs
-- for nullable references; ownership remains enforced by RLS + insert paths.

alter table public.time_logs drop constraint if exists time_logs_item_user_fk;
alter table public.time_logs
  add constraint time_logs_item_id_fk
  foreign key (item_id) references public.items (id) on delete set null;

alter table public.user_preferences drop constraint if exists user_preferences_pinned_item_fk;
alter table public.user_preferences
  add constraint user_preferences_pinned_item_id_fk
  foreign key (pinned_item_id) references public.items (id) on delete set null;

alter table public.resources drop constraint if exists resources_item_user_fk;
alter table public.resources
  add constraint resources_item_id_fk
  foreign key (item_id) references public.items (id) on delete set null;

alter table public.evidence drop constraint if exists evidence_criterion_user_fk;
alter table public.evidence
  add constraint evidence_criterion_id_fk
  foreign key (criterion_id) references public.achievement_criteria (id) on delete set null;
