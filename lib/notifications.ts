import { randomUUID } from "crypto";
import { sbSelect, sbInsert, sbUpdate } from "@/lib/supabase";
import type { Notification, User } from "@/lib/types";
import { isAdminEmail } from "@/lib/repo";

const enc = (s: string) => encodeURIComponent(s);

/** Хэрэглэгчийн мэдэгдлүүд — шинэхнээс нь */
export async function listNotifications(userId: string, limit = 30): Promise<Notification[]> {
  return sbSelect<Notification>("notifications", `user_id=eq.${enc(userId)}&order=created_at.desc&limit=${limit}`);
}

/** Уншаагүй мэдэгдлийн тоо */
export async function unreadCount(userId: string): Promise<number> {
  const rows = await sbSelect<Notification>("notifications", `user_id=eq.${enc(userId)}&read=is.false&limit=100`);
  return rows.length;
}

export async function createNotification(input: {
  userId: string;
  kind: Notification["kind"];
  title: string;
  body?: string;
  link?: string;
  /** Давхардлаас сэргийлэх түлхүүр — нэг үйл явдалд нэг л мэдэгдэл */
  dedupeKey?: string;
}): Promise<Notification | null> {
  if (input.dedupeKey) {
    const existing = await sbSelect<Notification>(
      "notifications",
      `user_id=eq.${enc(input.userId)}&dedupe_key=eq.${enc(input.dedupeKey)}&limit=1`,
    );
    if (existing[0]) return existing[0];
  }
  return sbInsert<Notification>("notifications", {
    id: randomUUID(),
    userId: input.userId,
    kind: input.kind,
    title: input.title,
    body: input.body || null,
    link: input.link || null,
    dedupeKey: input.dedupeKey || null,
    read: false,
    createdAt: new Date().toISOString(),
  });
}

export async function markRead(id: string, userId: string): Promise<void> {
  const rows = await sbSelect<Notification>("notifications", `id=eq.${enc(id)}&limit=1`);
  if (!rows[0] || rows[0].userId !== userId) return;
  await sbUpdate("notifications", id, { read: true });
}

export async function markAllRead(userId: string): Promise<void> {
  const rows = await sbSelect<Notification>("notifications", `user_id=eq.${enc(userId)}&read=is.false&limit=100`);
  await Promise.all(rows.map((r) => sbUpdate("notifications", r.id, { read: true })));
}

/** Бүх админд мэдэгдэл илгээх */
export async function notifyAdmins(input: { kind: Notification["kind"]; title: string; body?: string; link?: string; dedupeKey?: string }) {
  const users = await sbSelect<User>("users", "limit=500").catch(() => [] as User[]);
  const admins = users.filter((u) => u.isAdmin || isAdminEmail(u.email));
  await Promise.all(
    admins.map((a) =>
      createNotification({
        userId: a.id,
        kind: input.kind,
        title: input.title,
        body: input.body,
        link: input.link,
        dedupeKey: input.dedupeKey ? input.dedupeKey + ":" + a.id : undefined,
      }).catch(() => null),
    ),
  );
}
