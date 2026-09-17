import { unstable_cache } from "next/cache";
import type { Locale } from "./types";

export const supportedTranslationLocale = (value: unknown): value is Exclude<Locale,"mn"> => typeof value === "string" && ["en","ko","ja","zh"].includes(value);
export const translationReady = () => Boolean(process.env.GOOGLE_TRANSLATE_API_KEY);

export async function translateBatch(sources: string[], locale: Exclude<Locale,"mn">): Promise<string[]> {
  if (!sources.length) return [];
  const key = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!key) throw new Error("translation_not_configured");
  const res = await fetch("https://translation.googleapis.com/language/translate/v2", {
    method:"POST", headers:{"Content-Type":"application/json", "X-goog-api-key":key},
    body:JSON.stringify({q:sources,source:"mn",target:locale === "zh" ? "zh-CN" : locale,format:"text"}),
    signal:AbortSignal.timeout(12000), cache:"no-store",
  });
  if (!res.ok) throw new Error("translation_provider_unavailable");
  const result = await res.json() as {data?:{translations?:{translatedText?:string}[]}};
  const values=result.data?.translations;
  if (values?.length !== sources.length || values.some(value=>!value.translatedText)) throw new Error("translation_incomplete");
  return values.map(value=>value.translatedText!);
}
// Cache successful results by exact source text and language, never cache failures.
const cachedBatch = unstable_cache(translateBatch,["public-translations-v1"],{revalidate:60*60*24*30});
export async function cachedTranslations(sources: string[], locale: Exclude<Locale,"mn">) {
  const sorted=[...new Set(sources)].sort();
  const results=await cachedBatch(sorted,locale);
  return Object.fromEntries(sorted.map((source,index)=>[source,results[index]]));
}
