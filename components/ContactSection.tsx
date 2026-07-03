"use client";

import { useState } from "react";
import { siteConfig } from "@/data/content";
import { useI18n } from "@/lib/i18n";

/** Холбоо барих хэсэг — "Бидний тухай" хуудсанд нэгтгэгдсэн. */
export function ContactSection() {
  const { t, tr } = useI18n();
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    if (!payload.email && !payload.phone) { setStatus("error"); setError("Имэйл эсвэл утасны дугаараа оруулна уу."); return; }
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Error");
      }
      setStatus("done");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Error");
    }
  }

  const digits = siteConfig.phone.replace(/\D/g, "");
  const mapUrl = "https://www.google.com/maps?q=" + encodeURIComponent(siteConfig.mapQuery);
  const mapEmbed = mapUrl + "&z=17&output=embed";
  const info = [
    { icon: "📞", label: t("form.phone"), value: siteConfig.phone, href: "tel:" + digits },
    { icon: "✉️", label: t("form.email"), value: siteConfig.email, href: "mailto:" + siteConfig.email },
    { icon: "📍", label: t("contact.address"), value: tr(siteConfig.address), href: mapUrl },
    { icon: "🕒", label: t("contact.hours"), value: tr(siteConfig.workingHours), href: "" },
  ];

  return (
    <section id="contact" className="section bg-white">
      <div className="container-px">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-ink">{t("contact.title")}</h2>
          <p className="mt-2 text-muted">{t("contact.desc")}</p>
        </div>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-4">
            {info.map((i) => (
              <div key={i.label} className="flex items-center gap-4 rounded-3xl border border-line bg-cream p-5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-50 text-xl">{i.icon}</div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">{i.label}</p>
                  {i.href ? <a href={i.href} target={i.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="font-semibold text-ink transition hover:text-primary-700">{i.value}</a> : <p className="font-semibold text-ink">{i.value}</p>}
                </div>
              </div>
            ))}
            <div className="rounded-3xl bg-primary-grad p-6 text-white">
              <p className="font-display text-lg leading-relaxed">{t("contact.quote")}</p>
            </div>
          </div>

          <div className="card p-6 sm:p-8">
            {status === "done" ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-jade-400/15 text-4xl text-jade-600">✓</div>
                <h3 className="mt-5 font-display text-2xl font-semibold text-ink">{t("contact.done")}</h3>
                <p className="mt-2 text-muted">{t("contact.doneSub")}</p>
                <button onClick={() => setStatus("idle")} className="btn btn-outline btn-md mt-6">{t("contact.newMsg")}</button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="field-label" htmlFor="c-name">{t("form.name")} *</label>
                    <input id="c-name" name="name" required className="input" />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="c-phone">{t("form.phone")}</label>
                    <input id="c-phone" name="phone" className="input" placeholder="9900 0000" />
                  </div>
                </div>
                <div>
                  <label className="field-label" htmlFor="c-email">{t("form.email")}</label>
                  <input id="c-email" name="email" type="email" className="input" placeholder="name@email.com" />
                </div>
                <div>
                  <label className="field-label" htmlFor="c-subject">{t("contact.subject")}</label>
                  <input id="c-subject" name="subject" className="input" />
                </div>
                <div>
                  <label className="field-label" htmlFor="c-message">{t("contact.message")} *</label>
                  <textarea id="c-message" name="message" required className="textarea" />
                </div>
                {status === "error" && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>}
                <button type="submit" disabled={status === "sending"} className="btn btn-primary btn-lg w-full">
                  {status === "sending" ? t("contact.sending") : t("contact.send")}
                </button>
              </form>
            )}
          </div>
        </div>
        <div className="mt-12">
          <div className="overflow-hidden rounded-3xl border border-line shadow-card">
            <iframe title="Zaya's Ananda" src={mapEmbed} className="h-[380px] w-full" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          </div>
        </div>
      </div>
    </section>
  );
}
