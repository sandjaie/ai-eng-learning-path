"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { runCurriculumUpgrade } from "@/lib/curriculum/apply";
import { detectProvider } from "@/lib/provider";
import { computeEndedMinutes, findOpenSession, isValidHttpsUrl } from "@/lib/session";
import { shouldMarkItemDone, shouldReopenItem } from "@/lib/study-next";
import { createClient } from "@/lib/supabase/server";
import type { ItemKind, ItemStatus, SectionKind } from "@/lib/types";

function refresh(opts?: { phaseId?: string; itemId?: string }) {
  revalidatePath("/");
  revalidatePath("/plan");
  revalidatePath("/progress");
  if (opts?.phaseId) revalidatePath(`/phase/${opts.phaseId}`);
  if (opts?.itemId) revalidatePath(`/study/${opts.itemId}`);
}

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const orNull = (s: string) => (s === "" ? null : s);

// ---------- phases ----------

export async function createPhase(formData: FormData) {
  const title = str(formData, "title");
  if (!title) return;
  const supabase = await createClient();
  const { data: existing, error: readError } = await supabase
    .from("phases").select("sort_order").order("sort_order", { ascending: false }).limit(1);
  if (readError) throw readError;
  const { data, error } = await supabase
    .from("phases")
    .insert({ title, sort_order: (existing?.[0]?.sort_order ?? -1) + 1 })
    .select("id")
    .single();
  if (error) throw error;
  refresh();
  redirect(`/plan?phase=${data.id}`);
}

export async function updatePhase(id: string, formData: FormData) {
  const title = str(formData, "title");
  if (!title) return;
  const supabase = await createClient();
  const { error } = await supabase
    .from("phases")
    .update({
      title,
      description: orNull(str(formData, "description")),
      target_start: orNull(str(formData, "target_start")),
      target_end: orNull(str(formData, "target_end")),
    })
    .eq("id", id);
  if (error) throw error;
  refresh({ phaseId: id });
}

export async function deletePhase(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("phases").delete().eq("id", id);
  if (error) throw error;
  refresh();
  redirect("/plan");
}

export async function savePhaseNotes(id: string, notes: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("phases").update({ notes: orNull(notes.trim()) }).eq("id", id);
  if (error) throw error;
  refresh({ phaseId: id });
}

// ---------- ordering helper ----------

async function swapOrder(
  table: "sections" | "items",
  scope: { column: string; value: string },
  id: string,
  dir: -1 | 1,
) {
  const supabase = await createClient();
  const { data: rows, error } = await supabase
    .from(table)
    .select("id, sort_order")
    .eq(scope.column, scope.value)
    .order("sort_order");
  if (error) throw error;
  const i = rows.findIndex((r) => r.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= rows.length) return;
  // ponytail: two updates, no transaction — single-user app, worst case is a re-click
  const { error: firstError } = await supabase
    .from(table).update({ sort_order: rows[j].sort_order }).eq("id", rows[i].id);
  if (firstError) throw firstError;
  const { error: secondError } = await supabase
    .from(table).update({ sort_order: rows[i].sort_order }).eq("id", rows[j].id);
  if (secondError) throw secondError;
}

// ---------- sections ----------

export async function createSection(phaseId: string, formData: FormData) {
  const title = str(formData, "title");
  if (!title) return;
  const supabase = await createClient();
  const { data: existing, error: readError } = await supabase
    .from("sections").select("sort_order").eq("phase_id", phaseId)
    .order("sort_order", { ascending: false }).limit(1);
  if (readError) throw readError;
  const { error } = await supabase
    .from("sections")
    .insert({ phase_id: phaseId, title, sort_order: (existing?.[0]?.sort_order ?? -1) + 1 });
  if (error) throw error;
  refresh({ phaseId });
}

export async function renameSection(id: string, phaseId: string, title: string) {
  if (!title.trim()) return;
  const supabase = await createClient();
  const { error } = await supabase.from("sections").update({ title: title.trim() }).eq("id", id);
  if (error) throw error;
  refresh({ phaseId });
}

export async function deleteSection(id: string, phaseId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("sections").delete().eq("id", id);
  if (error) throw error;
  refresh({ phaseId });
}

