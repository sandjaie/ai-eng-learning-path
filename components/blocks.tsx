export function BlockBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-3.5 border-2 border-ink bg-white">
      <div className="h-full" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export function Sticker({
  children,
  color,
  rotate = -2,
}: {
  children: React.ReactNode;
  color?: string;
  rotate?: number;
}) {
  return (
    <span
      className="sticker"
      style={{
        background: color ?? "var(--card)",
        color: color ? "var(--on-color)" : undefined,
        transform: `rotate(${rotate}deg)`,
      }}
    >
      {children}
    </span>
  );
}

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export function WeekPips({ activeDays }: { activeDays: boolean[] }) {
  return (
    <div className="flex gap-2">
      {DAY_LABELS.map((label, i) => (
        <span
          key={i}
          className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink text-[0.6rem] font-extrabold ${activeDays[i] ? "text-on-color" : ""}`}
          style={{ background: activeDays[i] ? "#2ec4b6" : "var(--card)" }}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

export function StatTile({
  label, value, sub, color,
}: {
  label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div className="block-card p-3">
      <div className="text-[0.62rem] font-extrabold uppercase tracking-widest text-muted">{label}</div>
      <div
        className="mt-1 inline-block font-display text-2xl font-black tracking-tight tabular-nums"
        style={color ? { background: color, padding: "0 0.35rem", border: "2px solid var(--ink)", color: "var(--on-color)" } : undefined}
      >
        {value}
      </div>
      {sub && <div className="mt-0.5 text-xs text-muted">{sub}</div>}
    </div>
  );
}
