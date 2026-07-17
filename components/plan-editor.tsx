import Link from "next/link";
import {
  createItem,
  createPhase,
  createSection,
  deleteItem,
  deletePhase,
  deleteSection,
  moveItem,
  moveSection,
  renameSection,
  updatePhase,
  updateSectionKind,
} from "@/app/actions";
import type { Phase } from "@/lib/types";

export function PlanEditor({
  phases,
  selectedPhaseId,
}: {
  phases: Phase[];
  selectedPhaseId?: string;
}) {
  const selected =
    phases.find((p) => p.id === selectedPhaseId) ?? phases[0] ?? null;

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="scc-card p-4">
        <h2 className="font-display text-lg font-bold">Phases</h2>
        <ul className="mt-3 space-y-1">
          {phases.map((phase) => (
            <li key={phase.id}>
              <Link
                href={`/plan?phase=${phase.id}`}
                className={`block rounded-lg px-3 py-2 text-sm ${
                  selected?.id === phase.id ? "bg-teal-soft text-teal" : "hover:bg-rail"
                }`}
              >
                <strong className="block">{phase.title}</strong>
                <span className="text-xs text-muted">{phase.status}</span>
              </Link>
            </li>
          ))}
        </ul>
        <form action={createPhase} className="mt-4 space-y-2 border-t border-line pt-4">
          <label className="block text-xs font-bold">
            New phase title
            <input className="scc-input mt-1" name="title" required />
          </label>
          <button type="submit" className="scc-btn scc-btn-secondary w-full">
            Add phase
          </button>
        </form>
      </aside>

      {selected ? (
        <section className="space-y-6">
          <form action={updatePhase.bind(null, selected.id)} className="scc-card space-y-3 p-5">
            <h2 className="font-display text-xl font-bold">Phase details</h2>
            <label className="block text-sm font-bold">
              Title
              <input className="scc-input mt-1" name="title" defaultValue={selected.title} required />
            </label>
            <label className="block text-sm font-bold">
              Description
              <textarea
                className="scc-textarea mt-1"
                name="description"
                defaultValue={selected.description ?? ""}
                rows={3}
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm font-bold">
                Target start
                <input
                  className="scc-input mt-1"
                  type="date"
                  name="target_start"
                  defaultValue={selected.target_start ?? ""}
                />
              </label>
              <label className="block text-sm font-bold">
                Target end
                <input
                  className="scc-input mt-1"
                  type="date"
                  name="target_end"
                  defaultValue={selected.target_end ?? ""}
                />
              </label>
            </div>
            <button type="submit" className="scc-btn scc-btn-primary">
              Save phase
            </button>
          </form>
          <form action={deletePhase.bind(null, selected.id)}>
            <button type="submit" className="scc-btn scc-btn-secondary">
              Delete {selected.title}
            </button>
          </form>

          {selected.sections.map((section) => (
            <div key={section.id} className="scc-card space-y-3 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-lg font-bold">{section.title}</h3>
                <div className="flex flex-wrap gap-2">
                  <form action={moveSection.bind(null, section.id, selected.id, -1)}>
                    <button type="submit" className="scc-btn scc-btn-secondary min-h-11 px-3">
                      Up
                    </button>
                  </form>
                  <form action={moveSection.bind(null, section.id, selected.id, 1)}>
                    <button type="submit" className="scc-btn scc-btn-secondary min-h-11 px-3">
                      Down
                    </button>
                  </form>
                  <form action={deleteSection.bind(null, section.id, selected.id)}>
                    <button type="submit" className="scc-btn scc-btn-secondary min-h-11 px-3">
                      Delete section
                    </button>
                  </form>
                </div>
              </div>
              <form
                action={async (fd) => {
                  "use server";
                  await renameSection(section.id, selected.id, String(fd.get("title") ?? ""));
                  await updateSectionKind(
                    section.id,
                    selected.id,
                    String(fd.get("kind") ?? "custom") as never,
                  );
                }}
                className="grid gap-2 sm:grid-cols-[1fr_160px_auto]"
              >
                <input className="scc-input" name="title" defaultValue={section.title} />
                <select className="scc-input" name="kind" defaultValue={section.kind}>
                  <option value="topics">topics</option>
                  <option value="projects">projects</option>
                  <option value="outcomes">outcomes</option>
                  <option value="resources">resources</option>
                  <option value="custom">custom</option>
                </select>
                <button type="submit" className="scc-btn scc-btn-secondary">
                  Update
                </button>
              </form>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line px-3 py-2 text-sm"
                  >
                    <div>
                      <Link href={`/study/${item.id}`} className="font-bold hover:underline">
                        {item.title}
                      </Link>
                      <span className="ml-2 text-xs text-muted">
                        {item.kind} · {item.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <form action={moveItem.bind(null, item.id, section.id, selected.id, -1)}>
                        <button type="submit" className="scc-btn scc-btn-secondary min-h-11 px-3 text-xs">
                          Up
                        </button>
                      </form>
                      <form action={moveItem.bind(null, item.id, section.id, selected.id, 1)}>
                        <button type="submit" className="scc-btn scc-btn-secondary min-h-11 px-3 text-xs">
                          Down
                        </button>
                      </form>
                      <form action={deleteItem.bind(null, item.id, selected.id)}>
                        <button type="submit" className="scc-btn scc-btn-secondary min-h-11 px-3 text-xs">
                          Delete
                        </button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
              <form action={createItem.bind(null, section.id, selected.id)} className="flex flex-wrap gap-2">
                <input className="scc-input min-w-[200px] flex-1" name="title" placeholder="New item title" required />
                <button type="submit" className="scc-btn scc-btn-secondary">
                  Add item
                </button>
              </form>
            </div>
          ))}

          <form action={createSection.bind(null, selected.id)} className="scc-card space-y-3 p-5">
            <h3 className="font-display text-lg font-bold">Add section</h3>
            <input className="scc-input" name="title" placeholder="Section title" required />
            <button type="submit" className="scc-btn scc-btn-secondary">
              Add section
            </button>
          </form>
        </section>
      ) : null}
    </div>
  );
}
