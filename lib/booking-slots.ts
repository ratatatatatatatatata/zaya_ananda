/** Энергийн заслын цагийн хуваарь — ажлын өдөр 10:00–18:00 (сүүлчийн цаг 17:00-д эхэлнэ). */
export const SLOTS = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

/** Ажлын өдөр эсэх (Да–Ба) */
export function isWorkday(dateKey: string): boolean {
  const day = new Date(dateKey + "T00:00:00").getDay();
  return day >= 1 && day <= 5;
}
