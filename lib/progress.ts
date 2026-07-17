import { isTrackableKind } from "./migrate-kinds";
import { sessionElapsedMinutes } from "./session";
import type { ItemKind, ItemStatus } from "./types";

export interface Progress { done: number; total: number; pct: number; }

export function progress(items: { status: ItemStatus }[]): Progress {
  const total = items.length;
  const done = items.filter((i) => i.status === "done").length;
  return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
}

/** Learning progress excludes non-trackable kinds (e.g. reference / resources). */
export function trackableProgress(
  items: { status: ItemStatus; kind: ItemKind }[],
): Progress {
  return progress(items.filter((i) => isTrackableKind(i.kind)));
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

export interface WeekLogInput {
  logged_on: string;
  minutes: number;
  started_at: string | null;
  ended_at: string | null;
}

/** Sum closed log minutes in the week plus elapsed minutes from any open session. */
export function weeklyMinutes(
  logs: WeekLogInput[],
  weekStart: Date,
  now: Date = new Date(),
): number {
  const weekStartISO = weekStart.toISOString().slice(0, 10);
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);
  const weekEndISO = weekEnd.toISOString().slice(0, 10);

  let total = 0;
  for (const log of logs) {
    const open = log.started_at != null && log.ended_at == null;
    if (open) {
      total += sessionElapsedMinutes(log.started_at!, now);
      continue;
    }
    if (log.logged_on >= weekStartISO && log.logged_on < weekEndISO) {
      total += log.minutes;
    }
  }
  return total;
}

export function activeDaysThisWeek(
  logs: { logged_on: string; minutes: number; started_at: string | null; ended_at: string | null }[],
  weekStart: Date,
  now: Date = new Date(),
): boolean[] {
  const weekStartISO = weekStart.toISOString().slice(0, 10);
  const days = Array.from({ length: 7 }, () => false);
  for (const log of logs) {
    const open = log.started_at != null && log.ended_at == null;
    if (open) {
      const iso = now.toISOString().slice(0, 10);
      const idx = Math.floor(
        (Date.parse(iso) - Date.parse(weekStartISO)) / (24 * 3600 * 1000),
      );
      if (idx >= 0 && idx < 7) days[idx] = true;
      continue;
    }
    if (log.minutes <= 0) continue;
    const idx = Math.floor(
      (Date.parse(log.logged_on) - Date.parse(weekStartISO)) / (24 * 3600 * 1000),
    );
    if (idx >= 0 && idx < 7) days[idx] = true;
  }
  return days;
}
