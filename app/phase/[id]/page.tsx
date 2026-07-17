import Link from "next/link";
import { notFound } from "next/navigation";
import { activatePhaseAction } from "@/app/actions";
import { AppShell } from "@/components/app-shell";
import { PhaseNavigator } from "@/components/phase-navigator";
import { trackableProgress } from "@/lib/progress";
import { loadPhasesWithTree, loadPreferences, requireUser } from "@/lib/queries";
import { selectStudyNext } from "@/lib/study-next";
import type { SectionKind } from "@/lib/types";

const KIND_LABEL: Record<SectionKind, string> = {
  topics: "Topics to learn",
  projects: "Projects and practice",
  outcomes: "Exit outcomes",
  resources: "Phase resources",
  custom: "Additional work",
};

export default async function PhasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireUser();
  const phases = await loadPhasesWithTree();
  const prefs = await loadPreferences();
  const phase = phases.find((p) => p.id === id);
  if (!phase) notFound();

  const progress = trackableProgress(phase.sections.flatMap((s) => s.items));
  const studyNext = selectStudyNext(phases, prefs?.pinned_item_id ?? null);
  const continueHref =
    studyNext.type === "item" && studyNext.phase.id === phase.id
      ? `/study/${studyNext.item.id}`
      : phase.sections.flatMap((s) => s.items).find((i) => i.status !== "done" && i.kind !== "reference")
        ? `/study/${phase.sections.flatMap((s) => s.items).find((i) => i.status !== "done" && i.kind !== "reference")!.id}`
        : "/";

  const { data: resources } = await supabase
    .from("resources")
    .select("id, title, url, priority, status")
    .eq("phase_id", id)
    .order("sort_order");

  const itemIds = phase.sections.flatMap((s) => s.items.map((i) => i.id));
  const { data: evidence } =
    itemIds.length === 0
      ? { data: [] as { id: string; content: string; label: string | null; kind: string }[] }
      : await supabase
          .from("evidence")
          .select("id, content, label, kind")
          .in("item_id", itemIds)
          .order("created_at", { ascending: false })
          .limit(10);

  const grouped = (["topics", "projects", "outcomes", "custom", "resources"] as SectionKind[])
    .map((kind) => ({
      kind,
      sections: phase.sections.filter((s) => s.kind === kind),
    }))
    .filter((g) => g.sections.length > 0);

  return (
    <AppShell
      brand={prefs?.path_title ?? "AI Path"}
      sidebar={<PhaseNavigator phases={phases} activePhaseId={phase.id} />}
    >
      <div className="mb-4 flex flex-wrap gap-3">
        <Link href="/" className="text-sm font-bold text-muted hover:text-ink">
          ← Study command
        </Link>
      </div>

      <header className="scc-card p-6">
        <p className="text-xs font-bold tracking-wide text-muted uppercase">{phase.status}</p>
        <h1 className="font-display mt-1 text-3xl font-bold">{phase.title}</h1>
        {phase.description ? (
          <p className="mt-3 max-w-2xl text-sm text-muted">{phase.description}</p>
        ) : null}
        <div className="mt-4">
          <div
            className="scc-progress"
            role="progressbar"
            aria-valuenow={progress.pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Phase progress"
          >
            <span style={{ width: `${progress.pct}%` }} />
          </div>
          <p className="mt-2 text-sm text-muted">
            {progress.done} of {progress.total} trackable items ({progress.pct}%)
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href={continueHref} className="scc-btn scc-btn-primary">
            Continue phase
          </Link>
          <Link href={`/plan?phase=${phase.id}`} className="scc-btn scc-btn-secondary">
            Edit phase plan
          </Link>
          {phase.status === "planned" ? (
            <form action={activatePhaseAction.bind(null, phase.id)}>
              <button type="submit" className="scc-btn scc-btn-secondary">
                Start this phase
              </button>
            </form>
          ) : null}
        </div>
      </header>

      <div className="mt-8 space-y-6">
        {grouped.map(({ kind, sections }) => (
          <section key={kind} className="scc-card p-5">
            <h2 className="font-display text-xl font-bold">{KIND_LABEL[kind]}</h2>
            {sections.map((section) => (
              <div key={section.id} className="mt-4">
                {sections.length > 1 ? (
                  <h3 className="text-sm font-bold text-muted">{section.title}</h3>
                ) : null}
                <ul className="mt-2 space-y-2">
                  {section.items.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/study/${item.id}`}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line px-3 py-2 text-sm hover:bg-rail"
                      >
                        <span className="font-bold">{item.title}</span>
                        <span className="scc-tag">{item.status}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        ))}

        <section className="scc-card p-5">
          <h2 className="font-display text-xl font-bold">Phase-level resources</h2>
          <ul className="mt-3 space-y-2">
            {(resources ?? []).length === 0 ? (
              <li className="text-sm text-muted">No phase resources yet.</li>
            ) : (
              (resources ?? []).map((r) => (
                <li key={r.id as string}>
                  <a
                    href={r.url as string}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-bold hover:underline"
                  >
                    {r.title as string}
                  </a>
                  <span className="ml-2 text-xs text-muted">
                    {r.priority as string} · {r.status as string}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="scc-card p-5">
          <h2 className="font-display text-xl font-bold">Completed work and evidence</h2>
          <ul className="mt-3 space-y-2">
            {(evidence ?? []).length === 0 ? (
              <li className="text-sm text-muted">No evidence in this phase yet.</li>
            ) : (
              (evidence ?? []).map((e) => (
                <li key={e.id as string} className="text-sm">
                  <span className="scc-tag">{e.kind as string}</span>{" "}
                  {(e.label as string | null) ?? (e.content as string).slice(0, 80)}
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
