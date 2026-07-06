import { NextResponse } from "next/server";
import { getSettings } from "@/lib/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Түр оношилгоо: production ямар Supabase-тэй холбогдож байгаа, teachers өгөгдөл харагдаж буй эсэх. */
export async function GET() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  let host = "";
  try { host = new URL(url).host; } catch { host = url.slice(0, 40); }
  const s = await getSettings();
  return NextResponse.json({
    supabaseHost: host,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    teachersCount: (s.teachers || []).length,
    teacherNames: (s.teachers || []).map((t) => t.name),
    teamCount: (s.team || []).length,
    teamNames: (s.team || []).map((t) => t.name),
    aboutVideo: !!s.aboutVideo,
    bankSet: !!(s.bank && (s.bank.account || s.bank.bankName)),
  });
}
