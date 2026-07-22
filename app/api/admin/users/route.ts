import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { checkAdmin, setUserPassword, setUserAdmin } from "@/lib/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Админ хэрэглэгч удирдана:
 *  - { id, password }  → нууц үг шинэчлэх (бүх админ)
 *  - { id, isAdmin }   → админ эрх олгох/хасах (зөвхөн супер админ)
 */
export async function PATCH(req: Request) {
  const uid = await getSessionUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const adm = await checkAdmin(uid);
  if (!adm.ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const id = String(body?.id || "");
  if (!id) return NextResponse.json({ error: "Хэрэглэгч сонгогдоогүй байна." }, { status: 400 });

  if (body?.isAdmin !== undefined) {
    if (!adm.isSuper)
      return NextResponse.json({ error: "Админ эрх олгох/хасахыг зөвхөн үндсэн (супер) админ хийнэ." }, { status: 403 });
    if (id === uid)
      return NextResponse.json({ error: "Өөрийнхөө эрхийг өөрчлөх боломжгүй." }, { status: 400 });
    const ok = await setUserAdmin(id, !!body.isAdmin);
    if (!ok) return NextResponse.json({ error: "Хэрэглэгч олдсонгүй." }, { status: 404 });
    return NextResponse.json({ ok: true });
  }

  const password = String(body?.password || "");
  if (password.length < 6)
    return NextResponse.json({ error: "Шинэ нууц үг 6-аас дээш тэмдэгт байх ёстой." }, { status: 400 });
  const ok = await setUserPassword(id, password);
  if (!ok) return NextResponse.json({ error: "Хэрэглэгч олдсонгүй." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
