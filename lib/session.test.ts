import { describe, expect, test } from "vitest";
import {
  computeEndedMinutes,
  findOpenSession,
  isValidHttpsUrl,
  sessionElapsedMinutes,
} from "./session";

describe("findOpenSession", () => {
  test("returns open session id", () => {
    expect(
      findOpenSession([
        { id: "a", started_at: null, ended_at: null },
        { id: "b", started_at: "2026-07-17T10:00:00Z", ended_at: null },
      ]),
    ).toBe("b");
  });
  test("null when none open", () => {
    expect(
      findOpenSession([{ id: "a", started_at: "x", ended_at: "y" }]),
    ).toBeNull();
  });
});

describe("sessionElapsedMinutes", () => {
  test("floors elapsed minutes", () => {
    expect(
      sessionElapsedMinutes("2026-07-17T10:00:00Z", new Date("2026-07-17T10:45:30Z")),
    ).toBe(45);
  });
});

describe("computeEndedMinutes", () => {
  test("rounds positive minutes with floor of 1", () => {
    expect(
      computeEndedMinutes("2026-07-17T10:00:00Z", "2026-07-17T10:00:30Z"),
    ).toBe(1);
    expect(
      computeEndedMinutes("2026-07-17T10:00:00Z", "2026-07-17T11:00:00Z"),
    ).toBe(60);
  });
});

describe("isValidHttpsUrl", () => {
  test("accepts https only", () => {
    expect(isValidHttpsUrl("https://example.com/a")).toBe(true);
    expect(isValidHttpsUrl("http://example.com/a")).toBe(false);
    expect(isValidHttpsUrl("not-a-url")).toBe(false);
  });
});
