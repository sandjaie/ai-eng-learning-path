import { describe, expect, test } from "vitest";
import { onTrack, progress, startOfWeekMonday, trackableProgress, weeklyMinutes } from "./progress";

const items = (done: number, rest: number) => [
  ...Array(done).fill({ status: "done" as const }),
  ...Array(rest).fill({ status: "todo" as const }),
];

describe("progress", () => {
  test("counts done items and rounds pct", () => {
    expect(progress(items(2, 1))).toEqual({ done: 2, total: 3, pct: 67 });
  });
  test("empty list is 0%", () => {
    expect(progress([])).toEqual({ done: 0, total: 0, pct: 0 });
  });
  test("in_progress does not count as done", () => {
    expect(progress([{ status: "in_progress" }]).done).toBe(0);
  });
});

describe("onTrack", () => {
  const mid = new Date("2026-08-16"); // halfway through Aug 1 – Aug 31
  test("null without dates or items", () => {
    expect(onTrack(progress(items(1, 1)), null, "2026-08-31", mid)).toBeNull();
    expect(onTrack(progress([]), "2026-08-01", "2026-08-31", mid)).toBeNull();
  });
  test("ahead / behind / on track around ±5pp band", () => {
    expect(onTrack(progress(items(3, 1)), "2026-08-01", "2026-08-31", mid)).toBe("ahead");    // 75% vs ~50%
    expect(onTrack(progress(items(1, 3)), "2026-08-01", "2026-08-31", mid)).toBe("behind");   // 25% vs ~50%
    expect(onTrack(progress(items(2, 2)), "2026-08-01", "2026-08-31", mid)).toBe("on_track"); // 50% vs ~50%
  });
  test("clamps before start and after end", () => {
    expect(onTrack(progress(items(0, 4)), "2026-08-01", "2026-08-31", new Date("2026-07-01"))).toBe("on_track");
    expect(onTrack(progress(items(2, 2)), "2026-08-01", "2026-08-31", new Date("2026-10-01"))).toBe("behind");
  });
});

describe("startOfWeekMonday", () => {
  test("Wednesday maps to that week's Monday", () => {
    expect(startOfWeekMonday(new Date("2026-07-15")).toISOString().slice(0, 10)).toBe("2026-07-13");
  });
  test("Sunday maps back to previous Monday", () => {
    expect(startOfWeekMonday(new Date("2026-07-19")).toISOString().slice(0, 10)).toBe("2026-07-13");
  });
});

describe("trackableProgress", () => {
  test("excludes reference items from denominator", () => {
    expect(
      trackableProgress([
        { status: "done", kind: "topic" },
        { status: "todo", kind: "reference" },
        { status: "todo", kind: "topic" },
      ]),
    ).toEqual({ done: 1, total: 2, pct: 50 });
  });
});

describe("weeklyMinutes", () => {
  test("sums closed logs and open session elapsed", () => {
    const weekStart = startOfWeekMonday(new Date("2026-07-17"));
    const now = new Date("2026-07-17T12:30:00Z");
    expect(
      weeklyMinutes(
        [
          { logged_on: "2026-07-14", minutes: 60, started_at: null, ended_at: null },
          {
            logged_on: "2026-07-17",
            minutes: 0,
            started_at: "2026-07-17T12:00:00Z",
            ended_at: null,
          },
        ],
        weekStart,
        now,
      ),
    ).toBe(90);
  });
});
