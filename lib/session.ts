import type { TimeLog } from "./types";

export function findOpenSession(logs: Pick<TimeLog, "id" | "started_at" | "ended_at">[]): string | null {
  const open = logs.find((l) => l.started_at != null && l.ended_at == null);
  return open?.id ?? null;
}

export function sessionElapsedMinutes(
  startedAt: string,
  now: Date = new Date(),
): number {
  const start = new Date(startedAt).getTime();
  if (Number.isNaN(start)) return 0;
  return Math.max(0, Math.floor((now.getTime() - start) / 60_000));
}

export function computeEndedMinutes(
  startedAt: string,
  endedAt: string,
): number {
  const start = new Date(startedAt).getTime();
  const end = new Date(endedAt).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return 1;
  return Math.max(1, Math.round((end - start) / 60_000));
}

export function isValidHttpsUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:";
  } catch {
    return false;
  }
}