export async function moveSection(id: string, phaseId: string, dir: -1 | 1) {
  await swapOrder("sections", { column: "phase_id", value: phaseId }, id, dir);
  refresh({ phaseId });
}

// ---------- items ----------

export async function createItem(sectionId: string, phaseId: string, formData: FormData) {
  const title = str(formData, "title");
  if (!title) return;
  const url = orNull(str(formData, "url"));
  const supabase = await createClient();
  const { data: section } = await supabase
    .from("sections")
    .select("kind")
    .eq("id", sectionId)
    .single();
  const kindMap: Record<string, ItemKind> = {
    projects: "project_task",
    outcomes: "milestone",
    resources: "reference",
    topics: "topic",
    custom: "topic",
  };
  const kind = kindMap[section?.kind as string] ?? "topic";
  const { data: existing, error: readError } = await supabase
    .from("items").select("sort_order").eq("section_id", sectionId)
    .order("sort_order", { ascending: false }).limit(1);
  if (readError) throw readError;
  const { error } = await supabase.from("items").insert({
    section_id: sectionId,
    title,
    url,
    provider: url ? detectProvider(url) : null,
    kind: kind === "reference" ? "topic" : kind, // plan editor does not create reference rows
    sort_order: (existing?.[0]?.sort_order ?? -1) + 1,
  });
  if (error) throw error;
  refresh({ phaseId });
}

export async function updateItem(id: string, phaseId: string, formData: FormData) {
  const title = str(formData, "title");
  if (!title) return;
  const url = orNull(str(formData, "url"));
  let provider = orNull(str(formData, "provider"));
  if (!provider && url) provider = detectProvider(url);
  const supabase = await createClient();
  const { error } = await supabase.from("items").update({ title, url, provider }).eq("id", id);
  if (error) throw error;
  refresh({ phaseId, itemId: id });
}

export async function deleteItem(id: string, phaseId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("items").delete().eq("id", id);
  if (error) throw error;
  refresh({ phaseId });
}

const NEXT_STATUS: Record<ItemStatus, ItemStatus> = {
  todo: "in_progress",
  in_progress: "done",
  done: "todo",
};

export async function cycleItemStatus(id: string, phaseId: string) {
  const supabase = await createClient();
  const { data: item, error } = await supabase.from("items").select("status").eq("id", id).single();
  if (error) throw error;
  const next = NEXT_STATUS[item.status as ItemStatus];
  const { error: updateError } = await supabase
    .from("items")
    .update({ status: next, completed_at: next === "done" ? new Date().toISOString() : null })
    .eq("id", id);
  if (updateError) throw updateError;
  refresh({ phaseId, itemId: id });
}

export async function moveItem(id: string, sectionId: string, phaseId: string, dir: -1 | 1) {
  await swapOrder("items", { column: "section_id", value: sectionId }, id, dir);
  refresh({ phaseId });
}

export async function saveItemNotes(id: string, phaseId: string, notes: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("items").update({ notes: orNull(notes.trim()) }).eq("id", id);
  if (error) throw error;
  refresh({ phaseId, itemId: id });
}

// ---------- time logs ----------

export async function createTimeLog(phaseId: string, formData: FormData) {
  const hours = Number(formData.get("hours"));
  if (!Number.isFinite(hours) || hours <= 0) return;
  const supabase = await createClient();
  const { error } = await supabase.from("time_logs").insert({
    phase_id: phaseId,
    logged_on: orNull(str(formData, "logged_on")) ?? new Date().toISOString().slice(0, 10),
    minutes: Math.round(hours * 60),
    note: orNull(str(formData, "note")),
  });
  if (error) throw error;
  refresh({ phaseId });
}

export async function deleteTimeLog(id: string, phaseId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("time_logs").delete().eq("id", id);
  if (error) throw error;
  refresh({ phaseId });
}

// ---------- study command ----------

