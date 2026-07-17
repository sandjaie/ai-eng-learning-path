export type ItemStatus = "todo" | "in_progress" | "done";
export type PhaseStatus = "planned" | "active" | "complete";
export type SectionKind = "topics" | "projects" | "outcomes" | "resources" | "custom";
export type ItemKind = "topic" | "project_task" | "milestone" | "reference";
export type ResourceType =
  | "course"
  | "article"
  | "video"
  | "documentation"
  | "book"
  | "repository"
  | "other";
export type ResourceStatus = "planned" | "using" | "completed";
export type ResourcePriority = "primary" | "selective" | "optional";
export type EvidenceKind = "note" | "link";

export interface Item {
  id: string;
  section_id: string;
  title: string;
  url: string | null;
  provider: string | null;
  status: ItemStatus;
  notes: string | null;
  completed_at: string | null;
  sort_order: number;
  kind: ItemKind;
  estimated_minutes: number | null;
  started_at: string | null;
  source_key: string | null;
  source_revision: string | null;
}

export interface Section {
  id: string;
  phase_id: string;
  title: string;
  sort_order: number;
  kind: SectionKind;
  source_key: string | null;
  source_revision: string | null;
  items: Item[];
}

export interface Phase {
  id: string;
  title: string;
  description: string | null;
  notes: string | null;
  sort_order: number;
  target_start: string | null;
  target_end: string | null;
  status: PhaseStatus;
  activated_at: string | null;
  archived_at: string | null;
  source_key: string | null;
  source_revision: string | null;
  sections: Section[];
}

export interface TimeLog {
  id: string;
  phase_id: string;
  item_id: string | null;
  logged_on: string;
  minutes: number;
  note: string | null;
  started_at: string | null;
  ended_at: string | null;
}

export interface UserPreferences {
  user_id: string;
  pinned_item_id: string | null;
  path_title: string;
  path_goal: string | null;
  weekly_goal_min_minutes: number;
  weekly_goal_max_minutes: number;
}

export interface Resource {
  id: string;
  phase_id: string;
  item_id: string | null;
  title: string;
  url: string;
  provider: string | null;
  resource_type: ResourceType;
  status: ResourceStatus;
  priority: ResourcePriority;
  estimated_minutes: number | null;
  description: string | null;
  notes: string | null;
  sort_order: number;
  source_key: string | null;
  source_revision: string | null;
  verified_at: string | null;
}

export interface AchievementCriterion {
  id: string;
  item_id: string;
  description: string;
  is_required: boolean;
  sort_order: number;
  achieved_at: string | null;
  source_key: string | null;
  source_revision: string | null;
}

export interface Evidence {
  id: string;
  item_id: string;
  criterion_id: string | null;
  kind: EvidenceKind;
  content: string;
  label: string | null;
  created_at: string;
}

export const TRACKABLE_KINDS: ItemKind[] = ["topic", "project_task", "milestone"];

export const PHASE_COLORS = ["#2ec4b6", "#ffc94d", "#4cc9f0", "#c8b6ff", "#ff8a5c"] as const;
export const phaseColor = (sortOrder: number) =>
  PHASE_COLORS[((sortOrder % PHASE_COLORS.length) + PHASE_COLORS.length) % PHASE_COLORS.length];

export const WEEKLY_GOAL_MIN = 360; // minutes (6 h)
export const WEEKLY_GOAL_MAX = 480; // minutes (8 h)
