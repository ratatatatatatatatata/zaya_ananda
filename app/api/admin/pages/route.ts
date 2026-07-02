import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { getSessionUserId } from "@/lib/auth";
import { getUserById, listPages, createPage, updatePage, deletePage } from "@/lib/repo";

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

function refresh(id?: string) {
  revalidateTag("pages");
  if (id) revalidatePath("/p/" + id);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseInput(body: any) {
  return {
    title: String(body.title || ""),
    navLabel: body.navLabel ? String(body.navLabel) : undefined,
    body: body.body ? String(body.body) : undefined,
    image: body.image ? String(body.image) : undefined,
    video: body.video ? String(body.video) : undefined,
    position: body.position !== undefined && body.position !== "" ? Number(body.position) : undefined,
  };
}

export async function GET() {
  const g = await guard();
  if (!g.ok) return g.res;
  return NextResponse.json({ pages: await listPages() });
}

export async function POST(req: Request) {
  const g = await guard();
  if (!g.ok) return g.res;
  const body = await req.json().catch(() => null);
  if (!body || !String(body.title || "").trim()) return NextResponse.json({ error: "Гарчиг оруулна уу." }, { status: 400 });
  try {
    const page = await createPage(parseInput(body));
    refresh(page.id);
    return NextResponse.json({ page });
  } catch (e) {
    return NextResponse.json({ error: "Хадгалах үед алдаа: " + (e instanceof Error ? e.message : String(e)) }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const g = await guard();
  if (!g.ok) return g.res;
  const body = await req.json().catch(() => null);
  if (!body || !body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  if (!String(body.title || "").trim()) return NextResponse.json({ error: "Гарчиг оруулна уу." }, { status: 400 });
  try {
    const page = await updatePage(String(body.id), parseInput(body));
    refresh(String(body.id));
    return NextResponse.json({ page });
  } catch (e) {
    return NextResponse.json({ error: "Засах үед алдаа: " + (e instanceof Error ? e.message : String(e)) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const g = await guard();
  if (!g.ok) return g.res;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await deletePage(id);
  refresh(id);
  return NextResponse.json({ ok: true });
}
