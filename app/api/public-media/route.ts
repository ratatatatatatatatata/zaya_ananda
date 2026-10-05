import { NextResponse } from "next/server";
import { getCmsById } from "@/lib/repo";
import { signedDownloadUrl } from "@/lib/supabase";

export const dynamic = "force-dynamic";
/** Resolve legacy uploaded FREE media by record, never accept arbitrary storage paths. */
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const id = params.get("itemId");
  const index = Number(params.get("index"));
  if (!id || !params.has("index") || !Number.isInteger(index) || index < 0) return new NextResponse(null, { status: 400 });
  try {
    const item = await getCmsById(id);
    if (!item || !["free", "resource"].includes(item.kind) || Number(item.price || 0) > 0) return new NextResponse(null, { status: 404 });
    const path = item.lessons?.[index]?.path;
    if (!path) return new NextResponse(null, { status: 404 });
    const response = NextResponse.redirect(await signedDownloadUrl("lesson-videos", path, 3600), 307);
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch { return new NextResponse(null, { status: 503 }); }
}
