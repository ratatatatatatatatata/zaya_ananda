import sourceStrings from "@/data/translation-sources.json";
import { getSettingsCached, listCmsCached, listPagesCached } from "./repo";
import { listJourneysCached } from "./journeys-db";
import type { Locale } from "./types";

export const normalizeTranslationSource = (value: string) => value.replace(/\s+/gu, " ").trim();
const fields = new Set(["name", "title", "summary", "body", "navLabel", "category", "level", "nextNote", "teacherRole", "teacherInfo", "role", "info", "text", "description", "desc", "caption", "label", "q", "a", "days", "groupSize", "tagline", "audience", "route", "duration", "location", "activity", "meals", "stay", "highlights", "includes", "excludes", "included", "excluded", "transport", "bullets", "schedule", "note", "address", "hours"]);
function decode(value: string) {
  return value.replace(/&(?:nbsp|amp|lt|gt|quot|apos|#39|#\d+|#x[0-9a-f]+);/gi, entity => {
    const known: Record<string,string> = {"&nbsp;":" ","&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&apos;":"'","&#39;":"'"};
    if (known[entity]) return known[entity];
    const code = entity.startsWith("&#x") ? parseInt(entity.slice(3),16) : parseInt(entity.slice(2),10);
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : entity;
  });
}
export function addPublicText(set: Set<string>, value: string) {
  for (const part of [value, ...value.split(/<[^>]*>|\r?\n/g)]) {
    const text = normalizeTranslationSource(decode(part));
    if (text && /[А-Яа-яӨөҮүЁё]/u.test(text)) set.add(text);
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
  // Only published settings text. No users, orders, submissions, or bank details.
  for (const key of ["aboutTitle","aboutBody","aboutMission","aboutStory"] as const) if (settings[key]) addPublicText(allowed,settings[key]!);
  for (const key of ["aboutStats","aboutValues","aboutFaqs","aboutGallery","aboutMilestones","aboutProgramMilestones","teachers","team","zurhaiCards","customMoods","zurhaiRules","contact"] as const) collectPublicText(allowed,settings[key]);
  const overrides = new Map<string,string>();
  for (const item of [...items,...pages]) for (const field of ["title","summary","body","navLabel"] as const) {
    const source = (item as unknown as Record<string,unknown>)[field];
    const translated = item.i18n?.[locale]?.[field];
    if (typeof source === "string" && translated?.trim() && !/<[a-z]/i.test(source)) overrides.set(normalizeTranslationSource(source),translated);
  }
  return {allowed,overrides};
}
