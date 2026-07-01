import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { getUserById, toPublicUser } from "@/lib/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const uid = await getSessionUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const me = getUserById(uid);
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && me?.email !== adminEmail) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const data = db();
  const orders = data.orders;
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  return NextResponse.json({
    stats: { users: data.users.length, orders: orders.length, revenue, messages: data.messages.length },
    users: data.users.map(toPublicUser),
    orders,
  });
}
