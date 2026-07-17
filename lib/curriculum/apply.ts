import type { SupabaseClient } from "@supabase/supabase-js";
import { materializeCurriculum } from "./materialize";
import { curriculumRoadmap } from "./roadmap";
import { planCurriculumUpgrade, type Snapshot } from "./upgrade";

type Db = SupabaseClient;

/** Insert a full curriculum for a user who has no phases. */
export async function insertCurriculumForUser(
  supabase: Db,
  userId: string,
): Promise<{ error: string | null }> {
  const m = materializeCurriculum();
  const { error: prefError } = await supabase.from("user_preferences").upsert({
    user_id: userId,
    path_title: m.path_title,
    path_goal: m.path_goal,
    weekly_goal_min_minutes: m.weekly_goal_min_minutes,
    weekly_goal_max_minutes: m.weekly_goal_max_minutes,
  });
  if (prefError) return { error: prefError.message };

  for (const phase of m.phases) {
    const { error } = await supabase.from("phases").insert({
      user_id: userId,
      title: phase.title,
      description: phase.description,
      sort_order: phase.sort_order,
      target_start: phase.target_start,
      target_end: phase.target_end,
      status: phase.status,
      activated_at: phase.status === "active" ? new Date().toISOString() : null,
      source_key: phase.source_key,
      source_revision: phase.source_revision,
    });
    if (error) return { error: error.message };
  }

  const { data: phases, error: phaseReadError } = await supabase
    .from("phases")
    .select("id, source_key")
    .eq("user_id", userId);
  if (phaseReadError) return { error: phaseReadError.message };
  const phaseIdByKey = new Map(
    (phases ?? []).map((p) => [p.source_key as string, p.id as string]),
  );

  for (const section of m.sections) {
    const phase_id = phaseIdByKey.get(section.phase_source_key);
    if (!phase_id) return { error: `Missing phase ${section.phase_source_key}` };
    const { error } = await supabase.from("sections").insert({
      user_id: userId,
      phase_id,
      title: section.title,
      sort_order: section.sort_order,
      kind: section.kind,
      source_key: section.source_key,
      source_revision: section.source_revision,
    });
    if (error) return { error: error.message };
  }

  const { data: sections, error: sectionReadError } = await supabase
    .from("sections")
    .select("id, source_key")
    .eq("user_id", userId);
  if (sectionReadError) return { error: sectionReadError.message };
  const sectionIdByKey = new Map(
    (sections ?? []).map((s) => [s.source_key as string, s.id as string]),
  );

  for (const item of m.items) {
    const section_id = sectionIdByKey.get(item.section_source_key);
    if (!section_id) return { error: `Missing section ${item.section_source_key}` };
    const { error } = await supabase.from("items").insert({
      user_id: userId,
      section_id,
      title: item.title,
      sort_order: item.sort_order,
      kind: item.kind,
      estimated_minutes: item.estimated_minutes,
      source_key: item.source_key,
      source_revision: item.source_revision,
    });
    if (error) return { error: error.message };
  }

  const { data: items, error: itemReadError } = await supabase
    .from("items")
    .select("id, source_key")
    .eq("user_id", userId);
  if (itemReadError) return { error: itemReadError.message };
  const itemIdByKey = new Map(
    (items ?? []).map((i) => [i.source_key as string, i.id as string]),
  );

  for (const c of m.criteria) {
    const item_id = itemIdByKey.get(c.item_source_key);
    if (!item_id) return { error: `Missing item ${c.item_source_key}` };
    const { error } = await supabase.from("achievement_criteria").insert({
      user_id: userId,
      item_id,
      description: c.description,
      is_required: c.is_required,
      sort_order: c.sort_order,
      source_key: c.source_key,
      source_revision: c.source_revision,
    });
    if (error) return { error: error.message };
  }

  for (const r of m.resources) {
    const phase_id = phaseIdByKey.get(r.phase_source_key);
    if (!phase_id) return { error: `Missing phase ${r.phase_source_key}` };
    const { error } = await supabase.from("resources").insert({
      user_id: userId,
      phase_id,
      item_id: r.item_source_key ? itemIdByKey.get(r.item_source_key) ?? null : null,
      title: r.title,
      url: r.url,
      provider: r.provider,
      resource_type: r.resource_type,
      priority: r.priority,
      estimated_minutes: r.estimated_minutes,
      description: r.description,
      sort_order: r.sort_order,
      source_key: r.source_key,
      source_revision: r.source_revision,
      verified_at: r.verified_at,
      status: "planned",
    });
    if (error) return { error: error.message };
  }

  return { error: null };
}

