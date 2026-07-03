import { NextResponse } from "next/server";
import { listCmsCached } from "@/lib/repo";
import type { CmsItem } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED: CmsItem["kind"][] = ["service", "course", "product", "resource", "free"];

/** Нийтэд нээлттэй контентын жагсаалт (Сэтгэлийн туяа г.м. client хуудсууд ашиглана). */
export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("kinds") || "course,resource,free";
  const kinds = raw.split(",").map((s) => s.trim()).filter((k): k is CmsItem["kind"] => (ALLOWED as string[]).includes(k));
  const lists = await Promise.all(kinds.map((k) => listCmsCached(k)));
  return NextResponse.json({ items: lists.flat() });
}
