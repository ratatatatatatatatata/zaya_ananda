"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cx } from "@/lib/format";

const links = [
  { href: "/", key: "nav.home" },
  { href: "/services", key: "nav.services" },
  { href: "/courses", key: "nav.courses" },
  { href: "/shop", key: "nav.shop" },
  { href: "/about", key: "nav.about" },
  { href: "/contact", key: "nav.contact" },
];

export function Header() {
  const pathname = usePathname();
  const { count, open } = useCart();
  const { user } = useAuth();
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className={cx("sticky top-0 z-40 transition-all duration-300", scrolled ? "glass border-b border-line shadow-sm" : "bg-transparent")}>
      <div className="container-px flex h-16 items-center justify-between gap-3 lg:h-20">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary-grad text-lg text-white shadow-glow">✶</span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-semibold text-ink">Zaya&apos;s Ananda</span>
            <span className="text-[11px] tracking-wide text-muted">{t("brand.sub")}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              className={cx("nav-link relative py-1", isActive(l.href) && "text-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary-grad")}>
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button onClick={open} className="relative grid h-11 w-11 place-items-center rounded-full border border-line bg-white/70 text-ink transition hover:border-primary/30 hover:text-primary-700" aria-label="Cart">
            🛒
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-[20px] place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-white">{count}</span>
            )}
          </button>

          {user ? (
            <Link href="/account" className="hidden items-center gap-2 rounded-full border border-line bg-white/70 py-1.5 pl-1.5 pr-4 transition hover:border-primary/30 sm:inline-flex">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-grad text-sm font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
              <span className="max-w-[90px] truncate text-sm font-semibold text-ink">{user.name.split(" ")[0]}</span>
            </Link>
          ) : (
            <Link href="/login" className="btn btn-primary btn-sm hidden sm:inline-flex">{t("nav.login")}</Link>
          )}

          <button onClick={() => setMenuOpen((o) => !o)} className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white/70 text-ink lg:hidden" aria-label="Menu">
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      <div className={cx("overflow-hidden border-t border-line bg-cream/95 backdrop-blur lg:hidden", menuOpen ? "max-h-[420px]" : "max-h-0")} style={{ transition: "max-height 0.3s ease" }}>
        <nav className="container-px flex flex-col gap-1 py-4">
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              className={cx("rounded-xl px-3 py-2.5 text-[15px] font-medium transition", isActive(l.href) ? "bg-primary-50 text-primary-700" : "text-ink/80 hover:bg-ink/5")}>
              {t(l.key)}
            </Link>
          ))}
          <Link href={user ? "/account" : "/login"} className="btn btn-primary btn-md mt-2">
            {user ? t("nav.account") : t("auth.loginRegister")}
          </Link>
        </nav>
      </div>
    </header>
  );
}
