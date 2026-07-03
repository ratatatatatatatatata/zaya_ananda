import type { Locale } from "./types";

export type CmsI18n = Partial<Record<Locale, { title?: string; summary?: string; body?: string; navLabel?: string }>>;

/** Админы гараар оруулсан орчуулгаас тухайн хэлний текстийг авна, байхгүй бол монгол хувилбар. */
export function locText(
  lang: Locale,
  mnValue: string | undefined,
  i18n: CmsI18n | undefined,
  field: "title" | "summary" | "body" | "navLabel"
): string {
  if (lang !== "mn") {
    const v = i18n?.[lang]?.[field];
    if (v && v.trim()) return v;
  }
  return mnValue || "";
}
