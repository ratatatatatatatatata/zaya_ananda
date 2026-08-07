/** «Мэргэ төөрөг» — тооцооллын функцууд ба төлбөрт тайллын тогтсон үнэ.
 *  Тайллын бичвэрүүд нь data/merge-i18n.ts, data/merge-i18n2.ts дотор 5 хэлээр байрлана. */

/** Амьдралын зам (life path) — төрсөн огнооны цифрүүдийн нийлбэрээс */
export function lifePathOf(y: number, m: number, d: number): number {
  const sum = (n: number): number => String(n).split("").reduce((a, c) => a + Number(c), 0);
  let t = sum(y) + sum(m) + sum(d);
  while (t > 9 && t !== 11 && t !== 22) t = sum(t);
  return t;
}

/** Хувийн жил — тухайн жилийн эрчим */
export function personalYear(bm: number, bd: number, year: number): number {
  const sum = (n: number): number => String(n).split("").reduce((a, c) => a + Number(c), 0);
  let t = sum(bm) + sum(bd) + sum(year);
  while (t > 9 && t !== 11 && t !== 22) t = sum(t);
  return t;
}

/** Тогтмол индекс — нэг л түлхүүрт үргэлж ижил утга буцаана */
export function seedIndex(seed: string, len: number): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) % len;
}

/** Төлбөрт тайлал — CMS-д бус, системд шууд бүртгэлтэй тогтсон үнэтэй бараа */
export const MERGE_ITEMS = {
  month: { id: "merge-month", title: "Сарын мэргэ төөрөг", price: 19000, days: 35 },
  year: { id: "merge-year", title: "Жилийн мэргэ төөрөг", price: 49000, days: 370 },
} as const;

export type MergeItemKey = keyof typeof MERGE_ITEMS;
