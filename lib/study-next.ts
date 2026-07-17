import { isTrackableKind } from "./migrate-kinds";
import type { Item, ItemKind, ItemStatus, Phase, PhaseStatus } from "./types";

export type StudyNextState =
  | { type: "item"; item: StudyNextItem; phase: StudyNextPhase }
  | { type: "phase_transition"; completedPhase: StudyNextPhase; nextPhase: StudyNextPhase }
  | { type: "path_complete"; completedPhase: StudyNextPhase | null }
  | { type: "empty" };

export interface StudyNextItem {
  id: string;
  title: string;
  status: ItemStatus;
  kind: ItemKind;
  section_id: string;
  sort_order: number;
  section_sort_order: number;
  estimated_minutes: number | null;
}

export interface StudyNextPhase {
  id: string;
  title: string;
  status: PhaseStatus;
  sort_order: number;
}

type FlatItem = StudyNextItem & { phase_id: string };

function flattenTrackable(phases: Phase[]): FlatItem[] {
  const out: FlatItem[] = [];
  for (const phase of phases) {
    if (phase.archived_at) continue;
    const sections = [...phase.sections].sort((a, b) => a.sort_order - b.sort_order);
    for (const section of sections) {
      const items = [...section.items].sort((a, b) => a.sort_order - b.sort_order);
      for (const item of items) {
        if (!isTrackableKind(item.kind)) continue;
        out.push({
          id: item.id,
          title: item.title,
          status: item.status,
          kind: item.kind,
          section_id: item.section_id,
          sort_order: item.sort_order,
          section_sort_order: section.sort_order,
          estimated_minutes: item.estimated_minutes,
          phase_id: phase.id,
        });
      }
    }
  }
  return out;
}

function toPhase(p: Phase): StudyNextPhase {
  return { id: p.id, title: p.title, status: p.status, sort_order: p.sort_order };
}

/** Certification / optional milestones must not leapfrog incomplete project work. */
export function isBlockedCertificationMilestone(
  item: Pick<Item, "kind" | "title">,
  activePhaseItems: FlatItem[],
): boolean {
  if (item.kind !== "milestone") return false;
  const title = item.title.toLowerCase();
  const looksLikeCert =
    title.includes("certif") ||
    title.includes("practitioner") ||
    title.includes("associate") ||
    title.includes("professional") ||
    title.includes("microcredential");
  if (!looksLikeCert) return false;
  return activePhaseItems.some(
    (i) => i.kind === "project_task" && i.status !== "done",
  );
}

export function selectStudyNext(
  phases: Phase[],
  pinnedItemId: string | null = null,
): StudyNextState {
  const activePhases = [...phases]
    .filter((p) => !p.archived_at)
    .sort((a, b) => a.sort_order - b.sort_order);

  if (activePhases.length === 0) return { type: "empty" };

  const active = activePhases.find((p) => p.status === "active") ?? null;
  const allFlat = flattenTrackable(activePhases);

  if (active) {
    const phaseItems = allFlat.filter((i) => i.phase_id === active.id);
    const incomplete = phaseItems.filter((i) => i.status !== "done");

    if (pinnedItemId) {
      const pinned = incomplete.find((i) => i.id === pinnedItemId);
      if (pinned && !isBlockedCertificationMilestone(pinned, phaseItems)) {
        return { type: "item", item: pinned, phase: toPhase(active) };
      }
    }

    const inProgress = incomplete.find(
      (i) => i.status === "in_progress" && !isBlockedCertificationMilestone(i, phaseItems),
    );
    if (inProgress) return { type: "item", item: inProgress, phase: toPhase(active) };

    const todo = incomplete.find(
      (i) => i.status === "todo" && !isBlockedCertificationMilestone(i, phaseItems),
    );
    if (todo) return { type: "item", item: todo, phase: toPhase(active) };

    // Active phase complete — look for next planned phase
    const next = activePhases.find(
      (p) => p.sort_order > active.sort_order && p.status === "planned",
    );
    if (next) {
      return {
        type: "phase_transition",
        completedPhase: toPhase(active),
        nextPhase: toPhase(next),
      };
    }
    return { type: "path_complete", completedPhase: toPhase(active) };
  }

  // No active phase: recommend activating the next planned phase (e.g. after
  // markItemAchieved completed the previous active phase).
  const planned = activePhases.find((p) => p.status === "planned");
  if (planned) {
    const priorComplete =
      [...activePhases]
        .filter((p) => p.status === "complete" && p.sort_order < planned.sort_order)
        .at(-1) ??
      [...activePhases].reverse().find((p) => p.status === "complete") ??
      null;
    return {
      type: "phase_transition",
      completedPhase: priorComplete ? toPhase(priorComplete) : toPhase(planned),
      nextPhase: toPhase(planned),
    };
  }

  const lastComplete = [...activePhases].reverse().find((p) => p.status === "complete") ?? null;
  return { type: "path_complete", completedPhase: lastComplete ? toPhase(lastComplete) : null };
}

export interface CriterionInput {
  is_required: boolean;
  achieved_at: string | null;
}

export function shouldMarkItemDone(criteria: CriterionInput[]): boolean {
  const required = criteria.filter((c) => c.is_required);
  if (required.length === 0) return false;
  return required.every((c) => c.achieved_at != null);
}

export function shouldReopenItem(
  criteria: CriterionInput[],
  currentStatus: ItemStatus,
): boolean {
  if (currentStatus !== "done") return false;
  const required = criteria.filter((c) => c.is_required);
  if (required.length === 0) return false;
  return required.some((c) => c.achieved_at == null);
}
