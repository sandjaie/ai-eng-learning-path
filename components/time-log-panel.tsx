"use client";

import { useRef, useTransition } from "react";
import { createTimeLog, deleteTimeLog } from "@/app/actions";
import type { TimeLog } from "@/lib/types";

export function TimeLogPanel({ logs, phaseId }: { logs: TimeLog[]; phaseId: string }) {
  const ref = useRef<HTMLFormElement>(null);
  const [, start] = useTransition();
  const totalH = Math.round((logs.reduce((s, l) => s + l.minutes, 0) / 60) * 10) / 10;

  return (
    <div className="block-card">
      <div className="flex items-center justify-between border-b-2 border-ink bg-paper px-4 py-2">
        <span className="text-xs font-extrabold uppercase tracking-widest">Time log</span>
        <span className="font-mono text-xs">{totalH} h total</span>
      </div>
      <form
        ref={ref}
        action={async (fd) => {
          await createTimeLog(phaseId, fd);
          ref.current?.reset();
        }}
        className="flex flex-wrap gap-2 border-b-2 border-ink/15 p-3"
      >
        <input type="date" name="logged_on" defaultValue={new Date().toISOString().slice(0, 10)} className="block-input py-1 text-sm" />
        <input type="number" name="hours" required min="0.25" step="0.25" placeholder="Hours" className="block-input w-24 py-1 text-sm" />
        <input name="note" placeholder="What did you work on?" className="block-input min-w-40 flex-1 py-1 text-sm" />
        <button className="block-btn px-3 py-1 text-xs uppercase">Log</button>
      </form>
      <ul className="max-h-72 overflow-y-auto">
        {logs.map((log) => (
          <li key={log.id} className="group flex items-baseline gap-3 border-b-2 border-ink/10 px-4 py-2 text-sm last:border-b-0">
            <span className="font-mono text-xs text-muted">{log.logged_on}</span>
            <span className="font-bold">{Math.round((log.minutes / 60) * 10) / 10} h</span>
            {log.note && <span className="text-muted">{log.note}</span>}
            <button
              type="button"
              title="Delete entry"
              onClick={() => start(() => deleteTimeLog(log.id, phaseId))}
              className="ml-auto px-1 text-xs text-[#ff8a5c] opacity-0 group-hover:opacity-100"
            >✕</button>
          </li>
        ))}
        {logs.length === 0 && <li className="px-4 py-3 text-sm text-muted">No time logged yet.</li>}
      </ul>
    </div>
  );
}
