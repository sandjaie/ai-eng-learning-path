import { describe, expect, test } from "vitest";
import {
  applyUpgradePlan,
  planCurriculumUpgrade,
  shouldOverwriteCuratedField,
  stripTrackingParams,
} from "./upgrade";

describe("planCurriculumUpgrade", () => {
  test("maps legacy titles and archives parallel phases", () => {
    const plan = planCurriculumUpgrade({
      phases: [
        {
          id: "p0",
          title: "Months 1–2: Python, ML & mathematical foundations",
          source_key: null,
          source_revision: null,
          archived_at: null,
          sort_order: 0,
          status: "active",
        },
        {
          id: "p7",
          title: "Claude certification track (parallel)",
          source_key: null,
          source_revision: null,
          archived_at: null,
          sort_order: 7,
          status: "planned",
        },
        {
          id: "p8",
          title: "Portfolio & positioning",
          source_key: null,
          source_revision: null,
          archived_at: null,
          sort_order: 8,
          status: "planned",
        },
      ],
      items: [
        {
          id: "i1",
          phase_id: "p7",
          title: "Claude Certified Developer",
          source_key: null,
          status: "todo",
          notes: null,
        },
      ],
    });
    expect(plan.assignPhaseKeys).toEqual([
      { id: "p0", source_key: "phase.foundations" },
    ]);
    expect(plan.archivePhaseIds).toEqual(["p7", "p8"]);
    expect(plan.removeBannedItemIds).toEqual(["i1"]);
    expect(plan.phasesToInsert).toContain("phase.llms");
  });

  test("second apply is idempotent", () => {
    const initial = {
      phases: [
        {
          id: "p0",
          title: "Months 1–2: Python, ML & mathematical foundations",
          source_key: null,
          source_revision: null,
          archived_at: null,
          sort_order: 0,
          status: "active",
        },
        {
          id: "p7",
          title: "Claude certification track (parallel)",
          source_key: null,
          source_revision: null,
          archived_at: null,
          sort_order: 7,
          status: "planned",
        },
      ],
      items: [],
    };
    const once = applyUpgradePlan(initial, planCurriculumUpgrade(initial));
    const twice = applyUpgradePlan(once, planCurriculumUpgrade(once));
    expect(twice.phases.filter((p) => p.source_key === "phase.foundations")).toHaveLength(1);
    expect(twice.phases.find((p) => p.id === "p7")?.archived_at).toBeTruthy();
    const plan2 = planCurriculumUpgrade(twice);
    expect(plan2.assignPhaseKeys).toEqual([]);
    expect(plan2.archivePhaseIds).toEqual([]);
  });
});

describe("stripTrackingParams", () => {
  test("removes utm params", () => {
    expect(
      stripTrackingParams("https://example.com/a?utm_source=x&keep=1"),
    ).toBe("https://example.com/a?keep=1");
  });
});

describe("shouldOverwriteCuratedField", () => {
  test("protects personal edits", () => {
    expect(shouldOverwriteCuratedField("my title", "Old template", "New template")).toBe(false);
    expect(shouldOverwriteCuratedField("Old template", "Old template", "New template")).toBe(true);
  });
});
