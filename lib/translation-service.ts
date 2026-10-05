import { unstable_cache } from "next/cache";
import type { Locale } from "./types";

type TargetLocale = Exclude<Locale, "mn">;
type TextFormat = "text" | "html";
export type TranslationIssue = "not_configured" | "credentials" | "quota_or_access" | "rate_limited" | "provider_unavailable" | "incomplete" | "too_large";
export class TranslationError extends Error {
  constructor(public readonly issue: TranslationIssue) { super(issue); }
}
export const translationIssue = (error: unknown): TranslationIssue => error instanceof TranslationError ? error.issue : "provider_unavailable";
export const supportedTranslationLocale = (value: unknown): value is TargetLocale => typeof value === "string" && ["en", "ko", "ja", "zh"].includes(value);
export const translationReady = () => Boolean(process.env.AZURE_TRANSLATOR_KEY?.trim() && process.env.AZURE_TRANSLATOR_REGION?.trim());

/** Azure only: never fall back to a paid provider when the F0 quota is exhausted. */
export async function translateBatch(sources: string[], locale: TargetLocale, format: TextFormat = "text"): Promise<string[]> {
  if (!sources.length) return [];
  if (!translationReady()) throw new TranslationError("not_configured");
  if (sources.length > 100 || sources.reduce((n, value) => n + value.length, 0) > 50000) throw new TranslationError("too_large");
  const region = process.env.AZURE_TRANSLATOR_REGION!.trim().toLowerCase();
  const headers: Record<string, string> = {
    "Content-Type": "application/json; charset=UTF-8",
    "Ocp-Apim-Subscription-Key": process.env.AZURE_TRANSLATOR_KEY!.trim(),
  };
  if (region !== "global") headers["Ocp-Apim-Subscription-Region"] = region;
  const target = locale === "zh" ? "zh-Hans" : locale;
  const query = new URLSearchParams({ "api-version": "3.0", to: target, textType: format === "html" ? "html" : "plain" });
  const response = await fetch(`https://api.cognitive.microsofttranslator.com/translate?${query}`, {
    method: "POST", headers, body: JSON.stringify(sources.map(Text => ({ Text }))),
    signal: AbortSignal.timeout(12000), cache: "no-store",
  });
  if (!response.ok) {
    const issue = response.status === 401 ? "credentials" : response.status === 403 ? "quota_or_access" : response.status === 429 ? "rate_limited" : "provider_unavailable";
    // Do not return provider payloads or headers, which may contain account details.
    throw new TranslationError(issue);
  }
  const result: unknown = await response.json();
  if (!Array.isArray(result) || result.length !== sources.length) throw new TranslationError("incomplete");
  return result.map(item => {
    const value = item?.translations?.find((entry: { to?: string }) => entry.to === target)?.text;
    if (typeof value !== "string" || !value.trim()) throw new TranslationError("incomplete");
    // Azure plain text is already decoded; decoding again would corrupt literal entities.
    return value;
  });
}

// Successful exact text/target/format results persist in the Next Data Cache.
// A changed source creates a new cache entry; failed requests are never cached.
const cachedText = unstable_cache(async (source: string, locale: TargetLocale, format: TextFormat) => {
  return (await translateBatch([source], locale, format))[0];
}, ["azure-public-translation-v1"], { revalidate: false });
const inFlight = new Map<string, Promise<string>>();
export async function cachedTranslation(source: string, locale: TargetLocale, format: TextFormat = "text") {
  const key = JSON.stringify([source, locale, format]);
  const existing = inFlight.get(key);
  if (existing) return existing;
  const work = cachedText(source, locale, format);
  inFlight.set(key, work);
  try { return await work; } finally { inFlight.delete(key); }
}
export async function cachedTranslations(sources: string[], locale: TargetLocale) {
  const unique = [...new Set(sources)];
  const translations: Record<string, string> = {};
  // Bound concurrent misses, while allowing cached texts to be shared across pages.
  for (let i = 0; i < unique.length; i += 8) {
    await Promise.all(unique.slice(i, i + 8).map(async source => {
      translations[source] = await cachedTranslation(source, locale);
    }));
  }
  return translations;
}
