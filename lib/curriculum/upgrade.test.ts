import { describe, expect, test } from "vitest";
import {
  applyUpgradePlan,
  planCurriculumUpgrade,
  shouldOverwriteCuratedField,
  stripTrackingParams,
} from "./upgrade";

describe("planCurriculumUpgrade", () => {
  test("maps legacy titles, relocates parallel items, does not delete history", () => {
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
          status: "done",
          notes: "Passed practice exam",
        },
        {
          id: "i2",
          phase_id: "p8",
          title: "Case study draft",
          source_key: null,
          status: "in_progress",
          notes: "WIP",
        },
        {
          id: "i-personal",
          phase_id: "p0",
          title: "Claude Certified Developer",
          source_key: null,
          status: "done",
          notes: "My personal goal",
        },
      ],
    });
    expect(plan.assignPhaseKeys).toEqual([
      { id: "p0", source_key: "phase.foundations" },
    ]);
    expect(plan.archivePhaseIds).toEqual(["p7", "p8"]);
    expect(plan.relocateItemIds).toEqual(["i1", "i2"]);
    expect(plan.renameBannedItemIds.map((r) => r.id)).toEqual(["i1"]);
    expect(plan.relocateItemIds).not.toContain("i-personal");
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
      items: [
        {
          id: "i1",
          phase_id: "p7",
          title: "Claude Certified Developer",
          source_key: null,
          status: "done",
          notes: "kept",
        },
      ],
    };
    const once = applyUpgradePlan(initial, planCurriculumUpgrade(initial));
    expect(once.items.find((i) => i.id === "i1")?.title).toContain("retired claim");
    expect(once.items.find((i) => i.id === "i1")?.phase_id).not.toBe("p7");
    const twice = applyUpgradePlan(once, planCurriculumUpgrade(once));
    expect(twice.phases.filter((p) => p.source_key === "phase.foundations")).toHaveLength(1);
    expect(twice.phases.find((p) => p.id === "p7")?.archived_at).toBeTruthy();
    const plan2 = planCurriculumUpgrade(twice);
    expect(plan2.assignPhaseKeys).toEqual([]);
    expect(plan2.archivePhaseIds).toEqual([]);
    expect(plan2.relocateItemIds).toEqual([]);
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
