"use client";

import { useId, useState } from "react";
import { useI18n } from "@/lib/i18n";

export function ContactForm() {
  const { t } = useI18n();
  const id = useId();
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

  return <div aria-live="polite">
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
                    <label className="field-label" htmlFor={id + "-name"}>{t("form.name")} *</label>
                    <input id={id + "-name"} name="name" required className="input" />
                  </div>
                  <div>
                    <label className="field-label" htmlFor={id + "-phone"}>{t("form.phone")}</label>
                    <input id={id + "-phone"} name="phone" type="tel" className="input" placeholder="9900 0000" />
                  </div>
                </div>
                <div>
                  <label className="field-label" htmlFor={id + "-email"}>{t("form.email")}</label>
                  <input id={id + "-email"} name="email" type="email" className="input" placeholder="name@email.com" />
                </div>
                <div>
                  <label className="field-label" htmlFor={id + "-subject"}>{t("contact.subject")}</label>
                  <input id={id + "-subject"} name="subject" className="input" />
                </div>
                <div>
                  <label className="field-label" htmlFor={id + "-message"}>{t("contact.message")} *</label>
                  <textarea id={id + "-message"} name="message" required rows={4} className="textarea" />
                </div>
                {status === "error" && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>}
                <button type="submit" disabled={status === "sending"} className="btn btn-primary btn-md w-full">
                  {status === "sending" ? t("contact.sending") : t("contact.send")}
                </button>
              </form>
            )}
  </div>;
}
