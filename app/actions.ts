"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { detectProvider } from "@/lib/provider";
import { createClient } from "@/lib/supabase/server";
import type { ItemStatus } from "@/lib/types";

function refresh(phaseId?: string) {
  revalidatePath("/");
  if (phaseId) revalidatePath(`/phase/${phaseId}`);
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
  redirect(`/phase/${data.id}`);
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
  refresh(id);
}

export async function deletePhase(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("phases").delete().eq("id", id);
  if (error) throw error;
  refresh();
  redirect("/");
}

export async function savePhaseNotes(id: string, notes: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("phases").update({ notes: orNull(notes.trim()) }).eq("id", id);
  if (error) throw error;
  refresh(id);
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
  refresh(phaseId);
}

export async function renameSection(id: string, phaseId: string, title: string) {
  if (!title.trim()) return;
  const supabase = await createClient();
  const { error } = await supabase.from("sections").update({ title: title.trim() }).eq("id", id);
  if (error) throw error;
  refresh(phaseId);
}

export async function deleteSection(id: string, phaseId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("sections").delete().eq("id", id);
  if (error) throw error;
  refresh(phaseId);
}

export async function moveSection(id: string, phaseId: string, dir: -1 | 1) {
  await swapOrder("sections", { column: "phase_id", value: phaseId }, id, dir);
  refresh(phaseId);
}

// ---------- items ----------

export async function createItem(sectionId: string, phaseId: string, formData: FormData) {
  const title = str(formData, "title");
  if (!title) return;
  const url = orNull(str(formData, "url"));
  const supabase = await createClient();
  const { data: existing, error: readError } = await supabase
    .from("items").select("sort_order").eq("section_id", sectionId)
    .order("sort_order", { ascending: false }).limit(1);
  if (readError) throw readError;
  const { error } = await supabase.from("items").insert({
    section_id: sectionId,
    title,
    url,
    provider: url ? detectProvider(url) : null,
    sort_order: (existing?.[0]?.sort_order ?? -1) + 1,
  });
  if (error) throw error;
  refresh(phaseId);
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
  refresh(phaseId);
}

export async function deleteItem(id: string, phaseId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("items").delete().eq("id", id);
  if (error) throw error;
  refresh(phaseId);
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
  refresh(phaseId);
}

export async function moveItem(id: string, sectionId: string, phaseId: string, dir: -1 | 1) {
  await swapOrder("items", { column: "section_id", value: sectionId }, id, dir);
  refresh(phaseId);
}

export async function saveItemNotes(id: string, phaseId: string, notes: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("items").update({ notes: orNull(notes.trim()) }).eq("id", id);
  if (error) throw error;
  refresh(phaseId);
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
  refresh(phaseId);
}

export async function deleteTimeLog(id: string, phaseId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("time_logs").delete().eq("id", id);
  if (error) throw error;
  refresh(phaseId);
}

// ---------- auth ----------

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
