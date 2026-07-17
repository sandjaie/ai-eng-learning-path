import { describe, expect, test } from "vitest";
import {
  selectStudyNext,
  shouldMarkItemDone,
  shouldReopenItem,
  isBlockedCertificationMilestone,
} from "./study-next";
import type { Item, Phase, Section } from "./types";

function item(partial: Partial<Item> & Pick<Item, "id" | "title">): Item {
  return {
    section_id: "s1",
    url: null,
    provider: null,
    status: "todo",
    notes: null,
    completed_at: null,
    sort_order: 0,
    kind: "topic",
    estimated_minutes: 45,
    started_at: null,
    source_key: null,
    source_revision: null,
    ...partial,
  };
}

function section(partial: Partial<Section> & Pick<Section, "id" | "items">): Section {
  return {
    phase_id: "p1",
    title: "Learn",
    sort_order: 0,
    kind: "topics",
    source_key: null,
    source_revision: null,
    ...partial,
  };
}

function phase(partial: Partial<Phase> & Pick<Phase, "id" | "title" | "sections">): Phase {
  return {
    description: null,
    notes: null,
    sort_order: 0,
    target_start: null,
    target_end: null,
    status: "active",
    activated_at: null,
    archived_at: null,
    source_key: null,
    source_revision: null,
    ...partial,
  };
}

describe("selectStudyNext", () => {
  test("empty phases", () => {
    expect(selectStudyNext([])).toEqual({ type: "empty" });
  });

  test("prefers pinned incomplete item in active phase", () => {
    const a = item({ id: "a", title: "A", sort_order: 0, status: "todo" });
    const b = item({ id: "b", title: "B", sort_order: 1, status: "todo" });
    const phases = [
      phase({
        id: "p1",
        title: "Foundations",
        sections: [section({ id: "s1", items: [a, b] })],
      }),
    ];
    const next = selectStudyNext(phases, "b");
    expect(next.type).toBe("item");
    if (next.type === "item") expect(next.item.id).toBe("b");
  });

  test("falls back when pinned is done", () => {
    const a = item({ id: "a", title: "A", sort_order: 0, status: "todo" });
    const b = item({ id: "b", title: "B", sort_order: 1, status: "done" });
    const phases = [
      phase({
        id: "p1",
        title: "Foundations",
        sections: [section({ id: "s1", items: [a, b] })],
      }),
    ];
    const next = selectStudyNext(phases, "b");
    expect(next.type).toBe("item");
    if (next.type === "item") expect(next.item.id).toBe("a");
  });

  test("prefers in_progress over todo", () => {
    const a = item({ id: "a", title: "A", sort_order: 0, status: "todo" });
    const b = item({ id: "b", title: "B", sort_order: 1, status: "in_progress" });
    const phases = [
      phase({
        id: "p1",
        title: "Foundations",
        sections: [section({ id: "s1", items: [a, b] })],
      }),
    ];
    const next = selectStudyNext(phases, null);
    expect(next.type).toBe("item");
    if (next.type === "item") expect(next.item.id).toBe("b");
  });

  test("skips reference items", () => {
    const ref = item({ id: "r", title: "Course", kind: "reference", status: "todo" });
    const topic = item({ id: "t", title: "Topic", kind: "topic", status: "todo", sort_order: 1 });
    const phases = [
      phase({
        id: "p1",
        title: "Foundations",
        sections: [section({ id: "s1", items: [ref, topic] })],
      }),
    ];
    const next = selectStudyNext(phases, null);
    expect(next.type).toBe("item");
    if (next.type === "item") expect(next.item.id).toBe("t");
  });

  test("phase transition when active phase complete", () => {
    const done = item({ id: "a", title: "A", status: "done" });
    const phases = [
      phase({
        id: "p1",
        title: "One",
        sort_order: 0,
        status: "active",
        sections: [section({ id: "s1", items: [done] })],
      }),
      phase({
        id: "p2",
        title: "Two",
        sort_order: 1,
        status: "planned",
        sections: [
          section({
            id: "s2",
            phase_id: "p2",
            items: [item({ id: "b", title: "B", section_id: "s2" })],
          }),
        ],
      }),
    ];
    const next = selectStudyNext(phases, null);
    expect(next).toMatchObject({
      type: "phase_transition",
      completedPhase: { id: "p1" },
      nextPhase: { id: "p2" },
    });
  });

  test("path complete when no next phase", () => {
    const done = item({ id: "a", title: "A", status: "done" });
    const phases = [
      phase({
        id: "p1",
        title: "One",
        status: "active",
        sections: [section({ id: "s1", items: [done] })],
      }),
    ];
    expect(selectStudyNext(phases, null).type).toBe("path_complete");
  });

  test("after active phase completed, recommends next planned phase", () => {
    const phases = [
      phase({
        id: "p1",
        title: "One",
        sort_order: 0,
        status: "complete",
        sections: [
          section({
            id: "s1",
            items: [item({ id: "a", title: "A", status: "done" })],
          }),
        ],
      }),
      phase({
        id: "p2",
        title: "Two",
        sort_order: 1,
        status: "planned",
        sections: [
          section({
            id: "s2",
            phase_id: "p2",
            items: [item({ id: "b", title: "B", section_id: "s2" })],
          }),
        ],
      }),
    ];
    const next = selectStudyNext(phases, null);
    expect(next).toMatchObject({
      type: "phase_transition",
      completedPhase: { id: "p1" },
      nextPhase: { id: "p2" },
    });
  });

  test("blocks cert milestone while project incomplete", () => {
    const project = item({
      id: "proj",
      title: "Build service",
      kind: "project_task",
      status: "todo",
      sort_order: 0,
    });
    const cert = item({
      id: "cert",
      title: "AWS AI Practitioner certification",
      kind: "milestone",
      status: "todo",
      sort_order: 1,
    });
    const phases = [
      phase({
        id: "p1",
        title: "Foundations",
        sections: [section({ id: "s1", kind: "projects", items: [project, cert] })],
      }),
    ];
    const next = selectStudyNext(phases, null);
    expect(next.type).toBe("item");
    if (next.type === "item") expect(next.item.id).toBe("proj");
  });
});

describe("criteria completion", () => {
  test("marks done only when all required achieved", () => {
    expect(
      shouldMarkItemDone([
        { is_required: true, achieved_at: "2026-01-01" },
        { is_required: true, achieved_at: null },
      ]),
    ).toBe(false);
    expect(
      shouldMarkItemDone([
        { is_required: true, achieved_at: "2026-01-01" },
        { is_required: false, achieved_at: null },
      ]),
    ).toBe(true);
    expect(shouldMarkItemDone([])).toBe(false);
  });

  test("reopens when required criterion unchecked", () => {
    expect(
      shouldReopenItem([{ is_required: true, achieved_at: null }], "done"),
    ).toBe(true);
    expect(
      shouldReopenItem([{ is_required: true, achieved_at: "x" }], "done"),
    ).toBe(false);
  });
});

describe("isBlockedCertificationMilestone", () => {
  test("non-cert milestones are not blocked", () => {
    expect(
      isBlockedCertificationMilestone(
        { kind: "milestone", title: "Publish case study" },
        [
          {
            id: "p",
            title: "Build",
            status: "todo",
            kind: "project_task",
            section_id: "s",
            sort_order: 0,
            section_sort_order: 0,
            estimated_minutes: null,
            phase_id: "ph",
          },
        ],
      ),
    ).toBe(false);
  });
});
