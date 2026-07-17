import { describe, expect, test } from "vitest";
import { isTrackableKind, mapItemKind, mapSectionKind } from "./migrate-kinds";

describe("mapSectionKind", () => {
  test("maps known titles case-insensitively", () => {
    expect(mapSectionKind("Learn")).toBe("topics");
    expect(mapSectionKind("BUILD")).toBe("projects");
    expect(mapSectionKind("Exit criteria")).toBe("outcomes");
    expect(mapSectionKind("Courses")).toBe("resources");
  });
  test("unknown titles become custom", () => {
    expect(mapSectionKind("Certification")).toBe("custom");
  });
});

describe("mapItemKind", () => {
  test("derives item kind from section kind", () => {
    expect(mapItemKind("topics")).toBe("topic");
    expect(mapItemKind("projects")).toBe("project_task");
    expect(mapItemKind("outcomes")).toBe("milestone");
    expect(mapItemKind("resources")).toBe("reference");
    expect(mapItemKind("custom")).toBe("topic");
  });
});

describe("isTrackableKind", () => {
  test("reference is not trackable", () => {
    expect(isTrackableKind("reference")).toBe(false);
    expect(isTrackableKind("topic")).toBe(true);
  });
});
