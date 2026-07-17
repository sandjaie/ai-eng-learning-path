import { writeFileSync } from "node:fs";
import { materializeCurriculum } from "../lib/curriculum/materialize";

function sqlStr(value: string | null): string {
  if (value == null) return "null";
  return `'${value.replace(/'/g, "''")}'`;
}

function emit(): string {
  const m = materializeCurriculum();
  const lines: string[] = [];
  lines.push("-- Generated from lib/curriculum — do not edit by hand.");
  lines.push("-- Included by supabase/seed.sql");
  lines.push("");

  for (const phase of m.phases) {
    lines.push(`  insert into public.phases (`);
    lines.push(`    user_id, title, description, sort_order, target_start, target_end,`);
    lines.push(`    status, activated_at, source_key, source_revision`);
    lines.push(`  ) values (`);
    lines.push(`    uid, ${sqlStr(phase.title)}, ${sqlStr(phase.description)}, ${phase.sort_order},`);
    lines.push(`    ${sqlStr(phase.target_start)}, ${sqlStr(phase.target_end)},`);
    lines.push(`    ${sqlStr(phase.status)}, ${phase.status === "active" ? "now()" : "null"},`);
    lines.push(`    ${sqlStr(phase.source_key)}, ${sqlStr(phase.source_revision)}`);
    lines.push(`  );`);
  }

  lines.push("");
  lines.push(`  insert into public.user_preferences (`);
  lines.push(`    user_id, path_title, path_goal, weekly_goal_min_minutes, weekly_goal_max_minutes`);
  lines.push(`  ) values (`);
  lines.push(`    uid, ${sqlStr(m.path_title)}, ${sqlStr(m.path_goal)},`);
  lines.push(`    ${m.weekly_goal_min_minutes}, ${m.weekly_goal_max_minutes}`);
  lines.push(`  ) on conflict (user_id) do update set`);
  lines.push(`    path_title = excluded.path_title,`);
  lines.push(`    path_goal = excluded.path_goal,`);
  lines.push(`    weekly_goal_min_minutes = excluded.weekly_goal_min_minutes,`);
  lines.push(`    weekly_goal_max_minutes = excluded.weekly_goal_max_minutes,`);
  lines.push(`    updated_at = now();`);
  lines.push("");

  for (const section of m.sections) {
    lines.push(`  insert into public.sections (`);
    lines.push(`    user_id, phase_id, title, sort_order, kind, source_key, source_revision`);
    lines.push(`  ) select uid, p.id, ${sqlStr(section.title)}, ${section.sort_order},`);
    lines.push(`    ${sqlStr(section.kind)}, ${sqlStr(section.source_key)}, ${sqlStr(section.source_revision)}`);
    lines.push(`  from public.phases p`);
    lines.push(`  where p.user_id = uid and p.source_key = ${sqlStr(section.phase_source_key)};`);
  }
  lines.push("");

  for (const item of m.items) {
    lines.push(`  insert into public.items (`);
    lines.push(`    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision`);
    lines.push(`  ) select uid, s.id, ${sqlStr(item.title)}, ${item.sort_order},`);
    lines.push(`    ${sqlStr(item.kind)}, ${item.estimated_minutes ?? "null"},`);
    lines.push(`    ${sqlStr(item.source_key)}, ${sqlStr(item.source_revision)}`);
    lines.push(`  from public.sections s`);
    lines.push(`  where s.user_id = uid and s.source_key = ${sqlStr(item.section_source_key)};`);
  }
  lines.push("");

  for (const c of m.criteria) {
    lines.push(`  insert into public.achievement_criteria (`);
    lines.push(`    user_id, item_id, description, is_required, sort_order, source_key, source_revision`);
    lines.push(`  ) select uid, i.id, ${sqlStr(c.description)}, ${c.is_required}, ${c.sort_order},`);
    lines.push(`    ${sqlStr(c.source_key)}, ${sqlStr(c.source_revision)}`);
    lines.push(`  from public.items i`);
    lines.push(`  where i.user_id = uid and i.source_key = ${sqlStr(c.item_source_key)};`);
  }
  lines.push("");

  for (const r of m.resources) {
    lines.push(`  insert into public.resources (`);
    lines.push(`    user_id, phase_id, item_id, title, url, provider, resource_type, priority,`);
    lines.push(`    estimated_minutes, description, sort_order, source_key, source_revision, verified_at, status`);
    lines.push(`  ) select uid, p.id,`);
    if (r.item_source_key) {
      lines.push(`    (select i.id from public.items i where i.user_id = uid and i.source_key = ${sqlStr(r.item_source_key)}),`);
    } else {
      lines.push(`    null,`);
    }
    lines.push(`    ${sqlStr(r.title)}, ${sqlStr(r.url)}, ${sqlStr(r.provider)}, ${sqlStr(r.resource_type)},`);
    lines.push(`    ${sqlStr(r.priority)}, ${r.estimated_minutes ?? "null"}, ${sqlStr(r.description)},`);
    lines.push(`    ${r.sort_order}, ${sqlStr(r.source_key)}, ${sqlStr(r.source_revision)},`);
    lines.push(`    ${sqlStr(r.verified_at)}, 'planned'`);
    lines.push(`  from public.phases p`);
    lines.push(`  where p.user_id = uid and p.source_key = ${sqlStr(r.phase_source_key)};`);
  }

  return lines.join("\n");
}

const body = emit();
writeFileSync(new URL("../supabase/seed-curriculum-body.sql", import.meta.url), `${body}\n`);
console.log("Wrote supabase/seed-curriculum-body.sql");
