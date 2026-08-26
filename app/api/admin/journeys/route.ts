import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { getSessionUserId } from "@/lib/auth";
import { checkAdmin } from "@/lib/repo";
import { listJourneys, getJourneyBySlug, createJourney, updateJourney, deleteJourney } from "@/lib/journeys-db";
import type { Scene } from "@/data/journeys";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SCENES: Scene[] = ["gobi", "mountain", "monastery", "forest", "steppe", "lake"];

async function guard() {
  const uid = await getSessionUserId();
  if (!uid) return { ok: false as const, res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  if (!(await checkAdmin(uid)).ok) return { ok: false as const, res: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { ok: true as const };
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9а-яөүёA-ZА-ЯӨҮЁ]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

const asScene = (v: unknown): Scene => (SCENES.includes(v as Scene) ? (v as Scene) : "steppe");
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parsePerson(v: any) {
  return { name: str(v?.name), role: str(v?.role), info: str(v?.info), image: v?.image ? String(v.image) : "" };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseItinerary(raw: any) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((d) => ({
      label: str(d?.label),
      title: str(d?.title),
      text: str(d?.text),
      bullets: Array.isArray(d?.bullets) ? d.bullets.map((b: unknown) => String(b)).filter(Boolean) : [],
      image: d?.image ? String(d.image) : "",
      scene: asScene(d?.scene),
    }))
    .filter((d) => d.title || d.text);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseInput(body: any) {
  return {
    slug: str(body.slug) || slugify(str(body.name)),
    name: str(body.name),
    tagline: str(body.tagline),
    scene: asScene(body.scene),
    image: body.image ? String(body.image) : "",
    days: str(body.days),
    groupSize: str(body.groupSize),
    transport: str(body.transport),
    stay: str(body.stay),
    audience: str(body.audience),
    summary: str(body.summary),
    included: str(body.included),
    excluded: str(body.excluded),
    price: str(body.price),
    prepay: Number(body.prepay) || 0,
    itinerary: parseItinerary(body.itinerary),
    lead: parsePerson(body.lead || {}),
    crew: Array.isArray(body.crew) ? body.crew.map(parsePerson).filter((c: { name: string }) => c.name) : [],
  };
}

function refreshPublic(slug?: string) {
  revalidateTag("journeys");
  revalidatePath("/");
  revalidatePath("/ayalal");
  if (slug) revalidatePath(`/ayalal/${slug}`);
}

export async function GET() {
  const g = await guard();
  if (!g.ok) return g.res;
  return NextResponse.json({ items: await listJourneys() });
}

export async function POST(req: Request) {
  const g = await guard();
  if (!g.ok) return g.res;
  const body = await req.json().catch(() => null);
  if (!body || !str(body.name)) return NextResponse.json({ error: "Аяллын нэрийг оруулна уу." }, { status: 400 });
  try {
    const input = parseInput(body);
    if (!input.slug) return NextResponse.json({ error: "Slug тодорхойгүй байна." }, { status: 400 });
    const existing = await getJourneyBySlug(input.slug);
    if (existing) return NextResponse.json({ error: "Ийм slug-тай аялал бүртгэлтэй байна." }, { status: 409 });
    const item = await createJourney(input);
    refreshPublic(item.slug);
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
  if (!str(body.name)) return NextResponse.json({ error: "Аяллын нэрийг оруулна уу." }, { status: 400 });
  try {
    const input = parseInput(body);
    if (!input.slug) return NextResponse.json({ error: "Slug тодорхойгүй байна." }, { status: 400 });
    const existing = await getJourneyBySlug(input.slug);
    if (existing && existing.id !== String(body.id)) return NextResponse.json({ error: "Ийм slug-тай өөр аялал бүртгэлтэй байна." }, { status: 409 });
    const item = await updateJourney(String(body.id), input);
    refreshPublic(input.slug);
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
  await deleteJourney(id);
  refreshPublic();
  return NextResponse.json({ ok: true });
}
