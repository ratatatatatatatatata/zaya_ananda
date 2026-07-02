import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { getSessionUserId } from "@/lib/auth";
import { getUserById, getSettingsCached, updateSettings } from "@/lib/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  // Cached read ("settings" tag) — invalidated on PATCH below.
  return NextResponse.json({ settings: await getSettingsCached() });
}

export async function PATCH(req: Request) {
  const uid = await getSessionUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const me = await getUserById(uid);
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && me?.email !== adminEmail) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const body = await req.json().catch(() => ({}));
    const str = (v: unknown) => (v !== undefined ? String(v || "") : undefined);
    const settings = await updateSettings({
      logo: str(body.logo),
      aboutTitle: str(body.aboutTitle),
      aboutBody: str(body.aboutBody),
      aboutVideo: str(body.aboutVideo),
      facebook: str(body.facebook),
      instagram: str(body.instagram),
      youtube: str(body.youtube),
      team: Array.isArray(body.team)
        ? body.team.map((m: Record<string, unknown>) => ({
            name: String(m?.name || "").trim(),
            role: m?.role ? String(m.role) : "",
            info: m?.info ? String(m.info) : "",
            image: m?.image ? String(m.image) : "",
          })).filter((m: { name: string }) => m.name)
        : undefined,
      teachers: Array.isArray(body.teachers)
        ? body.teachers.map((t: Record<string, unknown>) => ({
            name: String(t?.name || "").trim(),
            info: t?.info ? String(t.info) : "",
            image: t?.image ? String(t.image) : "",
          })).filter((t: { name: string }) => t.name)
        : undefined,
      bank: body.bank && typeof body.bank === "object"
        ? { bankName: str(body.bank.bankName), account: str(body.bank.account), holder: str(body.bank.holder) }
        : undefined,
    });
    revalidateTag("settings");
    revalidatePath("/about");
    return NextResponse.json({ settings });
  } catch (e) {
    return NextResponse.json({ error: "Хадгалах үед алдаа: " + (e instanceof Error ? e.message : String(e)) }, { status: 500 });
  }
}
