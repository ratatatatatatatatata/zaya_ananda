import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { getUserById, setUserPassword } from "@/lib/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function guard() {
  const uid = await getSessionUserId();
  if (!uid) return { ok: false as const, res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const me = await getUserById(uid);
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && me?.email !== adminEmail)
    return { ok: false as const, res: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { ok: true as const };
}

/** Админ хэрэглэгчийн нууц үгийг шинээр тохируулна. */
export async function PATCH(req: Request) {
  const g = await guard();
  if (!g.ok) return g.res;
  const body = await req.json().catch(() => null);
  const id = String(body?.id || "");
  const password = String(body?.password || "");
  if (!id || password.length < 6)
    return NextResponse.json({ error: "Хэрэглэгч болон шинэ нууц үг (6+ тэмдэгт) шаардлагатай." }, { status: 400 });
  const ok = await setUserPassword(id, password);
  if (!ok) return NextResponse.json({ error: "Хэрэглэгч олдсонгүй." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
