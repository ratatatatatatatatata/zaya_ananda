"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { locText } from "@/lib/cms-i18n";
import type { CmsItem, Locale } from "@/lib/types";

const Lx = (mn: string, en: string, ko: string, ja: string, zh: string): Record<Locale, string> => ({ mn, en, ko, ja, zh });

const CLOSE = Lx("Хаах", "Close", "닫기", "閉じる", "关闭");
const GO = Lx("Дэлгэрэнгүй", "Learn more", "자세히 보기", "詳しく見る", "了解详情");

const KEY = "za_promo_seen";
const DELAY_MS = 1200;

/** Аль сурталчилгааг үзсэнийг санана — нэг хүнд нэг л удаа гарна. */
function readSeen(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}
function writeSeen(ids: string[]) {
  try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch { /* хаалттай байж болно */ }
}

/** Сурталчилгааны цонх — хуудас нээгдэхэд нэг удаа дарангуйлж гарна. */
export function PromoModal() {
  const { lang, tr } = useI18n();
  const pathname = usePathname();
  const [items, setItems] = useState<CmsItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Админ болон төлбөрийн хуудсанд саад болохгүй
    if (pathname.startsWith("/admin") || pathname.startsWith("/checkout")) return;

    let alive = true;
    fetch("/api/content?kinds=promo", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((d) => {
        if (!alive) return;
        const all: CmsItem[] = d.items || [];
        const seen = readSeen();
        const fresh = all.filter((p) => !seen.includes(p.id));
        if (fresh.length === 0) return;
        setItems(fresh);
        setTimeout(() => alive && setOpen(true), DELAY_MS);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [pathname]);

  // Escape дарахад хаах, нээлттэй үед ард нь гүйлгэхгүй
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    setOpen(false);
    writeSeen([...readSeen(), ...items.map((p) => p.id)]);
  }

  if (!open || items.length === 0) return null;

  const main = items[0];
  const rest = items.slice(1, 4);
  const mainTitle = locText(lang, main.title, main.i18n, "title");
  const mainSummary = locText(lang, main.summary, main.i18n, "summary");

  const Wrap = ({ p, children, className }: { p: CmsItem; children: React.ReactNode; className?: string }) =>
    p.link ? (
      <a href={p.link} target={p.link.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className={className} onClick={close}>
        {children}
      </a>
    ) : (
      <div className={className}>{children}</div>
    );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={mainTitle}
      className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-black/55 p-4 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="animate-fade-rise w-full max-w-5xl overflow-hidden rounded-3xl bg-surface-1 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-4 sm:p-5">
          {/* Хаах товч */}
          <button
            type="button"
            onClick={close}
            aria-label={tr(CLOSE)}
            className="focus-ring absolute right-6 top-6 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-lg font-bold text-[#15302C] shadow-lg transition hover:scale-105"
          >
            ✕
          </button>

          {/* Гол баннер */}
          <Wrap p={main} className="block overflow-hidden rounded-2xl">
            <div className="relative">
              {main.image ? (
                <img src={main.image} alt={mainTitle} className="max-h-[32rem] w-full object-cover" />
              ) : (
                <div className="grid min-h-[20rem] w-full place-items-center px-6 text-center"
                  style={{ backgroundImage: "linear-gradient(150deg,#0F2B26,#155248 55%,#2BC8BB)" }}>
                  <p className="font-display text-2xl font-semibold text-white sm:text-3xl">{mainTitle}</p>
                </div>
              )}
              {main.image && (mainTitle || mainSummary) && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-5 sm:p-7">
                  {mainTitle && <p className="font-display text-xl font-semibold text-white sm:text-2xl">{mainTitle}</p>}
                  {mainSummary && <p className="mt-1 max-w-xl text-sm text-white/90">{mainSummary}</p>}
                </div>
              )}
              {main.link && (
                <span className="absolute bottom-5 right-5 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg sm:bottom-7 sm:right-7">
                  {tr(GO)}
                </span>
              )}
            </div>
          </Wrap>

          {/* Нэмэлт жижиг картууд */}
          {rest.length > 0 && (
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {rest.map((p) => {
                const t = locText(lang, p.title, p.i18n, "title");
                return (
                  <Wrap key={p.id} p={p} className="group block overflow-hidden rounded-2xl border border-line bg-surface-2 transition hover:-translate-y-0.5 hover:shadow-sm">
                    {p.image ? (
                      <img src={p.image} alt={t} className="h-32 w-full object-cover transition duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="h-32 w-full" style={{ backgroundImage: "linear-gradient(140deg,#0F2B26,#2BC8BB)" }} />
                    )}
                    {t && <p className="px-3 py-2.5 text-sm font-semibold text-ink">{t}</p>}
                  </Wrap>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