/** Insert any missing curated children by source_key (retry-safe reconciliation). */
async function ensureCuratedChildren(
  supabase: Db,
  userId: string,
): Promise<{ error: string | null }> {
  const m = materializeCurriculum();
  const roadmapPhaseKeys = new Set(m.phases.map((p) => p.source_key));

  const { data: allPhases, error: phaseErr } = await supabase
    .from("phases")
    .select("id, source_key")
    .eq("user_id", userId);
  if (phaseErr) return { error: phaseErr.message };
  const phaseIdByKey = new Map(
    (allPhases ?? [])
      .filter((p) => p.source_key && roadmapPhaseKeys.has(p.source_key as string))
      .map((p) => [p.source_key as string, p.id as string]),
  );
  if (phaseIdByKey.size === 0) return { error: null };

  const { data: existingSections, error: secReadErr } = await supabase
    .from("sections")
    .select("id, source_key")
    .eq("user_id", userId);
  if (secReadErr) return { error: secReadErr.message };
  const sectionIdByKey = new Map(
    (existingSections ?? [])
      .filter((s) => s.source_key)
      .map((s) => [s.source_key as string, s.id as string]),
  );

  for (const section of m.sections) {
    if (!phaseIdByKey.has(section.phase_source_key)) continue;
    if (sectionIdByKey.has(section.source_key)) continue;
    const phase_id = phaseIdByKey.get(section.phase_source_key)!;
    const { data, error } = await supabase
      .from("sections")
      .insert({
        user_id: userId,
        phase_id,
        title: section.title,
        sort_order: section.sort_order,
        kind: section.kind,
        source_key: section.source_key,
        source_revision: section.source_revision,
      })
      .select("id")
      .single();
    if (error) return { error: error.message };
    sectionIdByKey.set(section.source_key, data.id as string);
  }

  const { data: existingItems, error: itemReadErr } = await supabase
    .from("items")
    .select("id, source_key")
    .eq("user_id", userId);
  if (itemReadErr) return { error: itemReadErr.message };
  const itemIdByKey = new Map(
    (existingItems ?? [])
      .filter((i) => i.source_key)
      .map((i) => [i.source_key as string, i.id as string]),
  );

  for (const item of m.items) {
    const section = m.sections.find((s) => s.source_key === item.section_source_key);
    if (!section || !phaseIdByKey.has(section.phase_source_key)) continue;
    if (itemIdByKey.has(item.source_key)) continue;
    const section_id = sectionIdByKey.get(item.section_source_key);
    if (!section_id) continue;
    const { data, error } = await supabase
      .from("items")
      .insert({
        user_id: userId,
        section_id,
        title: item.title,
        sort_order: item.sort_order,
        kind: item.kind,
        estimated_minutes: item.estimated_minutes,
        source_key: item.source_key,
        source_revision: item.source_revision,
      })
      .select("id")
      .single();
    if (error) return { error: error.message };
    itemIdByKey.set(item.source_key, data.id as string);
  }

  const { data: existingCriteria, error: critReadErr } = await supabase
    .from("achievement_criteria")
    .select("source_key")
    .eq("user_id", userId);
  if (critReadErr) return { error: critReadErr.message };
  const criterionKeys = new Set(
    (existingCriteria ?? []).map((c) => c.source_key as string | null).filter(Boolean),
  );

  for (const c of m.criteria) {
    if (criterionKeys.has(c.source_key)) continue;
    const item_id = itemIdByKey.get(c.item_source_key);
    if (!item_id) continue;
    const { error } = await supabase.from("achievement_criteria").insert({
      user_id: userId,
      item_id,
      description: c.description,
      is_required: c.is_required,
      sort_order: c.sort_order,
      source_key: c.source_key,
      source_revision: c.source_revision,
    });
    if (error) return { error: error.message };
    criterionKeys.add(c.source_key);
  }

  const { data: existingResources, error: resReadErr } = await supabase
    .from("resources")
    .select("source_key")
    .eq("user_id", userId);
  if (resReadErr) return { error: resReadErr.message };
  const resourceKeys = new Set(
    (existingResources ?? []).map((r) => r.source_key as string | null).filter(Boolean),
  );

  for (const r of m.resources) {
    if (!phaseIdByKey.has(r.phase_source_key)) continue;
    if (resourceKeys.has(r.source_key)) continue;
    const phase_id = phaseIdByKey.get(r.phase_source_key)!;
    const { error } = await supabase.from("resources").insert({
      user_id: userId,
      phase_id,
      item_id: r.item_source_key ? itemIdByKey.get(r.item_source_key) ?? null : null,
      title: r.title,
      url: r.url,
      provider: r.provider,
      resource_type: r.resource_type,
      priority: r.priority,
      estimated_minutes: r.estimated_minutes,
      description: r.description,
      sort_order: r.sort_order,
      source_key: r.source_key,
      source_revision: r.source_revision,
      verified_at: r.verified_at,
      status: "planned",
    });
    if (error) return { error: error.message };
    resourceKeys.add(r.source_key);
  }

  return { error: null };
}

