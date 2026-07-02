import { randomUUID } from "crypto";
import { unstable_cache } from "next/cache";
import { hashPassword, verifyPassword } from "./auth";
import { sbSelect, sbInsert, sbUpdate, sbDelete, enc } from "./supabase";
import { services, courses, products } from "@/data/content";
import type { User, PublicUser, Order, OrderItem, ContactMessage, CmsItem, SiteSettings, SitePage, TeacherPreset } from "./types";

export const catalog = { services, courses, products };
export function findService(slug: string) { return services.find((s) => s.slug === slug) || null; }
export function findCourse(slug: string) { return courses.find((c) => c.slug === slug) || null; }
export function findProduct(slug: string) { return products.find((p) => p.slug === slug) || null; }

export function toPublicUser(u: User): PublicUser {
  const { passwordHash: _pw, ...rest } = u;
  void _pw;
  return rest;
}

export function isAdminEmail(email?: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return true;
  return (email || "").toLowerCase() === adminEmail.toLowerCase();
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const e = (email || "").trim().toLowerCase();
  if (!e) return null;
  const rows = await sbSelect<User>("users", `email=eq.${enc(e)}&limit=1`);
  return rows[0] || null;
}
export async function getUserById(id: string): Promise<User | null> {
  const rows = await sbSelect<User>("users", `id=eq.${enc(id)}&limit=1`);
  return rows[0] || null;
}
export async function getUserByPhone(phone: string): Promise<User | null> {
  const p = (phone || "").trim();
  if (!p) return null;
  const rows = await sbSelect<User>("users", `phone=eq.${enc(p)}&limit=1`);
  return rows[0] || null;
}
export async function getUserByEmailOrPhone(identifier: string): Promise<User | null> {
  const v = (identifier || "").trim();
  if (!v) return null;
  if (v.includes("@")) return getUserByEmail(v);
  return (await getUserByPhone(v)) || (await getUserByEmail(v));
}
export async function getOrCreateSocialUser(provider: string): Promise<User> {
  const email = provider.toLowerCase() + ".demo@zaya.local";
  const existing = await getUserByEmail(email);
  if (existing) return existing;
  return sbInsert<User>("users", {
    id: randomUUID(),
    name: provider === "facebook" ? "Facebook хэрэглэгч" : "Хэрэглэгч",
    email, phone: null, passwordHash: hashPassword(randomUUID()), createdAt: new Date().toISOString(),
  });
}
export async function createUser(input: { name: string; email?: string; password: string; phone?: string }): Promise<{ user?: User; error?: string }> {
  const email = (input.email || "").trim().toLowerCase();
  const phone = (input.phone || "").trim();
  if (!email && !phone) return { error: "Имэйл эсвэл утасны дугаараа оруулна уу." };
  if (email && (await getUserByEmail(email))) return { error: "Энэ имэйл хаягаар бүртгэл аль хэдийн үүссэн байна." };
  if (phone && (await getUserByPhone(phone))) return { error: "Энэ утасны дугаараар бүртгэл аль хэдийн үүссэн байна." };
  const user = await sbInsert<User>("users", {
    id: randomUUID(), name: input.name.trim(), email: email || null, phone: phone || null,
    passwordHash: hashPassword(input.password), createdAt: new Date().toISOString(),
  });
  return { user };
}
export async function authenticate(identifier: string, password: string): Promise<User | null> {
  const user = await getUserByEmailOrPhone(identifier);
  if (!user) return null;
  if (!verifyPassword(password, user.passwordHash)) return null;
  return user;
}
export async function updateUser(id: string, patch: { name?: string; phone?: string; email?: string }): Promise<{ user?: User; error?: string }> {
  const u = await getUserById(id);
  if (!u) return { error: "Хэрэглэгч олдсонгүй." };
  const p: Record<string, unknown> = {};
  if (patch.email !== undefined) {
    const email = String(patch.email).trim().toLowerCase();
    if (email && email !== u.email) {
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "Имэйл хаяг буруу байна." };
      const exists = await getUserByEmail(email);
      if (exists && exists.id !== id) return { error: "Энэ имэйл хаягаар бүртгэл аль хэдийн үүссэн байна." };
      p.email = email;
    }
  }
  if (patch.name !== undefined && String(patch.name).trim()) p.name = String(patch.name).trim();
  if (patch.phone !== undefined) p.phone = String(patch.phone).trim() || null;
  const user = Object.keys(p).length ? await sbUpdate<User>("users", id, p) : u;
  return { user: user || u };
}
export async function createOrder(input: { userId: string | null; items: OrderItem[]; customer: Order["customer"]; status?: Order["status"] }): Promise<Order> {
  const total = input.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  return sbInsert<Order>("orders", {
    id: randomUUID(), userId: input.userId, items: input.items, total, status: input.status || "pending", customer: input.customer, createdAt: new Date().toISOString(),
  });
}
export async function updateOrderStatus(id: string, status: Order["status"]): Promise<Order | null> {
  return sbUpdate<Order>("orders", id, { status });
}

