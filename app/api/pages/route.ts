import { NextResponse } from "next/server";
import { listPagesCached } from "@/lib/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Нийтэд харагдах цэсний хуудсууд (Header ашиглана). */
export async function GET() {
  const pages = await listPagesCached();
  return NextResponse.json({ pages: pages.map((p) => ({ id: p.id, title: p.title, navLabel: p.navLabel || p.title })) });
}
