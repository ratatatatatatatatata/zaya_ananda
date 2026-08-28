import { randomUUID } from "crypto";
import { sbSelect, sbInsert, sbUpdate, sbDelete } from "@/lib/supabase";
import type { JourneyBooking, JourneyReview, ServiceBooking } from "@/lib/types";
import type { Journey } from "@/data/journeys";

const enc = (s: string) => encodeURIComponent(s);

/* ---------- Захиалга ---------- */

export async function createBooking(input: {
  userId: string | null;
  slug: string;
  journeyName: string;
  date: string;
  people: number;
  name: string;
  phone: string;
  email: string;
  note?: string;
}): Promise<JourneyBooking> {
  return sbInsert<JourneyBooking>("journey_bookings", {
    id: randomUUID(),
    userId: input.userId,
    slug: input.slug,
    journeyName: input.journeyName,
    date: input.date,
    people: input.people,
    name: input.name,
    phone: input.phone,
    email: input.email,
    note: input.note || null,
    status: "pending",
    createdAt: new Date().toISOString(),
  });
}

export async function listBookings(): Promise<JourneyBooking[]> {
  return sbSelect<JourneyBooking>("journey_bookings", "order=created_at.desc");
}

export async function listBookingsByUser(userId: string): Promise<JourneyBooking[]> {
  return sbSelect<JourneyBooking>("journey_bookings", `user_id=eq.${enc(userId)}&order=date.desc`);
}

export async function setBookingStatus(id: string, status: JourneyBooking["status"]) {
  return sbUpdate<JourneyBooking>("journey_bookings", id, { status });
}

export async function getBookingById(id: string): Promise<JourneyBooking | null> {
  const rows = await sbSelect<JourneyBooking>("journey_bookings", `id=eq.${enc(id)}&limit=1`);
  return rows[0] || null;
}

/** Аялах өдрөө өөрчилнө — дахин баталгаажуулах шаардлагатай тул төлөв "pending" болно */
export async function rescheduleBooking(id: string, date: string) {
  return sbUpdate<JourneyBooking>("journey_bookings", id, { date, status: "pending" });
}

export async function deleteBooking(id: string) {
  await sbDelete("journey_bookings", id);
  return true;
}

/* ---------- Сэтгэгдэл ---------- */

export async function createReview(input: {
  userId: string | null;
  slug: string;
  name: string;
  rating: number;
  text: string;
}): Promise<JourneyReview> {
  return sbInsert<JourneyReview>("journey_reviews", {
    id: randomUUID(),
    userId: input.userId,
    slug: input.slug,
    name: input.name,
    rating: Math.max(1, Math.min(5, input.rating)),
    text: input.text,
    featured: false,
    createdAt: new Date().toISOString(),
  });
}

export async function listReviews(slug?: string): Promise<JourneyReview[]> {
  const q = slug ? `slug=eq.${enc(slug)}&order=created_at.desc` : "order=created_at.desc";
  return sbSelect<JourneyReview>("journey_reviews", q);
}

/** Нийтэд харагдах — админаас сонгосон дээд тал нь 3 сэтгэгдэл */
export async function listFeaturedReviews(slug: string): Promise<JourneyReview[]> {
  const rows = await sbSelect<JourneyReview>(
    "journey_reviews",
    `slug=eq.${enc(slug)}&featured=is.true&order=created_at.desc&limit=3`,
  );
  return rows;
}

export async function setReviewFeatured(id: string, featured: boolean) {
  return sbUpdate<JourneyReview>("journey_reviews", id, { featured });
}

export async function deleteReview(id: string) {
  await sbDelete("journey_reviews", id);
  return true;
}

/* ---------- Энергийн заслын цаг захиалга ---------- */

export async function createServiceBooking(input: {
  userId: string | null;
  itemId: string;
  serviceName: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email?: string;
  note?: string;
  status?: ServiceBooking["status"];
}) {
  return sbInsert("service_bookings", {
    id: randomUUID(),
    userId: input.userId,
    itemId: input.itemId,
    serviceName: input.serviceName,
    date: input.date,
    time: input.time,
    name: input.name,
    phone: input.phone,
    email: input.email || null,
    note: input.note || null,
    status: input.status || "pending",
    createdAt: new Date().toISOString(),
  });
}

export async function listServiceBookings() {
  return sbSelect("service_bookings", "order=date.asc");
}