export async function activatePhase(phaseId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: current } = await supabase
    .from("phases")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .is("archived_at", null);
  for (const row of current ?? []) {
    const { error } = await supabase
      .from("phases")
      .update({ status: "complete" })
      .eq("id", row.id);
    if (error) return { error: error.message };
  }

  const { error } = await supabase
    .from("phases")
    .update({ status: "active", activated_at: new Date().toISOString() })
    .eq("id", phaseId);
  if (error) return { error: error.message };
  refresh({ phaseId });
  return { error: null };
}

export async function pinStudyItem(itemId: string | null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  const { error } = await supabase.from("user_preferences").upsert({
    user_id: user.id,
    pinned_item_id: itemId,
  });
  if (error) return { error: error.message };
  refresh({ itemId: itemId ?? undefined });
  return { error: null };
}

export async function startStudySession(phaseId: string, itemId: string | null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", sessionId: null };

  const { data: logs } = await supabase
    .from("time_logs")
    .select("id, started_at, ended_at")
    .eq("user_id", user.id);
  const openId = findOpenSession(logs ?? []);
  if (openId) {
    refresh({ phaseId, itemId: itemId ?? undefined });
    return { error: null, sessionId: openId };
  }

  const { data, error } = await supabase
    .from("time_logs")
    .insert({
      phase_id: phaseId,
      item_id: itemId,
      logged_on: new Date().toISOString().slice(0, 10),
      minutes: 0,
      started_at: new Date().toISOString(),
      ended_at: null,
      note: null,
    })
    .select("id")
    .single();
  if (error) return { error: error.message, sessionId: null };

  if (itemId) {
    await supabase
      .from("items")
      .update({ status: "in_progress", started_at: new Date().toISOString() })
      .eq("id", itemId)
      .eq("status", "todo");
  }

  refresh({ phaseId, itemId: itemId ?? undefined });
  return { error: null, sessionId: data.id as string };
}

export async function endStudySession(sessionId: string) {
  const supabase = await createClient();
  const { data: session, error } = await supabase
    .from("time_logs")
    .select("id, phase_id, item_id, started_at, ended_at")
    .eq("id", sessionId)
    .single();
  if (error) return { error: error.message };
  if (!session.started_at || session.ended_at) return { error: "No open session" };

  const endedAt = new Date().toISOString();
  const minutes = computeEndedMinutes(session.started_at, endedAt);
  const { error: updateError } = await supabase
    .from("time_logs")
    .update({ ended_at: endedAt, minutes })
    .eq("id", sessionId);
  if (updateError) return { error: updateError.message };
  refresh({
    phaseId: session.phase_id as string,
    itemId: (session.item_id as string | null) ?? undefined,
  });
  return { error: null };
}

export async function upsertPreferences(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  const path_title = str(formData, "path_title") || "AI Engineer Path";
  const path_goal = orNull(str(formData, "path_goal"));
  const weekly_goal_min_minutes = Number(formData.get("weekly_goal_min_minutes")) || 360;
  const weekly_goal_max_minutes = Number(formData.get("weekly_goal_max_minutes")) || 480;
  const { error } = await supabase.from("user_preferences").upsert({
    user_id: user.id,
    path_title,
    path_goal,
    weekly_goal_min_minutes,
    weekly_goal_max_minutes,
  });
  if (error) return { error: error.message };
  refresh();
  return { error: null };
}

export async function createResource(phaseId: string, formData: FormData) {
  const title = str(formData, "title");
  const url = str(formData, "url");
  if (!title || !isValidHttpsUrl(url)) return { error: "Title and HTTPS URL required" };
  const itemId = orNull(str(formData, "item_id"));
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("resources")
    .select("sort_order")
    .eq("phase_id", phaseId)
    .order("sort_order", { ascending: false })
    .limit(1);
  const { error } = await supabase.from("resources").insert({
    phase_id: phaseId,
    item_id: itemId,
    title,
    url,
    provider: orNull(str(formData, "provider")) ?? detectProvider(url),
    resource_type: str(formData, "resource_type") || "other",
    priority: str(formData, "priority") || "primary",
    status: "planned",
    estimated_minutes: Number(formData.get("estimated_minutes")) || null,
    description: orNull(str(formData, "description")),
    sort_order: (existing?.[0]?.sort_order ?? -1) + 1,
  });
  if (error) return { error: error.message };
  refresh({ phaseId, itemId: itemId ?? undefined });
  return { error: null };
}

