# Study Command Center redesign

**Date:** 2026-07-17
**Status:** Approved product direction; ready for implementation planning

## Summary

The tracker already stores a detailed multi-phase roadmap, links, item status,
notes, dates, and time logs. Its current interface emphasizes roadmap
administration and aggregate completion, but it does not answer the learner's
most important daily questions:

1. What should I study next?
2. Which resources should I use for this topic?
3. What did I understand or build?
4. Have I achieved the intended outcome?

The redesign uses the approved **Study Command Center** direction. The home
screen becomes a daily learning workspace with one dominant action,
**Continue studying**, while path planning and progress review remain
available as secondary workflows.

The core loop is:

> Plan the path → study the next topic → use linked resources → capture notes
> and evidence → verify outcomes → review progress

## Goals

- Guide the learner through the roadmap phase by phase and topic by topic.
- Make the next recommended study action obvious on every visit.
- Associate multiple study resources with the topic they support.
- Capture study time, notes, and evidence in the context of the current topic.
- Define completion through explicit achievement criteria, not only a checked
  row.
- Provide a focused plan editor for creating and maintaining the whole path.
- Preserve the existing single-user auth model, server-action architecture,
  RLS guarantees, and existing roadmap data.
- Replace the admin-like neobrutalist presentation with a calm, accessible
  learning-product visual system.

## Non-goals for the first release

- AI-generated learning paths or automatic resource recommendations.
- Social features, cohorts, leaderboards, or public profiles.
- File uploads to Supabase Storage. Evidence supports text and URLs first.
- Calendar integrations, notifications, or scheduled reminders.
- Grading, quizzes, or automated evaluation of the learner's answers.
- Multi-user teams or sharing.

## Experience principles

### One clear next action

The dashboard must make the recommended topic and **Continue studying** action
more prominent than metrics or plan-management controls.

### Progress means demonstrated achievement

Resources and study time support learning, but neither counts as achievement.
A topic is complete when its required criteria are achieved or, when it has no
criteria, when the learner explicitly marks it achieved.

### Context stays together

The current topic, its resources, session time, notes, evidence, and outcome
criteria must be available in the same workflow. The learner should not need
to scroll to unrelated panels to record what happened.

### The plan remains visible

The current phase is always shown in the context of the overall path. Planning
is secondary on the daily dashboard but is a first-class dedicated workspace.

## Information architecture

### `/` — Study Command dashboard

Desktop uses the selected three-column layout:

1. **Phase navigator** — the ordered learning path, active phase, phase
   progress, and an `Edit plan` entry.
2. **Study workspace** — the current topic, its progress, recommended
   resources, and achievement criteria.
3. **Session rail** — focus session, weekly time goal, contextual note, and
   evidence capture.

The page also includes a secondary `Review progress` action. It does not show
all phases as equal-sized cards or lead with aggregate statistics.

### `/study/[itemId]` — Topic workspace

The topic workspace expands the dashboard's current-topic area without losing
context. It contains:

- topic purpose and estimated effort;
- linked resources, each with a usage status;
- a Learn / Practice / Reflect workflow;
- achievement criteria;
- notes and evidence;
- session start, pause, resume, and completion controls;
- `Study another topic` as a secondary override.

The current `/phase/[id]` page remains available during migration and then
becomes the phase overview described below.

### `/phase/[id]` — Phase overview

The phase overview communicates the learning sequence rather than exposing a
large editable checklist. It groups content by typed sections:

- topics to learn;
- projects and practice tasks;
- exit outcomes;
- phase-level resources;
- completed work and evidence.

It provides `Continue phase` and `Edit phase plan` actions. Destructive and
reordering controls are only shown in editing mode.

### `/plan` — Learning-path editor

The plan editor is the primary place to create and manage the whole roadmap.
It uses a two-pane layout:

- ordered phases and dates on the left;
- selected phase details on the right.

The learner can add, duplicate, rename, delete, and reorder phases, sections,
and items. When editing an item, they can set its type, effort, resources, and
achievement criteria together.

