import { createEvidenceAction } from "@/app/actions";

export function CapturePanel({
  itemId,
  phaseId,
}: {
  itemId: string;
  phaseId: string;
}) {
  return (
    <section className="space-y-3">
      <h3 className="font-display text-lg font-bold">Capture while it is fresh</h3>
      <form action={createEvidenceAction.bind(null, itemId, phaseId)} className="space-y-3">
        <input type="hidden" name="kind" value="note" />
        <label className="block text-xs font-bold">
          Study note
          <textarea
            className="scc-textarea mt-1 min-h-[82px]"
            name="content"
            placeholder="What clicked? What is still unclear?"
            required
          />
        </label>
        <button type="submit" className="scc-btn scc-btn-secondary w-full">
          Add note
        </button>
      </form>
      <form action={createEvidenceAction.bind(null, itemId, phaseId)} className="space-y-3">
        <input type="hidden" name="kind" value="link" />
        <label className="block text-xs font-bold">
          Evidence URL
          <input
            className="scc-input mt-1"
            name="content"
            type="url"
            placeholder="https://…"
            required
          />
        </label>
        <label className="block text-xs font-bold">
          Label
          <input className="scc-input mt-1" name="label" placeholder="Eval report, repo, demo" />
        </label>
        <button type="submit" className="scc-btn scc-btn-secondary w-full">
          Attach evidence
        </button>
      </form>
    </section>
  );
}
