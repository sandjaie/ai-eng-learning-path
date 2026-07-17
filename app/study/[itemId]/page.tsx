import Link from "next/link";
import { notFound } from "next/navigation";
import { pinStudyItemAction } from "@/app/actions";
import { AchievementChecklist } from "@/components/achievement-checklist";
import { AppShell } from "@/components/app-shell";
import { CapturePanel } from "@/components/capture-panel";
import { PhaseNavigator } from "@/components/phase-navigator";
import { ResourceList } from "@/components/resource-list";
import { StudySessionPanel } from "@/components/study-session-panel";
import { activeDaysThisWeek, startOfWeekMonday, weeklyMinutes } from "@/lib/progress";
import { loadPhasesWithTree, loadPreferences, requireUser } from "@/lib/queries";
import { WEEKLY_GOAL_MIN, type Resource } from "@/lib/types";

export default async function StudyPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const { itemId } = await params;
  const { supabase } = await requireUser();
  const phases = await loadPhasesWithTree();
  const prefs = await loadPreferences();

  let phaseId = "";
  let item = null as null | {
    id: string;
    title: string;
    status: string;
    kind: string;
    estimated_minutes: number | null;
    notes: string | null;
  };
  for (const phase of phases) {
    for (const section of phase.sections) {
      const found = section.items.find((i) => i.id === itemId);
      if (found) {
        phaseId = phase.id;
        item = found;
      }
    }
  }
  if (!item || !phaseId) notFound();

  const [{ data: resources }, { data: criteria }, { data: evidence }, { data: logs }] =
    await Promise.all([
      supabase.from("resources").select("*").eq("phase_id", phaseId).order("sort_order"),
      supabase
        .from("achievement_criteria")
        .select("*")
        .eq("item_id", itemId)
        .order("sort_order"),
      supabase
        .from("evidence")
        .select("*")
        .eq("item_id", itemId)
        .order("created_at", { ascending: false }),
      supabase
        .from("time_logs")
        .select("id, logged_on, minutes, started_at, ended_at"),
    ]);

  const allRes = (resources ?? []) as Resource[];
  const itemLinked = allRes.filter((r) => r.item_id === itemId);
  const shown = itemLinked.length > 0 ? itemLinked : allRes.filter((r) => !r.item_id);
  const weekStart = startOfWeekMonday(new Date());
  const open = (logs ?? []).find((l) => l.started_at && !l.ended_at) ?? null;
  const activePhase = phases.find((p) => p.status === "active");

  return (
    <AppShell
      brand={prefs?.path_title ?? "AI Path"}
      sidebar={<PhaseNavigator phases={phases} activePhaseId={phaseId} />}
      rail={
        <div className="space-y-8">
          <StudySessionPanel
            phaseId={phaseId}
            itemId={itemId}
            openSession={
              open?.started_at
                ? { id: open.id as string, started_at: open.started_at as string }
                : null
            }
            suggestedMinutes={item.estimated_minutes ?? 45}
            weekMinutes={weeklyMinutes(logs ?? [], weekStart)}
            weekGoalMin={prefs?.weekly_goal_min_minutes ?? WEEKLY_GOAL_MIN}
            activeDays={activeDaysThisWeek(logs ?? [], weekStart)}
          />
          <CapturePanel itemId={itemId} phaseId={phaseId} />
        </div>
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="text-sm font-bold text-muted hover:text-ink">
          ← Study command
        </Link>
        <div className="flex flex-wrap gap-2">
          <form action={pinStudyItemAction.bind(null, itemId)}>
            <button type="submit" className="scc-btn scc-btn-secondary">
              Pin as study next
            </button>
          </form>
          <Link href="/" className="scc-btn scc-btn-secondary">
            Study another topic
          </Link>
        </div>
      </div>

      <header className="mt-6">
        <p className="text-xs font-bold tracking-wide text-muted uppercase">Topic workspace</p>
        <h1 className="font-display mt-1 text-3xl font-bold">{item.title}</h1>
        <p className="mt-2 text-sm text-muted">
          {item.kind} · {item.status}
          {item.estimated_minutes ? ` · ~${item.estimated_minutes} min` : ""}
          {activePhase ? ` · ${activePhase.title}` : ""}
        </p>
      </header>

      <div className="mt-8 grid gap-8">
        <section className="scc-card p-5">
          <h2 className="font-display text-lg font-bold">Learn</h2>
          <p className="mt-2 text-sm text-muted">
            Review the purpose and work through the linked resources. Resource completion is not
            achievement by itself.
          </p>
          <div className="mt-4">
            <ResourceList
              resources={shown}
              phaseId={phaseId}
              itemId={itemId}
              editable
            />
          </div>
        </section>

        <section className="scc-card p-5">
          <h2 className="font-display text-lg font-bold">Practice</h2>
          <p className="mt-2 text-sm text-muted">
            Apply the topic in exercises or the phase project. Capture results as evidence below.
          </p>
          {item.notes ? (
            <div className="mt-3 rounded-xl border border-line bg-rail p-3 text-sm whitespace-pre-wrap">
              {item.notes}
            </div>
          ) : null}
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="scc-card p-5">
            <h2 className="font-display text-lg font-bold">Reflect</h2>
            <p className="mt-2 mb-4 text-sm text-muted">
              Check outcomes and keep notes while the session is fresh.
            </p>
            <AchievementChecklist
              criteria={criteria ?? []}
              itemId={itemId}
              phaseId={phaseId}
              itemStatus={item.status}
            />
          </section>
          <section className="scc-card p-5">
            <h2 className="font-display text-lg font-bold">Evidence</h2>
            <ul className="mt-3 space-y-3">
              {(evidence ?? []).length === 0 ? (
                <li className="text-sm text-muted">No evidence yet.</li>
              ) : (
                (evidence ?? []).map((e) => (
                  <li key={e.id as string} className="border-b border-line pb-3 text-sm">
                    <span className="scc-tag">{e.kind as string}</span>
                    <p className="mt-2 font-bold">{(e.label as string | null) ?? "Untitled"}</p>
                    <p className="text-muted break-all">{e.content as string}</p>
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