export async function runCurriculumUpgrade(
  supabase: Db,
  userId: string,
): Promise<{ error: string | null; alreadyCurrent: boolean }> {
  const { data: phases, error: phaseError } = await supabase
    .from("phases")
    .select("id, title, source_key, source_revision, archived_at, sort_order, status")
    .eq("user_id", userId);
  if (phaseError) return { error: phaseError.message, alreadyCurrent: false };

  if (!phases?.length) {
    const inserted = await insertCurriculumForUser(supabase, userId);
    return { error: inserted.error, alreadyCurrent: false };
  }

  const { data: sections } = await supabase
    .from("sections")
    .select("id, phase_id")
    .eq("user_id", userId);
  const sectionPhase = new Map((sections ?? []).map((s) => [s.id as string, s.phase_id as string]));

  const { data: items } = await supabase
    .from("items")
    .select("id, title, source_key, status, notes, section_id")
    .eq("user_id", userId);

  const snapshot: Snapshot = {
    phases: phases as Snapshot["phases"],
    items: (items ?? []).map((i) => ({
      id: i.id as string,
      phase_id: sectionPhase.get(i.section_id as string) ?? "",
      title: i.title as string,
      source_key: (i.source_key as string | null) ?? null,
      status: i.status as string,
      notes: (i.notes as string | null) ?? null,
    })),
  };

  const plan = planCurriculumUpgrade(snapshot, curriculumRoadmap);

  for (const assign of plan.assignPhaseKeys) {
    const { error: upError } = await supabase
      .from("phases")
      .update({ source_key: assign.source_key, source_revision: plan.revision })
      .eq("id", assign.id);
    if (upError) return { error: upError.message, alreadyCurrent: false };
  }

  if (plan.removeBannedItemIds.length > 0) {
    const { error: delError } = await supabase
      .from("items")
      .delete()
      .in("id", plan.removeBannedItemIds);
    if (delError) return { error: delError.message, alreadyCurrent: false };
  }

  if (plan.archivePhaseIds.length > 0) {
    const { error: archError } = await supabase
      .from("phases")
      .update({ archived_at: new Date().toISOString() })
      .in("id", plan.archivePhaseIds);
    if (archError) return { error: archError.message, alreadyCurrent: false };
  }

  const m = materializeCurriculum();
  for (const phase of m.phases.filter((p) => plan.phasesToInsert.includes(p.source_key))) {
    const { error: insError } = await supabase.from("phases").insert({
      user_id: userId,
      title: phase.title,
      description: phase.description,
      sort_order: phase.sort_order,
      target_start: phase.target_start,
      target_end: phase.target_end,
      status: "planned",
      source_key: phase.source_key,
      source_revision: phase.source_revision,
    });
    // Unique violation means a prior partial run already created the phase — continue.
    if (insError && !/duplicate|unique/i.test(insError.message)) {
      return { error: insError.message, alreadyCurrent: false };
    }
  }

  // Always reconcile children so a failed mid-upgrade retry fills missing rows.
  const children = await ensureCuratedChildren(supabase, userId);
  if (children.error) return { error: children.error, alreadyCurrent: false };

  await supabase
    .from("phases")
    .update({ source_revision: plan.revision })
    .eq("user_id", userId)
    .not("source_key", "is", null);

  // Re-check after reconcile: only "already current" when nothing structural changed.
  if (
    plan.alreadyCurrent &&
    plan.phasesToInsert.length === 0 &&
    plan.assignPhaseKeys.length === 0
  ) {
    return { error: null, alreadyCurrent: true };
  }

  return { error: null, alreadyCurrent: false };
}
