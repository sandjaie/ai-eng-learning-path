import Link from "next/link";
import {
  createCriterionAction,
  createItemAction,
  createPhase,
  createResourceAction,
  createSection,
  deleteCriterionAction,
  deleteItem,
  deletePhase,
  deleteResourceAction,
  deleteSection,
  duplicatePhaseAction,
  moveItem,
  movePhaseAction,
  moveSection,
  renameSection,
  updateCriterionAction,
  updateItemAction,
  updatePhase,
  updateResourceAction,
  updateSectionKind,
} from "@/app/actions";
import type { AchievementCriterion, Phase, Resource } from "@/lib/types";

export function PlanEditor({
  phases,
  selectedPhaseId,
  resources,
  criteriaByItem,
}: {
  phases: Phase[];
  selectedPhaseId?: string;
  resources: Resource[];
  criteriaByItem: Record<string, AchievementCriterion[]>;
}) {
  const selected =
    phases.find((p) => p.id === selectedPhaseId) ?? phases[0] ?? null;
  const phaseResources = selected
    ? resources.filter((r) => r.phase_id === selected.id)
    : [];
  const phaseItems = selected
    ? selected.sections.flatMap((s) => s.items.map((item) => ({ item, sectionId: s.id })))
    : [];

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="scc-card p-4">
        <h2 className="font-display text-lg font-bold">Phases</h2>
        <ul className="mt-3 space-y-1">
          {phases.map((phase) => (
            <li key={phase.id} className="rounded-lg border border-transparent">
              <div
                className={`rounded-lg px-2 py-2 ${
                  selected?.id === phase.id ? "bg-teal-soft" : "hover:bg-rail"
                }`}
              >
                <Link
                  href={`/plan?phase=${phase.id}`}
                  className={`block text-sm ${selected?.id === phase.id ? "text-teal" : ""}`}
                >
                  <strong className="block text-ink">{phase.title}</strong>
                  <span className="text-xs text-muted">{phase.status}</span>
                </Link>
                <div className="mt-2 flex flex-wrap gap-1">
                  <form action={movePhaseAction.bind(null, phase.id, -1)}>
                    <button type="submit" className="scc-btn scc-btn-secondary min-h-11 px-2 text-xs">
                      Up
                    </button>
                  </form>
                  <form action={movePhaseAction.bind(null, phase.id, 1)}>
                    <button type="submit" className="scc-btn scc-btn-secondary min-h-11 px-2 text-xs">
                      Down
                    </button>
                  </form>
                  <form action={duplicatePhaseAction.bind(null, phase.id)}>
                    <button type="submit" className="scc-btn scc-btn-secondary min-h-11 px-2 text-xs">
                      Duplicate
                    </button>
                  </form>
                </div>
              </div>
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
              <ul className="space-y-4">
                {section.items.map((item) => (
                  <li key={item.id} className="rounded-lg border border-line p-3">
                    <form
                      action={updateItemAction.bind(null, item.id, selected.id)}
                      className="space-y-2"
                    >
                      <label className="block text-xs font-bold">
                        Title
                        <input
                          className="scc-input mt-1"
                          name="title"
                          defaultValue={item.title}
                          required
                        />
                      </label>
                      <div className="grid gap-2 sm:grid-cols-3">
                        <label className="block text-xs font-bold">
                          Kind
                          <select className="scc-input mt-1" name="kind" defaultValue={item.kind}>
                            <option value="topic">topic</option>
                            <option value="project_task">project_task</option>
                            <option value="milestone">milestone</option>
                          </select>
                        </label>
                        <label className="block text-xs font-bold">
                          Est. minutes
                          <input
                            className="scc-input mt-1"
                            name="estimated_minutes"
                            type="number"
                            min={1}
                            defaultValue={item.estimated_minutes ?? ""}
                          />
                        </label>
                        <label className="block text-xs font-bold">
                          URL
                          <input
                            className="scc-input mt-1"
                            name="url"
                            type="url"
                            defaultValue={item.url ?? ""}
                          />
                        </label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button type="submit" className="scc-btn scc-btn-secondary min-h-11 px-3 text-xs">
                          Save item
                        </button>
                        <Link
                          href={`/study/${item.id}`}
                          className="scc-btn scc-btn-secondary min-h-11 px-3 text-xs"
                        >
                          Open study
                        </Link>
                      </div>
                    </form>
                    <div className="mt-2 flex flex-wrap gap-2">
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
                    <div className="mt-3 space-y-2 border-t border-line pt-3">
                      <p className="text-xs font-bold tracking-wide text-muted uppercase">
                        Criteria
                      </p>
                      {(criteriaByItem[item.id] ?? []).map((c) => (
                        <div key={c.id} className="flex flex-wrap items-end gap-2">
                          <form
                            action={updateCriterionAction.bind(null, c.id, item.id, selected.id)}
                            className="flex min-w-[220px] flex-1 flex-wrap items-end gap-2"
                          >
                            <label className="block min-w-[180px] flex-1 text-xs font-bold">
                              Description
                              <input
                                className="scc-input mt-1"
                                name="description"
                                defaultValue={c.description}
                                required
                              />
                            </label>
                            <label className="flex items-center gap-2 pb-2 text-xs font-bold">
                              <input
                                type="checkbox"
                                name="is_required"
                                defaultChecked={c.is_required}
                              />
                              Required
                            </label>
                            <button type="submit" className="scc-btn scc-btn-secondary min-h-11 px-3 text-xs">
                              Save
                            </button>
                          </form>
                          <form action={deleteCriterionAction.bind(null, c.id, item.id, selected.id)}>
                            <button type="submit" className="scc-btn scc-btn-secondary min-h-11 px-3 text-xs">
                              Delete
                            </button>
                          </form>
                        </div>
                      ))}
                      <form
                        action={createCriterionAction.bind(null, item.id, selected.id)}
                        className="flex flex-wrap gap-2"
                      >
                        <input type="hidden" name="return_to" value={`/plan?phase=${selected.id}`} />
                        <input
                          className="scc-input min-w-[200px] flex-1"
                          name="description"
                          placeholder="New criterion"
                          required
                        />
                        <button type="submit" className="scc-btn scc-btn-secondary">
                          Add criterion
                        </button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
              <form
                action={createItemAction.bind(null, section.id, selected.id)}
                className="grid gap-2 sm:grid-cols-[1fr_140px_120px_auto]"
              >
                <input className="scc-input" name="title" placeholder="New item title" required />
                <select className="scc-input" name="kind" defaultValue="topic">
                  <option value="topic">topic</option>
                  <option value="project_task">project_task</option>
                  <option value="milestone">milestone</option>
                </select>
                <input
                  className="scc-input"
                  name="estimated_minutes"
                  type="number"
                  min={1}
                  placeholder="minutes"
                />
                <button type="submit" className="scc-btn scc-btn-secondary">
                  Add item
                </button>
              </form>
            </div>
          ))}

          <div className="scc-card space-y-4 p-5">
            <h3 className="font-display text-lg font-bold">Phase resources</h3>
            {phaseResources.length === 0 ? (
              <p className="text-sm text-muted">No resources yet.</p>
            ) : (
              <ul className="space-y-4">
                {phaseResources.map((r) => (
                  <li key={r.id} className="rounded-lg border border-line p-3">
                    <form
                      action={updateResourceAction.bind(null, r.id, selected.id)}
                      className="space-y-2"
                    >
                      <label className="block text-xs font-bold">
                        Title
                        <input className="scc-input mt-1" name="title" defaultValue={r.title} required />
                      </label>
                      <label className="block text-xs font-bold">
                        URL
                        <input className="scc-input mt-1" name="url" type="url" defaultValue={r.url} required />
                      </label>
                      <div className="grid gap-2 sm:grid-cols-3">
                        <label className="block text-xs font-bold">
                          Priority
                          <select className="scc-input mt-1" name="priority" defaultValue={r.priority}>
                            <option value="primary">Primary</option>
                            <option value="selective">Selective</option>
                            <option value="optional">Optional</option>
                          </select>
                        </label>
                        <label className="block text-xs font-bold">
                          Type
                          <select
                            className="scc-input mt-1"
                            name="resource_type"
                            defaultValue={r.resource_type}
                          >
                            <option value="course">Course</option>
                            <option value="article">Article</option>
                            <option value="video">Video</option>
                            <option value="documentation">Documentation</option>
                            <option value="book">Book</option>
                            <option value="repository">Repository</option>
                            <option value="other">Other</option>
                          </select>
                        </label>
                        <label className="block text-xs font-bold">
                          Est. minutes
                          <input
                            className="scc-input mt-1"
                            name="estimated_minutes"
                            type="number"
                            defaultValue={r.estimated_minutes ?? ""}
                          />
                        </label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button type="submit" className="scc-btn scc-btn-secondary min-h-11 px-3 text-xs">
                          Save resource
                        </button>
                      </div>
                    </form>
                    <form action={deleteResourceAction.bind(null, r.id, selected.id, null)} className="mt-2">
                      <button type="submit" className="scc-btn scc-btn-secondary min-h-11 px-3 text-xs">
                        Delete resource
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
            <form action={createResourceAction.bind(null, selected.id)} className="space-y-2 border-t border-line pt-4">
              <input type="hidden" name="return_to" value={`/plan?phase=${selected.id}`} />
              <h4 className="text-sm font-bold">Add resource</h4>
              {phaseItems.length > 0 ? (
                <label className="block text-xs font-bold">
                  Attach to item (optional)
                  <select className="scc-input mt-1" name="item_id" defaultValue="">
                    <option value="">Phase-level</option>
                    {phaseItems.map(({ item }) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}
              <input className="scc-input" name="title" placeholder="Title" required />
              <input className="scc-input" name="url" type="url" placeholder="https://…" required />
              <button type="submit" className="scc-btn scc-btn-secondary">
                Add resource
              </button>
            </form>
          </div>

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
