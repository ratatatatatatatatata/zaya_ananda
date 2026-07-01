import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { getUserById, updateOrder, getOrderById, getCmsById } from "@/lib/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req: Request) {
  const uid = await getSessionUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const me = await getUserById(uid);
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && me?.email !== adminEmail) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json().catch(() => null);
  const id = body?.id ? String(body.id) : "";
  const status = body?.status;
  if (!id || !["pending", "paid", "cancelled"].includes(status))
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  try {
    const patch: { status: typeof status; expiresAt?: string | null } = { status };
    if (status === "paid") {
      const existing = await getOrderById(id);
      const itemId = existing?.items?.[0]?.slug;
      const item = itemId ? await getCmsById(itemId) : null;
      const days = item && typeof item.accessDays === "number" ? item.accessDays : 0;
      patch.expiresAt = days > 0 ? new Date(Date.now() + days * 86400000).toISOString() : null;
    } else {
      patch.expiresAt = null;
    }
    const order = await updateOrder(id, patch);
    return NextResponse.json({ ok: true, order });
  } catch (e) {
    return NextResponse.json({ error: "Серверийн алдаа: " + (e instanceof Error ? e.message : String(e)) }, { status: 500 });
  }
}
