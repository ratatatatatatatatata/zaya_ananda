import sourceStrings from "@/data/translation-sources.json";
import { getSettingsCached, listCmsCached, listPagesCached } from "./repo";
import { listJourneysCached } from "./journeys-db";
import type { Locale } from "./types";

import { normalizeTranslationSource, splitTranslationText, hasTranslatableText, decodeTranslationEntities } from "./translation-text";
export { normalizeTranslationSource } from "./translation-text";
const fields = new Set(["name", "title", "summary", "body", "navLabel", "category", "level", "nextNote", "teacherName", "teacherRole", "teacherInfo", "role", "info", "text", "description", "desc", "caption", "label", "q", "a", "days", "groupSize", "tagline", "audience", "route", "duration", "location", "activity", "meals", "stay", "highlights", "includes", "excludes", "included", "excluded", "transport", "bullets", "schedule", "note", "address", "hours", "price"]);
export function addPublicText(set: Set<string>, value: string) {
  const clean = value.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
  const parts = [clean, clean.replace(/<[^>]*>/g, " "), ...clean.split(/<[^>]*>|\r?\n/g)];
  for (const part of parts) {
    const text = normalizeTranslationSource(decodeTranslationEntities(part));
    if (!hasTranslatableText(text)) continue;
    set.add(text);
    splitTranslationText(text).forEach(chunk => set.add(chunk));
  }
}
export function collectPublicText(set: Set<string>, value: unknown, key = "") {
  if (typeof value === "string") { if (fields.has(key)) addPublicText(set,value); return; }
  if (Array.isArray(value)) { value.forEach(child=>collectPublicText(set,child,key)); return; }
  if (value && typeof value === "object") for (const [childKey, child] of Object.entries(value)) {
    if (["i18n","bank","lessons","images","image","video","url","link","path","email","phone"].includes(childKey)) continue;
    collectPublicText(set,child,childKey);
  }
}
export async function translationCatalog(locale: Locale) {
  const allowed = new Set<string>();
  sourceStrings.forEach(text=>addPublicText(allowed,text));
  const [items, journeys, settings, pages] = await Promise.all([
    Promise.all((["service","course","product","resource","free","promo"] as const).map(listCmsCached)).then(lists=>lists.flat()),
    listJourneysCached(), getSettingsCached(), listPagesCached(),
  ]);
  collectPublicText(allowed,items); collectPublicText(allowed,journeys); collectPublicText(allowed,pages);
  // Lesson titles are public catalogue labels; never include protected media paths.
  for (const item of items) for (const lesson of item.lessons || []) addPublicText(allowed, lesson.title);
  // Known, explicitly authored language variants may also appear in CMS previews.
  for (const item of [...items, ...pages]) for (const row of Object.values(item.i18n || {})) collectPublicText(allowed, row);
  // Only published settings text. No users, orders, submissions, or bank details.
  for (const key of ["aboutTitle","aboutBody","aboutMission","aboutStory"] as const) if (settings[key]) addPublicText(allowed,settings[key]!);
  for (const key of ["aboutStats","aboutValues","aboutFaqs","aboutGallery","aboutMilestones","aboutProgramMilestones","aboutPartners","teachers","team","zurhaiCards","customMoods","zurhaiRules","contact"] as const) collectPublicText(allowed,settings[key]);
  const overrides = new Map<string,string>();
  for (const item of [...items,...pages]) for (const field of ["title","summary","body","navLabel"] as const) {
    const source = (item as unknown as Record<string,unknown>)[field];
    const translated = item.i18n?.[locale]?.[field];
    if (typeof source === "string" && translated?.trim() && !/<[a-z]/i.test(source)) overrides.set(normalizeTranslationSource(source),translated);
  }
  return {allowed,overrides};
}
