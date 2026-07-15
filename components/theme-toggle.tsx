"use client";

import { useSyncExternalStore } from "react";

function getTheme(): "light" | "dark" {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", onChange);
  const obs = new MutationObserver(onChange);
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => {
    mq.removeEventListener("change", onChange);
    obs.disconnect();
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "light" as const);

  const toggle = () => {
    const next = getTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* ignore quota / private mode */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      title="Toggle dark mode"
      className="block-btn px-3 py-1.5 text-xs"
      aria-label="Toggle dark mode"
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}
