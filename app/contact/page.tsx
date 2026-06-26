"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { siteConfig } from "@/data/content";
import { useI18n } from "@/lib/i18n";

export default function ContactPage() {
  const { t, tr } = useI18n();
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
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

  const info = [
    { icon: "📞", label: t("form.phone"), value: siteConfig.phone },
    { icon: "✉️", label: t("form.email"), value: siteConfig.email },
    { icon: "📍", label: t("contact.address"), value: tr(siteConfig.address) },
    { icon: "🕒", label: t("contact.hours"), value: tr(siteConfig.workingHours) },
  ];

  return (
    <>
      <PageHeader title={t("contact.title")} crumb={t("nav.contact")} desc={t("contact.desc")} />
      <section className="section">
        <div className="container-px grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-4">
            {info.map((i) => (
              <div key={i.label} className="flex items-center gap-4 rounded-3xl border border-line bg-white p-5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-50 text-xl">{i.icon}</div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">{i.label}</p>
                  <p className="font-semibold text-ink">{i.value}</p>
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
                <h2 className="mt-5 font-display text-2xl font-semibold text-ink">{t("contact.done")}</h2>
                <p className="mt-2 text-muted">{t("contact.doneSub")}</p>
                <button onClick={() => setStatus("idle")} className="btn btn-outline btn-md mt-6">{t("contact.newMsg")}</button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="field-label" htmlFor="name">{t("form.name")} *</label>
                    <input id="name" name="name" required className="input" />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="phone">{t("form.phone")}</label>
                    <input id="phone" name="phone" className="input" placeholder="9900 0000" />
                  </div>
                </div>
                <div>
                  <label className="field-label" htmlFor="email">{t("form.email")} *</label>
                  <input id="email" name="email" type="email" required className="input" placeholder="name@email.com" />
                </div>
                <div>
                  <label className="field-label" htmlFor="subject">{t("contact.subject")}</label>
                  <input id="subject" name="subject" className="input" />
                </div>
                <div>
                  <label className="field-label" htmlFor="message">{t("contact.message")} *</label>
                  <textarea id="message" name="message" required className="textarea" />
                </div>
                {status === "error" && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>}
                <button type="submit" disabled={status === "sending"} className="btn btn-primary btn-lg w-full">
                  {status === "sending" ? t("contact.sending") : t("contact.send")}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
