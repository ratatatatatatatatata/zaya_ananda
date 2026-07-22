import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getSessionUserId } from "@/lib/auth";
import { checkAdmin } from "@/lib/repo";
import { ensureBucket, signedUploadUrl } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const BUCKET = "lesson-videos";

export async function POST(req: Request) {
  const uid = await getSessionUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await checkAdmin(uid)).ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const body = await req.json().catch(() => ({}));
    const filename = String(body?.filename || "video");
    const ext = (filename.split(".").pop() || "mp4").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5) || "mp4";
    const path = `${new Date().getFullYear()}/${randomUUID()}.${ext}`;
    await ensureBucket(BUCKET);
    const uploadUrl = await signedUploadUrl(BUCKET, path);
    return NextResponse.json({ uploadUrl, path });
  } catch (e) {
    return NextResponse.json({ error: "Байршуулах URL үүсгэхэд алдаа: " + (e instanceof Error ? e.message : String(e)) }, { status: 500 });
  }
}
