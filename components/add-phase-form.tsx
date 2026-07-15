"use client";

import { useRef } from "react";
import { createPhase } from "@/app/actions";

export function AddPhaseForm() {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={ref}
      action={async (fd) => {
        await createPhase(fd);
        ref.current?.reset();
      }}
      className="flex gap-3"
    >
      <input
        name="title"
        required
        placeholder="New phase title…"
        className="block-input flex-1"
      />
      <button type="submit" className="block-btn px-4 py-2 text-sm uppercase">
        + Add phase
      </button>
    </form>
  );
}
