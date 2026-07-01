import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { getOrdersByUser } from "@/lib/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const uid = await getSessionUserId();
  if (!uid) return NextResponse.json({ status: "none" });
  const itemId = new URL(req.url).searchParams.get("itemId");
  if (!itemId) return NextResponse.json({ status: "none" });
  try {
    const orders = await getOrdersByUser(uid);
    const mine = orders.filter((o) => (o.items || []).some((i) => i.slug === itemId));
    const now = Date.now();
    const active = mine.find((o) => o.status === "paid" && (!o.expiresAt || new Date(o.expiresAt).getTime() > now));
    if (active) {
      const daysLeft = active.expiresAt ? Math.max(0, Math.ceil((new Date(active.expiresAt).getTime() - now) / 86400000)) : null;
      return NextResponse.json({ status: "active", expiresAt: active.expiresAt || null, daysLeft });
    }
    if (mine.some((o) => o.status === "paid" && o.expiresAt && new Date(o.expiresAt).getTime() <= now))
      return NextResponse.json({ status: "expired" });
    if (mine.some((o) => o.status === "pending")) return NextResponse.json({ status: "pending" });
    return NextResponse.json({ status: "none" });
  } catch {
    return NextResponse.json({ status: "none" });
  }
}
