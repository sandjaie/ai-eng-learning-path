import { signOut } from "@/app/actions";
import { AddPhaseForm } from "@/components/add-phase-form";
import { StatTile, Sticker, WeekPips } from "@/components/blocks";
import { PhaseCard, TRACK_COLOR, TRACK_LABEL } from "@/components/phase-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { onTrack, progress, startOfWeekMonday } from "@/lib/progress";
import { createClient } from "@/lib/supabase/server";
import { phaseColor, WEEKLY_GOAL_MAX, WEEKLY_GOAL_MIN, type ItemStatus } from "@/lib/types";

export default async function Dashboard() {
  const supabase = await createClient();
  const [{ data: phases }, { data: logs }, { data: recent }] = await Promise.all([
    supabase
      .from("phases")
      .select("id, title, sort_order, target_start, target_end, sections(id, items(id, status))")
      .order("sort_order"),
    supabase.from("time_logs").select("phase_id, minutes, logged_on"),
    supabase
      .from("items")
      .select("id, title, provider, completed_at")
      .eq("status", "done")
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false })
      .limit(10),
  ]);

  const allPhases = phases ?? [];
  const allLogs = logs ?? [];

  const phaseItems = (p: (typeof allPhases)[number]) =>
    p.sections.flatMap((s) => s.items) as { status: ItemStatus }[];
  const allItems = allPhases.flatMap(phaseItems);
  const overall = progress(allItems);

  const hoursByPhase = new Map<string, number>();
  for (const log of allLogs) {
    hoursByPhase.set(log.phase_id, (hoursByPhase.get(log.phase_id) ?? 0) + log.minutes / 60);
  }

  const weekStart = startOfWeekMonday(new Date());
  const weekStartISO = weekStart.toISOString().slice(0, 10);
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);
  const weekEndISO = weekEnd.toISOString().slice(0, 10);
  const weekLogs = allLogs.filter((l) => l.logged_on >= weekStartISO && l.logged_on < weekEndISO);
  const weekMinutes = weekLogs.reduce((sum, l) => sum + l.minutes, 0);
  const activeDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setUTCDate(d.getUTCDate() + i);
    const iso = d.toISOString().slice(0, 10);
    return weekLogs.some((l) => l.logged_on === iso);
  });

  const starts = allPhases.map((p) => p.target_start).filter(Boolean) as string[];
  const ends = allPhases.map((p) => p.target_end).filter(Boolean) as string[];
  const roadmapStart = starts.length ? [...starts].sort()[0] : null;
  const roadmapEnd = ends.length ? [...ends].sort().at(-1)! : null;
  // Server Component: wall-clock progress for this request (not a client re-render).
  const nowMs = new Date().getTime();
  const sinceStart = roadmapStart ? nowMs - new Date(roadmapStart).getTime() : null;
  const monthNo = sinceStart !== null
    ? Math.max(1, Math.floor(sinceStart / (30.44 * 24 * 3600 * 1000)) + 1)
    : null;
  const weekNo = sinceStart !== null
    ? Math.max(1, Math.floor(sinceStart / (7 * 24 * 3600 * 1000)) + 1)
    : null;
  const overallTrack = roadmapStart && roadmapEnd ? onTrack(overall, roadmapStart, roadmapEnd) : null;
  const totalMinutes = allLogs.reduce((sum, l) => sum + l.minutes, 0);
  const h = (m: number) => Math.round((m / 60) * 10) / 10;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-black uppercase tracking-tight sm:text-5xl">
            AI Engineer
          </h1>
          <p className="mt-1 text-sm font-bold uppercase tracking-wide text-muted">
            18-month transition tracker
          </p>
        </div>
        <div className="flex items-center gap-3">
          {monthNo && <Sticker color="#ffc94d" rotate={2}>Month {monthNo}</Sticker>}
          <ThemeToggle />
          <form action={signOut}>
            <button className="block-btn px-3 py-1.5 text-xs uppercase">Sign out</button>
          </form>
        </div>
      </header>

      <section className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatTile label="Overall" value={`${overall.pct}%`} />
        <StatTile label="Items done" value={`${overall.done}/${overall.total}`} />
        <StatTile
          label="Week"
          value={weekNo ? String(weekNo) : "—"}
          sub={monthNo ? `Month ${monthNo} of 18` : undefined}
        />
        <StatTile label="This week" value={`${h(weekMinutes)} h`} sub={`goal ${WEEKLY_GOAL_MIN / 60}–${WEEKLY_GOAL_MAX / 60} h`} />
        <StatTile label="Total" value={`${h(totalMinutes)} h`} />
        <StatTile
          label="Status"
          value={overallTrack ? TRACK_LABEL[overallTrack] : "—"}
          color={overallTrack ? TRACK_COLOR[overallTrack] : undefined}
        />
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {allPhases.map((p, i) => {
          const prog = progress(phaseItems(p));
          return (
            <PhaseCard
              key={p.id}
              id={p.id}
              title={p.title}
              index={i}
              color={phaseColor(p.sort_order)}
              prog={prog}
              track={onTrack(prog, p.target_start, p.target_end)}
              hours={hoursByPhase.get(p.id) ?? 0}
              targetStart={p.target_start}
              targetEnd={p.target_end}
            />
          );
        })}
      </section>

      <section className="block-card mt-8 flex flex-wrap items-center gap-5 p-5">
        <span className="text-sm font-extrabold uppercase tracking-wide">This week</span>
        <WeekPips activeDays={activeDays} />
        <span className="ml-auto text-sm text-muted">
          {Math.round((weekMinutes / 60) * 10) / 10} of {WEEKLY_GOAL_MIN / 60}–{WEEKLY_GOAL_MAX / 60} h
          {weekMinutes < WEEKLY_GOAL_MIN &&
            ` — ${Math.round(((WEEKLY_GOAL_MIN - weekMinutes) / 60) * 10) / 10} h to the minimum`}
        </span>
      </section>

      {(recent ?? []).length > 0 && (
        <section className="block-card mt-6 p-5">
          <h2 className="text-sm font-extrabold uppercase tracking-wide">Recently completed</h2>
          <ul className="mt-3 space-y-1.5">
            {(recent ?? []).map((r) => (
              <li key={r.id} className="flex items-baseline gap-2 text-sm">
                <span className="font-black text-[#2ec4b6]">✓</span>
                <span>{r.title}</span>
                {r.provider && <span className="text-xs text-muted">· {r.provider}</span>}
                <span className="ml-auto shrink-0 text-xs text-muted">
                  {new Date(r.completed_at!).toLocaleDateString("en", { month: "short", day: "numeric" })}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <AddPhaseForm />
      </section>
    </main>
  );
}
