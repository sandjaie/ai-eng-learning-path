import {
  createCriterionAction,
  markItemAchievedAction,
  toggleCriterionAction,
} from "@/app/actions";
import type { AchievementCriterion } from "@/lib/types";

export function AchievementChecklist({
  criteria,
  itemId,
  phaseId,
  itemStatus,
}: {
  criteria: AchievementCriterion[];
  itemId: string;
  phaseId: string;
  itemStatus: string;
}) {
  const required = criteria.filter((c) => c.is_required);
  const allRequiredDone =
    required.length > 0 && required.every((c) => c.achieved_at != null);

  return (
    <section className="scc-check-panel rounded-[14px] p-5">
      <p className="text-xs font-bold tracking-wide text-muted uppercase">Achievement check</p>
      <h3 className="font-display mt-1 text-lg font-bold text-ink">You are done when you can…</h3>
      {criteria.length === 0 ? (
        <p className="mt-4 text-sm">
          No required criteria — mark achieved when you can demonstrate the outcome.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {criteria.map((c) => (
            <li key={c.id} className="flex items-start gap-2 text-sm leading-snug">
              <form action={toggleCriterionAction.bind(null, c.id, itemId, phaseId, !c.achieved_at)}>
                <button
                  type="submit"
                  className="mt-0.5 grid h-11 w-11 place-items-center rounded-lg border border-line bg-card text-sm font-black"
                  aria-pressed={c.achieved_at != null}
                  aria-label={c.achieved_at ? `Uncheck: ${c.description}` : `Achieve: ${c.description}`}
                >
                  {c.achieved_at ? "✓" : ""}
                </button>
              </form>
              <span className="pt-2.5">
                {c.description}
                {!c.is_required ? (
                  <span className="ml-2 text-xs font-bold text-muted">optional</span>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      )}
      {required.length > 0 && allRequiredDone ? (
        <p className="mt-3 text-sm font-bold" aria-live="polite">
          Required outcomes met.
        </p>
      ) : null}
      {/* No required criteria (empty or optional-only): allow explicit completion. */}
      {required.length === 0 ? (
        itemStatus !== "done" ? (
          <form action={markItemAchievedAction.bind(null, itemId, phaseId)} className="mt-4">
            <button type="submit" className="scc-btn scc-btn-secondary w-full">
              Mark achieved
            </button>
          </form>
        ) : (
          <p className="mt-4 text-sm font-bold">Achieved</p>
        )
      ) : null}
      <form action={createCriterionAction.bind(null, itemId, phaseId)} className="mt-4 space-y-2">
        <label className="block text-xs font-bold">
          Add criterion
          <input className="scc-input mt-1" name="description" required />
        </label>
        <button type="submit" className="scc-btn scc-btn-secondary w-full">
          Add criterion
        </button>
      </form>
    </section>
  );
}
