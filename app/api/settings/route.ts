import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { getUserById, getSettings, updateSettings } from "@/lib/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ settings: await getSettings() });
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
      facebook: str(body.facebook),
      instagram: str(body.instagram),
      youtube: str(body.youtube),
    });
    return NextResponse.json({ settings });
  } catch (e) {
    return NextResponse.json({ error: "Хадгалах үед алдаа: " + (e instanceof Error ? e.message : String(e)) }, { status: 500 });
  }
}
