import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getSessionUserId } from "@/lib/auth";
import { checkAdmin } from "@/lib/repo";
import { configureBucket, ensureBucket, publicStorageUrl, signedUploadUrl } from "@/lib/supabase";
import { REEL_BUCKET, REEL_MAX_BYTES, REEL_MIME_EXT, reelUploadError } from "@/lib/reel-upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  const uid = await getSessionUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await checkAdmin(uid)).ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const body = await req.json();
    const mime = String(body.mime || "");
    const error = reelUploadError(mime, Number(body.size));
    if (error) return NextResponse.json({ error }, { status: 400 });
    // Public marketing media only. The lesson-videos bucket remains private.
    try {
      await configureBucket(REEL_BUCKET, { public: true, fileSizeLimit: REEL_MAX_BYTES, allowedMimeTypes: Object.keys(REEL_MIME_EXT) });
    } catch (error) {
      // Keep existing small uploads working while the project-wide limit is updated.
      if (Number(body.size) > 50 * 1024 * 1024 || !/maximum.*size|file.*size.*limit|exceed.*limit/i.test(String(error))) throw error;
      await ensureBucket(REEL_BUCKET, { public: true, fileSizeLimit: 50 * 1024 * 1024, allowedMimeTypes: Object.keys(REEL_MIME_EXT) });
    }
    const path = `${new Date().getFullYear()}/${randomUUID()}.${REEL_MIME_EXT[mime]}`;
    return NextResponse.json({ uploadUrl: await signedUploadUrl(REEL_BUCKET, path), url: publicStorageUrl(REEL_BUCKET, path) });
  } catch (error) {
    if (/maximum.*size|file.*size.*limit|exceed.*limit/i.test(String(error))) {
      return NextResponse.json({ error: "Supabase Storage-ийн ерөнхий файлын хязгаарыг 500 MB болгож тохируулна уу." }, { status: 413 });
    }
    return NextResponse.json({ error: "Хадгалалттай холбогдож чадсангүй. Дахин оролдоно уу." }, { status: 500 });
  }
}
