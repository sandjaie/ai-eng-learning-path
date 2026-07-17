import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { CapturePanel } from "@/components/capture-panel";
import { PathBuilder } from "@/components/path-builder";
import { PhaseNavigator } from "@/components/phase-navigator";
import { ResourceList } from "@/components/resource-list";
import { StudyNextCard } from "@/components/study-next-card";
import { StudySessionPanel } from "@/components/study-session-panel";
import { AchievementChecklist } from "@/components/achievement-checklist";
import { activeDaysThisWeek, startOfWeekMonday, weeklyMinutes } from "@/lib/progress";
import { loadPhasesWithTree, loadPreferences, requireUser } from "@/lib/queries";
import { selectStudyNext } from "@/lib/study-next";
import { WEEKLY_GOAL_MIN, type Resource } from "@/lib/types";

export default async function Dashboard() {
  const { supabase } = await requireUser();
  const phases = await loadPhasesWithTree();
  const prefs = await loadPreferences();

  if (phases.length === 0) {
    return (
      <AppShell>
        <PathBuilder />
      </AppShell>
    );
  }

  const studyNext = selectStudyNext(phases, prefs?.pinned_item_id ?? null);
  const activePhase =
    phases.find((p) => p.status === "active") ??
    (studyNext.type === "item" ? phases.find((p) => p.id === studyNext.phase.id) : null);

  const { data: logs } = await supabase
    .from("time_logs")
    .select("id, phase_id, item_id, logged_on, minutes, started_at, ended_at");
  const weekStart = startOfWeekMonday(new Date());
  const weekMins = weeklyMinutes(logs ?? [], weekStart);
  const days = activeDaysThisWeek(logs ?? [], weekStart);
  const open = (logs ?? []).find((l) => l.started_at && !l.ended_at) ?? null;

  let resources: Resource[] = [];
  let criteria: {
    id: string;
    item_id: string;
    description: string;
    is_required: boolean;
    sort_order: number;
    achieved_at: string | null;
    source_key: string | null;
    source_revision: string | null;
  }[] = [];

  if (studyNext.type === "item") {
    const [{ data: res }, { data: crit }] = await Promise.all([
      supabase
        .from("resources")
        .select("*")
        .eq("phase_id", studyNext.phase.id)
        .order("sort_order"),
      supabase
        .from("achievement_criteria")
        .select("*")
        .eq("item_id", studyNext.item.id)
        .order("sort_order"),
    ]);
    const allRes = (res ?? []) as Resource[];
    const itemLinked = allRes.filter((r) => r.item_id === studyNext.item.id);
    resources = itemLinked.length > 0 ? itemLinked : allRes.filter((r) => !r.item_id);
    criteria = crit ?? [];
  }

  const achieved = criteria.filter((c) => c.achieved_at).length;

  return (
    <AppShell
      brand={prefs?.path_title ?? "AI Path"}
      sidebar={<PhaseNavigator phases={phases} activePhaseId={activePhase?.id} />}
      rail={
        <div className="space-y-8">
          <StudySessionPanel
            phaseId={activePhase?.id ?? phases[0]?.id ?? ""}
            itemId={studyNext.type === "item" ? studyNext.item.id : null}
            openSession={
              open?.started_at
                ? { id: open.id as string, started_at: open.started_at as string }
                : null
            }
            suggestedMinutes={
              studyNext.type === "item" ? studyNext.item.estimated_minutes ?? 45 : 45
            }
            weekMinutes={weekMins}
            weekGoalMin={prefs?.weekly_goal_min_minutes ?? WEEKLY_GOAL_MIN}
            activeDays={days}
          />
          {studyNext.type === "item" ? (
            <CapturePanel itemId={studyNext.item.id} phaseId={studyNext.phase.id} />
          ) : null}
        </div>
      }
    >
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-muted">
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
          <p className="mt-3 text-xs font-bold tracking-wide text-muted uppercase">
            Today’s learning
          </p>
          <h1 className="font-display mt-1 max-w-xl text-3xl font-bold sm:text-4xl">
            {studyNext.type === "item"
              ? `Continue ${studyNext.item.title}`
              : "Your study command center"}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            One focused topic, the right resources, and a clear outcome.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/progress" className="scc-btn scc-btn-secondary">
            Review progress
          </Link>
          <Link href="/plan" className="scc-btn scc-btn-secondary">
            Edit plan
          </Link>
        </div>
      </header>

      <div className="mt-8">
        <StudyNextCard
          state={studyNext}
          achievedCriteria={achieved}
          totalCriteria={criteria.length}
        />
      </div>

      {studyNext.type === "item" ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ResourceList
            resources={resources}
            phaseId={studyNext.phase.id}
            itemId={studyNext.item.id}
            editable
          />
          <AchievementChecklist
            criteria={criteria}
            itemId={studyNext.item.id}
            phaseId={studyNext.phase.id}
            itemStatus={studyNext.item.status}
          />
        </div>
      ) : null}
    </AppShell>
  );
}
