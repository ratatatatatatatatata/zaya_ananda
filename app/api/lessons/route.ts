import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { getCmsById, getOrdersByUser, getUserById, registerDevice } from "@/lib/repo";
import { signedDownloadUrl } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Нэг эрхээр зэрэг ашиглаж болох төхөөрөмжийн дээд тоо (гэрээ: төхөөрөмжийн хязгаарлалт) */
const MAX_DEVICES = 3;

export async function GET(req: Request) {
  const u = new URL(req.url);
  const itemId = u.searchParams.get("itemId");
  const deviceId = (u.searchParams.get("device") || "").slice(0, 64);
  if (!itemId) return NextResponse.json({ status: "none", lessons: [] });
  try {
    const item = await getCmsById(itemId);
    const lessons = Array.isArray(item?.lessons) ? item!.lessons : [];
    if (lessons.length === 0) return NextResponse.json({ status: "none", lessons: [] });

    let status: "none" | "pending" | "active" | "expired" = "none";
    const uid = await getSessionUserId();
    if (uid) {
      const orders = await getOrdersByUser(uid);
      const mine = orders.filter((o) => (o.items || []).some((i) => i.slug === itemId));
      const now = Date.now();
      const active = mine.find((o) => o.status === "paid" && (!o.expiresAt || new Date(o.expiresAt).getTime() > now));
      if (active) status = "active";
      else if (mine.some((o) => o.status === "paid" && o.expiresAt && new Date(o.expiresAt).getTime() <= now)) status = "expired";
      else if (mine.some((o) => o.status === "pending")) status = "pending";
    }

    // Төхөөрөмжийн хязгаар — хэт олон төхөөрөмжөөс нэвтэрвэл түгжинэ
    let mark = "";
    if (status === "active" && uid) {
      const user = await getUserById(uid).catch(() => null);
      mark = (user?.email || user?.phone || uid).slice(0, 42);
      if (deviceId) {
        const okDevice = await registerDevice(uid, deviceId, MAX_DEVICES).catch(() => true);
        if (!okDevice) {
          return NextResponse.json({ status: "device-limit", lessons: [], maxDevices: MAX_DEVICES });
        }
      }
    }

    const BUCKET = "lesson-videos";
    const out = await Promise.all(lessons.map(async (l) => {
      let url = "";
      if (status === "active") {
        if (l.path) { try { url = await signedDownloadUrl(BUCKET, l.path); } catch { url = ""; } }
        else if (l.url) url = l.url;
      }
      return { title: l.title, url, quality: l.quality || "", subtitles: status === "active" ? (l.subtitles || "") : "" };
    }));
    return NextResponse.json({ status, lessons: out, mark });
  } catch {
    return NextResponse.json({ status: "none", lessons: [] });
  }
}
