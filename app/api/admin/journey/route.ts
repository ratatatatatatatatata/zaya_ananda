import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { checkAdmin } from "@/lib/repo";
import {
  listBookings, setBookingStatus, deleteBooking,
  listReviews, setReviewFeatured, deleteReview, listFeaturedReviews,
  listServiceBookings, setServiceBookingStatus, deleteServiceBooking,
} from "@/lib/journeys-db";
import { createNotification } from "@/lib/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function guard() {
  const uid = await getSessionUserId();
  if (!uid) return null;
  return (await checkAdmin(uid)).ok ? uid : null;
}

export async function GET() {
  if (!(await guard())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const [bookings, reviews, services] = await Promise.all([listBookings(), listReviews(), listServiceBookings()]);
    return NextResponse.json({ bookings, reviews, services });
  } catch {
    return NextResponse.json({ bookings: [], reviews: [], services: [] });
  }
}

export async function PATCH(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json().catch(() => ({}));
  try {
    if (b?.bookingId && b?.status) {
      const updated = await setBookingStatus(String(b.bookingId), b.status);
      if (updated?.userId && b.status === "confirmed") {
        await createNotification({
          userId: updated.userId,
          kind: "booking",
          title: "«" + updated.journeyName + "» аялал баталгаажлаа",
          body: updated.date + " — уулзацгаая! Бэлтгэлийн зөвлөмжийг аяллын хуудаснаас уншаарай.",
          link: "/ayalal/" + updated.slug,
          dedupeKey: "booking-confirm:" + updated.id,
        }).catch(() => null);
      }
      return NextResponse.json({ ok: true });
    }

    if (b?.serviceBookingId && b?.status) {
      await setServiceBookingStatus(String(b.serviceBookingId), String(b.status));
      return NextResponse.json({ ok: true });
    }

    if (b?.reviewId !== undefined && b?.featured !== undefined) {
      // Нэг аялалд дээд тал нь 3 сэтгэгдэл сонгоно
      if (b.featured && b?.slug) {
        const current = await listFeaturedReviews(String(b.slug));
        if (current.length >= 3) {
          return NextResponse.json({ error: "Нэг аялалд дээд тал нь 3 сэтгэгдэл сонгоно." }, { status: 400 });
        }
      }
      await setReviewFeatured(String(b.reviewId), Boolean(b.featured));
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Алдаа" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const u = new URL(req.url);
  const bookingId = u.searchParams.get("bookingId");
  const reviewId = u.searchParams.get("reviewId");
  const serviceBookingId = u.searchParams.get("serviceBookingId");
  try {
    if (bookingId) await deleteBooking(bookingId);
    if (reviewId) await deleteReview(reviewId);
    if (serviceBookingId) await deleteServiceBooking(serviceBookingId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
