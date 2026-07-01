import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { updateUser, toPublicUser } from "@/lib/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req: Request) {
  const uid = await getSessionUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const { user, error } = updateUser(uid, { name: body.name, phone: body.phone, email: body.email });
  if (error || !user) return NextResponse.json({ error: error || "Update failed" }, { status: 400 });
  return NextResponse.json({ user: toPublicUser(user) });
}