export async function getOrderById(id: string): Promise<Order | null> {
  const rows = await sbSelect<Order>("orders", `id=eq.${enc(id)}&limit=1`);
  return rows[0] || null;
}

export async function updateOrder(id: string, patch: { status?: Order["status"]; expiresAt?: string | null }): Promise<Order | null> {
  return sbUpdate<Order>("orders", id, patch as Record<string, unknown>);
}

export async function deleteOrder(id: string): Promise<boolean> {
  await sbDelete("orders", id);
  return true;
}

export async function deleteMessage(id: string): Promise<boolean> {
  await sbDelete("messages", id);
  return true;
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  return sbSelect<Order>("orders", `user_id=eq.${enc(userId)}&order=created_at.desc`);
}
export async function createMessage(input: { name: string; email: string; phone?: string; subject: string; message: string }): Promise<ContactMessage> {
  return sbInsert<ContactMessage>("messages", {
    id: randomUUID(), name: input.name.trim(), email: input.email.trim(), phone: input.phone?.trim() || null,
    subject: input.subject.trim(), message: input.message.trim(), createdAt: new Date().toISOString(),
  });
}

// ---------- Settings ----------
export async function getSettings(): Promise<SiteSettings> {
  try {
    const rows = await sbSelect<SiteSettings>("site_settings", "id=eq.main&limit=1");
    const r = (rows[0] || {}) as SiteSettings;
    return {
      logo: r.logo, aboutTitle: r.aboutTitle, aboutBody: r.aboutBody, aboutVideo: r.aboutVideo,
      facebook: r.facebook, instagram: r.instagram, youtube: r.youtube,
      team: Array.isArray(r.team) ? r.team : [],
      teachers: Array.isArray(r.teachers) ? r.teachers : [],
      bank: r.bank && typeof r.bank === "object" ? r.bank : {},
    };
  } catch { return {}; }
}

/** Багшийн мэдээллийг дараа дахин сонгож болохоор хадгална (нэрээр upsert). */
export async function upsertTeacherPreset(t: TeacherPreset): Promise<void> {
  if (!t.name?.trim()) return;
  try {
    const s = await getSettings();
    const list = [...(s.teachers || [])];
    const idx = list.findIndex((x) => x.name.trim().toLowerCase() === t.name.trim().toLowerCase());
    const entry = { name: t.name.trim(), image: t.image || list[idx]?.image || "", info: t.info || list[idx]?.info || "" };
    if (idx >= 0) list[idx] = entry; else list.push(entry);
    await updateSettings({ teachers: list });
  } catch { /* багш хадгалахад алдаа гарвал контентын хадгалалтыг зогсоохгүй */ }
}
export async function updateSettings(patch: Partial<SiteSettings>): Promise<SiteSettings> {
  const existing = await sbSelect<{ id: string }>("site_settings", "id=eq.main&limit=1");
  const row: Record<string, unknown> = { ...patch, updatedAt: new Date().toISOString() };
  if (existing[0]) await sbUpdate("site_settings", "main", row);
  else await sbInsert("site_settings", { id: "main", ...row });
  return getSettings();
}

// ---------- CMS ----------
export async function listCms(kind: CmsItem["kind"]): Promise<CmsItem[]> {
  return sbSelect<CmsItem>("cms_items", `kind=eq.${enc(kind)}&order=created_at.desc`);
}
export async function allCms(): Promise<CmsItem[]> {
  return sbSelect<CmsItem>("cms_items", "order=created_at.desc");
}
const numOrNull = (v: unknown) => (typeof v === "number" && !Number.isNaN(v) ? v : null);

export async function getCmsById(id: string): Promise<CmsItem | null> {
  const rows = await sbSelect<CmsItem>("cms_items", `id=eq.${enc(id)}&limit=1`);
  return rows[0] || null;
}

// ---------- Custom pages (админ өөрөө үүсгэдэг хуудсууд) ----------
export async function listPages(): Promise<SitePage[]> {
  try { return await sbSelect<SitePage>("pages", "order=position.asc,created_at.asc"); } catch { return []; }
}
export async function getPageById(id: string): Promise<SitePage | null> {
  const rows = await sbSelect<SitePage>("pages", `id=eq.${enc(id)}&limit=1`);
  return rows[0] || null;
}
type PageInput = { title: string; navLabel?: string; body?: string; image?: string; video?: string; position?: number };
function pageRow(input: PageInput): Record<string, unknown> {
  return {
    title: input.title.trim(), navLabel: input.navLabel?.trim() || null, body: input.body || null,
    image: input.image || null, video: input.video || null,
    position: typeof input.position === "number" && !Number.isNaN(input.position) ? input.position : 0,
  };
}
export async function createPage(input: PageInput): Promise<SitePage> {
  return sbInsert<SitePage>("pages", { id: randomUUID(), ...pageRow(input), createdAt: new Date().toISOString() });
}
export async function updatePage(id: string, input: PageInput): Promise<SitePage | null> {
  return sbUpdate<SitePage>("pages", id, pageRow(input));
}
export async function deletePage(id: string): Promise<boolean> {
  await sbDelete("pages", id); return true;
}

