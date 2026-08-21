import { randomUUID } from "crypto";
import { sbSelect, sbInsert, sbUpdate, sbDelete } from "@/lib/supabase";
import type { JourneyBooking, JourneyReview } from "@/lib/types";

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
