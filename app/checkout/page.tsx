"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import { cx, formatMNT } from "@/lib/format";
import type { Order } from "@/lib/types";

function qrGrid(seed: number) {
  let s = seed >>> 0;
  const r = () => ((s = (s * 1664525 + 1013904223) >>> 0), s / 4294967296);
  const N = 25;
  const g: boolean[][] = Array.from({ length: N }, () => Array.from({ length: N }, () => r() > 0.5));
  const finder = (ox: number, oy: number) => {
    for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) {
      const edge = x === 0 || x === 6 || y === 0 || y === 6;
      const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
      g[oy + y][ox + x] = edge || core;
    }
    for (let y = -1; y < 8; y++) for (let x = -1; x < 8; x++) {
      if (x === -1 || x === 7 || y === -1 || y === 7) { const gy = oy + y, gx = ox + x; if (gy >= 0 && gy < N && gx >= 0 && gx < N) g[gy][gx] = false; }
    }
  };
  finder(0, 0); finder(N - 7, 0); finder(0, N - 7);
  return g;
}

export default function CheckoutPage() {
  const { items, total, count, clear } = useCart();
  const { user } = useAuth();
  const { t, tr, lang } = useI18n();
  const [step, setStep] = useState<"info" | "pay" | "done">("info");
  const [method, setMethod] = useState<"qpay" | "bank">("qpay");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", note: "" });

  useEffect(() => { if (user) setForm((f) => ({ ...f, name: f.name || user.name, email: f.email || user.email, phone: f.phone || user.phone || "" })); }, [user]);

  const hasService = items.some((i) => i.kind === "service");
  const hasCourse = items.some((i) => i.kind === "course");
  const courseSlug = items.find((i) => i.kind === "course")?.slug;
  const qr = useMemo(() => qrGrid(Math.round(total) + count * 7 + 13), [total, count]);

  const steps = [
    { k: "step.cart", done: true }, { k: "step.info", active: step === "info" },
    { k: "step.pay", active: step === "pay" }, { k: "step.done", active: step === "done" },
  ];

  function toPay(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) { setError(t("checkout.demo")); return; }
    setError(""); setStep("pay"); window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function pay() {
    setProcessing(true); setError("");
    try {
      const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: items.map((i) => ({ kind: i.kind, slug: i.slug, qty: i.qty })), customer: form, lang }) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Error"); }
      const data = await res.json();
      setOrder(data.order); setStep("done"); clear(); window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) { setError(err instanceof Error ? err.message : "Error"); } finally { setProcessing(false); }
  }

  if (items.length === 0 && step !== "done") {
    return (
      <section className="section"><div className="container-px">
        <div className="mx-auto max-w-md rounded-4xl border border-line bg-white p-10 text-center shadow-card">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary-50 text-3xl">🧺</div>
          <h1 className="mt-6 font-display text-2xl font-semibold text-ink">{t("checkout.empty")}</h1>
          <p className="mt-3 text-muted">{t("checkout.emptyHint")}</p>
          <Link href="/services" className="btn btn-primary btn-md mt-6">{t("nav.services")}</Link>
        </div>
      </div></section>
    );
  }

  return (
    <section className="section">
      <div className="container-px">
        {/* stepper */}
        <div className="mx-auto mb-10 flex max-w-2xl items-center justify-between">
          {steps.map((st, i) => (
            <div key={st.k} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <span className={cx("grid h-9 w-9 place-items-center rounded-full text-sm font-bold", st.done || st.active ? "bg-primary-grad text-white" : "bg-primary-50 text-primary-700")}>{st.done && !st.active ? "✓" : i + 1}</span>
                <span className={cx("text-xs font-semibold", st.active ? "text-primary-700" : "text-muted")}>{t(st.k)}</span>
              </div>
              {i < steps.length - 1 && <span className="mx-2 h-0.5 flex-1 rounded bg-line" />}
            </div>
          ))}
        </div>

        {step === "done" && order ? (
          <div className="mx-auto max-w-xl">
            <div className="rounded-4xl border border-line bg-white p-8 text-center shadow-card sm:p-10">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-jade-400/15 text-4xl text-jade-600">✓</div>
              <h1 className="mt-6 font-display text-3xl font-semibold text-ink">{t("checkout.success")}</h1>
              <p className="mt-2 font-mono text-sm text-primary-700">#{order.id.slice(0, 8).toUpperCase()}</p>
              <div className="mt-6 space-y-2 text-left">
                {[
                  { label: t("st.paid"), on: true },
                  { label: t("st.preparing"), on: true },
                  hasService ? { label: t("st.booked"), on: true } : null,
                  hasCourse ? { label: t("st.courseOpen"), on: true } : null,
                ].filter(Boolean).map((row: any) => (
                  <div key={row.label} className="flex items-center gap-3 rounded-2xl bg-aqua px-4 py-3">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-jade-500 text-xs text-white">✓</span>
                    <span className="text-sm font-medium text-ink">{row.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {hasCourse && courseSlug && <Link href={"/learn/" + courseSlug} className="btn btn-primary btn-md">{t("course.startLearning")}</Link>}
                <Link href="/account" className="btn btn-outline btn-md">{t("checkout.myOrders")}</Link>
                <Link href="/" className="btn btn-ghost btn-md">{t("checkout.home")}</Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              {step === "info" && (
                <form onSubmit={toPay} className="card p-6 sm:p-8">
                  <h2 className="font-display text-xl font-semibold text-ink">{t("checkout.customer")}</h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div><label className="field-label">{t("form.name")} *</label><input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                    <div><label className="field-label">{t("form.phone")} *</label><input required className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="9900 0000" /></div>
                  </div>
                  <div className="mt-4"><label className="field-label">{t("form.email")} *</label><input type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                  <div className="mt-4"><label className="field-label">{t("checkout.note")}</label><textarea className="textarea" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder={hasService ? "Тохирох цаг, нэмэлт хүсэлт..." : ""} /></div>
                  {error && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>}
                  <button type="submit" className="btn btn-primary btn-lg mt-6 w-full">{t("step.next")}</button>
                </form>
              )}

              {step === "pay" && (
                <div className="card p-6 sm:p-8">
                  <h2 className="font-display text-xl font-semibold text-ink">{t("pay.method")}</h2>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {(["qpay", "bank"] as const).map((m) => (
                      <button key={m} onClick={() => setMethod(m)} className={cx("rounded-2xl border-2 px-4 py-4 text-center font-semibold transition", method === m ? "border-primary-500 bg-primary-50 text-primary-700" : "border-line text-ink/70 hover:border-primary-300")}>
                        {m === "qpay" ? "QPay" : t("pay.bank")}
                      </button>
                    ))}
                  </div>

                  {method === "qpay" ? (
                    <div className="mt-6 flex flex-col items-center rounded-3xl bg-aqua p-6 text-center">
                      <p className="text-sm text-muted">{t("pay.qpayNote")}</p>
                      <svg viewBox="0 0 25 25" className="mt-4 h-44 w-44 rounded-xl bg-white p-2 shadow-card">
                        {qr.map((row, y) => row.map((on, x) => on ? <rect key={x + "-" + y} x={x} y={y} width="1" height="1" fill="#0E746E" /> : null))}
                      </svg>
                      <p className="mt-4 font-display text-2xl font-semibold text-ink">{formatMNT(total)}</p>
                      <span className="mt-1 text-xs text-muted">{t("pay.amount")}</span>
                    </div>
                  ) : (
                    <div className="mt-6 rounded-3xl bg-aqua p-6">
                      <p className="text-sm text-muted">{t("pay.bankNote")}</p>
                      <div className="mt-4 rounded-2xl border border-line bg-white p-4">
                        <p className="font-semibold text-ink">{t("pay.account")}</p>
                        <p className="mt-2 font-display text-xl font-semibold text-ink">{formatMNT(total)}</p>
                      </div>
                    </div>
                  )}

                  {error && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>}
                  <div className="mt-6 flex gap-3">
                    <button onClick={() => setStep("info")} className="btn btn-outline btn-md">{t("step.back")}</button>
                    <button onClick={pay} disabled={processing} className="btn btn-primary btn-lg flex-1">{processing ? t("checkout.processing") : t("pay.iPaid")}</button>
                  </div>
                  <p className="mt-3 text-center text-xs text-muted">{t("checkout.demo")}</p>
                </div>
              )}
            </div>

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
        )}
      </div>
    </section>
  );
}
