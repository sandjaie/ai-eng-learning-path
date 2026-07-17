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
  /** Parallel phases to archive only after their items are relocated. */
  archivePhaseIds: string[];
  /** Move these items into the preserved-legacy section of a sequential phase. */
  relocateItemIds: string[];
  /** Retire false cert claims without deleting progress/history. */
  renameBannedItemIds: { id: string; title: string }[];
  alreadyCurrent: boolean;
}

function isBannedClaudeCertTitle(title: string): boolean {
  return (
    (REMOVED_CLAUDE_CERT_TITLES as readonly string[]).some((t) =>
      title.includes(t.replace("Claude ", "")),
    ) || /claude certified (developer|engineer|practitioner)/i.test(title)
  );
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

  const relocateItemIds = snapshot.items
    .filter((i) => archivePhaseIdSet.has(i.phase_id))
    .map((i) => i.id);

  const renameBannedItemIds = snapshot.items
    .filter((i) => archivePhaseIdSet.has(i.phase_id) && isBannedClaudeCertTitle(i.title))
    .filter((i) => !i.title.includes("(retired claim)"))
    .map((i) => ({
      id: i.id,
      title: `${i.title} (retired claim — kept for history)`,
    }));

  // Phase-key presence alone is never enough for "current"; apply.ts verifies children.
  const activeRevisions = snapshot.phases
    .filter((p) => p.source_key && !p.archived_at)
    .map((p) => p.source_revision);
  const alreadyCurrent =
    phasesToInsert.length === 0 &&
    assignPhaseKeys.length === 0 &&
    archivePhaseIds.length === 0 &&
    relocateItemIds.length === 0 &&
    renameBannedItemIds.length === 0 &&
    activeRevisions.length >= 8 &&
    activeRevisions.every((r) => r === CURRICULUM_REVISION);

  return {
    revision: CURRICULUM_REVISION,
    assignPhaseKeys,
    phasesToInsert,
    archivePhaseIds,
    relocateItemIds,
    renameBannedItemIds,
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

  const rename = new Map(plan.renameBannedItemIds.map((r) => [r.id, r.title]));
  const preservePhaseId =
    phases.find((p) => p.source_key === "phase.production-aws" && !p.archived_at)?.id ??
    phases.find((p) => p.source_key && !p.archived_at)?.id ??
    null;

  const items = snapshot.items.map((i) => {
    let next = { ...i };
    const renamed = rename.get(i.id);
    if (renamed) next = { ...next, title: renamed };
    if (plan.relocateItemIds.includes(i.id) && preservePhaseId) {
      next = { ...next, phase_id: preservePhaseId };
    }
    return next;
  });

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
