import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { getCmsById, getOrdersByUser } from "@/lib/repo";
import { signedDownloadUrl } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const itemId = new URL(req.url).searchParams.get("itemId");
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

    const BUCKET = "lesson-videos";
    const out = await Promise.all(lessons.map(async (l) => {
      let url = "";
      if (status === "active") {
        if (l.path) { try { url = await signedDownloadUrl(BUCKET, l.path); } catch { url = ""; } }
        else if (l.url) url = l.url;
      }
      return { title: l.title, url, quality: l.quality || "", subtitles: status === "active" ? (l.subtitles || "") : "" };
    }));
    return NextResponse.json({ status, lessons: out });
  } catch {
    return NextResponse.json({ status: "none", lessons: [] });
  }
}
