import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { getSessionUserId } from "@/lib/auth";
import { getUserById, allCms, createCmsItem, updateCmsItem, deleteCmsItem, upsertTeacherPreset } from "@/lib/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KINDS = ["service", "course", "product", "resource", "promo", "free"] as const;
const LANGS = ["en", "ko", "ja", "zh"] as const;

// Purge cached public pages/data so admin edits show up immediately.
function refreshPublic(id?: string) {
  revalidateTag("cms");
  for (const p of ["/services", "/courses", "/shop", "/resources", "/gift"]) revalidatePath(p);
  if (id) revalidatePath(`/item/${id}`);
}

async function guard() {
  const uid = await getSessionUserId();
  if (!uid) return { ok: false as const, res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const me = await getUserById(uid);
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && me?.email !== adminEmail)
    return { ok: false as const, res: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { ok: true as const };
}

const num = (v: unknown) => (v !== undefined && v !== null && v !== "" ? Number(v) : undefined);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseInput(body: any) {
  const lessons = Array.isArray(body.lessons)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? body.lessons.map((l: any) => ({ title: String(l?.title || "").trim(), path: l?.path ? String(l.path) : "", url: l?.url ? String(l.url) : "", quality: l?.quality ? String(l.quality) : "", subtitles: l?.subtitles ? String(l.subtitles) : "" })).filter((l: { title: string; path: string; url: string }) => l.title && (l.path || l.url))
    : undefined;
  return {
    kind: body.kind,
    title: String(body.title),
    summary: body.summary ? String(body.summary) : "",
    body: body.body ? String(body.body) : undefined,
    price: num(body.price),
    category: body.category ? String(body.category) : undefined,
    mode: body.mode,
    image: body.image ? String(body.image) : undefined,
    images: Array.isArray(body.images) ? body.images.map((s: unknown) => String(s)).filter(Boolean).slice(0, 3) : undefined,
    link: body.link ? String(body.link) : undefined,
    videoLessons: num(body.videoLessons),
    students: num(body.students),
    views: num(body.views),
    teacherName: body.teacherName ? String(body.teacherName) : undefined,
    teacherImage: body.teacherImage ? String(body.teacherImage) : undefined,
    teacherRole: body.teacherRole ? String(body.teacherRole) : undefined,
    teacherInfo: body.teacherInfo ? String(body.teacherInfo) : undefined,
    accessDays: num(body.accessDays),
    lessons,
    moods: Array.isArray(body.moods) ? body.moods.map((m: unknown) => String(m)).filter(Boolean) : undefined,
    i18n: parseI18n(body.i18n),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseI18n(raw: any) {
  if (!raw || typeof raw !== "object") return undefined;
  const out: Record<string, { title?: string; summary?: string; body?: string; navLabel?: string }> = {};
  for (const l of LANGS) {
    const v = raw[l];
    if (!v || typeof v !== "object") continue;
    const entry: { title?: string; summary?: string; body?: string; navLabel?: string } = {};
    if (v.title && String(v.title).trim()) entry.title = String(v.title);
    if (v.summary && String(v.summary).trim()) entry.summary = String(v.summary);
    if (v.body && String(v.body).trim()) entry.body = String(v.body);
    if (v.navLabel && String(v.navLabel).trim()) entry.navLabel = String(v.navLabel);
    if (Object.keys(entry).length) out[l] = entry;
  }
  return Object.keys(out).length ? out : undefined;
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
  if (!body || !KINDS.includes(body.kind)) return NextResponse.json({ error: "Төрөл буруу байна." }, { status: 400 });
  if (!body.title || !String(body.title).trim()) return NextResponse.json({ error: "Гарчиг оруулна уу." }, { status: 400 });
  try {
    const input = parseInput(body);
    const item = await createCmsItem(input);
    if (input.teacherName) { await upsertTeacherPreset({ name: input.teacherName, image: input.teacherImage, role: input.teacherRole, info: input.teacherInfo }); revalidateTag("settings"); }
    refreshPublic(item.id);
    return NextResponse.json({ item });
  } catch (e) {
    return NextResponse.json({ error: "Хадгалах үед алдаа: " + (e instanceof Error ? e.message : String(e)) }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const g = await guard();
  if (!g.ok) return g.res;
  const body = await req.json().catch(() => null);
  if (!body || !body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  if (!KINDS.includes(body.kind)) return NextResponse.json({ error: "Төрөл буруу байна." }, { status: 400 });
  if (!body.title || !String(body.title).trim()) return NextResponse.json({ error: "Гарчиг оруулна уу." }, { status: 400 });
  try {
    const input = parseInput(body);
    const item = await updateCmsItem(String(body.id), input);
    if (input.teacherName) { await upsertTeacherPreset({ name: input.teacherName, image: input.teacherImage, role: input.teacherRole, info: input.teacherInfo }); revalidateTag("settings"); }
    refreshPublic(String(body.id));
    return NextResponse.json({ item });
  } catch (e) {
    return NextResponse.json({ error: "Засах үед алдаа: " + (e instanceof Error ? e.message : String(e)) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const g = await guard();
  if (!g.ok) return g.res;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await deleteCmsItem(id);
  refreshPublic(id);
  return NextResponse.json({ ok: true });
}
