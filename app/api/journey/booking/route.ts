import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { createBooking, listBookingsByUser, getJourneyBySlugCached } from "@/lib/journeys-db";
import { createNotification, notifyAdmins } from "@/lib/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const uid = await getSessionUserId();
  if (!uid) return NextResponse.json({ items: [] });
  try {
    return NextResponse.json({ items: await listBookingsByUser(uid) });
  } catch {
    return NextResponse.json({ items: [] });
  }
}

export async function POST(req: Request) {
  const uid = await getSessionUserId();
  if (!uid) return NextResponse.json({ error: "Захиалга хийхийн тулд эхлээд нэвтэрнэ үү." }, { status: 401 });
  const b = await req.json().catch(() => ({}));

  const slug = String(b?.slug || "");
  const date = String(b?.date || "");
  const name = String(b?.name || "").trim();
  const phone = String(b?.phone || "").trim();
  const email = String(b?.email || "").trim();
  const people = Math.max(1, Math.min(20, Number(b?.people) || 1));

  const journey = await getJourneyBySlugCached(slug).catch(() => null);
  if (!journey) return NextResponse.json({ error: "Аялал олдсонгүй." }, { status: 404 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ error: "Огноогоо сонгоно уу." }, { status: 400 });
  if (!name || !phone) return NextResponse.json({ error: "Нэр, утсаа оруулна уу." }, { status: 400 });

  try {
    const booking = await createBooking({
      userId: uid, slug, journeyName: journey.name, date, people, name, phone, email,
      note: b?.note ? String(b.note) : "",
    });

    // Бүх админд мэдэгдэнэ
    await notifyAdmins({
      kind: "booking",
      title: "Шинэ аяллын захиалга — " + journey.name,
      body: `${date} · ${people} хүн · ${name} · ${phone}`,
      link: "/admin",
      dedupeKey: "jbooking:" + booking.id,
    }).catch(() => null);

    if (uid) {
      await createNotification({
        userId: uid,
        kind: "booking",
        title: "«" + journey.name + "» аялалд бүртгүүллээ",
        body: date + " — админ баталгаажуулсны дараа танд мэдэгдэнэ.",
        link: "/account",
        dedupeKey: "booking:" + booking.id,
      }).catch(() => null);
    }
    return NextResponse.json({ ok: true, id: booking.id });
  } catch (e) {
    return NextResponse.json({ error: "Серверийн алдаа: " + (e instanceof Error ? e.message : String(e)) }, { status: 500 });
  }
}
