import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import {
  listBookingsByUser, listUserServiceBookings,
  getBookingById, setBookingStatus, rescheduleBooking,
  getServiceBookingById, setServiceBookingStatus, rescheduleServiceBooking, takenSlots,
} from "@/lib/journeys-db";
import { getCmsByIdCached } from "@/lib/repo";
import { isAllowedDay, slotsOf, dropPastSlots } from "@/lib/booking-slots";
import { notifyAdmins } from "@/lib/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const uid = await getSessionUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const [journeys, services] = await Promise.all([
      listBookingsByUser(uid),
      listUserServiceBookings(uid),
    ]);
    return NextResponse.json({ journeys, services });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Захиалга уншихад алдаа гарлаа." },
      { status: 500 },
    );
  }
}

const todayKey = () => {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
};

/** Хэрэглэгч өөрийн захиалгаа цуцлах эсвэл өдөр/цагийг өөрчлөх */
export async function PATCH(req: Request) {
  const uid = await getSessionUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => ({}));

  const kind = String(b?.kind || ""); // "journey" | "service"
  const id = String(b?.id || "");
  const action = String(b?.action || ""); // "cancel" | "reschedule"
  const date = String(b?.date || "");
  const time = String(b?.time || "");

  if (!id || !["journey", "service"].includes(kind) || !["cancel", "reschedule"].includes(action)) {
    return NextResponse.json({ error: "Буруу хүсэлт." }, { status: 400 });
  }

  try {
    if (kind === "journey") {
      const booking = await getBookingById(id);
      if (!booking || booking.userId !== uid) return NextResponse.json({ error: "Захиалга олдсонгүй." }, { status: 404 });
      if (booking.status === "cancelled") return NextResponse.json({ error: "Захиалга аль хэдийн цуцлагдсан." }, { status: 400 });

      if (action === "cancel") {
        await setBookingStatus(id, "cancelled");
      } else {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < todayKey())
          return NextResponse.json({ error: "Аялах өдрөө зөв сонгоно уу." }, { status: 400 });
        await rescheduleBooking(id, date);
      }

      await notifyAdmins({
        kind: "booking",
        title: (action === "cancel" ? "Аяллын захиалга цуцлагдлаа — " : "Аяллын огноо өөрчлөгдлөө — ") + booking.journeyName,
        body: action === "cancel" ? `${booking.date} · ${booking.name}` : `${booking.date} → ${date} · ${booking.name}`,
        link: "/admin",
        dedupeKey: `jbooking-${action}:${id}:${Date.now()}`,
      }).catch(() => null);

      return NextResponse.json({ ok: true });
    } else {
      const booking = await getServiceBookingById(id);
      if (!booking || booking.userId !== uid) return NextResponse.json({ error: "Захиалга олдсонгүй." }, { status: 404 });
      if (booking.status === "cancelled") return NextResponse.json({ error: "Захиалга аль хэдийн цуцлагдсан." }, { status: 400 });

      if (action === "cancel") {
        await setServiceBookingStatus(id, "cancelled");
      } else {
        const item = await getCmsByIdCached(booking.itemId).catch(() => null);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !isAllowedDay(item, date))
          return NextResponse.json({ error: "Энэ өдөр захиалга авахгүй байна. Өөр өдөр сонгоно уу." }, { status: 400 });
        const allowed = dropPastSlots(slotsOf(item), date);
        if (!allowed.includes(time)) return NextResponse.json({ error: "Цагаа сонгоно уу." }, { status: 400 });
        const taken = await takenSlots(booking.itemId, date);
        if (taken.includes(time)) return NextResponse.json({ error: "Энэ цаг аль хэдийн захиалагдсан байна." }, { status: 409 });
        await rescheduleServiceBooking(id, date, time);
      }

      await notifyAdmins({
        kind: "booking",
        title: (action === "cancel" ? "Цаг захиалга цуцлагдлаа — " : "Цаг захиалга өөрчлөгдлөө — ") + booking.serviceName,
        body: action === "cancel" ? `${booking.date} ${booking.time} · ${booking.name}` : `${booking.date} ${booking.time} → ${date} ${time} · ${booking.name}`,
        link: "/admin",
        dedupeKey: `svcbooking-${action}:${id}:${Date.now()}`,
      }).catch(() => null);

      return NextResponse.json({ ok: true });
    }
  } catch (e) {
    return NextResponse.json({ error: "Серверийн алдаа: " + (e instanceof Error ? e.message : String(e)) }, { status: 500 });
  }
}