An empty roadmap starts with a guided four-step builder:

1. Define the learning goal, duration, and weekly time goal.
2. Add and order phases.
3. Add topics, projects, resources, and outcomes to each phase.
4. Review the path and activate the first phase.

Bulk AI import is deliberately deferred. The first version can duplicate a
phase and add multiple items in one editing session, but it does not parse
arbitrary prose into a roadmap.

### `/progress` — Progress review

The review surface shows:

- achieved outcomes by phase;
- active and completed topics;
- weekly study time versus the configured goal;
- recent notes and evidence;
- areas with study activity but no achieved outcome.

This is an analysis surface, not the default landing page.

## Core workflows

### Continue studying

The dashboard selects `Study next` in this order:

1. A manually pinned item, if it is still incomplete and belongs to the active
   phase.
2. The first `in_progress` item in active-phase section and item order.
3. The first `todo` trackable item in active-phase section and item order.
4. A phase-transition state when the active phase is complete. This state shows
   the next planned phase and requires explicit `Start next phase`
   confirmation.
5. A path-completion state when there is no next planned phase.

Only topic, project-task, and milestone items are trackable. Resources do not
participate in the recommendation order or progress denominator.

The learner can override the recommendation by choosing another item. The
override is stored as the pinned item until it is completed or unpinned.

When the final trackable item in the active phase is achieved, that phase moves
to `complete`. The next phase remains `planned` until the learner confirms
`Start next phase`; phase activation is never advanced silently.

### Study a topic

1. The learner opens the recommended topic.
2. They review the purpose, estimated effort, resources, and achievement
   criteria.
3. Starting a session stores the session start immediately, so a refresh does
   not lose the timer.
4. Opening or continuing a resource can mark it `using`.
5. During or after the session, the learner records a note and optional text or
   URL evidence.
6. The learner checks criteria as they are achieved.
7. When at least one required criterion exists and all required criteria are
   achieved, the topic becomes `done` and the next topic is recommended. A
   topic with no required criteria requires explicit `Mark achieved`
   confirmation.

### Manage resources

A resource belongs to a phase and may optionally be linked to a specific item.
This supports both broad course material and topic-specific references.

Each resource has:

- title;
- URL;
- provider;
- type: course, article, video, documentation, book, repository, or other;
- usage status: planned, using, or completed;
- optional notes;
- sort order.

Resources can be attached from the plan editor or the topic workspace. The UI
shows provider and type but never treats the resource as a completed learning
outcome.

### Capture achievement

Achievement criteria are short, observable statements such as:

- explain the concept without notes;
- complete a named exercise;
- build and verify a project capability;
- compare two approaches and justify the choice.

Criteria can be required or optional. Achieving a criterion records a
timestamp. Evidence can optionally be linked to a criterion. Unchecking a
required criterion reopens a completed topic after confirmation.

## Data model

The existing `phases → sections → items` hierarchy remains the roadmap spine.
The migration extends it rather than replacing it.

### Existing-table changes

#### `phases`

- `status`: `planned | active | complete`, default `planned`.
- `activated_at`: nullable timestamp.
- Add a partial unique index so one user can have at most one active phase.

#### `sections`

- `kind`: `topics | projects | outcomes | resources | custom`, default
  `custom` for existing rows.

#### `items`

- `kind`: `topic | project_task | milestone | reference`, default `topic`.
  `reference` is a non-trackable migration type for legacy course/resource
  rows and is not created by the new plan editor.
- `estimated_minutes`: nullable positive integer.
- `started_at`: nullable timestamp.
- Keep `status`, `notes`, and existing URL/provider columns during migration.
  New multi-resource relationships use the `resources` table.

#### `time_logs`

- `item_id`: nullable foreign key to `items`.
- `started_at`: nullable timestamp.
- `ended_at`: nullable timestamp.
- Allow `minutes = 0` only while `started_at` is present and `ended_at` is
  null. Ending the session calculates and stores a positive minute total.
- Existing manual entries remain valid phase-level logs.

### New tables

