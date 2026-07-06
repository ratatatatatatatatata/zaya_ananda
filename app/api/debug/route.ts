import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getSettings } from "@/lib/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Оношилгоо + гацсан кэшийг хүчээр цэвэрлэнэ. Дуудах бүрт бүх нийтийн хуудас шинэчлэгдэнэ. */
export async function GET() {
  // Гацсан бүх кэшийг цэвэрлэх
  revalidateTag("settings");
  revalidateTag("cms");
  revalidateTag("pages");
  for (const p of ["/", "/about", "/teachers", "/services", "/courses", "/shop", "/resources", "/gift", "/mood"]) {
    try { revalidatePath(p); } catch { /* ignore */ }
  }
  try { revalidatePath("/teachers/[slug]", "page"); } catch { /* ignore */ }
  try { revalidatePath("/item/[id]", "page"); } catch { /* ignore */ }
  try { revalidatePath("/p/[id]", "page"); } catch { /* ignore */ }

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  let host = "";
  try { host = new URL(url).host; } catch { host = url.slice(0, 40); }
  const s = await getSettings();
  return NextResponse.json({
    purged: true,
    supabaseHost: host,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    teachersCount: (s.teachers || []).length,
    teacherNames: (s.teachers || []).map((t) => t.name),
    teamCount: (s.team || []).length,
    aboutVideo: !!s.aboutVideo,
    bankSet: !!(s.bank && (s.bank.account || s.bank.bankName)),
  });
}
