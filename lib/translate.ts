// Azure Translator: fill only missing CMS translations and reuse cached results.
import { cachedTranslation, translationReady } from "./translation-service";
import type { CmsTranslations } from "./types";

const LANGS: { l: "en" | "ko" | "ja" | "zh"; code: string }[] = [
  { l: "en", code: "en" },
  { l: "ko", code: "ko" },
  { l: "ja", code: "ja" },
  { l: "zh", code: "zh" },
];

async function tr(text: string, target: string, format: "text" | "html"): Promise<string | null> {
  if (!translationReady() || !text || !text.trim()) return null;
  try {
    return await cachedTranslation(text, target as "en" | "ko" | "ja" | "zh", format);
  } catch {
    return null;
  }
}

/**
 * Монгол контентын дутуу орчуулгыг автоматаар бөглөнө.
 * Админы гараар оруулсан орчуулга ямагт давуу — зөвхөн ХООСОН талбарыг л орчуулна.
 */
export async function autoTranslate(
  mn: { title?: string; summary?: string; body?: string; navLabel?: string },
  existing?: CmsTranslations
): Promise<CmsTranslations | undefined> {
  if (!translationReady()) return existing;
  const out: CmsTranslations = { ...(existing || {}) };
  for (const { l, code } of LANGS) {
    const cur = { ...(out[l] || {}) };
    const jobs: Promise<void>[] = [];
    if (mn.title && !cur.title) jobs.push(tr(mn.title, code, "text").then((v) => { if (v) cur.title = v; }));
    if (mn.summary && !cur.summary) jobs.push(tr(mn.summary, code, "text").then((v) => { if (v) cur.summary = v; }));
    if (mn.navLabel && !cur.navLabel) jobs.push(tr(mn.navLabel, code, "text").then((v) => { if (v) cur.navLabel = v; }));
    if (mn.body && !cur.body) {
      const isHtml = /<[a-z][\s\S]*>/i.test(mn.body);
      jobs.push(tr(mn.body, code, isHtml ? "html" : "text").then((v) => { if (v) cur.body = v; }));
    }
    await Promise.all(jobs);
    if (Object.keys(cur).length) out[l] = cur;
  }
  return Object.keys(out).length ? out : undefined;
}

export const translateConfigured = translationReady();
