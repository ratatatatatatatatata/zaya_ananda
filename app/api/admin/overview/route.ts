import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { getUserById, adminStats } from "@/lib/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const uid = await getSessionUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const me = await getUserById(uid);
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && me?.email !== adminEmail) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const s = await adminStats();
  return NextResponse.json({
    stats: { users: s.users, orders: s.orders, revenue: s.revenue, messages: s.messages },
    users: s.usersList,
    orders: s.ordersList,
  });
}
