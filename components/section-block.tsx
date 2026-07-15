"use client";

import { useRef, useState, useTransition } from "react";
import { createItem, deleteSection, moveSection, renameSection } from "@/app/actions";
import { ItemRow } from "@/components/item-row";
import type { Section } from "@/lib/types";

export function SectionBlock({
  section, phaseId, color,
}: {
  section: Section; phaseId: string; color: string;
}) {
  const [renaming, setRenaming] = useState(false);
  const [, start] = useTransition();
  const addForm = useRef<HTMLFormElement>(null);
  const done = section.items.filter((i) => i.status === "done").length;

  return (
    <div className="block-card">
      <div
        className="flex items-center gap-2 border-b-2 border-ink px-4 py-2 text-on-color"
        style={{ background: color }}
      >
        {renaming ? (
          <form
            action={(fd) => {
              start(() => renameSection(section.id, phaseId, String(fd.get("title") ?? "")));
              setRenaming(false);
            }}
            className="flex flex-1 gap-2"
          >
            <input name="title" defaultValue={section.title} className="block-input flex-1 py-0.5 text-sm" autoFocus />
            <button className="block-btn px-2 py-0.5 text-xs uppercase">Save</button>
          </form>
        ) : (
          <button
            type="button"
            onDoubleClick={() => setRenaming(true)}
            title="Double-click to rename"
            className="text-xs font-extrabold uppercase tracking-widest"
          >
            {section.title}
          </button>
        )}
        <span className="font-mono text-xs">{done}/{section.items.length}</span>
        <span className="ml-auto flex gap-1">
          <button type="button" title="Move up" onClick={() => start(() => moveSection(section.id, phaseId, -1))} className="px-1 text-xs font-bold">↑</button>
          <button type="button" title="Move down" onClick={() => start(() => moveSection(section.id, phaseId, 1))} className="px-1 text-xs font-bold">↓</button>
          <button
            type="button"
            title="Delete section"
            onClick={() => {
              if (confirm(`Delete section "${section.title}" and its ${section.items.length} items?`))
                start(() => deleteSection(section.id, phaseId));
            }}
            className="px-1 text-xs font-bold"
          >✕</button>
        </span>
      </div>
      <ul>
        {section.items.map((item) => (
          <ItemRow key={item.id} item={item} phaseId={phaseId} />
        ))}
      </ul>
      <form
        ref={addForm}
        action={async (fd) => {
          await createItem(section.id, phaseId, fd);
          addForm.current?.reset();
        }}
        className="flex gap-2 border-t-2 border-ink/15 p-2"
      >
        <input name="title" required placeholder="Add item…" className="block-input flex-1 py-1 text-sm" />
        <input name="url" placeholder="URL (optional)" className="block-input w-44 py-1 text-sm" />
        <button className="block-btn px-3 py-1 text-xs uppercase">+ Add</button>
      </form>
    </div>
  );
}
