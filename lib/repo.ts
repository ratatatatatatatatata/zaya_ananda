import { randomUUID } from "crypto";
import { db, persist } from "./db";
import { hashPassword, verifyPassword } from "./auth";
import { services, courses, products } from "@/data/content";
import type {
  User,
  PublicUser,
  Order,
  OrderItem,
  ContactMessage,
  CmsItem,
} from "./types";

export const catalog = { services, courses, products };

export function findService(slug: string) {
  return services.find((s) => s.slug === slug) || null;
}
export function findCourse(slug: string) {
  return courses.find((c) => c.slug === slug) || null;
}
export function findProduct(slug: string) {
  return products.find((p) => p.slug === slug) || null;
}

export function toPublicUser(u: User): PublicUser {
  const { passwordHash, ...rest } = u;
  return rest;
}

export function getUserByEmail(email: string): User | null {
  return (
    db().users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ||
    null
  );
}

export function getUserById(id: string): User | null {
  return db().users.find((u) => u.id === id) || null;
}

export function getUserByPhone(phone: string): User | null {
  const p = (phone || "").trim();
  if (!p) return null;
  return db().users.find((u) => (u.phone || "").trim() === p) || null;
}

export function getUserByEmailOrPhone(identifier: string): User | null {
  const v = (identifier || "").trim();
  if (!v) return null;
  if (v.includes("@")) return getUserByEmail(v);
  return getUserByPhone(v) || getUserByEmail(v);
}

export function getOrCreateSocialUser(provider: string): User {
  const email = provider.toLowerCase() + ".demo@zaya.local";
  const existing = getUserByEmail(email);
  if (existing) return existing;
  const user: User = {
    id: randomUUID(),
    name: provider === "facebook" ? "Facebook хэрэглэгч" : "Хэрэглэгч",
    email,
    phone: undefined,
    passwordHash: hashPassword(randomUUID()),
    createdAt: new Date().toISOString(),
  };
  db().users.push(user);
  persist();
  return user;
}

export function createUser(input: {
  name: string;
  email?: string;
  password: string;
  phone?: string;
}): { user?: User; error?: string } {
  const email = (input.email || "").trim().toLowerCase();
  const phone = (input.phone || "").trim();
  if (!email && !phone) {
    return { error: "Имэйл эсвэл утасны дугаараа оруулна уу." };
  }
  if (email && getUserByEmail(email)) {
    return { error: "Энэ имэйл хаягаар бүртгэл аль хэдийн үүссэн байна." };
  }
  if (phone && getUserByPhone(phone)) {
    return { error: "Энэ утасны дугаараар бүртгэл аль хэдийн үүссэн байна." };
  }
  const user: User = {
    id: randomUUID(),
    name: input.name.trim(),
    email,
    phone: phone || undefined,
    passwordHash: hashPassword(input.password),
    createdAt: new Date().toISOString(),
  };
  db().users.push(user);
  persist();
  return { user };
}

export function authenticate(identifier: string, password: string): User | null {
  const user = getUserByEmailOrPhone(identifier);
  if (!user) return null;
  if (!verifyPassword(password, user.passwordHash)) return null;
  return user;
}

export function createOrder(input: {
  userId: string | null;
  items: OrderItem[];
  customer: Order["customer"];
}): Order {
  const total = input.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const order: Order = {
    id: randomUUID(),
    userId: input.userId,
    items: input.items,
    total,
    status: "paid",
    customer: input.customer,
    createdAt: new Date().toISOString(),
  };
  db().orders.unshift(order);
  persist();
  return order;
}

export function getOrdersByUser(userId: string): Order[] {
  return db().orders.filter((o) => o.userId === userId);
}

export function createMessage(input: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): ContactMessage {
  const msg: ContactMessage = {
    id: randomUUID(),
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() || undefined,
    subject: input.subject.trim(),
    message: input.message.trim(),
    createdAt: new Date().toISOString(),
  };
  db().messages.unshift(msg);
  persist();
  return msg;
}

export function updateUser(
  id: string,
  patch: { name?: string; phone?: string; email?: string }
): { user?: User; error?: string } {
  const u = getUserById(id);
  if (!u) return { error: "Хэрэглэгч олдсонгүй." };
  if (patch.email !== undefined) {
    const email = String(patch.email).trim().toLowerCase();
    if (email && email !== u.email) {
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "Имэйл хаяг буруу байна." };
      const exists = getUserByEmail(email);
      if (exists && exists.id !== id) return { error: "Энэ имэйл хаягаар бүртгэл аль хэдийн үүссэн байна." };
      u.email = email;
    }
  }
  if (patch.name !== undefined && String(patch.name).trim()) u.name = String(patch.name).trim();
  if (patch.phone !== undefined) u.phone = String(patch.phone).trim() || undefined;
  persist();
  return { user: u };
}

// ---------- CMS (admin-managed content) ----------
export function listCms(kind: CmsItem["kind"]): CmsItem[] {
  return db()
    .cmsItems.filter((i) => i.kind === kind)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export function allCms(): CmsItem[] {
  return [...db().cmsItems].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export function createCmsItem(input: {
  kind: CmsItem["kind"];
  title: string;
  summary?: string;
  body?: string;
  price?: number;
  category?: string;
  mode?: CmsItem["mode"];
}): CmsItem {
  const item: CmsItem = {
    id: randomUUID(),
    kind: input.kind,
    title: input.title.trim(),
    summary: (input.summary || "").trim(),
    body: input.body?.trim() || undefined,
    price: typeof input.price === "number" && !Number.isNaN(input.price) ? input.price : undefined,
    category: input.category?.trim() || undefined,
    mode: input.kind === "course" ? input.mode || "online" : undefined,
    createdAt: new Date().toISOString(),
  };
  db().cmsItems.push(item);
  persist();
  return item;
}
export function deleteCmsItem(id: string): boolean {
  const d = db();
  const i = d.cmsItems.findIndex((x) => x.id === id);
  if (i < 0) return false;
  d.cmsItems.splice(i, 1);
  persist();
  return true;
}
