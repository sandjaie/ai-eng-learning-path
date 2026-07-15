"use client";

import { useState, useTransition } from "react";
import ReactMarkdown from "react-markdown";

export function NotesEditor({
  initial,
  onSave,
  placeholder = "Markdown notes…",
}: {
  initial: string | null;
  onSave: (notes: string) => Promise<void>;
  placeholder?: string;
}) {
  const [value, setValue] = useState(initial ?? "");
  const [preview, setPreview] = useState(false);
  const [saving, startSaving] = useTransition();
  const dirty = value !== (initial ?? "");

  return (
    <div className="border-2 border-ink bg-white">
      <div className="flex items-center gap-2 border-b-2 border-ink bg-paper px-3 py-1.5">
        <span className="text-xs font-extrabold uppercase tracking-wide">Notes</span>
        <button
          type="button"
          onClick={() => setPreview((p) => !p)}
          className="ml-auto text-xs font-bold underline"
        >
          {preview ? "Edit" : "Preview"}
        </button>
        {dirty && (
          <button
            type="button"
            disabled={saving}
            onClick={() => startSaving(() => onSave(value))}
            className="block-btn px-2 py-0.5 text-xs uppercase"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        )}
      </div>
      {preview ? (
        <div className="prose prose-sm max-w-none p-3 [&_a]:underline">
          <ReactMarkdown>{value || "*Nothing yet.*"}</ReactMarkdown>
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          rows={Math.max(3, Math.min(14, value.split("\n").length + 1))}
          className="w-full resize-y p-3 font-mono text-sm focus:outline-none"
        />
      )}
    </div>
  );
}
