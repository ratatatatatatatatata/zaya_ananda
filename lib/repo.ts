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

export function createUser(input: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}): { user?: User; error?: string } {
  if (getUserByEmail(input.email)) {
    return { error: "Энэ имэйл хаягаар бүртгэл аль хэдийн үүссэн байна." };
  }
  const user: User = {
    id: randomUUID(),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone?.trim() || undefined,
    passwordHash: hashPassword(input.password),
    createdAt: new Date().toISOString(),
  };
  db().users.push(user);
  persist();
  return { user };
}

export function authenticate(email: string, password: string): User | null {
  const user = getUserByEmail(email);
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
