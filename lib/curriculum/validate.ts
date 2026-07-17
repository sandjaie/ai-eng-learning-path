import type { CurriculumRoadmap } from "./types";

const BANNED_PHRASES = [
  "claude certified developer",
  "claude certified engineer",
  "claude certified practitioner",
  "four official claude certifications",
];

const PERSONAL_EMAIL = /@[a-z0-9.-]+\.[a-z]{2,}/i;

export interface ValidationIssue {
  code: string;
  message: string;
}

export function validateCurriculum(roadmap: CurriculumRoadmap): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const keys = new Set<string>();

  const take = (key: string, label: string) => {
    if (keys.has(key)) issues.push({ code: "duplicate_key", message: `Duplicate source_key ${key} (${label})` });
    else keys.add(key);
  };

  if (roadmap.phases.length !== 8) {
    issues.push({
      code: "phase_count",
      message: `Expected 8 phases, got ${roadmap.phases.length}`,
    });
  }

  const blob = JSON.stringify(roadmap).toLowerCase();
  for (const phrase of BANNED_PHRASES) {
    if (blob.includes(phrase)) {
      issues.push({ code: "banned_cert", message: `Banned certification claim present: ${phrase}` });
    }
  }
  if (PERSONAL_EMAIL.test(blob) && !blob.includes("you@example.com")) {
    // allow only template email if any
  }
  const emails = blob.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/g) ?? [];
  for (const email of emails) {
    if (email !== "you@example.com") {
      issues.push({ code: "personal_email", message: `Non-template email in curriculum: ${email}` });
    }
  }

  let prevEnd = 0;
  for (const phase of roadmap.phases) {
    take(phase.source_key, "phase");
    if (phase.month_start !== prevEnd + 1 && phase.sort_order === 0) {
      // first phase should start at 1
    }
    if (phase.sort_order > 0 && phase.month_start !== prevEnd + 1) {
      issues.push({
        code: "month_gap",
        message: `${phase.source_key} month_start ${phase.month_start} does not follow ${prevEnd}`,
      });
    }
    prevEnd = phase.month_end;

    const titles = new Set<string>();
    for (const section of phase.sections) {
      take(section.source_key, "section");
      for (const item of section.items) {
        take(item.source_key, "item");
        const titleKey = item.title.toLowerCase();
        if (titles.has(titleKey)) {
          issues.push({
            code: "duplicate_topic",
            message: `Duplicate topic title in ${phase.source_key}: ${item.title}`,
          });
        }
        titles.add(titleKey);

        if (
          (item.kind === "topic" || item.kind === "project_task") &&
          item.criteria.length === 0
        ) {
          issues.push({
            code: "missing_criteria",
            message: `${item.source_key} has no achievement criteria`,
          });
        }
        for (const c of item.criteria) take(c.source_key, "criterion");
      }
    }

    let primaryMinutes = 0;
    for (const resource of phase.resources) {
      take(resource.source_key, "resource");
      if (!resource.url.startsWith("https://")) {
        issues.push({
          code: "resource_url",
          message: `${resource.source_key} must use HTTPS`,
        });
      }
      if (!["primary", "selective", "optional"].includes(resource.priority)) {
        issues.push({
          code: "resource_priority",
          message: `${resource.source_key} missing priority`,
        });
      }
      if (resource.priority === "primary") {
        primaryMinutes += resource.estimated_minutes ?? 0;
      }
    }

    // Two-month phases: ~16 weeks * 2h structured ≈ 1920 min soft budget for primary courses
    const months = phase.month_end - phase.month_start + 1;
    const budget = months * 960;
    if (primaryMinutes > budget * 1.5) {
      issues.push({
        code: "primary_budget",
        message: `${phase.source_key} primary resources total ${primaryMinutes}m exceeds soft budget ${budget}`,
      });
    }
  }

  return issues;
}
