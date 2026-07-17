import { createClient } from "@/lib/supabase/server";
import type { Phase, UserPreferences } from "@/lib/types";

export async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return { supabase, user };
}

export async function loadPhasesWithTree(): Promise<Phase[]> {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("phases")
    .select(`
      id, title, description, notes, sort_order, target_start, target_end,
      status, activated_at, archived_at, source_key, source_revision,
      sections (
        id, phase_id, title, sort_order, kind, source_key, source_revision,
        items (
          id, section_id, title, url, provider, status, notes, completed_at,
          sort_order, kind, estimated_minutes, started_at, source_key, source_revision
        )
      )
    `)
    .is("archived_at", null)
    .order("sort_order");
  if (error) throw error;

  return (data ?? []).map((p) => ({
    ...p,
    sections: [...(p.sections ?? [])]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((s) => ({
        ...s,
        items: [...(s.items ?? [])].sort((a, b) => a.sort_order - b.sort_order),
      })),
  })) as Phase[];
}

export async function loadPreferences(): Promise<UserPreferences | null> {
  const { supabase, user } = await requireUser();
  const { data } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  return data as UserPreferences | null;
}