#### `user_preferences`

- `user_id` primary key and foreign key to `auth.users`.
- `pinned_item_id` nullable foreign key to `items`.
- `path_title` and nullable `path_goal`.
- `weekly_goal_min_minutes` and `weekly_goal_max_minutes`.

#### `resources`

- `id`, `user_id`, `phase_id`, nullable `item_id`.
- `title`, `url`, `provider`, `resource_type`, `status`, `notes`, `sort_order`.
- `created_at`, `updated_at`.

#### `achievement_criteria`

- `id`, `user_id`, `item_id`.
- `description`, `is_required`, `sort_order`, nullable `achieved_at`.
- `created_at`, `updated_at`.

#### `evidence`

- `id`, `user_id`, `item_id`, nullable `criterion_id`.
- `kind`: `note | link`.
- `content` for note text or URL.
- optional `label`.
- `created_at`, `updated_at`.

All new tables receive `owner_all` RLS policies matching the existing
`auth.uid()` pattern. Parent tables receive the composite uniqueness needed for
child tables to use `(parent_id, user_id)` foreign keys. This prevents a row
owned by one user from referencing phase, item, criterion, or resource records
owned by another user; RLS is not the only ownership boundary.

### Existing data migration

- Existing phases remain ordered and receive `planned` status. If no phase is
  active, activate the first incomplete phase.
- Map known section titles case-insensitively: Learn → `topics`, Build →
  `projects`, Exit criteria → `outcomes`, Courses/Resources → `resources`.
- Existing items keep their data and default to a kind based on section kind.
  Items under mapped resource sections become non-trackable `reference` rows.
- For every existing item with a URL, create a phase-level resource while
  retaining the original item and URL. This avoids data loss and lets the
  learner attach the migrated resource to a topic later.
- Copy non-empty legacy item notes into note evidence while retaining the
  original notes during the compatibility period.
- Existing time logs remain phase-level logs with `item_id = null`.
- Update the generic seed roadmap to create typed sections, linked resources,
  and representative achievement criteria directly.

## Progress rules

- **Item progress:** an item is achieved when its status is `done`.
- **Criteria-driven completion:** when an item has at least one required
  criterion, achieving all required criteria marks it `done`. Optional criteria
  do not block completion. Items with no required criteria require explicit
  confirmation.
- **Phase progress:** achieved trackable items divided by all trackable items.
- **Overall progress:** achieved trackable items divided by all trackable items
  across the path.
- **Resource progress:** displayed separately as planned / using / completed;
  never included in learning progress.
- **Time progress:** displayed against the weekly time goal; never converted
  into achievement percentage.
- Existing schedule status continues to compare achieved item percentage with
  elapsed phase time.

## Visual design

The selected Study Command concept replaces the hard-shadow Blocks aesthetic.

### Visual language

- Warm neutral page background with white content surfaces.
- Deep navy primary text.
- Teal for active learning, progress, and primary study actions.
- Golden yellow for achievement prompts and attention states.
- Fine neutral dividers, restrained elevation, and medium-radius surfaces.
- Clear 14–16px body typography and a compact display scale.
- No decorative card grid, oversized metrics row, hard shadows, or all-caps
  administrative styling.

The implementation must continue to use CSS tokens in `app/globals.css` and
provide equivalent dark-mode tokens. Components must not hardcode paper, card,
ink, or on-color values.

### Responsive behavior

- **Desktop ≥ 1200px:** phase navigator, study workspace, and session rail.
- **Tablet 768–1199px:** compact phase navigator, study workspace, then session
  tools below the current-topic area.
- **Mobile < 768px:** single column; path becomes a phase selector; resources,
  criteria, and capture tools stack; `Continue studying` remains visible near
  the top and may use a sticky bottom action while a topic is active.

No breakpoint may require horizontal scrolling. Hover-only controls are not
allowed.

## Components and boundaries

