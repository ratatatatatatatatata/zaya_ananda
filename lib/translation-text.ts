/** Identical segmentation on the client and server keeps long public text allowed. */
export const normalizeTranslationSource = (value: string) => value.replace(/\s+/gu, " ").trim();
export const TRANSLATION_CHUNK_SIZE = 1800;
export function splitTranslationText(value: string): string[] {
  const text = normalizeTranslationSource(value);
  if (!text) return [];
  const chunks: string[] = [];
  let rest = text;
  while (rest.length > TRANSLATION_CHUNK_SIZE) {
    let end = rest.lastIndexOf(" ", TRANSLATION_CHUNK_SIZE);
    if (end < TRANSLATION_CHUNK_SIZE / 2) end = TRANSLATION_CHUNK_SIZE;
    // Never split a UTF-16 surrogate pair.
    if (/[\uD800-\uDBFF]/.test(rest[end - 1])) end--;
    chunks.push(rest.slice(0, end));
    rest = rest.slice(end).trimStart();
  }
  if (rest) chunks.push(rest);
  return chunks;
}
export function hasTranslatableText(value: string) {
  return /\p{L}/u.test(value) && !/^(?:https?:\/\/|mailto:|tel:|data:|\S+@\S+\.\S+$)/i.test(value);
}
export function decodeTranslationEntities(value: string) {
  const named: Record<string, string> = {nbsp:" ",amp:"&",lt:"<",gt:">",quot:'"',apos:"'",ndash:"–",mdash:"—",hellip:"…",bull:"•",copy:"©"};
  return value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, code: string) => {
    if (code[0] !== "#") return named[code.toLowerCase()] ?? entity;
    const point = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : Number(code.slice(1));
    return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : entity;
  });
}
