import Link from "next/link";
import { activatePhaseAction } from "@/app/actions";
import type { StudyNextState } from "@/lib/study-next";

export function StudyNextCard({
  state,
  achievedCriteria = 0,
  totalCriteria = 0,
}: {
  state: StudyNextState;
  achievedCriteria?: number;
  totalCriteria?: number;
}) {
  if (state.type === "empty") {
    return (
      <article className="scc-card p-7">
        <p className="text-sm font-bold text-muted">No learning path yet</p>
        <h2 className="font-display mt-2 text-2xl font-bold">Build your path</h2>
        <p className="mt-2 text-sm text-muted">
          Start with the guided builder or load the default AI Engineer curriculum.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/plan" className="scc-btn scc-btn-primary">
            Open path builder
          </Link>
        </div>
      </article>
    );
  }

  if (state.type === "phase_transition") {
    return (
      <article className="scc-card p-7">
        <span className="scc-tag scc-tag-current">Phase complete</span>
        <h2 className="font-display mt-3 text-2xl font-bold">
          Start {state.nextPhase.title.replace(/^Months \d+[–-]\d+:\s*/, "")}?
        </h2>
        <p className="mt-2 text-sm text-muted">
          {state.completedPhase.id === state.nextPhase.id
            ? "Activate your first phase to begin studying."
            : `${state.completedPhase.title} is complete. Confirm to activate the next phase.`}
        </p>
        <form action={activatePhaseAction.bind(null, state.nextPhase.id)} className="mt-5">
          <button type="submit" className="scc-btn scc-btn-primary">
            Start next phase
          </button>
        </form>
      </article>
    );
  }

  if (state.type === "path_complete") {
    return (
      <article className="scc-card p-7">
        <span className="scc-tag scc-tag-current">Path complete</span>
        <h2 className="font-display mt-3 text-2xl font-bold">You finished the sequential path</h2>
        <p className="mt-2 text-sm text-muted">
          Review progress, keep applying, or extend the plan with specialization work.
        </p>
        <Link href="/progress" className="scc-btn scc-btn-secondary mt-5 inline-flex">
          Review progress
        </Link>
      </article>
    );
  }

  const pct =
    totalCriteria === 0 ? 0 : Math.round((achievedCriteria / totalCriteria) * 100);

  return (
    <article className="scc-card p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="scc-tag scc-tag-current">Up next</span>
          <h2 className="font-display mt-3 text-2xl font-bold">{state.item.title}</h2>
          <div className="mt-2 flex flex-wrap gap-3 text-xs font-semibold text-muted">
            <span>{state.phase.title.replace(/^Months \d+[–-]\d+:\s*/, "")}</span>
            {state.item.estimated_minutes ? (
              <span>{state.item.estimated_minutes} min focus</span>
            ) : null}
            {totalCriteria > 0 ? (
              <span>
                {achievedCriteria} of {totalCriteria} outcomes
              </span>
            ) : null}
          </div>
        </div>
        <div className="text-right">
          <strong className="block text-2xl">{pct}%</strong>
          <span className="text-xs text-muted">topic progress</span>
        </div>
      </div>
      <div className="scc-progress mt-4" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Topic progress">
        <span style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href={`/study/${state.item.id}`} className="scc-btn scc-btn-primary">
          Continue studying
        </Link>
        <Link href={`/phase/${state.phase.id}`} className="scc-btn scc-btn-secondary">
          View phase
        </Link>
      </div>
    </article>
  );
}
