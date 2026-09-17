"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/data/content";
import { useI18n } from "@/lib/i18n";
import { ContactForm } from "./ContactForm";
import { useAuth } from "@/lib/auth-context";

type ContactInfo = { phone?: string; email?: string; address?: string; hours?: string; mapQuery?: string };

/** Нийтийн хуудсуудын авсаархан холбоо барих хэсэг. */
export function ContactSection({ id = "contact" }: { id?: string }) {
  const { t, tr } = useI18n();
  const { user } = useAuth();
  /** Админаас оруулсан холбоо барих мэдээлэл — байхгүй бол өгөгдмөл рүү шилжинэ. */
  const [cfg, setCfg] = useState<ContactInfo>({});

  // Сэтгэгдэл үлдээх — нэвтрэлгүйгээр хэн ч бичиж болно
  const [tName, setTName] = useState("");
  const [tRating, setTRating] = useState(5);
  const [tText, setTText] = useState("");
  const [tCompany, setTCompany] = useState(""); // honeypot — жинхэнэ хэрэглэгч бөглөхгүй
  const [tStatus, setTStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [tError, setTError] = useState("");
  const [publicT, setPublicT] = useState<{ id: string; name: string; rating: number; text: string }[]>([]);

  useEffect(() => {
    fetch("/api/testimonial", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((d) => setPublicT(d.items || []))
      .catch(() => {});
  }, [tStatus]);

  async function submitTestimonial(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!tName.trim() || !tText.trim()) { setTStatus("error"); setTError("Нэр болон сэтгэгдлээ бичнэ үү."); return; }
    setTStatus("sending"); setTError("");
    try {
      const res = await fetch("/api/testimonial", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tName.trim(), rating: tRating, text: tText.trim(), company: tCompany }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Error"); }
      setTStatus("done"); setTName(""); setTRating(5); setTText(""); setTCompany("");
    } catch (err) {
      setTStatus("error");
      setTError(err instanceof Error ? err.message : "Error");
    }
  }

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.settings?.contact) setCfg(d.settings.contact); })
      .catch(() => {});
  }, []);

  const phone = cfg.phone?.trim() || siteConfig.phone;
  const email = cfg.email?.trim() || siteConfig.email;
  const address = cfg.address?.trim() || tr(siteConfig.address);
  const hours = cfg.hours?.trim() || tr(siteConfig.workingHours);
  const mapQuery = cfg.mapQuery?.trim() || siteConfig.mapQuery;

  const digits = phone.replace(/\D/g, "");
  const mapUrl = "https://www.google.com/maps?q=" + encodeURIComponent(mapQuery);
  const mapEmbed = mapUrl + "&z=17&output=embed";
  const info = [
    { icon: "📞", label: t("form.phone"), value: phone, href: "tel:" + digits },
    { icon: "✉️", label: t("form.email"), value: email, href: "mailto:" + email },
    { icon: "📍", label: t("contact.address"), value: address, href: mapUrl },
    { icon: "🕒", label: t("contact.hours"), value: hours, href: "" },
  ];

  return (
    <section id={id} aria-label={t("contact.title")} className="scroll-mt-28 border-t border-line bg-surface-2 py-8 sm:py-10">
      <div className="container-px">
        <div className="mb-5">
          <h2 className="font-display text-2xl font-semibold text-ink">{t("contact.title")}</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {info.map(i => <div key={i.label} className="min-w-0 border-l-2 border-primary-200 pl-4">
            <p className="text-sm text-muted">{i.label}</p>
            {i.href ? <a href={i.href} target={i.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="mt-1 block break-words text-sm font-semibold leading-6 text-ink hover:text-primary-700">{i.value}</a> : <p className="mt-1 text-sm font-semibold leading-6 text-ink">{i.value}</p>}
          </div>)}
        </div>
        <details className="mt-5 rounded-2xl border border-line bg-white/70">
          <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-primary-800">Зурвас илгээх, газрын зураг үзэх</summary>
          <div className="border-t border-line p-4 sm:p-6">
            {publicT.length > 0 && <div className="mb-6 grid gap-4 sm:grid-cols-3">{publicT.map(r => <blockquote key={r.id} className="rounded-xl bg-surface-2 p-4"><span className="text-accent-300">{"★".repeat(r.rating)}</span><p className="mt-2 text-sm leading-relaxed">«{r.text}»</p><footer className="mt-2 text-sm font-semibold">— {r.name}</footer></blockquote>)}</div>}
            <div className={"grid gap-5 " + (!user ? "lg:grid-cols-2" : "mx-auto max-w-2xl")}>
          <div className="card p-6 sm:p-8">
            <ContactForm />
          </div>

          {!user && <div className="card p-6 sm:p-8">
            <h3 className="font-display text-lg font-semibold text-ink">Манай төвийн тухай сэтгэгдэл үлдээх</h3>
            <p className="mt-1 text-sm text-muted">Zaya&apos;s Ananda төвтэй холбоотой ерөнхий сэтгэгдэл, туршлагаа энд хуваалцаарай. Нэвтрэх шаардлагагүй.</p>
            {tStatus === "done" ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-jade-400/15 text-3xl text-jade-600">✓</div>
                <p className="mt-4 font-semibold text-ink">Баярлалаа!</p>
                <p className="mt-1 text-sm text-muted">Админ шалгаад нийтэд харуулна.</p>
                <button onClick={() => setTStatus("idle")} className="btn btn-outline btn-md mt-5">Дахин бичих</button>
              </div>
            ) : (
              <form onSubmit={submitTestimonial} className="mt-4 space-y-4">
                <div>
                  <label className="field-label" htmlFor="t-name">{t("form.name")} *</label>
                  <input id="t-name" className="input" value={tName} onChange={(e) => setTName(e.target.value)} required />
                </div>
                {/* honeypot — жинхэнэ хэрэглэгчид харагдахгүй, ботууд бөглөж алдана */}
                <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden value={tCompany} onChange={(e) => setTCompany(e.target.value)} name="company" />
                <div>
                  <label className="field-label">Үнэлгээ</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button key={i} type="button" onClick={() => setTRating(i)} aria-label={i + " од"}
                        className={"text-2xl transition " + (i <= tRating ? "text-accent-300" : "text-line hover:text-accent-300/60")}>
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="field-label" htmlFor="t-text">Сэтгэгдэл *</label>
                  <textarea id="t-text" className="textarea" rows={4} value={tText} onChange={(e) => setTText(e.target.value)} required />
                </div>
                {tStatus === "error" && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{tError}</p>}
                <button type="submit" disabled={tStatus === "sending"} className="btn btn-primary btn-md w-full">
                  {tStatus === "sending" ? "Илгээж байна…" : "Илгээх"}
                </button>
              </form>
            )}
          </div>}
        </div>
        <div className="mt-5">
          <div className="overflow-hidden rounded-3xl border border-line shadow-card">
            <iframe title="Zaya's Ananda" src={mapEmbed} className="h-60 w-full" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          </div>
        </div>
          </div>
        </details>
      </div>
    </section>
  );
}
