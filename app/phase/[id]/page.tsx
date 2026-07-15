import { notFound } from "next/navigation";
import { savePhaseNotes } from "@/app/actions";
import { BlockBar } from "@/components/blocks";
import { NotesEditor } from "@/components/notes-editor";
import { PhaseHeader } from "@/components/phase-header";
import { SectionBlock } from "@/components/section-block";
import { ThemeToggle } from "@/components/theme-toggle";
import { TimeLogPanel } from "@/components/time-log-panel";
import { progress } from "@/lib/progress";
import { createClient } from "@/lib/supabase/server";
import { phaseColor, type Phase, type TimeLog } from "@/lib/types";
import { AddSectionForm } from "@/components/add-section-form";

export default async function PhasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: phase }, { data: logs }] = await Promise.all([
    supabase.from("phases").select("*, sections(*, items(*))").eq("id", id).single(),
    supabase.from("time_logs").select("*").eq("phase_id", id).order("logged_on", { ascending: false }),
  ]);
  if (!phase) notFound();

  // sort nested collections in JS — avoids PostgREST nested-order syntax
  const typed = phase as unknown as Phase;
  typed.sections.sort((a, b) => a.sort_order - b.sort_order);
  typed.sections.forEach((s) => s.items.sort((a, b) => a.sort_order - b.sort_order));

  const items = typed.sections.flatMap((s) => s.items);
  const prog = progress(items);
  const color = phaseColor(typed.sort_order);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <PhaseHeader phase={typed} itemCount={items.length} />
        </div>
        <ThemeToggle />
      </div>

      <div className="mt-4 flex items-center gap-4">
        <span className="font-display text-4xl font-black tabular-nums">{prog.pct}%</span>
        <div className="flex-1">
          <BlockBar pct={prog.pct} color={color} />
        </div>
        <span className="font-mono text-xs text-muted">{prog.done}/{prog.total}</span>
      </div>

      <div className="mt-8 space-y-6">
        {typed.sections.map((section) => (
          <SectionBlock key={section.id} section={section} phaseId={typed.id} color={color} />
        ))}
        <AddSectionForm phaseId={typed.id} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <NotesEditor initial={typed.notes} onSave={savePhaseNotes.bind(null, typed.id)} placeholder="Phase notes (markdown)…" />
        <TimeLogPanel logs={(logs ?? []) as TimeLog[]} phaseId={typed.id} />
      </div>
    </main>
  );
}
