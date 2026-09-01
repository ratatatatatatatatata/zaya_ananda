"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NotificationBell } from "./NotificationBell";
import { Logo } from "./Logo";
import { cx } from "@/lib/format";
import { NAV_LINKS as links } from "@/lib/nav-links";


export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { count, open } = useCart();
  const { user, logout } = useAuth();
  const { t, lang } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const [logo, setLogo] = useState<string>();
  const [customPages, setCustomPages] = useState<{ id: string; navLabel: string; i18n?: Record<string, { navLabel?: string }> | null }[]>([]);
  const pageLabel = (p: { navLabel: string; i18n?: Record<string, { navLabel?: string }> | null }) =>
    (lang !== "mn" && p.i18n?.[lang]?.navLabel) || p.navLabel;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { setMenuOpen(false); setAccountOpen(false); }, [pathname]);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);
  useEffect(() => { fetch("/api/settings", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((d) => { if (d?.settings?.logo) setLogo(d.settings.logo); }).catch(() => {}); }, []);
  useEffect(() => { fetch("/api/pages", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((d) => { if (Array.isArray(d?.pages)) setCustomPages(d.pages); }).catch(() => {}); }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className={cx("sticky top-0 z-40 transition-all duration-300", scrolled ? "glass border-b border-line shadow-sm" : "border-b border-transparent bg-ivory/80 backdrop-blur-sm")}>
      <div className="flex h-16 w-full items-center justify-between gap-3 px-4 lg:h-[72px] lg:px-6">
        <Link href="/" aria-label="Zaya's Ananda" className="shrink-0"><Logo logoSrc={logo} /></Link>

        <nav className="hidden min-w-0 items-center gap-2.5 xl:flex 2xl:gap-4">
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              className={cx("nav-link relative whitespace-nowrap py-1 text-[13px] 2xl:text-[14.5px]", isActive(l.href) && "text-primary-700 after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-primary-grad")}>
              {t(l.key)}
            </Link>
          ))}
          {customPages.map((p) => (
            <Link key={p.id} href={"/p/" + p.id}
              className={cx("nav-link relative whitespace-nowrap py-1 text-[13px] 2xl:text-[14.5px]", isActive("/p/" + p.id) && "text-primary-700 after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-primary-grad")}>
              {pageLabel(p)}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="hidden sm:block"><LanguageSwitcher /></div>
          <button onClick={open} className="relative grid h-10 w-10 place-items-center rounded-full text-ink/70 transition hover:bg-primary-50 hover:text-primary-700" aria-label="Cart">
            🛒
            {count > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-[20px] place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-white">{count}</span>}
          </button>
          <NotificationBell />
          {user ? (
            <div ref={accountRef} className="relative">
              <button
                onClick={() => setAccountOpen((o) => !o)}
                className="grid h-10 w-10 place-items-center rounded-full text-ink/70 transition hover:bg-primary-50 hover:text-primary-700"
                aria-label="Account"
                aria-expanded={accountOpen}
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-grad text-sm font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
              </button>
              {accountOpen && (
                <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-line bg-surface-1 p-1.5 shadow-lift">
                  <p className="truncate px-3 py-2 text-sm font-semibold text-ink">{user.name}</p>
                  <div className="my-1 border-t border-line" />
                  <Link href="/account" onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-ink/80 transition hover:bg-primary-50 hover:text-primary-700">
                    👤 {t("nav.account")}
                  </Link>
                  {user.isAdmin && (
                    <Link href="/admin" onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-ink/80 transition hover:bg-primary-50 hover:text-primary-700">
                      ⚙ {t("admin.title")}
                    </Link>
                  )}
                  <div className="my-1 border-t border-line" />
                  <button
                    onClick={() => { setAccountOpen(false); logout().then(() => router.push("/")); }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-rose-600 transition hover:bg-rose-50"
                  >
                    {t("account.logout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="grid h-10 w-10 place-items-center rounded-full text-ink/70 transition hover:bg-primary-50 hover:text-primary-700" aria-label="Account">👤</Link>
          )}
          <button onClick={() => setMenuOpen((o) => !o)} className="grid h-11 w-11 place-items-center rounded-full text-2xl text-ink/80 transition hover:bg-primary-50 xl:hidden" aria-label={menuOpen ? "Цэс хаах" : "Цэс нээх"} aria-expanded={menuOpen} aria-controls="mobile-navigation">{menuOpen ? "✕" : "☰"}</button>
        </div>
      </div>

      {/* mobile / tablet menu */}
      <div id="mobile-navigation" className={cx("border-t border-line bg-ivory/95 backdrop-blur xl:hidden", menuOpen ? "visible max-h-[calc(100dvh-4.5rem)] overflow-y-auto opacity-100" : "invisible max-h-0 overflow-hidden opacity-0")} style={{ transition: "max-height 0.3s ease, opacity 0.2s ease, visibility 0.3s" }}>
        <nav className="container-px flex flex-col gap-1 py-4">
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              className={cx("rounded-xl px-3 py-2.5 text-[15px] font-medium transition", isActive(l.href) ? "bg-primary-50 text-primary-700" : "text-ink/80 hover:bg-primary-50")}>
              {t(l.key)}
            </Link>
          ))}
          {customPages.map((p) => (
            <Link key={p.id} href={"/p/" + p.id}
              className={cx("rounded-xl px-3 py-2.5 text-[15px] font-medium transition", isActive("/p/" + p.id) ? "bg-primary-50 text-primary-700" : "text-ink/80 hover:bg-primary-50")}>
              {pageLabel(p)}
            </Link>
          ))}
          <div className="mt-2"><LanguageSwitcher /></div>
        </nav>
      </div>
    </header>
  );
}