- `AppShell`: global product navigation and responsive shell.
- `PhaseNavigator`: path order, active phase, and phase progress.
- `StudyNextCard`: recommendation, topic progress, and primary action.
- `ResourceList` / `ResourceEditor`: resource display and editing.
- `AchievementChecklist`: criteria state and completion confirmation.
- `StudySessionPanel`: resilient session timer and weekly time summary.
- `CapturePanel`: contextual note and evidence creation.
- `PlanEditor`: phase outline and selected-phase editor.
- `ProgressReview`: outcome, time, and evidence summaries.

Recommendation and progress calculations remain pure functions under `lib/` so
they can be tested independently of UI and Supabase.

## Data flow and server actions

Reads remain server-component queries. All writes remain server actions in
`app/actions.ts`; no API routes are introduced.

New or expanded actions include:

- activate a phase;
- pin or unpin the study-next item;
- start, end, or manually add a study session;
- create, update, reorder, and delete a resource;
- update resource usage status;
- create, update, reorder, and delete achievement criteria;
- toggle criterion achievement;
- create, update, and delete evidence;
- update item kind and estimated effort;
- update section kind;
- save path-builder steps.

Every action validates ownership through the authenticated Supabase client,
normalizes input, returns a usable error state, and revalidates `/`, the
affected `/phase/[id]`, `/study/[itemId]`, `/plan`, and `/progress` as needed.

## Error and empty states

- A missing roadmap shows the guided path builder, not a blank dashboard.
- A phase with no trackable items offers `Add the first topic`.
- A topic with no resources offers `Add a resource` without blocking study.
- A topic with no criteria uses explicit `Mark achieved` confirmation.
- Starting a session twice returns the already-active session instead of
  creating overlapping rows.
- A failed save keeps the entered value, shows a concise inline error, and
  leaves the action available for retry.
- Broken or invalid resource URLs are rejected during save.
- Deleting phases, items, criteria, or evidence requires clear confirmation
  that names the affected content.
- If the pinned item is deleted or completed, the recommendation falls back to
  the normal selection algorithm.

## Accessibility requirements

- Every field has a visible label; placeholders only provide examples.
- All editing and reordering controls are keyboard reachable and visible on
  focus. Nothing depends on hover.
- Icon-only controls require accessible names and at least a 44×44px target on
  touch layouts.
- Section titles use heading semantics rather than buttons unless they are
  actual disclosure controls.
- Timer state changes and save results use polite live announcements.
- Progress indicators expose text values in addition to color and bar length.
- Light and dark themes meet WCAG AA contrast for normal text and controls.
- Reduced-motion preferences disable nonessential movement.

## Testing and verification

### Unit tests

- Study-next selection order, pinned-item behavior, and fallback behavior.
- Criteria-driven completion and reopening.
- Phase and overall progress excluding resources.
- Weekly time calculations with active and manual sessions.
- Data-migration mapping helpers for section and item kinds.

### Action tests

- Ownership and validation for resource, criterion, evidence, and session
  writes.
- Prevention of overlapping active sessions.
- Phase activation maintains one active phase per user.

### Browser verification

- Empty roadmap → builder → activate first phase.
- Dashboard → continue topic → start/end session → capture note/evidence.
- Add and update a topic resource.
- Achieve all required criteria → topic completes → next recommendation.
- Manual topic override and unpin.
- Plan editing and reordering without exposing controls in study mode.
- Keyboard-only navigation and visible focus.
- Responsive checks at mobile, tablet, and desktop widths in both themes.

### Project gates

- `npm run verify` for normal iterations.
- `npm run verify:full` before merge because the change includes schema,
  routing, and substantial UI work.

## Implementation sequence

The implementation plan should split the work into independently verifiable
milestones:

1. Schema migration, types, RLS, seed updates, and pure progress/recommendation
   helpers.
2. Study Command shell and dashboard.
3. Topic workspace, resources, sessions, criteria, notes, and evidence.
4. Learning-path editor and empty-roadmap builder.
5. Progress review, responsive refinement, accessibility, and migration
   cleanup.

Each milestone must preserve the current app's usable state and pass the
project verification gate before moving to the next.