export async function listUserServiceBookings(userId: string): Promise<ServiceBooking[]> {
  return sbSelect<ServiceBooking>("service_bookings", `user_id=eq.${enc(userId)}&order=date.desc`);
}

/** Тухайн өдөр аль цагууд аль хэдийн захиалагдсан бэ */
export async function takenSlots(itemId: string, date: string): Promise<string[]> {
  const rows = await sbSelect<{ time: string; status: string }>(
    "service_bookings",
    `item_id=eq.${enc(itemId)}&date=eq.${enc(date)}&limit=50`,
  );
  return rows.filter((r) => r.status !== "cancelled").map((r) => r.time);
}

export async function setServiceBookingStatus(id: string, status: string) {
  return sbUpdate<ServiceBooking>("service_bookings", id, { status });
}

export async function getServiceBookingById(id: string): Promise<ServiceBooking | null> {
  const rows = await sbSelect<ServiceBooking>("service_bookings", `id=eq.${enc(id)}&limit=1`);
  return rows[0] || null;
}

/** Захиалгын өдөр/цагийг өөрчилнө — дахин баталгаажуулах шаардлагатай тул төлөв "pending" болно */
export async function rescheduleServiceBooking(id: string, date: string, time: string) {
  return sbUpdate<ServiceBooking>("service_bookings", id, { date, time, status: "pending" });
}

export async function deleteServiceBooking(id: string) {
  await sbDelete("service_bookings", id);
  return true;
}

/* ---------- Сүнслэг аяллын каталог (админаас удирдана) ---------- */

function journeyRow(input: Omit<Journey, "id" | "createdAt">): Record<string, unknown> {
  return {
    slug: input.slug.trim(),
    name: input.name.trim(),
    tagline: input.tagline?.trim() || "",
    scene: input.scene || "steppe",
    image: input.image || null,
    days: input.days?.trim() || "",
    groupSize: input.groupSize?.trim() || "",
    transport: input.transport?.trim() || "",
    stay: input.stay?.trim() || "",
    audience: input.audience?.trim() || "",
    summary: input.summary?.trim() || "",
    included: input.included?.trim() || "",
    excluded: input.excluded?.trim() || "",
    price: input.price?.trim() || "",
    prepay: typeof input.prepay === "number" && input.prepay > 0 ? input.prepay : 0,
    itinerary: input.itinerary || [],
    lead: input.lead || { name: "", role: "", info: "" },
    crew: input.crew || [],
  };
}

export async function listJourneys(): Promise<Journey[]> {
  return sbSelect<Journey>("journeys", "order=created_at.asc");
}

export async function getJourneyBySlug(slug: string): Promise<Journey | null> {
  const rows = await sbSelect<Journey>("journeys", `slug=eq.${enc(slug)}&limit=1`);
  return rows[0] || null;
}

export async function getJourneyById(id: string): Promise<Journey | null> {
  const rows = await sbSelect<Journey>("journeys", `id=eq.${enc(id)}&limit=1`);
  return rows[0] || null;
}

export async function createJourney(input: Omit<Journey, "id" | "createdAt">): Promise<Journey> {
  return sbInsert<Journey>("journeys", { id: randomUUID(), ...journeyRow(input), createdAt: new Date().toISOString() });
}

export async function updateJourney(id: string, input: Omit<Journey, "id" | "createdAt">): Promise<Journey | null> {
  return sbUpdate<Journey>("journeys", id, journeyRow(input));
}

export async function deleteJourney(id: string): Promise<boolean> {
  await sbDelete("journeys", id);
  return true;
}

// ---------- Аялалын мэдээлэл админаас байнга шинэчлэгддэг тул кэшлэхгүй, шууд DB-ээс уншина ----------
// (Өмнө unstable_cache ашигладаг байсан ч кэш сэргээлт (revalidateTag) instance хооронд саатдаг тул
//  "буруу/хуучин аяллын мэдээлэл харагдах", "дэлгэрэнгүй хуудас 404 өгөх" гэсэн алдаанууд давтагдсан.
//  Аяллын тоо цөөн, засвар ховор тул шууд DB унших нь илүү найдвартай.)
export const listJourneysCached = () => listJourneys();
export const getJourneyBySlugCached = (slug: string) => getJourneyBySlug(slug);
