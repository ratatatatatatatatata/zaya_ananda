import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { getCmsByIdCached } from "@/lib/repo";
import { createServiceBooking, takenSlots } from "@/lib/journeys-db";
import { createNotification, notifyAdmins } from "@/lib/notifications";
import { isAllowedDay, slotsOf, dropPastSlots } from "@/lib/booking-slots";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Тухайн өдрийн сул цагууд — зүйл бүрийн админаас тохируулсан хуваарийг дагана */
export async function GET(req: Request) {
  const u = new URL(req.url);
  const itemId = u.searchParams.get("itemId") || "";
  const date = u.searchParams.get("date") || "";
  if (!itemId || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ slots: [] });

  const item = await getCmsByIdCached(itemId).catch(() => null);
  if (!isAllowedDay(item, date)) return NextResponse.json({ slots: [], weekend: true });

  const all = slotsOf(item);
  try {
    const taken = await takenSlots(itemId, date);
    return NextResponse.json({ slots: dropPastSlots(all.filter((s) => !taken.includes(s)), date) });
  } catch {
    return NextResponse.json({ slots: dropPastSlots(all, date) });
  }
}

export async function POST(req: Request) {
  const uid = await getSessionUserId();
  const b = await req.json().catch(() => ({}));

  const itemId = String(b?.itemId || "");
  const date = String(b?.date || "");
  const time = String(b?.time || "");
  const name = String(b?.name || "").trim();
  const phone = String(b?.phone || "").trim();

  const item = await getCmsByIdCached(itemId).catch(() => null);
  if (!item) return NextResponse.json({ error: "Үйлчилгээ олдсонгүй." }, { status: 404 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !isAllowedDay(item, date))
    return NextResponse.json({ error: "Энэ өдөр захиалга авахгүй байна. Өөр өдөр сонгоно уу." }, { status: 400 });
  if (!slotsOf(item).includes(time) || !dropPastSlots(slotsOf(item), date).includes(time))
    return NextResponse.json({ error: "Цагаа сонгоно уу." }, { status: 400 });
  if (!name || !phone) return NextResponse.json({ error: "Нэр, утсаа оруулна уу." }, { status: 400 });

  try {
    const taken = await takenSlots(itemId, date);
    if (taken.includes(time)) return NextResponse.json({ error: "Энэ цаг аль хэдийн захиалагдсан байна." }, { status: 409 });

    await createServiceBooking({
      userId: uid, itemId, serviceName: item.title, date, time, name, phone,
      email: b?.email ? String(b.email) : "",
      note: b?.note ? String(b.note) : "",
    });

    // Админд мэдэгдэнэ
    await notifyAdmins({
      kind: "booking",
      title: "Шинэ цаг захиалга — " + item.title,
      body: `${date} ${time} · ${name} · ${phone}`,
      link: "/admin",
      dedupeKey: `svc:${itemId}:${date}:${time}`,
    }).catch(() => null);

    // Захиалагчид мэдэгдэнэ
    if (uid) {
      await createNotification({
        userId: uid,
        kind: "booking",
        title: "«" + item.title + "» цаг захиаллаа",
        body: date + " " + time + " — админ баталгаажуулсны дараа мэдэгдэнэ.",
        link: "/account",
        dedupeKey: `svc-user:${itemId}:${date}:${time}`,
      }).catch(() => null);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Серверийн алдаа: " + (e instanceof Error ? e.message : String(e)) }, { status: 500 });
  }
}
