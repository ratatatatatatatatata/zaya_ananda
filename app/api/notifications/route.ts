import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { getOrdersByUser, getCmsByIdCached } from "@/lib/repo";
import { listNotifications, unreadCount, markRead, markAllRead, createNotification } from "@/lib/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Дуусахад 7 хоног үлдсэн эрхүүдэд мэдэгдэл автоматаар үүсгэнэ. */
async function checkExpiring(uid: string) {
  const orders = await getOrdersByUser(uid).catch(() => []);
  const now = Date.now();
  const WEEK = 7 * 86400000;

  for (const o of orders) {
    if (o.status !== "paid" || !o.expiresAt) continue;
    const left = new Date(o.expiresAt).getTime() - now;
    if (left <= 0 || left > WEEK) continue;

    const days = Math.max(1, Math.ceil(left / 86400000));
    const item = o.items?.[0];
    const title = item?.title || "Худалдаж авсан эрх";
    const cms = item?.slug ? await getCmsByIdCached(item.slug).catch(() => null) : null;

    await createNotification({
      userId: uid,
      kind: "expiry",
      title: `«${title}» үзэх хугацаа дуусахад ${days} хоног үлдлээ`,
      body: "Хугацаа дуусахаас өмнө үлдсэн хичээлээ үзэж дуусгаарай. Хүсвэл эрхээ сунгаж болно.",
      link: cms ? "/item/" + cms.id : "/account",
      dedupeKey: "expiry:" + o.id,
    }).catch(() => null);
  }
}

export async function GET() {
  const uid = await getSessionUserId();
  if (!uid) return NextResponse.json({ items: [], unread: 0 });
  try {
    await checkExpiring(uid);
    const [items, unread] = await Promise.all([listNotifications(uid), unreadCount(uid)]);
    return NextResponse.json({ items, unread });
  } catch {
    return NextResponse.json({ items: [], unread: 0 });
  }
}

export async function PATCH(req: Request) {
  const uid = await getSessionUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  try {
    if (body?.all) await markAllRead(uid);
    else if (body?.id) await markRead(String(body.id), uid);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
