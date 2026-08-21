import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { getUserById } from "@/lib/repo";
import { createReview, listFeaturedReviews, listBookingsByUser } from "@/lib/journeys-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Нийтэд харагдах (админаас сонгосон) сэтгэгдлүүд */
export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug") || "";
  if (!slug) return NextResponse.json({ items: [] });
  try {
    return NextResponse.json({ items: await listFeaturedReviews(slug) });
  } catch {
    return NextResponse.json({ items: [] });
  }
}

/** Аялалд явсан хүн л сэтгэгдэл үлдээнэ */
export async function POST(req: Request) {
  const uid = await getSessionUserId();
  if (!uid) return NextResponse.json({ error: "Эхлээд нэвтэрнэ үү." }, { status: 401 });

  const b = await req.json().catch(() => ({}));
  const slug = String(b?.slug || "");
  const text = String(b?.text || "").trim();
  const rating = Number(b?.rating) || 5;
  if (!slug || !text) return NextResponse.json({ error: "Сэтгэгдлээ бичнэ үү." }, { status: 400 });

  try {
    // Тухайн аялалд бүртгүүлж, аялал нь өнгөрсөн байх ёстой
    const mine = await listBookingsByUser(uid);
    const today = new Date().toISOString().slice(0, 10);
    const eligible = mine.some((x) => x.slug === slug && x.status !== "cancelled" && x.date <= today);
    if (!eligible) {
      return NextResponse.json({ error: "Энэ аялалд оролцсоны дараа сэтгэгдэл үлдээх боломжтой." }, { status: 403 });
    }

    const user = await getUserById(uid).catch(() => null);
    await createReview({ userId: uid, slug, name: user?.name || "Аялагч", rating, text });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Серверийн алдаа: " + (e instanceof Error ? e.message : String(e)) }, { status: 500 });
  }
}
