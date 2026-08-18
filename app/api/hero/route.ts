import { NextResponse } from "next/server";
import { heroMediaFor } from "@/lib/hero-video";
import { HERO_SLOTS, type HeroSlot } from "@/lib/hero-slots";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Толгойн дэвсгэрийг client талаас авах (жишээ нь хувийн булан). */
export async function GET(req: Request) {
  const slot = new URL(req.url).searchParams.get("slot") || "";
  if (!HERO_SLOTS.some((s) => s.key === slot)) return NextResponse.json({ media: null });
  const media = await heroMediaFor(slot as HeroSlot);
  return NextResponse.json({ media: media || null });
}
