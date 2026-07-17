"use client";

import { useEffect, useState, useTransition } from "react";
import { endStudySession, startStudySession } from "@/app/actions";
export function StudySessionPanel({
  phaseId,
  itemId,
  openSession,
  suggestedMinutes = 45,
  weekMinutes,
  weekGoalMin,
  activeDays,
}: {
  phaseId: string;
  itemId: string | null;
  openSession: { id: string; started_at: string } | null;
  suggestedMinutes?: number;
  weekMinutes: number;
  weekGoalMin: number;
  activeDays: boolean[];
}) {
  const [pending, startTransition] = useTransition();
  const [now, setNow] = useState(() => Date.now());
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!openSession) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [openSession]);

  const elapsedSec = openSession
    ? Math.max(0, Math.floor((now - new Date(openSession.started_at).getTime()) / 1000))
    : suggestedMinutes * 60;
  const mm = String(Math.floor(elapsedSec / 60)).padStart(2, "0");
  const ss = String(elapsedSec % 60).padStart(2, "0");
  const weekPct = Math.min(100, Math.round((weekMinutes / Math.max(weekGoalMin, 1)) * 100));
  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Study session</h2>
        <span className="scc-tag">Focus</span>
      </div>

      <section className="rounded-2xl bg-ink p-5 text-on-color">
        <p className="text-xs font-bold tracking-wide text-[#9da9c4] uppercase">
          {openSession ? "Session running" : "Suggested session"}
        </p>
        <div className="mt-2 font-display text-4xl font-bold tabular-nums" aria-live="polite">
          {mm}:{ss}
        </div>
        {openSession ? (
          <button
            type="button"
            className="scc-btn scc-btn-gold mt-4 w-full"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const res = await endStudySession(openSession.id);
                setMessage(res.error ? res.error : "Session saved");
              })
            }
          >
            End session
          </button>
        ) : (
          <button
            type="button"
            className="scc-btn scc-btn-gold mt-4 w-full"
            disabled={pending || !phaseId}
            onClick={() =>
              startTransition(async () => {
                const res = await startStudySession(phaseId, itemId);
                setMessage(res.error ? res.error : "Session started");
              })
            }
          >
            Start focus session
          </button>
        )}
        <p className="mt-2 min-h-5 text-xs text-[#9da9c4]" aria-live="polite">
          {message}
        </p>
      </section>

      <section>
        <div className="mb-2 flex justify-between text-sm font-bold">
          <span>Weekly goal</span>
          <span>
            {Math.round((weekMinutes / 60) * 10) / 10}h / {Math.round(weekGoalMin / 60)}h
          </span>
        </div>
        <div
          className="scc-progress"
          role="progressbar"
          aria-valuenow={weekPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Weekly study time"
        >
          <span style={{ width: `${weekPct}%` }} />
        </div>
        <div className="mt-3 grid grid-cols-7 gap-1">
          {dayLabels.map((label, i) => (
            <div key={`${label}-${i}`} className="text-center text-[9px] text-muted">
              {label}
              <span
                className={`mx-auto mt-1 grid h-6 w-6 place-items-center rounded-full border text-[10px] font-extrabold ${
                  activeDays[i]
                    ? "border-teal bg-teal text-on-color"
                    : "border-line bg-card text-muted"
                }`}
              >
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
