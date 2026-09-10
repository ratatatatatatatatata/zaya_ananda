import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { getSessionUserId } from "@/lib/auth";
import { checkAdmin, getSettingsCached, updateSettings } from "@/lib/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  // Cached read ("settings" tag) — invalidated on PATCH below.
  return NextResponse.json({ settings: await getSettingsCached() });
}

export async function PATCH(req: Request) {
  const uid = await getSessionUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await checkAdmin(uid)).ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const body = await req.json().catch(() => ({}));
    const str = (v: unknown) => (v !== undefined ? String(v || "") : undefined);
    const settings = await updateSettings({
      logo: str(body.logo),
      aboutTitle: str(body.aboutTitle),
      aboutBody: str(body.aboutBody),
      aboutVideo: str(body.aboutVideo),
      heroVideos: body.heroVideos && typeof body.heroVideos === "object"
        ? Object.fromEntries(Object.entries(body.heroVideos as Record<string, unknown>).map(([k, v]) => [k, String(v || "")]))
        : undefined,
      heroMedia: body.heroMedia && typeof body.heroMedia === "object"
        ? Object.fromEntries(
            Object.entries(body.heroMedia as Record<string, { kind?: unknown; src?: unknown }>).map(([k, v]) => [
              k,
              { kind: v?.kind === "image" ? ("image" as const) : ("video" as const), src: String(v?.src || "") },
            ]),
          )
        : undefined,
      zurhaiCards: Array.isArray(body.zurhaiCards)
        ? body.zurhaiCards
            .map((c: Record<string, unknown>) => ({
              emoji: String(c?.emoji || "🔮"),
              title: String(c?.title || "").trim(),
              desc: String(c?.desc || "").trim(),
              href: String(c?.href || "").trim(),
              image: c?.image ? String(c.image) : "",
            }))
            .filter((c: { title: string }) => c.title)
        : undefined,
      customMoods: Array.isArray(body.customMoods)
        ? body.customMoods
            .map((m: Record<string, unknown>) => ({
              key: String(m?.key || "").trim() || String(m?.label || "").trim().toLowerCase().replace(/\s+/g, "-"),
              emoji: String(m?.emoji || "✨"),
              label: String(m?.label || "").trim(),
            }))
            .filter((m: { key: string; label: string }) => m.key && m.label)
        : undefined,
      zurhaiRules: Array.isArray(body.zurhaiRules)
        ? body.zurhaiRules
            .map((r: Record<string, unknown>) => ({ key: String(r?.key || "").trim(), text: String(r?.text || "").trim() }))
            .filter((r: { key: string; text: string }) => r.key && r.text)
        : undefined,
      contact: body.contact && typeof body.contact === "object"
        ? {
            phone: str(body.contact.phone),
            email: str(body.contact.email),
            address: str(body.contact.address),
            hours: str(body.contact.hours),
            mapQuery: str(body.contact.mapQuery),
          }
        : undefined,
      servicePrepay: body.servicePrepay !== undefined ? Math.max(0, Number(body.servicePrepay) || 0) : undefined,
      facebook: str(body.facebook),
      instagram: str(body.instagram),
      youtube: str(body.youtube),
      team: Array.isArray(body.team)
        ? body.team.map((m: Record<string, unknown>) => ({
            name: String(m?.name || "").trim(),
            role: m?.role ? String(m.role) : "",
            info: m?.info ? String(m.info) : "",
            image: m?.image ? String(m.image) : "",
            focus: m?.focus !== undefined && m?.focus !== null && m?.focus !== "" ? Math.max(0, Math.min(100, Number(m.focus))) : undefined,
          })).filter((m: { name: string }) => m.name)
        : undefined,
      teachers: Array.isArray(body.teachers)
        ? body.teachers.map((t: Record<string, unknown>) => ({
            name: String(t?.name || "").trim(),
            role: t?.role ? String(t.role) : "",
            info: t?.info ? String(t.info) : "",
            image: t?.image ? String(t.image) : "",
            focus: t?.focus !== undefined && t?.focus !== null && t?.focus !== "" ? Math.max(0, Math.min(100, Number(t.focus))) : undefined,
          })).filter((t: { name: string }) => t.name)
        : undefined,
      bank: body.bank && typeof body.bank === "object"
        ? { bankName: str(body.bank.bankName), account: str(body.bank.account), holder: str(body.bank.holder) }
        : undefined,
      aboutMission: str(body.aboutMission),
      aboutStory: str(body.aboutStory),
      aboutStats: Array.isArray(body.aboutStats)
        ? body.aboutStats
            .map((s: Record<string, unknown>) => ({ value: String(s?.value || "").trim(), label: String(s?.label || "").trim() }))
            .filter((s: { value: string; label: string }) => s.value && s.label)
        : undefined,
      aboutValues: Array.isArray(body.aboutValues)
        ? body.aboutValues
            .map((v: Record<string, unknown>) => ({ glyph: String(v?.glyph || "✶").trim(), title: String(v?.title || "").trim(), text: String(v?.text || "").trim() }))
            .filter((v: { title: string; text: string }) => v.title && v.text)
        : undefined,
      aboutFaqs: Array.isArray(body.aboutFaqs)
        ? body.aboutFaqs
            .map((f: Record<string, unknown>) => ({ q: String(f?.q || "").trim(), a: String(f?.a || "").trim() }))
            .filter((f: { q: string; a: string }) => f.q && f.a)
        : undefined,
      aboutGallery: Array.isArray(body.aboutGallery)
        ? body.aboutGallery
            .map((g: Record<string, unknown>) => ({ image: String(g?.image || "").trim(), caption: g?.caption ? String(g.caption).trim() : "" }))
            .filter((g: { image: string }) => g.image)
        : undefined,
      aboutMilestones: Array.isArray(body.aboutMilestones)
        ? body.aboutMilestones
            .map((m: Record<string, unknown>) => ({ year: String(m?.year || "").trim(), text: String(m?.text || "").trim() }))
            .filter((m: { year: string; text: string }) => m.year && m.text)
        : undefined,
    });
    revalidateTag("settings");
    revalidatePath("/", "layout");
    revalidatePath("/about");
    revalidatePath("/teachers");
    revalidatePath("/teachers/[slug]", "page");
    return NextResponse.json({ settings });
  } catch (e) {
    return NextResponse.json({ error: "Хадгалах үед алдаа: " + (e instanceof Error ? e.message : String(e)) }, { status: 500 });
  }
}
