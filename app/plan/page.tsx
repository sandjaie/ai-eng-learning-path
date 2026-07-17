import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { PathBuilder } from "@/components/path-builder";
import { PhaseNavigator } from "@/components/phase-navigator";
import { PlanEditor } from "@/components/plan-editor";
import { loadPhasesWithTree, loadPreferences } from "@/lib/queries";

export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<{ phase?: string }>;
}) {
  const { phase: selectedPhaseId } = await searchParams;
  const phases = await loadPhasesWithTree();
  const prefs = await loadPreferences();

  if (phases.length === 0) {
    return (
      <AppShell brand={prefs?.path_title ?? "AI Path"}>
        <PathBuilder />
      </AppShell>
    );
  }

  const active = phases.find((p) => p.status === "active");

  return (
    <AppShell
      brand={prefs?.path_title ?? "AI Path"}
      sidebar={<PhaseNavigator phases={phases} activePhaseId={active?.id} />}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-wide text-muted uppercase">Plan editor</p>
          <h1 className="font-display mt-1 text-3xl font-bold">Learning path</h1>
        </div>
        <Link href="/" className="scc-btn scc-btn-secondary">
          Back to study
        </Link>
      </div>
      <PlanEditor phases={phases} selectedPhaseId={selectedPhaseId} />
    </AppShell>
  );
}
