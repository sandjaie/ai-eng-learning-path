import type { ItemStatus } from "./types";

export interface Progress { done: number; total: number; pct: number; }

export function progress(items: { status: ItemStatus }[]): Progress {
  const total = items.length;
  const done = items.filter((i) => i.status === "done").length;
  return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
}

export type TrackStatus = "ahead" | "on_track" | "behind";

// ponytail: linear expectation with a ±5pp band — good enough for a personal tracker
export function onTrack(
  p: Progress,
  targetStart: string | null,
  targetEnd: string | null,
  today: Date = new Date(),
): TrackStatus | null {
  if (!targetStart || !targetEnd || p.total === 0) return null;
  const start = new Date(targetStart).getTime();
  const end = new Date(targetEnd).getTime();
  if (end <= start) return null;
  const elapsed = Math.min(1, Math.max(0, (today.getTime() - start) / (end - start)));
  const diff = p.done / p.total - elapsed;
  if (diff >= 0.05) return "ahead";
  if (diff <= -0.05) return "behind";
  return "on_track";
}

export function startOfWeekMonday(d: Date): Date {
  const out = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = out.getUTCDay(); // 0 = Sunday
  out.setUTCDate(out.getUTCDate() - ((day + 6) % 7));
  return out;
}
