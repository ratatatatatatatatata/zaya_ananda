import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { getUserById, allCms, createCmsItem, deleteCmsItem } from "@/lib/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KINDS = ["service", "course", "product", "resource"] as const;

async function guard() {
  const uid = await getSessionUserId();
  if (!uid) return { ok: false as const, res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const me = await getUserById(uid);
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && me?.email !== adminEmail)
    return { ok: false as const, res: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { ok: true as const };
}

export async function GET() {
  const g = await guard();
  if (!g.ok) return g.res;
  return NextResponse.json({ items: await allCms() });
}

export async function POST(req: Request) {
  const g = await guard();
  if (!g.ok) return g.res;
  const body = await req.json().catch(() => null);
  if (!body || !KINDS.includes(body.kind))
    return NextResponse.json({ error: "Төрөл буруу байна." }, { status: 400 });
  if (!body.title || !String(body.title).trim())
    return NextResponse.json({ error: "Гарчиг оруулна уу." }, { status: 400 });
  const num = (v: unknown) => (v !== undefined && v !== null && v !== "" ? Number(v) : undefined);
  const lessons = Array.isArray(body.lessons)
    ? body.lessons.map((l: { title?: unknown; path?: unknown; url?: unknown; quality?: unknown }) => ({ title: String(l?.title || "").trim(), path: l?.path ? String(l.path) : "", url: l?.url ? String(l.url) : "", quality: l?.quality ? String(l.quality) : "" })).filter((l: { title: string; path: string; url: string }) => l.title && (l.path || l.url))
    : undefined;
  try {
  const item = await createCmsItem({
    kind: body.kind,
    title: String(body.title),
    summary: body.summary ? String(body.summary) : "",
    body: body.body ? String(body.body) : undefined,
    price: num(body.price),
    category: body.category ? String(body.category) : undefined,
    mode: body.mode,
    image: body.image ? String(body.image) : undefined,
    videoLessons: num(body.videoLessons),
    students: num(body.students),
    views: num(body.views),
    teacherName: body.teacherName ? String(body.teacherName) : undefined,
    teacherImage: body.teacherImage ? String(body.teacherImage) : undefined,
    teacherInfo: body.teacherInfo ? String(body.teacherInfo) : undefined,
    accessDays: num(body.accessDays),
    lessons,
  });
    return NextResponse.json({ item });
  } catch (e) {
    return NextResponse.json({ error: "Хадгалах үед алдаа: " + (e instanceof Error ? e.message : String(e)) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const g = await guard();
  if (!g.ok) return g.res;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await deleteCmsItem(id);
  return NextResponse.json({ ok: true });
}
