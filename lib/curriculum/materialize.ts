import type { CurriculumRoadmap } from "./types";
import { curriculumRoadmap } from "./roadmap";
import { CURRICULUM_REVISION } from "./types";

export interface MaterializedPhase {
  source_key: string;
  source_revision: string;
  title: string;
  description: string;
  sort_order: number;
  target_start: string;
  target_end: string;
  status: "planned" | "active";
  activated_at: string | null;
}

export interface MaterializedSection {
  phase_source_key: string;
  source_key: string;
  source_revision: string;
  title: string;
  kind: string;
  sort_order: number;
}

export interface MaterializedItem {
  section_source_key: string;
  source_key: string;
  source_revision: string;
  title: string;
  kind: string;
  estimated_minutes: number | null;
  sort_order: number;
}

export interface MaterializedCriterion {
  item_source_key: string;
  source_key: string;
  source_revision: string;
  description: string;
  is_required: boolean;
  sort_order: number;
}

export interface MaterializedResource {
  phase_source_key: string;
  item_source_key: string | null;
  source_key: string;
  source_revision: string;
  title: string;
  url: string;
  provider: string | null;
  resource_type: string;
  priority: string;
  estimated_minutes: number | null;
  description: string | null;
  sort_order: number;
  verified_at: string | null;
}

export interface MaterializedCurriculum {
  revision: string;
  path_title: string;
  path_goal: string;
  weekly_goal_min_minutes: number;
  weekly_goal_max_minutes: number;
  phases: MaterializedPhase[];
  sections: MaterializedSection[];
  items: MaterializedItem[];
  criteria: MaterializedCriterion[];
  resources: MaterializedResource[];
}

function addMonths(isoDate: string, months: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().slice(0, 10);
}

export function materializeCurriculum(
  roadmap: CurriculumRoadmap = curriculumRoadmap,
  pathStart = "2026-08-01",
): MaterializedCurriculum {
  const phases: MaterializedPhase[] = [];
  const sections: MaterializedSection[] = [];
  const items: MaterializedItem[] = [];
  const criteria: MaterializedCriterion[] = [];
  const resources: MaterializedResource[] = [];

  for (const phase of roadmap.phases) {
    const start = addMonths(pathStart, phase.month_start - 1);
    // month_end is inclusive; target_end is the day before the next month starts
    const endExclusive = addMonths(pathStart, phase.month_end);
    const endDate = new Date(`${endExclusive}T00:00:00Z`);
    endDate.setUTCDate(endDate.getUTCDate() - 1);
    const target_end = endDate.toISOString().slice(0, 10);

    phases.push({
      source_key: phase.source_key,
      source_revision: CURRICULUM_REVISION,
      title: phase.title,
      description: phase.description,
      sort_order: phase.sort_order,
      target_start: start,
      target_end,
      status: phase.sort_order === 0 ? "active" : "planned",
      activated_at: phase.sort_order === 0 ? new Date().toISOString() : null,
    });

    phase.sections.forEach((section, sIdx) => {
      sections.push({
        phase_source_key: phase.source_key,
        source_key: section.source_key,
        source_revision: CURRICULUM_REVISION,
        title: section.title,
        kind: section.kind,
        sort_order: sIdx,
      });
      section.items.forEach((item, iIdx) => {
        items.push({
          section_source_key: section.source_key,
          source_key: item.source_key,
          source_revision: CURRICULUM_REVISION,
          title: item.title,
          kind: item.kind,
          estimated_minutes: item.estimated_minutes,
          sort_order: iIdx,
        });
        item.criteria.forEach((c, cIdx) => {
          criteria.push({
            item_source_key: item.source_key,
            source_key: c.source_key,
            source_revision: CURRICULUM_REVISION,
            description: c.description,
            is_required: c.is_required,
            sort_order: cIdx,
          });
        });
      });
    });

    phase.resources.forEach((r, rIdx) => {
      resources.push({
        phase_source_key: phase.source_key,
        item_source_key: r.item_source_key,
        source_key: r.source_key,
        source_revision: CURRICULUM_REVISION,
        title: r.title,
        url: r.url,
        provider: r.provider,
        resource_type: r.resource_type,
        priority: r.priority,
        estimated_minutes: r.estimated_minutes,
        description: r.description,
        sort_order: rIdx,
        verified_at: r.verified_at,
      });
    });
  }

  return {
    revision: CURRICULUM_REVISION,
    path_title: roadmap.path_title,
    path_goal: roadmap.path_goal,
    weekly_goal_min_minutes: roadmap.weekly_goal_min_minutes,
    weekly_goal_max_minutes: roadmap.weekly_goal_max_minutes,
    phases,
    sections,
    items,
    criteria,
    resources,
  };
}
