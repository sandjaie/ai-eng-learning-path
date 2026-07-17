import {
  createResourceAction,
  deleteResourceAction,
  updateResourceStatusAction,
} from "@/app/actions";
import type { Resource } from "@/lib/types";

export function ResourceList({
  resources,
  phaseId,
  itemId,
  editable = false,
}: {
  resources: Resource[];
  phaseId: string;
  itemId?: string;
  editable?: boolean;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h3 className="font-display text-lg font-bold">Resources for this topic</h3>
        <p className="text-sm text-muted">Use these in order, or add your own source.</p>
      </div>
      {resources.length === 0 ? (
        <p className="text-sm text-muted">No resources yet. Add one to keep study materials handy.</p>
      ) : (
        <ul className="space-y-2">
          {resources.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-card px-3 py-3"
            >
              <a
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="min-w-0 flex-1"
              >
                <strong className="block text-sm">{r.title}</strong>
                <span className="text-xs text-muted">
                  {[r.provider, r.resource_type, r.priority].filter(Boolean).join(" · ")}
                </span>
              </a>
              <span className="scc-tag">{r.status}</span>
              <form
                action={updateResourceStatusAction.bind(
                  null,
                  r.id,
                  phaseId,
                  r.status === "planned" ? "using" : r.status === "using" ? "completed" : "planned",
                  itemId,
                )}
              >
                <button type="submit" className="scc-btn scc-btn-secondary min-h-11 px-3 text-xs">
                  {r.status === "planned" ? "Start" : r.status === "using" ? "Complete" : "Reset"}
                </button>
              </form>
              {editable ? (
                <form action={deleteResourceAction.bind(null, r.id, phaseId, itemId)}>
                  <button type="submit" className="scc-btn scc-btn-secondary min-h-11 px-3 text-xs">
                    Delete
                  </button>
                </form>
              ) : null}
            </li>
          ))}
        </ul>
      )}
      {editable ? (
        <form action={createResourceAction.bind(null, phaseId)} className="scc-card space-y-3 p-4">
          <h4 className="text-sm font-bold">Add a resource</h4>
          {itemId ? <input type="hidden" name="item_id" value={itemId} /> : null}
          <label className="block text-xs font-bold">
            Title
            <input className="scc-input mt-1" name="title" required />
          </label>
          <label className="block text-xs font-bold">
            HTTPS URL
            <input className="scc-input mt-1" name="url" type="url" required />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs font-bold">
              Priority
              <select className="scc-input mt-1" name="priority" defaultValue="primary">
                <option value="primary">Primary</option>
                <option value="selective">Selective</option>
                <option value="optional">Optional</option>
              </select>
            </label>
            <label className="block text-xs font-bold">
              Type
              <select className="scc-input mt-1" name="resource_type" defaultValue="other">
                <option value="course">Course</option>
                <option value="article">Article</option>
                <option value="video">Video</option>
                <option value="documentation">Documentation</option>
                <option value="book">Book</option>
                <option value="repository">Repository</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>
          <button type="submit" className="scc-btn scc-btn-secondary">
            Add resource
          </button>
        </form>
      ) : null}
    </section>
  );
}
