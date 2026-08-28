/** 12 ордын нэгдсэн жагсаалт — StoneReading (нийтэд) болон AdminContentManager
 *  (админ, чулуу бүтээгдэхүүнд ээлтэй орд сонгох) хоёулаа энэ нэг эх сурвалжийг ашиглана. */

export type Zodiac = { key: string; name: string; symbol: string; from: [number, number]; to: [number, number] };

export const ZODIACS: Zodiac[] = [
  { key: "aries", name: "Хонь", symbol: "♈", from: [3, 21], to: [4, 19] },
  { key: "taurus", name: "Үхэр", symbol: "♉", from: [4, 20], to: [5, 20] },
  { key: "gemini", name: "Ихэр", symbol: "♊", from: [5, 21], to: [6, 21] },
  { key: "cancer", name: "Мэлхий", symbol: "♋", from: [6, 22], to: [7, 22] },
  { key: "leo", name: "Арслан", symbol: "♌", from: [7, 23], to: [8, 22] },
  { key: "virgo", name: "Охин", symbol: "♍", from: [8, 23], to: [9, 22] },
  { key: "libra", name: "Жинлүүр", symbol: "♎", from: [9, 23], to: [10, 23] },
  { key: "scorpio", name: "Хилэнц", symbol: "♏", from: [10, 24], to: [11, 22] },
  { key: "sagittarius", name: "Нум", symbol: "♐", from: [11, 23], to: [12, 21] },
  { key: "capricorn", name: "Матар", symbol: "♑", from: [12, 22], to: [1, 19] },
  { key: "aquarius", name: "Хумх", symbol: "♒", from: [1, 20], to: [2, 18] },
  { key: "pisces", name: "Загас", symbol: "♓", from: [2, 19], to: [3, 20] },
];

export function zodiacOf(month: number, day: number): Zodiac {
  for (const z of ZODIACS) {
    const [fm, fd] = z.from, [tm, td] = z.to;
    if (fm <= tm) { if ((month === fm && day >= fd) || (month === tm && day <= td) || (month > fm && month < tm)) return z; }
    else { if ((month === fm && day >= fd) || (month === tm && day <= td) || month > fm || month < tm) return z; }
  }
  return ZODIACS[0];
}

export function zodiacByKey(key: string): Zodiac | undefined {
  return ZODIACS.find((z) => z.key === key);
}

/** Бүтээгдэхүүний (чулуу) moods талбарт хадгалагдах "бүх орд" гэсэн тусгай түлхүүр. */
export const ALL_ZODIACS_KEY = "all";
