import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { checkAdmin } from "@/lib/repo";
import { listMedia, createMedia, deleteMedia } from "@/lib/media-db";
import { signedDownloadUrl, deleteObjects } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const BUCKET = "lesson-videos";

async function requireAdmin() {
  const uid = await getSessionUserId();
  if (!uid) return { ok: false as const, res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  if (!(await checkAdmin(uid)).ok) return { ok: false as const, res: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { ok: true as const };
}

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.res;
  try {
    const items = await listMedia();
    const withUrls = await Promise.all(
      items.map(async (m) => {
        let url = "";
        try { url = await signedDownloadUrl(BUCKET, m.path); } catch { /* skip broken links */ }
        return { ...m, url };
      })
    );
    return NextResponse.json({ items: withUrls });
  } catch (e) {
    return NextResponse.json({ error: "Жагсаалт авахад алдаа: " + (e instanceof Error ? e.message : String(e)) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.res;
  const b = await req.json().catch(() => ({}));
  const filename = String(b?.filename || "").trim();
  const path = String(b?.path || "").trim();
  const mime = String(b?.mime || "");
  const size = Number(b?.size) || 0;
  if (!filename || !path) return NextResponse.json({ error: "Файлын мэдээлэл дутуу байна." }, { status: 400 });
  const kind = mime.startsWith("image/") ? "image" : mime.startsWith("video/") ? "video" : "other";
  try {
    const item = await createMedia({ filename, path, kind, mime, size });
    return NextResponse.json({ ok: true, item });
  } catch (e) {
    return NextResponse.json({ error: "Хадгалахад алдаа: " + (e instanceof Error ? e.message : String(e)) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.res;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") || "";
  const path = searchParams.get("path") || "";
  if (!id) return NextResponse.json({ error: "id дутуу байна." }, { status: 400 });
  try {
    if (path) await deleteObjects(BUCKET, [path]).catch(() => null);
    await deleteMedia(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Устгахад алдаа: " + (e instanceof Error ? e.message : String(e)) }, { status: 500 });
  }
}
