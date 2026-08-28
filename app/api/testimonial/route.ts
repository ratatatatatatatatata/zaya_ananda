import { NextResponse } from "next/server";
import { createReview, listFeaturedReviews } from "@/lib/journeys-db";
import { notifyAdmins } from "@/lib/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Нүүр хуудасны ерөнхий сэтгэгдлийг тусгай "home" slug-аар journey_reviews хүснэгтэд хадгална
// (аяллын сэтгэгдэлтэй ижил хүснэгт, зөвхөн slug-аар нь ялгана) — шинэ хүснэгт үүсгэх шаардлагагүй.
const HOME_SLUG = "home";

/** Нийтэд харагдах (админаас сонгосон) нүүр хуудасны сэтгэгдлүүд */
export async function GET() {
  try {
    return NextResponse.json({ items: await listFeaturedReviews(HOME_SLUG) });
  } catch {
    return NextResponse.json({ items: [] });
  }
}

/** Хэн ч, нэвтрэлгүйгээр сэтгэгдэл үлдээж болно — админ сонгосны дараа нийтэд харагдана */
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  // Спам-бот хамгаалалт: харагдахгүй honeypot талбар бөглөгдсөн бол чимээгүй үл хэрэгсэнэ
  if (String(b?.company || "").trim()) return NextResponse.json({ ok: true });

  const name = String(b?.name || "").trim();
  const text = String(b?.text || "").trim();
  const rating = Number(b?.rating) || 5;
  if (!name || !text) return NextResponse.json({ error: "Нэр болон сэтгэгдлээ бичнэ үү." }, { status: 400 });

  try {
    const review = await createReview({ userId: null, slug: HOME_SLUG, name, rating, text });
    await notifyAdmins({
      kind: "system",
      title: "Шинэ сэтгэгдэл — " + review.name,
      body: review.text.slice(0, 120),
      link: "/admin",
      dedupeKey: "testimonial:" + review.id,
    }).catch(() => null);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Серверийн алдаа: " + (e instanceof Error ? e.message : String(e)) }, { status: 500 });
  }
}
