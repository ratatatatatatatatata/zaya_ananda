import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { checkAdmin, deleteMessage } from "@/lib/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(req: Request) {
  const uid = await getSessionUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await checkAdmin(uid)).ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await deleteMessage(id);
  return NextResponse.json({ ok: true });
}
