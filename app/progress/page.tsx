import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { PhaseNavigator } from "@/components/phase-navigator";
import { ProgressReview } from "@/components/progress-review";
import { startOfWeekMonday, weeklyMinutes } from "@/lib/progress";
import { loadPhasesWithTree, loadPreferences, requireUser } from "@/lib/queries";
import { WEEKLY_GOAL_MAX, WEEKLY_GOAL_MIN, type Evidence } from "@/lib/types";

export default async function ProgressPage() {
  const { supabase } = await requireUser();
  const phases = await loadPhasesWithTree();
  const prefs = await loadPreferences();
  const active = phases.find((p) => p.status === "active");

  const { data: logs } = await supabase
    .from("time_logs")
    .select("logged_on, minutes, started_at, ended_at");
  const weekStart = startOfWeekMonday(new Date());

  const { data: evidenceRows } = await supabase
    .from("evidence")
    .select("id, item_id, criterion_id, kind, content, label, created_at, items(title)")
    .order("created_at", { ascending: false })
    .limit(20);

  const recentEvidence = (evidenceRows ?? []).map((e) => ({
    id: e.id as string,
    item_id: e.item_id as string,
    criterion_id: (e.criterion_id as string | null) ?? null,
    kind: e.kind as Evidence["kind"],
    content: e.content as string,
    label: (e.label as string | null) ?? null,
    created_at: e.created_at as string,
    item_title:
      ((e.items as { title?: string } | null)?.title as string | undefined) ?? "Topic",
  }));

  return (
    <AppShell
      brand={prefs?.path_title ?? "AI Path"}
      sidebar={<PhaseNavigator phases={phases} activePhaseId={active?.id} />}
    >
      <div className="mb-4">
        <Link href="/" className="text-sm font-bold text-muted hover:text-ink">
          ← Study command
        </Link>
      </div>
      <ProgressReview
        phases={phases}
        weekMinutes={weeklyMinutes(logs ?? [], weekStart)}
        weekGoalMin={prefs?.weekly_goal_min_minutes ?? WEEKLY_GOAL_MIN}
        weekGoalMax={prefs?.weekly_goal_max_minutes ?? WEEKLY_GOAL_MAX}
        recentEvidence={recentEvidence}
      />
    </AppShell>
  );
}
