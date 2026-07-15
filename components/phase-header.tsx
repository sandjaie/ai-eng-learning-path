"use client";

import Link from "next/link";
import { useState } from "react";
import { deletePhase, updatePhase } from "@/app/actions";
import type { Phase } from "@/lib/types";

export function PhaseHeader({ phase, itemCount }: { phase: Phase; itemCount: number }) {
  const [editing, setEditing] = useState(false);

  return (
    <header>
      <Link href="/" className="text-xs font-bold uppercase tracking-wide underline">
        ← Dashboard
      </Link>
      {editing ? (
        <form
          action={async (fd) => {
            await updatePhase(phase.id, fd);
            setEditing(false);
          }}
          className="mt-3 grid gap-3 sm:grid-cols-2"
        >
          <input name="title" defaultValue={phase.title} required className="block-input font-display text-lg font-bold sm:col-span-2" />
          <input name="description" defaultValue={phase.description ?? ""} placeholder="Short description" className="block-input sm:col-span-2" />
          <label className="text-sm font-bold">
            Target start
            <input type="date" name="target_start" defaultValue={phase.target_start ?? ""} className="block-input mt-1 block w-full" />
          </label>
          <label className="text-sm font-bold">
            Target end
            <input type="date" name="target_end" defaultValue={phase.target_end ?? ""} className="block-input mt-1 block w-full" />
          </label>
          <div className="flex gap-2 sm:col-span-2">
            <button className="block-btn px-3 py-1.5 text-xs uppercase">Save</button>
            <button type="button" onClick={() => setEditing(false)} className="text-xs underline">Cancel</button>
          </div>
        </form>
      ) : (
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-black uppercase tracking-tight">{phase.title}</h1>
            {phase.description && <p className="mt-1 text-sm text-muted">{phase.description}</p>}
            {(phase.target_start || phase.target_end) && (
              <p className="mt-1 font-mono text-xs text-muted">
                {phase.target_start ?? "?"} → {phase.target_end ?? "?"}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setEditing(true)} className="block-btn px-3 py-1.5 text-xs uppercase">Edit</button>
            <button
              type="button"
              onClick={() => {
                if (confirm(`Delete phase "${phase.title}" with ${itemCount} items and its time logs? This cannot be undone.`))
                  deletePhase(phase.id).catch(() => alert("Delete failed — please try again."));
              }}
              className="block-btn px-3 py-1.5 text-xs uppercase text-[#b3431f]"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
