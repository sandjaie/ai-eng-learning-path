import type {
  ItemKind,
  ResourcePriority,
  ResourceType,
  SectionKind,
} from "@/lib/types";

export const CURRICULUM_REVISION = "2026-07-17.1";

export interface CurriculumCriterion {
  source_key: string;
  description: string;
  is_required: boolean;
}

export interface CurriculumResource {
  source_key: string;
  title: string;
  url: string;
  provider: string | null;
  resource_type: ResourceType;
  priority: ResourcePriority;
  estimated_minutes: number | null;
  description: string | null;
  /** When set, resource is linked to this item source_key within the same phase. */
  item_source_key: string | null;
  verified_at: string | null;
}

export interface CurriculumItem {
  source_key: string;
  title: string;
  kind: ItemKind;
  estimated_minutes: number | null;
  criteria: CurriculumCriterion[];
}

export interface CurriculumSection {
  source_key: string;
  title: string;
  kind: SectionKind;
  items: CurriculumItem[];
}

export interface CurriculumPhase {
  source_key: string;
  title: string;
  description: string;
  sort_order: number;
  /** Months from path start for target dates (inclusive span). */
  month_start: number;
  month_end: number;
  sections: CurriculumSection[];
  resources: CurriculumResource[];
}

export interface CurriculumRoadmap {
  revision: string;
  path_title: string;
  path_goal: string;
  weekly_goal_min_minutes: number;
  weekly_goal_max_minutes: number;
  phases: CurriculumPhase[];
}
