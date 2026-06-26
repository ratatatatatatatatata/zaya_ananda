"use client";

import Link from "next/link";
import { siteConfig } from "@/data/content";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t, tr } = useI18n();
  const cols = [
    { title: t("nav.services"), links: [
      { href: "/services", label: t("common.allServices") },
      { href: "/courses", label: t("nav.courses") },
      { href: "/shop", label: t("nav.shop") },
    ] },
    { title: t("footer.centerCol"), links: [
      { href: "/about", label: t("nav.about") },
      { href: "/contact", label: t("nav.contact") },
      { href: "/account", label: t("nav.account") },
    ] },
  ];

  return (
    <footer className="mt-10 border-t border-line bg-white">
      <div className="container-px grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary-grad text-lg text-white">✶</span>
            <span className="font-display text-lg font-semibold text-ink">Zaya&apos;s Ananda</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{tr(siteConfig.tagline)}</p>
          <div className="mt-5 flex gap-2">
            {["f", "ig", "yt"].map((s) => (
              <span key={s} className="grid h-9 w-9 place-items-center rounded-full border border-line text-xs font-bold uppercase text-muted">{s}</span>
            ))}
          </div>
        </div>

        {cols.map((col) => (
          <div key={col.title}>
            <h3 className="font-display text-base font-semibold text-ink">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-sm text-muted transition hover:text-primary-700">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="font-display text-base font-semibold text-ink">{t("nav.contact")}</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            <li>📞 {siteConfig.phone}</li>
            <li>✉️ {siteConfig.email}</li>
            <li>📍 {tr(siteConfig.address)}</li>
            <li>🕒 {tr(siteConfig.workingHours)}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-px flex flex-col items-center justify-between gap-2 py-5 text-sm text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Zaya&apos;s Ananda. {t("footer.rights")}</p>
          <p>{t("footer.motto")}</p>
        </div>
      </div>
    </footer>
  );
}
