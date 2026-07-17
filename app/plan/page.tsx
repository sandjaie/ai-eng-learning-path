import Link from "next/link";
import { ActionError } from "@/components/action-error";
import { AppShell } from "@/components/app-shell";
import { CurriculumUpgradeCard } from "@/components/curriculum-upgrade-card";
import { PathBuilder } from "@/components/path-builder";
import { PhaseNavigator } from "@/components/phase-navigator";
import { PlanEditor } from "@/components/plan-editor";
import { isCurriculumFullyMaterialized } from "@/lib/curriculum/apply";
import { loadPhasesWithTree, loadPreferences, requireUser } from "@/lib/queries";
import type { AchievementCriterion, Resource } from "@/lib/types";

export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<{ phase?: string; error?: string }>;
}) {
  const { phase: selectedPhaseId, error } = await searchParams;
  const { supabase, user } = await requireUser();
  const phases = await loadPhasesWithTree();
  const prefs = await loadPreferences();

  if (phases.length === 0) {
    return (
      <AppShell brand={prefs?.path_title ?? "AI Path"}>
        <ActionError message={error} />
        <PathBuilder />
      </AppShell>
    );
  }

  const active = phases.find((p) => p.status === "active");
  const phaseIds = phases.map((p) => p.id);
  const itemIds = phases.flatMap((p) => p.sections.flatMap((s) => s.items.map((i) => i.id)));
  const curriculumComplete = await isCurriculumFullyMaterialized(supabase, user.id);

  const [{ data: resourceRows }, { data: criterionRows }] = await Promise.all([
    supabase.from("resources").select("*").in("phase_id", phaseIds).order("sort_order"),
    itemIds.length
      ? supabase
          .from("achievement_criteria")
          .select("*")
          .in("item_id", itemIds)
          .order("sort_order")
      : Promise.resolve({ data: [] as AchievementCriterion[] }),
  ]);

  const resources = (resourceRows ?? []) as Resource[];
  const criteriaByItem: Record<string, AchievementCriterion[]> = {};
  for (const c of (criterionRows ?? []) as AchievementCriterion[]) {
    (criteriaByItem[c.item_id] ??= []).push(c);
  }

  return (
    <AppShell
      brand={prefs?.path_title ?? "AI Path"}
      sidebar={<PhaseNavigator phases={phases} activePhaseId={active?.id} />}
    >
      <ActionError message={error} />
      <CurriculumUpgradeCard needsUpgrade={!curriculumComplete} />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-wide text-muted uppercase">Plan editor</p>
          <h1 className="font-display mt-1 text-3xl font-bold">Learning path</h1>
        </div>
        <Link href="/" className="scc-btn scc-btn-secondary">
          Back to study
        </Link>
      </div>
      <PlanEditor
        phases={phases}
        selectedPhaseId={selectedPhaseId}
        resources={resources}
        criteriaByItem={criteriaByItem}
      />
    </AppShell>
  );
}
