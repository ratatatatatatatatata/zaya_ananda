"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { Icon } from "./Icon";
import { cx } from "@/lib/format";

const items = [
  { href: "/", k: "nav.home", icon: "home" },
  { href: "/services", k: "nav.services", icon: "sparkles" },
  { href: "/courses", k: "nav.courses", icon: "award" },
  { href: "/shop", k: "nav.shop", icon: "bag" },
  { href: "/account", k: "nav.account", icon: "user" },
];

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useI18n();
  const active = (h: string) => (h === "/" ? pathname === "/" : pathname.startsWith(h));
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur-xl lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="mx-auto grid max-w-md grid-cols-5">
        {items.map((it) => (
          <Link key={it.href} href={it.href}
            className={cx("flex min-h-[60px] flex-col items-center justify-center gap-1 px-1 py-2 text-[0.74rem] font-semibold transition", active(it.href) ? "text-primary-700" : "text-ink/60")}>
            <Icon name={it.icon} className={cx("h-6 w-6", active(it.href) && "text-primary-600")} />
            <span className="leading-none">{t(it.k)}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
