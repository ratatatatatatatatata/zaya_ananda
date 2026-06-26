import type { L, Locale } from "./types";

export const defaultLocale: Locale = "mn";

export const localeMeta: { code: Locale; native: string; flag: string }[] = [
  { code: "mn", native: "Монгол", flag: "🇲🇳" },
  { code: "en", native: "English", flag: "🇬🇧" },
  { code: "ko", native: "한국어", flag: "🇰🇷" },
  { code: "ja", native: "日本語", flag: "🇯🇵" },
  { code: "zh", native: "中文", flag: "🇨🇳" },
];

export function pick(v: L | undefined, locale: Locale = defaultLocale): string {
  if (!v) return "";
  return v[locale] ?? v[defaultLocale] ?? "";
}
