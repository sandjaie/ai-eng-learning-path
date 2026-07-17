import type { ItemKind, SectionKind } from "./types";

export function mapSectionKind(title: string): SectionKind {
  const key = title.trim().toLowerCase();
  if (["learn", "topics", "core topics"].includes(key)) return "topics";
  if (["build", "projects", "practice"].includes(key)) return "projects";
  if (["exit criteria", "outcomes", "exit outcomes"].includes(key)) return "outcomes";
  if (["courses", "resources", "courses/resources"].includes(key)) return "resources";
  return "custom";
}

export function mapItemKind(sectionKind: SectionKind): ItemKind {
  switch (sectionKind) {
    case "projects":
      return "project_task";
    case "outcomes":
      return "milestone";
    case "resources":
      return "reference";
    default:
      return "topic";
  }
}

export function isTrackableKind(kind: ItemKind): boolean {
  return kind === "topic" || kind === "project_task" || kind === "milestone";
}