// ---------- Password helpers ----------
export async function setUserPassword(id: string, password: string): Promise<boolean> {
  const u = await getUserById(id);
  if (!u) return false;
  await sbUpdate("users", id, { passwordHash: hashPassword(password) });
  return true;
}
export async function setResetCode(userId: string, codeHash: string, expiresAt: string): Promise<void> {
  await sbUpdate("users", userId, { resetCodeHash: codeHash, resetExpires: expiresAt });
}
export async function clearResetCode(userId: string): Promise<void> {
  await sbUpdate("users", userId, { resetCodeHash: null, resetExpires: null });
}

// ---------- Cached public reads (invalidated via revalidateTag in admin API routes) ----------
export const listCmsCached = (kind: CmsItem["kind"]) =>
  unstable_cache(() => listCms(kind), ["cms-list", kind], { tags: ["cms"], revalidate: 300 })();
export const getCmsByIdCached = (id: string) =>
  unstable_cache(() => getCmsById(id), ["cms-item", id], { tags: ["cms"], revalidate: 300 })();
export const getSettingsCached = () =>
  unstable_cache(() => getSettings(), ["site-settings"], { tags: ["settings"], revalidate: 300 })();
export const listPagesCached = () =>
  unstable_cache(() => listPages(), ["site-pages"], { tags: ["pages"], revalidate: 300 })();
export const getPageByIdCached = (id: string) =>
  unstable_cache(() => getPageById(id), ["site-page", id], { tags: ["pages"], revalidate: 300 })();

type CmsInput = {
  kind: CmsItem["kind"]; title: string; summary?: string; body?: string; price?: number; category?: string; mode?: CmsItem["mode"];
  image?: string; images?: string[]; link?: string; videoLessons?: number; students?: number; views?: number; teacherName?: string; teacherImage?: string; teacherInfo?: string; accessDays?: number; lessons?: { title: string; path?: string; url?: string; quality?: string; subtitles?: string }[];
};
function cmsRow(input: CmsInput): Record<string, unknown> {
  return {
    kind: input.kind, title: input.title.trim(), summary: (input.summary || "").trim(),
    body: input.body?.trim() || null,
    price: numOrNull(input.price),
    category: input.category?.trim() || null,
    mode: input.kind === "course" ? input.mode || "online" : null,
    image: input.image || null,
    images: input.images && input.images.length ? input.images : null,
    link: input.link?.trim() || null,
    videoLessons: input.lessons && input.lessons.length ? input.lessons.length : numOrNull(input.videoLessons),
    students: numOrNull(input.students),
    views: numOrNull(input.views),
    teacherName: input.teacherName?.trim() || null,
    teacherImage: input.teacherImage || null,
    teacherInfo: input.teacherInfo?.trim() || null,
    accessDays: numOrNull(input.accessDays),
    lessons: input.lessons && input.lessons.length ? input.lessons : null,
  };
}
export async function createCmsItem(input: CmsInput): Promise<CmsItem> {
  return sbInsert<CmsItem>("cms_items", { id: randomUUID(), ...cmsRow(input), createdAt: new Date().toISOString() });
}
export async function updateCmsItem(id: string, input: CmsInput): Promise<CmsItem | null> {
  return sbUpdate<CmsItem>("cms_items", id, cmsRow(input));
}
export async function deleteCmsItem(id: string): Promise<boolean> {
  await sbDelete("cms_items", id);
  return true;
}

export async function adminStats(): Promise<{ users: number; orders: number; revenue: number; messages: number; usersList: PublicUser[]; ordersList: Order[]; messagesList: ContactMessage[] }> {
  const [users, orders, messages] = await Promise.all([
    sbSelect<User>("users", "order=created_at.desc"),
    sbSelect<Order>("orders", "order=created_at.desc"),
    sbSelect<ContactMessage>("messages", "order=created_at.desc"),
  ]);
  return {
    users: users.length, orders: orders.length,
    revenue: orders.reduce((s, o) => s + o.total, 0), messages: messages.length,
    usersList: users.map(toPublicUser), ordersList: orders, messagesList: messages,
  };
}
