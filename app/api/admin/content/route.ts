import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { getUserById, allCms, createCmsItem, deleteCmsItem } from "@/lib/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KINDS = ["service", "course", "product", "resource"] as const;

async function guard() {
  const uid = await getSessionUserId();
  if (!uid) return { ok: false as const, res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const me = getUserById(uid);
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && me?.email !== adminEmail)
    return { ok: false as const, res: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { ok: true as const };
}

export async function GET() {
  const g = await guard();
  if (!g.ok) return g.res;
  return NextResponse.json({ items: allCms() });
}

export async function POST(req: Request) {
  const g = await guard();
  if (!g.ok) return g.res;
  const body = await req.json().catch(() => null);
  if (!body || !KINDS.includes(body.kind))
    return NextResponse.json({ error: "Төрөл буруу байна." }, { status: 400 });
  if (!body.title || !String(body.title).trim())
    return NextResponse.json({ error: "Гарчиг оруулна уу." }, { status: 400 });
  const item = createCmsItem({
    kind: body.kind,
    title: String(body.title),
    summary: body.summary ? String(body.summary) : "",
    body: body.body ? String(body.body) : undefined,
    price: body.price !== undefined && body.price !== "" ? Number(body.price) : undefined,
    category: body.category ? String(body.category) : undefined,
    mode: body.mode,
  });
  return NextResponse.json({ item });
}

export async function DELETE(req: Request) {
  const g = await guard();
  if (!g.ok) return g.res;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  deleteCmsItem(id);
  return NextResponse.json({ ok: true });
}
