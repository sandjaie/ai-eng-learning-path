import Link from "next/link";
import { trackableProgress } from "@/lib/progress";
import type { Phase } from "@/lib/types";

export function PhaseNavigator({
  phases,
  activePhaseId,
}: {
  phases: Phase[];
  activePhaseId?: string | null;
}) {
  return (
    <nav aria-label="Learning path" className="space-y-1">
      <p className="mb-2 text-[10px] font-black tracking-[0.13em] text-muted uppercase">
        Your path
      </p>
      {phases.map((phase, index) => {
        const items = phase.sections.flatMap((s) => s.items);
        const p = trackableProgress(items);
        const active = phase.id === activePhaseId || phase.status === "active";
        return (
          <Link
            key={phase.id}
            href={`/phase/${phase.id}`}
            className={`grid grid-cols-[24px_1fr] gap-2.5 rounded-[10px] px-2 py-2.5 text-xs leading-snug ${
              active ? "bg-teal-soft text-ink" : "text-muted hover:bg-card"
            }`}
          >
            <span
              className={`grid h-[22px] w-[22px] place-items-center rounded-full text-[10px] font-black ${
                active ? "bg-teal text-on-color" : "bg-line text-muted"
              }`}
            >
              {index + 1}
            </span>
            <span>
              <strong className="block text-ink">{phase.title.replace(/^Months \d+[–-]\d+:\s*/, "")}</strong>
              <span className="text-muted">
                {p.done}/{p.total} · {phase.status}
              </span>
            </span>
          </Link>
        );
      })}
      <p className="mt-6 mb-2 text-[10px] font-black tracking-[0.13em] text-muted uppercase">
        Plan
      </p>
      <Link
        href="/plan"
        className="grid grid-cols-[24px_1fr] gap-2.5 rounded-[10px] px-2 py-2.5 text-xs text-muted hover:bg-card"
      >
        <span className="grid h-[22px] w-[22px] place-items-center rounded-full bg-line text-[10px] font-black text-ink">
          P
        </span>
        <span>
          <strong className="block text-ink">Edit learning plan</strong>
          Phases, outcomes and dates
        </span>
      </Link>
    </nav>
  );
}
