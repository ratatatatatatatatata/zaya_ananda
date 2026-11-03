export const DEFAULT_LOGO_SRC = "/brand/zaya-ananda-white.webp";

/** Replace the existing black-background CMS asset without overriding future
 * custom uploads. Its fingerprint identifies the current public image only. */
export function resolveLogoSrc(value?: string) {
  const source = value?.trim();
  if (!source || source === "/brand/zaya-ananda-logo-clean.png") return DEFAULT_LOGO_SRC;
  if (source.length === 19207 && source.startsWith("data:image/jpeg;base64,")) {
    let hash = 2166136261;
    for (let i = 0; i < source.length; i++) hash = Math.imul(hash ^ source.charCodeAt(i), 16777619);
    if ((hash >>> 0) === 3079376286) return DEFAULT_LOGO_SRC;
  }
  return source;
}
