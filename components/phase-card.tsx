import Link from "next/link";
import { BlockBar, Sticker } from "@/components/blocks";
import type { Progress, TrackStatus } from "@/lib/progress";

export const TRACK_LABEL: Record<TrackStatus, string> = {
  ahead: "AHEAD",
  on_track: "ON TRACK",
  behind: "BEHIND",
};
export const TRACK_COLOR: Record<TrackStatus, string> = {
  ahead: "#2ec4b6",
  on_track: "#ffc94d",
  behind: "#ff8a5c",
};

function bandLabel(targetStart: string | null, targetEnd: string | null, index: number) {
  if (!targetStart || !targetEnd) return `PHASE ${index + 1}`;
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en", { month: "short", year: "2-digit" }).toUpperCase();
  return `${fmt(targetStart)} – ${fmt(targetEnd)}`;
}

export function PhaseCard({
  id, title, index, color, prog, track, hours,
  targetStart, targetEnd,
}: {
  id: string; title: string; index: number; color: string;
  prog: Progress; track: TrackStatus | null; hours: number;
  targetStart: string | null; targetEnd: string | null;
}) {
  const sticker =
    prog.total > 0 && prog.done === prog.total
      ? { label: "DONE ✓", color: "#2ec4b6" }
      : track
        ? { label: TRACK_LABEL[track], color: TRACK_COLOR[track] }
        : null;
  return (
    <Link href={`/phase/${id}`} className="block-card block transition-transform hover:-translate-y-0.5">
      <div
        className="flex items-center justify-between border-b-2 border-ink px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-on-color"
        style={{ background: color }}
      >
        {bandLabel(targetStart, targetEnd, index)}
        {sticker && <Sticker color={sticker.color}>{sticker.label}</Sticker>}
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg font-extrabold leading-tight">{title}</h3>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="font-display text-4xl font-black tracking-tight tabular-nums">
            {prog.pct}%
          </span>
          <span className="font-mono text-xs text-muted">
            {prog.done}/{prog.total}{hours > 0 ? ` · ${Math.round(hours * 10) / 10}h` : ""}
          </span>
        </div>
        <div className="mt-2">
          <BlockBar pct={prog.pct} color={color} />
        </div>
      </div>
    </Link>
  );
}
