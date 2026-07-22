import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { checkAdmin, adminStats } from "@/lib/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const uid = await getSessionUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await checkAdmin(uid)).ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const s = await adminStats();
  return NextResponse.json({
    stats: { users: s.users, orders: s.orders, revenue: s.revenue, messages: s.messages },
    users: s.usersList,
    orders: s.ordersList,
    messages: s.messagesList,
  });
}
