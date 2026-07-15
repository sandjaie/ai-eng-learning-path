export type ItemStatus = "todo" | "in_progress" | "done";

export interface Item {
  id: string; section_id: string; title: string;
  url: string | null; provider: string | null;
  status: ItemStatus; notes: string | null;
  completed_at: string | null; sort_order: number;
}
export interface Section {
  id: string; phase_id: string; title: string; sort_order: number;
  items: Item[];
}
export interface Phase {
  id: string; title: string; description: string | null; notes: string | null;
  sort_order: number; target_start: string | null; target_end: string | null;
  sections: Section[];
}
export interface TimeLog {
  id: string; phase_id: string; logged_on: string; minutes: number; note: string | null;
}

export const PHASE_COLORS = ["#2ec4b6", "#ffc94d", "#4cc9f0", "#c8b6ff", "#ff8a5c"] as const;
export const phaseColor = (sortOrder: number) =>
  PHASE_COLORS[((sortOrder % PHASE_COLORS.length) + PHASE_COLORS.length) % PHASE_COLORS.length];

export const WEEKLY_GOAL_MIN = 360; // minutes (6 h)
export const WEEKLY_GOAL_MAX = 480; // minutes (8 h)
