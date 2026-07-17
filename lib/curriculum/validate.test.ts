import { describe, expect, test } from "vitest";
import { curriculumRoadmap } from "./roadmap";
import { validateCurriculum } from "./validate";

describe("validateCurriculum", () => {
  test("canonical roadmap has no issues", () => {
    expect(validateCurriculum(curriculumRoadmap)).toEqual([]);
  });

  test("requires eight phases", () => {
    const broken = { ...curriculumRoadmap, phases: curriculumRoadmap.phases.slice(0, 2) };
    expect(validateCurriculum(broken).some((i) => i.code === "phase_count")).toBe(true);
  });

  test("flags non-https resources", () => {
    const phases = structuredClone(curriculumRoadmap.phases);
    phases[0].resources[0].url = "http://example.com";
    expect(
      validateCurriculum({ ...curriculumRoadmap, phases }).some((i) => i.code === "resource_url"),
    ).toBe(true);
  });
});