export async function updateResourceStatus(
  id: string,
  phaseId: string,
  status: "planned" | "using" | "completed",
  itemId?: string,
) {
  const supabase = await createClient();
  const { error } = await supabase.from("resources").update({ status }).eq("id", id);
  if (error) return { error: error.message };
  refresh({ phaseId, itemId });
  return { error: null };
}

export async function deleteResource(id: string, phaseId: string, itemId?: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("resources").delete().eq("id", id);
  if (error) return { error: error.message };
  refresh({ phaseId, itemId });
  return { error: null };
}

export async function createCriterion(itemId: string, phaseId: string, formData: FormData) {
  const description = str(formData, "description");
  if (!description) return { error: "Description required" };
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("achievement_criteria")
    .select("sort_order")
    .eq("item_id", itemId)
    .order("sort_order", { ascending: false })
    .limit(1);
  const { error } = await supabase.from("achievement_criteria").insert({
    item_id: itemId,
    description,
    is_required: formData.get("is_required") !== "false",
    sort_order: (existing?.[0]?.sort_order ?? -1) + 1,
  });
  if (error) return { error: error.message };
  refresh({ phaseId, itemId });
  return { error: null };
}

export async function toggleCriterion(
  id: string,
  itemId: string,
  phaseId: string,
  achieved: boolean,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("achievement_criteria")
    .update({ achieved_at: achieved ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) return { error: error.message };

  const { data: criteria } = await supabase
    .from("achievement_criteria")
    .select("is_required, achieved_at")
    .eq("item_id", itemId);
  const { data: item } = await supabase.from("items").select("status").eq("id", itemId).single();
  if (criteria && item) {
    if (shouldMarkItemDone(criteria)) {
      await supabase
        .from("items")
        .update({ status: "done", completed_at: new Date().toISOString() })
        .eq("id", itemId);
    } else if (shouldReopenItem(criteria, item.status as ItemStatus)) {
      await supabase
        .from("items")
        .update({ status: "in_progress", completed_at: null })
        .eq("id", itemId);
    }
  }

  refresh({ phaseId, itemId });
  return { error: null };
}

export async function markItemAchieved(itemId: string, phaseId: string) {
  const supabase = await createClient();
  const { data: criteria } = await supabase
    .from("achievement_criteria")
    .select("is_required, achieved_at")
    .eq("item_id", itemId);
  const required = (criteria ?? []).filter((c) => c.is_required);
  if (required.length > 0 && !shouldMarkItemDone(criteria ?? [])) {
    return { error: "Complete required criteria first" };
  }
  const { error } = await supabase
    .from("items")
    .update({ status: "done", completed_at: new Date().toISOString() })
    .eq("id", itemId);
  if (error) return { error: error.message };

  // Complete phase when all trackable items done
  const { data: phaseSections } = await supabase
    .from("sections")
    .select("id, items(id, status, kind)")
    .eq("phase_id", phaseId);
  const trackable = (phaseSections ?? []).flatMap((s) =>
    ((s.items ?? []) as { status: string; kind: string }[]).filter((i) =>
      ["topic", "project_task", "milestone"].includes(i.kind),
    ),
  );
  if (trackable.length > 0 && trackable.every((i) => i.status === "done")) {
    await supabase.from("phases").update({ status: "complete" }).eq("id", phaseId);
  }

  refresh({ phaseId, itemId });
  return { error: null };
}

export async function createEvidence(itemId: string, phaseId: string, formData: FormData) {
  const kind = str(formData, "kind") === "link" ? "link" : "note";
  const content = str(formData, "content");
  if (!content) return { error: "Content required" };
  if (kind === "link" && !isValidHttpsUrl(content)) return { error: "HTTPS URL required" };
  const supabase = await createClient();
  const { error } = await supabase.from("evidence").insert({
    item_id: itemId,
    criterion_id: orNull(str(formData, "criterion_id")),
    kind,
    content,
    label: orNull(str(formData, "label")),
  });
  if (error) return { error: error.message };
  refresh({ phaseId, itemId });
  return { error: null };
}

export async function deleteEvidence(id: string, itemId: string, phaseId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("evidence").delete().eq("id", id);
  if (error) return { error: error.message };
  refresh({ phaseId, itemId });
  return { error: null };
}

export async function updateItemMeta(
  id: string,
  phaseId: string,
  fields: { kind?: ItemKind; estimated_minutes?: number | null },
) {
  const supabase = await createClient();
  const { error } = await supabase.from("items").update(fields).eq("id", id);
  if (error) return { error: error.message };
  refresh({ phaseId, itemId: id });
  return { error: null };
}

export async function updateSectionKind(id: string, phaseId: string, kind: SectionKind) {
  const supabase = await createClient();
  const { error } = await supabase.from("sections").update({ kind }).eq("id", id);
  if (error) return { error: error.message };
  refresh({ phaseId });
  return { error: null };
}

export async function upgradeCurriculumAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  const result = await runCurriculumUpgrade(supabase, user.id);
  refresh();
  return result;
}

