"use client";

import Link from "next/link";
import { SOCIALS } from "./SocialIcons";
import { siteConfig } from "@/data/content";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";

export function Footer() {
  const { t, tr } = useI18n();
  const { user } = useAuth();
  const [settings, setSettings] = useState<{ logo?: string; facebook?: string; instagram?: string; youtube?: string }>({});
  useEffect(() => { fetch("/api/settings", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((d) => { if (d?.settings) setSettings(d.settings); }).catch(() => {}); }, []);
  const cols = [
    { title: t("nav.services"), links: [
      { href: "/services", label: t("common.allServices") },
      { href: "/courses", label: t("nav.courses") },
      { href: "/ayalal", label: t("nav.journey") },
      { href: "/shop", label: t("nav.shop") },
      { href: "/merge", label: t("nav.merge") },
      { href: "/mood", label: t("nav.mood") },
    ] },
    { title: t("footer.centerCol"), links: [
      { href: "/about", label: t("nav.about") },
      { href: "/about#contact", label: t("nav.contact") },
      { href: "/account", label: t("nav.account") },
      ...(user?.isAdmin ? [{ href: "/admin", label: t("admin.title") }] : []),
    ] },
  ];

  return (
    <footer className="mt-10 border-t border-line bg-surface-2">
      <div className="container-px grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            {settings.logo
              ? <img src={settings.logo} alt="" className="h-10 w-10 rounded-2xl object-cover" />
              : <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary-grad text-lg text-white">✶</span>}
            <span className="font-display text-lg font-semibold text-ink">Zaya&apos;s Ananda</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{tr(siteConfig.tagline)}</p>
          <div className="mt-5 flex gap-2">
            {SOCIALS.map(({ key, label, color, Icon }) => {
              const url = settings[key as "facebook" | "instagram" | "youtube"];
              if (!url) return null;
              return (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  title={label}
                  className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-line bg-surface-1 text-muted transition hover:-translate-y-0.5 hover:border-transparent hover:text-white hover:shadow-sm"
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = color; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = ""; }}
                >
                  <Icon />
                </a>
              );
            })}
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
            <li>📞 <a href={"tel:" + siteConfig.phone.replace(/\D/g, "")} className="transition hover:text-primary-700">{siteConfig.phone}</a></li>
            <li>✉️ <a href={"mailto:" + siteConfig.email} className="transition hover:text-primary-700">{siteConfig.email}</a></li>
            <li>📍 <a href={"https://www.google.com/maps?q=" + encodeURIComponent(siteConfig.mapQuery)} target="_blank" rel="noreferrer" className="transition hover:text-primary-700">{tr(siteConfig.address)}</a></li>
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
