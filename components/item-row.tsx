"use client";

import { useState, useTransition } from "react";
import {
  cycleItemStatus, deleteItem, moveItem, saveItemNotes, updateItem,
} from "@/app/actions";
import { NotesEditor } from "@/components/notes-editor";
import type { Item } from "@/lib/types";

const STATUS_GLYPH = { todo: "", in_progress: "◐", done: "✓" } as const;
const STATUS_BG = { todo: "var(--card)", in_progress: "#ffc94d", done: "#2ec4b6" } as const;

export function ItemRow({ item, phaseId }: { item: Item; phaseId: string }) {
  const [editing, setEditing] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [, start] = useTransition();

  return (
    <li className="border-b-2 border-ink/15 last:border-b-0">
      <div className="group flex items-center gap-3 px-3 py-2">
        <button
          type="button"
          title={`Status: ${item.status} — click to change`}
          onClick={() => start(() => cycleItemStatus(item.id, phaseId))}
          className={`flex h-6 w-6 shrink-0 items-center justify-center border-2 border-ink text-sm font-black ${item.status !== "todo" ? "text-on-color" : ""}`}
          style={{ background: STATUS_BG[item.status] }}
        >
          {STATUS_GLYPH[item.status]}
        </button>

        {editing ? (
          <form
            action={async (fd) => {
              await updateItem(item.id, phaseId, fd);
              setEditing(false);
            }}
            className="flex flex-1 flex-wrap items-center gap-2"
          >
            <input name="title" defaultValue={item.title} required className="block-input flex-1 py-1 text-sm" />
            <input name="url" defaultValue={item.url ?? ""} placeholder="URL (optional)" className="block-input w-48 py-1 text-sm" />
            <input name="provider" defaultValue={item.provider ?? ""} placeholder="Provider" className="block-input w-28 py-1 text-sm" />
            <button className="block-btn px-2 py-1 text-xs uppercase">Save</button>
            <button type="button" onClick={() => setEditing(false)} className="text-xs underline">Cancel</button>
          </form>
        ) : (
          <span className={`flex-1 text-sm ${item.status === "done" ? "text-muted line-through" : ""}`}>
            {item.url ? (
              <a href={item.url} target="_blank" rel="noreferrer" className="underline decoration-2 underline-offset-2">
                {item.title}
              </a>
            ) : (
              item.title
            )}
            {item.provider && (
              <span className="ml-2 border border-ink px-1.5 py-0.5 text-[0.65rem] font-bold uppercase">
                {item.provider}
              </span>
            )}
          </span>
        )}

        <span className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button type="button" title="Notes" onClick={() => setShowNotes((s) => !s)} className={`px-1 text-xs font-bold ${item.notes ? "text-ink" : "text-muted"}`}>✎</button>
          <button type="button" title="Edit" onClick={() => setEditing(true)} className="px-1 text-xs text-muted">Edit</button>
          <button type="button" title="Move up" onClick={() => start(() => moveItem(item.id, item.section_id, phaseId, -1))} className="px-1 text-xs text-muted">↑</button>
          <button type="button" title="Move down" onClick={() => start(() => moveItem(item.id, item.section_id, phaseId, 1))} className="px-1 text-xs text-muted">↓</button>
          <button
            type="button"
            title="Delete"
            onClick={() => { if (confirm(`Delete "${item.title}"?`)) start(() => deleteItem(item.id, phaseId)); }}
            className="px-1 text-xs text-[#ff8a5c]"
          >✕</button>
        </span>
      </div>
      {showNotes && (
        <div className="px-3 pb-3 pl-12">
          <NotesEditor initial={item.notes} onSave={(n) => saveItemNotes(item.id, phaseId, n)} />
        </div>
      )}
    </li>
  );
}