export async function savePathBuilder(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const path_title = str(formData, "path_title") || "My learning path";
  const path_goal = orNull(str(formData, "path_goal"));
  const weekly_goal_min_minutes = Number(formData.get("weekly_goal_min_minutes")) || 360;
  const weekly_goal_max_minutes = Number(formData.get("weekly_goal_max_minutes")) || 480;
  const phaseTitles = str(formData, "phase_titles")
    .split("\n")
    .map((t) => t.trim())
    .filter(Boolean);

  await supabase.from("user_preferences").upsert({
    user_id: user.id,
    path_title,
    path_goal,
    weekly_goal_min_minutes,
    weekly_goal_max_minutes,
  });

  const { count } = await supabase
    .from("phases")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);
  if ((count ?? 0) > 0) return { error: "Path already exists — use the plan editor" };

  let firstId: string | null = null;
  for (let i = 0; i < phaseTitles.length; i++) {
    const { data, error } = await supabase
      .from("phases")
      .insert({
        title: phaseTitles[i],
        sort_order: i,
        status: i === 0 ? "active" : "planned",
        activated_at: i === 0 ? new Date().toISOString() : null,
      })
      .select("id")
      .single();
    if (error) return { error: error.message };
    if (i === 0) firstId = data.id as string;
    await supabase.from("sections").insert({
      phase_id: data.id,
      title: "Topics",
      kind: "topics",
      sort_order: 0,
    });
  }

  refresh({ phaseId: firstId ?? undefined });
  return { error: null, phaseId: firstId };
}

// ---------- auth ----------

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}


// Form-action wrappers (must return void for Next.js form actions)
export async function activatePhaseAction(phaseId: string) {
  await activatePhase(phaseId);
}
export async function pinStudyItemAction(itemId: string | null) {
  await pinStudyItem(itemId);
}
export async function createResourceAction(phaseId: string, formData: FormData) {
  await createResource(phaseId, formData);
}
export async function updateResourceStatusAction(
  id: string,
  phaseId: string,
  status: "planned" | "using" | "completed",
  itemId?: string,
) {
  await updateResourceStatus(id, phaseId, status, itemId);
}
export async function deleteResourceAction(id: string, phaseId: string, itemId?: string) {
  await deleteResource(id, phaseId, itemId);
}
export async function createCriterionAction(itemId: string, phaseId: string, formData: FormData) {
  await createCriterion(itemId, phaseId, formData);
}
export async function toggleCriterionAction(
  id: string,
  itemId: string,
  phaseId: string,
  achieved: boolean,
) {
  await toggleCriterion(id, itemId, phaseId, achieved);
}
export async function markItemAchievedAction(itemId: string, phaseId: string) {
  await markItemAchieved(itemId, phaseId);
}
export async function createEvidenceAction(itemId: string, phaseId: string, formData: FormData) {
  await createEvidence(itemId, phaseId, formData);
}
export async function upgradeCurriculumFormAction() {
  await upgradeCurriculumAction();
}
export async function savePathBuilderAction(formData: FormData) {
  await savePathBuilder(formData);
}
