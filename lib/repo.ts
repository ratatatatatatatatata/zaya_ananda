import { randomUUID } from "crypto";
import { hashPassword, verifyPassword } from "./auth";
import { sbSelect, sbInsert, sbUpdate, sbDelete, enc } from "./supabase";
import { services, courses, products } from "@/data/content";
import type { User, PublicUser, Order, OrderItem, ContactMessage, CmsItem } from "./types";

export const catalog = { services, courses, products };
export function findService(slug: string) { return services.find((s) => s.slug === slug) || null; }
export function findCourse(slug: string) { return courses.find((c) => c.slug === slug) || null; }
export function findProduct(slug: string) { return products.find((p) => p.slug === slug) || null; }

export function toPublicUser(u: User): PublicUser {
  const { passwordHash: _pw, ...rest } = u;
  void _pw;
  return rest;
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

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  return sbSelect<Order>("orders", `user_id=eq.${enc(userId)}&order=created_at.desc`);
}
export async function createMessage(input: { name: string; email: string; phone?: string; subject: string; message: string }): Promise<ContactMessage> {
  return sbInsert<ContactMessage>("messages", {
    id: randomUUID(), name: input.name.trim(), email: input.email.trim(), phone: input.phone?.trim() || null,
    subject: input.subject.trim(), message: input.message.trim(), createdAt: new Date().toISOString(),
  });
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

export async function createCmsItem(input: {
  kind: CmsItem["kind"]; title: string; summary?: string; body?: string; price?: number; category?: string; mode?: CmsItem["mode"];
  image?: string; videoLessons?: number; students?: number; views?: number; teacherName?: string; teacherImage?: string; teacherInfo?: string; accessDays?: number;
}): Promise<CmsItem> {
  return sbInsert<CmsItem>("cms_items", {
    id: randomUUID(), kind: input.kind, title: input.title.trim(), summary: (input.summary || "").trim(),
    body: input.body?.trim() || null,
    price: numOrNull(input.price),
    category: input.category?.trim() || null,
    mode: input.kind === "course" ? input.mode || "online" : null,
    image: input.image || null,
    videoLessons: numOrNull(input.videoLessons),
    students: numOrNull(input.students),
    views: numOrNull(input.views),
    teacherName: input.teacherName?.trim() || null,
    teacherImage: input.teacherImage || null,
    teacherInfo: input.teacherInfo?.trim() || null,
    accessDays: numOrNull(input.accessDays),
    createdAt: new Date().toISOString(),
  });
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
