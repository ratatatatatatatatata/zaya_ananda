/** Энергийн заслын цаг захиалгын өгөгдмөл хуваарь — ажлын өдөр 10:00–18:00 (сүүлчийн цаг 17:00-д эхэлнэ). */
export const DEFAULT_BOOKING_DAYS = [1, 2, 3, 4, 5]; // Даа–Ба (JS Date.getDay(): 0=Ням)
export const DEFAULT_START_HOUR = 10;
export const DEFAULT_END_HOUR = 18;

/** Хуучин код руу нийцтэй байлгах өгөгдмөл жагсаалт. Шинэ код `slotsFor()`-ийг ашиглана. */
export const SLOTS = slotsFor(DEFAULT_START_HOUR, DEFAULT_END_HOUR);

const WD = ["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"];
/** Долоо хоногийн өдрийн богино нэрс */
export function weekdayLabels() {
  return WD;
}

/** Ажлын өдөр эсэх (өгөгдмөл: Да–Ба) */
export function isWorkday(dateKey: string): boolean {
  const day = new Date(dateKey + "T00:00:00").getDay();
  return DEFAULT_BOOKING_DAYS.includes(day);
}

/** Тухайн зүйлийн зөвшөөрөгдсөн өдрүүд — админ тохируулаагүй бол өгөгдмөл Да–Ба */
export function bookingDaysOf(item?: { bookingDays?: number[] } | null): number[] {
  return item?.bookingDays && item.bookingDays.length ? item.bookingDays : DEFAULT_BOOKING_DAYS;
}

/** Тухайн огноо энэ зүйлд зөвшөөрөгдсөн өдөр мөн үү */
export function isAllowedDay(item: { bookingDays?: number[] } | null | undefined, dateKey: string): boolean {
  const day = new Date(dateKey + "T00:00:00").getDay();
  return bookingDaysOf(item).includes(day);
}

/** Эхлэх/төгсгөх цагаас цагийн слот жагсаалт үүсгэнэ: жишээ 10,18 → ["10:00",...,"17:00"] */
export function slotsFor(startHour?: number, endHour?: number): string[] {
  const s = typeof startHour === "number" && startHour >= 0 && startHour <= 23 ? startHour : DEFAULT_START_HOUR;
  const e = typeof endHour === "number" && endHour > s && endHour <= 24 ? endHour : DEFAULT_END_HOUR;
  const out: string[] = [];
  for (let h = s; h < e; h++) out.push(String(h).padStart(2, "0") + ":00");
  return out;
}

/** Тухайн зүйлийн цагийн слотуудыг тооцно */
export function slotsOf(item?: { bookingStartHour?: number; bookingEndHour?: number } | null): string[] {
  return slotsFor(item?.bookingStartHour, item?.bookingEndHour);
}

/** Өнөөдрийн огноонд аль хэдийн өнгөрсөн (эсвэл 30 минутын дотор эхлэх) цагуудыг слотоос хасна. Өөр өдөр бол хэвээр буцаана. */
export function dropPastSlots(slots: string[], dateKey: string, now = new Date()): string[] {
  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  if (dateKey !== todayKey) return slots;
  const cutoff = now.getHours() * 60 + now.getMinutes() + 30; // 30 минутын бэлтгэлтэй захиална
  return slots.filter((s) => {
    const [h, m] = s.split(":").map(Number);
    return h * 60 + m > cutoff;
  });
}
