import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { getUserById, getCmsById, createOrder } from "@/lib/repo";

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

    const [user, item] = await Promise.all([getUserById(uid), getCmsById(itemId)]);
    if (!item) return NextResponse.json({ error: "Бараа олдсонгүй." }, { status: 404 });
    const price = typeof item.price === "number" ? item.price : 0;
    const kind = item.kind === "course" || item.kind === "product" ? item.kind : "service";

    const order = await createOrder({
      userId: uid,
      items: [{ kind, slug: item.id, title: item.title, price, qty: 1 }],
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
