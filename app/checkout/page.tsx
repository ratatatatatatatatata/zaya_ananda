"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import { formatMNT } from "@/lib/format";
import type { Order } from "@/lib/types";

export default function CheckoutPage() {
  const { items, total, count, clear } = useCart();
  const { user } = useAuth();
  const { t, tr, lang } = useI18n();
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", note: "" });

  useEffect(() => {
    if (user) setForm((f) => ({ ...f, name: f.name || user.name, email: f.email || user.email, phone: f.phone || user.phone || "" }));
  }, [user]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("processing");
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: items.map((i) => ({ kind: i.kind, slug: i.slug, qty: i.qty })), customer: form, lang }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Error");
      }
      const data = await res.json();
      setOrder(data.order);
      setStatus("done");
      clear();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Error");
    }
  }

  if (status === "done" && order) {
    return (
      <section className="section">
        <div className="container-px">
          <div className="mx-auto max-w-xl rounded-4xl border border-line bg-white p-10 text-center shadow-card">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-jade-400/15 text-4xl text-jade-600">✓</div>
            <h1 className="mt-6 font-display text-3xl font-semibold text-ink">{t("checkout.success")}</h1>
            <p className="mt-3 text-muted">{t("checkout.successSub")}</p>
            <p className="mt-1 font-mono text-sm text-primary-700">{order.id.slice(0, 8).toUpperCase()}</p>
            <div className="mt-6 rounded-3xl bg-cream p-5 text-left">
              {order.items.map((it) => (
                <div key={it.kind + it.slug} className="flex justify-between py-1 text-sm">
                  <span className="text-ink/80">{it.title} × {it.qty}</span>
                  <span className="font-medium text-ink">{formatMNT(it.price * it.qty)}</span>
                </div>
              ))}
              <div className="mt-2 flex justify-between border-t border-line pt-2 font-semibold text-ink">
                <span>{t("cart.total")}</span><span>{formatMNT(order.total)}</span>
              </div>
            </div>
            <p className="mt-5 text-sm text-muted">{t("checkout.willContact")}</p>
            <div className="mt-8 flex justify-center gap-3">
              <Link href="/" className="btn btn-outline btn-md">{t("checkout.home")}</Link>
              {user ? <Link href="/account" className="btn btn-primary btn-md">{t("checkout.myOrders")}</Link> : <Link href="/services" className="btn btn-primary btn-md">{t("common.continue")}</Link>}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="section">
        <div className="container-px">
          <div className="mx-auto max-w-md rounded-4xl border border-line bg-white p-10 text-center shadow-card">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary-50 text-3xl">🧺</div>
            <h1 className="mt-6 font-display text-2xl font-semibold text-ink">{t("checkout.empty")}</h1>
            <p className="mt-3 text-muted">{t("checkout.emptyHint")}</p>
            <Link href="/services" className="btn btn-primary btn-md mt-6">{t("nav.services")}</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container-px">
        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{t("checkout.title")}</h1>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <form onSubmit={onSubmit} className="card p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-ink">{t("checkout.customer")}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label" htmlFor="cname">{t("form.name")} *</label>
                <input id="cname" required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="field-label" htmlFor="cphone">{t("form.phone")} *</label>
                <input id="cphone" required className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="9900 0000" />
              </div>
            </div>
            <div className="mt-4">
              <label className="field-label" htmlFor="cemail">{t("form.email")} *</label>
              <input id="cemail" type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@email.com" />
            </div>
            <div className="mt-4">
              <label className="field-label" htmlFor="cnote">{t("checkout.note")}</label>
              <textarea id="cnote" className="textarea" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-primary-200 bg-primary-50/50 p-4 text-sm text-muted">{t("checkout.demo")}</div>

            {status === "error" && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>}

            <button type="submit" disabled={status === "processing"} className="btn btn-primary btn-lg mt-6 w-full">
              {status === "processing" ? t("checkout.processing") : t("checkout.confirm")}
            </button>
            {!user && (
              <p className="mt-3 text-center text-sm text-muted">
                {t("checkout.loginPre")} <Link href="/login" className="font-semibold text-primary-700">{t("auth.login")}</Link>
              </p>
            )}
          </form>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <h2 className="font-display text-lg font-semibold text-ink">{t("checkout.summary")} ({count})</h2>
              <div className="mt-4 space-y-3 border-t border-line pt-4">
                {items.map((it) => (
                  <div key={it.kind + it.slug} className="flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0 flex-1 truncate text-ink/80">{tr(it.title)} <span className="text-muted">× {it.qty}</span></span>
                    <span className="font-medium text-ink">{formatMNT(it.price * it.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between border-t border-line pt-4">
                <span className="font-semibold text-ink">{t("cart.total")}</span>
                <span className="font-display text-xl font-semibold text-ink">{formatMNT(total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
