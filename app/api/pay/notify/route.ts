import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { getUserById, getCmsById, createOrder } from "@/lib/repo";
import { MERGE_ITEMS } from "@/data/merge-toorog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const uid = await getSessionUserId();
    if (!uid) return NextResponse.json({ error: "Эхлээд нэвтэрнэ үү." }, { status: 401 });
    const body = await req.json().catch(() => null);
    const itemId = body?.itemId ? String(body.itemId) : "";
    const method = body?.method === "bank" ? "bank" : "qpay";
    if (!itemId) return NextResponse.json({ error: "Бараа олдсонгүй." }, { status: 400 });

    // Мэргэ төөрөгийн тогтсон үнэтэй тайлал (CMS-д байхгүй, системд шууд бүртгэлтэй)
    const fixed = Object.values(MERGE_ITEMS).find((m) => m.id === itemId);

    const [user, item] = await Promise.all([getUserById(uid), fixed ? null : getCmsById(itemId)]);
    if (!fixed && !item) return NextResponse.json({ error: "Бараа олдсонгүй." }, { status: 404 });
    const price = fixed ? fixed.price : typeof item!.price === "number" ? item!.price : 0;
    const kind = fixed ? "service" : item!.kind === "course" || item!.kind === "product" ? item!.kind : "service";
    const slug = fixed ? fixed.id : item!.id;
    const title = fixed ? fixed.title : item!.title;

    const order = await createOrder({
      userId: uid,
      items: [{ kind, slug, title, price, qty: 1 }],
      customer: {
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        note: method === "bank" ? "Банкны шилжүүлэг" : "QPay",
      },
    });
    return NextResponse.json({ ok: true, id: order.id });
  } catch (e) {
    return NextResponse.json({ error: "Серверийн алдаа: " + (e instanceof Error ? e.message : String(e)) }, { status: 500 });
  }
}
