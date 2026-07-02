import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { findService, findCourse, findProduct, createOrder, getOrdersByUser, getCmsById } from "@/lib/repo";
import { pick } from "@/lib/i18n-core";
import type { Locale, OrderItem } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const uid = await getSessionUserId();
  if (!uid) return NextResponse.json({ orders: [] });
  return NextResponse.json({ orders: await getOrdersByUser(uid) });
}

export async function POST(req: Request) {
  const uid = await getSessionUserId();
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Bad request." }, { status: 400 });

  const { items, customer, lang } = body;
  const locale: Locale = ["mn", "en", "ko", "ja", "zh"].includes(lang) ? lang : "mn";
  if (!Array.isArray(items) || items.length === 0)
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  if (!customer || !customer.name || !customer.email || !customer.phone)
    return NextResponse.json({ error: "Missing customer details." }, { status: 400 });

  const resolved: OrderItem[] = [];
  for (const it of items) {
    const qty = Math.max(1, Math.min(20, parseInt(String(it.qty)) || 1));
    const found =
      it.kind === "service" ? findService(String(it.slug))
      : it.kind === "course" ? findCourse(String(it.slug))
      : it.kind === "product" ? findProduct(String(it.slug))
      : null;
    if (found) {
      resolved.push({ kind: it.kind, slug: found.slug, title: pick(found.title, locale), price: found.price, qty });
      continue;
    }
    // CMS-ээс нэмсэн бүтээгдэхүүн/контент (slug = cms id)
    const cms = await getCmsById(String(it.slug)).catch(() => null);
    if (cms && ["service", "course", "product"].includes(it.kind)) {
      resolved.push({ kind: it.kind, slug: cms.id, title: cms.title, price: typeof cms.price === "number" ? cms.price : 0, qty });
    }
  }
  if (resolved.length === 0)
    return NextResponse.json({ error: "No matching items." }, { status: 400 });

  const order = await createOrder({
    userId: uid,
    items: resolved,
    customer: {
      name: String(customer.name),
      email: String(customer.email),
      phone: String(customer.phone),
      note: customer.note ? String(customer.note) : undefined,
    },
  });
  return NextResponse.json({ order });
}
