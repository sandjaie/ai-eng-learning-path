import Link from "next/link";
import { trackableProgress } from "@/lib/progress";
import type { Evidence, Phase } from "@/lib/types";

export function ProgressReview({
  phases,
  weekMinutes,
  weekGoalMin,
  weekGoalMax,
  recentEvidence,
}: {
  phases: Phase[];
  weekMinutes: number;
  weekGoalMin: number;
  weekGoalMax: number;
  recentEvidence: (Evidence & { item_title: string })[];
}) {
  const allItems = phases.flatMap((p) => p.sections.flatMap((s) => s.items));
  const overall = trackableProgress(allItems);
  const active = allItems.filter((i) => i.status === "in_progress");
  const done = allItems.filter((i) => i.status === "done" && i.kind !== "reference");
  const studiedWithoutOutcome = allItems.filter(
    (i) => i.kind !== "reference" && i.status === "in_progress" && !i.completed_at,
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold">Progress review</h1>
        <p className="mt-2 text-sm text-muted">
          Outcomes, study time, and evidence — not the default landing page.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="scc-card p-5">
          <p className="text-xs font-bold text-muted uppercase">Path progress</p>
          <p className="mt-2 text-3xl font-bold">{overall.pct}%</p>
          <p className="text-sm text-muted">
            {overall.done} of {overall.total} trackable items
          </p>
        </div>
        <div className="scc-card p-5">
          <p className="text-xs font-bold text-muted uppercase">This week</p>
          <p className="mt-2 text-3xl font-bold">
            {Math.round((weekMinutes / 60) * 10) / 10}h
          </p>
          <p className="text-sm text-muted">
            Goal {Math.round(weekGoalMin / 60)}–{Math.round(weekGoalMax / 60)}h
          </p>
        </div>
        <div className="scc-card p-5">
          <p className="text-xs font-bold text-muted uppercase">Active topics</p>
          <p className="mt-2 text-3xl font-bold">{active.length}</p>
          <p className="text-sm text-muted">{done.length} completed</p>
        </div>
      </section>

      <section className="scc-card p-5">
        <h2 className="font-display text-xl font-bold">Achieved outcomes by phase</h2>
        <ul className="mt-4 space-y-3">
          {phases.map((phase) => {
            const p = trackableProgress(phase.sections.flatMap((s) => s.items));
            return (
              <li key={phase.id} className="flex flex-wrap items-center justify-between gap-2">
                <Link href={`/phase/${phase.id}`} className="font-bold hover:underline">
                  {phase.title}
                </Link>
                <span className="text-sm text-muted">
                  {p.done}/{p.total} ({p.pct}%)
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="scc-card p-5">
        <h2 className="font-display text-xl font-bold">Study activity without achieved outcome</h2>
        {studiedWithoutOutcome.length === 0 ? (
          <p className="mt-2 text-sm text-muted">None right now.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {studiedWithoutOutcome.map((item) => (
              <li key={item.id}>
                <Link href={`/study/${item.id}`} className="text-sm font-bold hover:underline">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="scc-card p-5">
        <h2 className="font-display text-xl font-bold">Recent notes and evidence</h2>
        {recentEvidence.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No evidence captured yet.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {recentEvidence.map((e) => (
              <li key={e.id} className="border-b border-line pb-3 text-sm last:border-0">
                <p className="font-bold">{e.item_title}</p>
                <p className="text-muted">
                  {e.kind}: {e.label ?? e.content.slice(0, 120)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
