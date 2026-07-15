"use client";

import { useRef } from "react";
import { createSection } from "@/app/actions";

export function AddSectionForm({ phaseId }: { phaseId: string }) {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={ref}
      action={async (fd) => {
        await createSection(phaseId, fd);
        ref.current?.reset();
      }}
      className="flex gap-2"
    >
      <input name="title" required placeholder="New section (e.g. Learn, Courses, Build)…" className="block-input flex-1 text-sm" />
      <button className="block-btn px-3 py-1.5 text-xs uppercase">+ Add section</button>
    </form>
  );
}
