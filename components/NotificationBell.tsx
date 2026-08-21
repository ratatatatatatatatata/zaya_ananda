"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import type { Locale, Notification } from "@/lib/types";

const Lx = (mn: string, en: string, ko: string, ja: string, zh: string): Record<Locale, string> => ({ mn, en, ko, ja, zh });

const TITLE = Lx("Мэдэгдэл", "Notifications", "알림", "お知らせ", "通知");
const EMPTY = Lx("Одоогоор мэдэгдэл алга.", "No notifications yet.", "아직 알림이 없습니다.", "お知らせはまだありません。", "暂无通知。");
const ALL_READ = Lx("Бүгдийг уншсан болгох", "Mark all read", "모두 읽음", "すべて既読", "全部标为已读");

const ICON: Record<Notification["kind"], string> = {
  reply: "💬",
  expiry: "⏳",
  booking: "🕊",
  system: "✨",
};

/** Толгойн хонх — уншаагүй мэдэгдлийн тоо, жагсаалт. */
export function NotificationBell() {
  const { user } = useAuth();
  const { tr } = useI18n();
  const [items, setItems] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  const load = useCallback(() => {
    if (!user) return;
    fetch("/api/notifications", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) return;
        setItems(d.items || []);
        setUnread(d.unread || 0);
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    load();
    if (!user) return;
    const t = setInterval(load, 120000); // 2 минут тутам шинэчилнэ
    return () => clearInterval(t);
  }, [load, user]);

  // Гадуур дарахад хаах
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  if (!user) return null;

  async function readAll() {
    setUnread(0);
    setItems((xs) => xs.map((x) => ({ ...x, read: true })));
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    }).catch(() => {});
  }

  async function readOne(id: string) {
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, read: true } : x)));
    setUnread((n) => Math.max(0, n - 1));
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => {});
  }

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => { setOpen((v) => !v); if (!open) load(); }}
        aria-label={tr(TITLE)}
        aria-expanded={open}
        className="focus-ring relative grid h-10 w-10 place-items-center rounded-full text-ink/75 transition hover:bg-primary-50 hover:text-primary-700"
      >
        <span aria-hidden className="text-lg">🔔</span>
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid min-w-[1.15rem] place-items-center rounded-full bg-rose-500 px-1 text-[0.68rem] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-line bg-surface-1 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="font-display text-sm font-semibold text-ink">{tr(TITLE)}</p>
            {unread > 0 && (
              <button type="button" onClick={readAll} className="text-xs font-semibold text-primary-700 hover:underline">
                {tr(ALL_READ)}
              </button>
            )}
          </div>

          <div className="max-h-[24rem] overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted">{tr(EMPTY)}</p>
            ) : (
              items.map((n) => {
                const inner = (
                  <>
                    <span className="mt-0.5 shrink-0 text-lg" aria-hidden>{ICON[n.kind] || "✨"}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-ink">{n.title}</span>
                      {n.body && <span className="mt-0.5 block text-xs leading-relaxed text-muted">{n.body}</span>}
                      <span className="mt-1 block text-[0.7rem] text-muted">{n.createdAt.slice(0, 10)}</span>
                    </span>
                    {!n.read && <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary-600" />}
                  </>
                );
                const cls =
                  "flex w-full gap-3 border-b border-line px-4 py-3 text-left transition last:border-0 " +
                  (n.read ? "bg-transparent hover:bg-surface-2" : "bg-primary-50/60 hover:bg-primary-50");
                return n.link ? (
                  <Link key={n.id} href={n.link} onClick={() => { readOne(n.id); setOpen(false); }} className={cls}>
                    {inner}
                  </Link>
                ) : (
                  <button key={n.id} type="button" onClick={() => readOne(n.id)} className={cls}>
                    {inner}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
