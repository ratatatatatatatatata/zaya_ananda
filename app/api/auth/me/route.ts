import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { getUserById, toPublicUser } from "@/lib/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const uid = await getSessionUserId();
  if (!uid) return NextResponse.json({ user: null });
  const user = await getUserById(uid);
  return NextResponse.json({ user: user ? toPublicUser(user) : null });
}
