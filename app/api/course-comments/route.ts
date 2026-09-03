import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { getUserById } from "@/lib/repo";
import { createReview, listFeaturedReviews } from "@/lib/journeys-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Хичээлийн сэтгэгдлийг journey_reviews хүснэгтэд "item-<id>" гэсэн тусгай slug-аар хадгална
// (шинэ хүснэгт үүсгэх шаардлагагүй) — аяллын сэтгэгдэлтэй андуурахгүй.
const key = (itemId: string) => "item-" + itemId;

/** Нийтэд харагдах хичээлийн сэтгэгдэл — аяллын/нүүр хуудасны сэтгэгдэлтэй адил, админ
 *  "Аяллын сэтгэгдэл" табаас тухайн хичээлд дээд тал нь 3-ыг сонгосны дараа нийтэд харагдана. */
export async function GET(req: Request) {
  const itemId = new URL(req.url).searchParams.get("itemId") || "";
  if (!itemId) return NextResponse.json({ items: [] });
  try {
    return NextResponse.json({ items: await listFeaturedReviews(key(itemId)) });
  } catch {
    return NextResponse.json({ items: [] });
  }
}

/** Нэвтэрсэн хэрэглэгч сэтгэгдэл бичнэ */
export async function POST(req: Request) {
  const uid = await getSessionUserId();
  if (!uid) return NextResponse.json({ error: "Эхлээд нэвтэрнэ үү." }, { status: 401 });

  const b = await req.json().catch(() => ({}));
  const itemId = String(b?.itemId || "");
  const text = String(b?.text || "").trim();
  if (!itemId || !text) return NextResponse.json({ error: "Сэтгэгдлээ бичнэ үү." }, { status: 400 });

  try {
    const user = await getUserById(uid).catch(() => null);
    const review = await createReview({ userId: uid, slug: key(itemId), name: user?.name || "Хэрэглэгч", rating: 5, text });
    return NextResponse.json({ item: review });
  } catch (e) {
    return NextResponse.json({ error: "Серверийн алдаа: " + (e instanceof Error ? e.message : String(e)) }, { status: 500 });
  }
}
