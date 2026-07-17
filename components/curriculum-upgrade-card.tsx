import { upgradeCurriculumFormAction } from "@/app/actions";

export function CurriculumUpgradeCard({
  needsUpgrade,
}: {
  needsUpgrade: boolean;
}) {
  if (!needsUpgrade) return null;

  return (
    <form action={upgradeCurriculumFormAction} className="scc-card mb-6 space-y-3 p-5">
      <h2 className="font-display text-xl font-bold">Update to AI Engineer curriculum</h2>
      <p className="text-sm text-muted">
        Your path is missing curated phases, resources, or achievement criteria. This upgrade
        fills gaps and preserves personal progress — it does not wipe your history.
      </p>
      <button type="submit" className="scc-btn scc-btn-primary">
        Upgrade curriculum
      </button>
    </form>
  );
}
