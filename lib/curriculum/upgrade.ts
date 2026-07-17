import { curriculumRoadmap } from "./roadmap";
import {
  LEGACY_PARALLEL_PHASE_TITLES,
  LEGACY_PHASE_TITLES,
  REMOVED_CLAUDE_CERT_TITLES,
} from "./legacy-titles";
import type { CurriculumRoadmap } from "./types";
import { CURRICULUM_REVISION } from "./types";

export interface SnapshotPhase {
  id: string;
  title: string;
  source_key: string | null;
  source_revision: string | null;
  archived_at: string | null;
  sort_order: number;
  status: string;
}

export interface SnapshotItem {
  id: string;
  phase_id: string;
  title: string;
  source_key: string | null;
  status: string;
  notes: string | null;
}

export interface Snapshot {
  phases: SnapshotPhase[];
  items: SnapshotItem[];
}

export interface UpgradePlan {
  revision: string;
  assignPhaseKeys: { id: string; source_key: string }[];
  phasesToInsert: string[];
  archivePhaseIds: string[];
  removeBannedItemIds: string[];
  alreadyCurrent: boolean;
}

export function planCurriculumUpgrade(
  snapshot: Snapshot,
  roadmap: CurriculumRoadmap = curriculumRoadmap,
): UpgradePlan {
  const assignPhaseKeys: { id: string; source_key: string }[] = [];
  const knownKeys = new Set(
    snapshot.phases.map((p) => p.source_key).filter(Boolean) as string[],
  );

  for (const phase of snapshot.phases) {
    if (phase.source_key || phase.archived_at) continue;
    const mapped = LEGACY_PHASE_TITLES[phase.title];
    if (mapped && !knownKeys.has(mapped)) {
      assignPhaseKeys.push({ id: phase.id, source_key: mapped });
      knownKeys.add(mapped);
    }
  }

  const phasesToInsert = roadmap.phases
    .map((p) => p.source_key)
    .filter((key) => !knownKeys.has(key));

  const archivePhaseIds = snapshot.phases
    .filter(
      (p) =>
        !p.archived_at &&
        (LEGACY_PARALLEL_PHASE_TITLES as readonly string[]).includes(p.title),
    )
    .map((p) => p.id);
  const archivePhaseIdSet = new Set(archivePhaseIds);

  // Only remove unverified Claude cert claims from legacy parallel phases.
  // Personal items in sequential phases (even with similar titles) are preserved.
  const removeBannedItemIds = snapshot.items
    .filter((i) => {
      if (!archivePhaseIdSet.has(i.phase_id)) return false;
      if (i.source_key) return false; // curated rows are relocated/archived with the phase
      return (
        (REMOVED_CLAUDE_CERT_TITLES as readonly string[]).some((t) =>
          i.title.includes(t.replace("Claude ", "")),
        ) || /claude certified (developer|engineer|practitioner)/i.test(i.title)
      );
    })
    .map((i) => i.id);

  const activeRevisions = snapshot.phases
    .filter((p) => p.source_key && !p.archived_at)
    .map((p) => p.source_revision);
  const alreadyCurrent =
    phasesToInsert.length === 0 &&
    assignPhaseKeys.length === 0 &&
    archivePhaseIds.length === 0 &&
    removeBannedItemIds.length === 0 &&
    activeRevisions.length >= 8 &&
    activeRevisions.every((r) => r === CURRICULUM_REVISION);

  return {
    revision: CURRICULUM_REVISION,
    assignPhaseKeys,
    phasesToInsert,
    archivePhaseIds,
    removeBannedItemIds,
    alreadyCurrent,
  };
}

/** Pure in-memory upgrade used by tests to prove idempotency. */
export function applyUpgradePlan(snapshot: Snapshot, plan: UpgradePlan): Snapshot {
  const phases = snapshot.phases.map((p) => {
    const assign = plan.assignPhaseKeys.find((a) => a.id === p.id);
    let next = { ...p };
    if (assign) {
      next = { ...next, source_key: assign.source_key, source_revision: plan.revision };
    }
    if (plan.archivePhaseIds.includes(p.id)) {
      next = { ...next, archived_at: next.archived_at ?? "2026-07-17T00:00:00Z" };
    }
    if (next.source_key && plan.phasesToInsert.length === 0) {
      next = { ...next, source_revision: plan.revision };
    }
    return next;
  });

  for (const key of plan.phasesToInsert) {
    phases.push({
      id: `new-${key}`,
      title: key,
      source_key: key,
      source_revision: plan.revision,
      archived_at: null,
      sort_order: phases.length,
      status: "planned",
    });
  }

  const banned = new Set(plan.removeBannedItemIds);
  const items = snapshot.items.filter((i) => !banned.has(i.id));

  return { phases, items };
}

export function stripTrackingParams(url: string): string {
  try {
    const u = new URL(url);
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((k) =>
      u.searchParams.delete(k),
    );
    return u.toString();
  } catch {
    return url;
  }
}

export function shouldOverwriteCuratedField(
  current: string | null,
  previousTemplate: string | null,
  nextTemplate: string,
): boolean {
  if (current == null || current === "") return true;
  if (previousTemplate != null && current === previousTemplate) return true;
  if (current === nextTemplate) return true;
  return false;
}
