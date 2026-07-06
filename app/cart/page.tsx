"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { cx, formatMNT, toneStyles } from "@/lib/format";

export default function CartPage() {
  const { items, total, count, setQty, remove } = useCart();
  const { t, tr } = useI18n();

  if (items.length === 0) {
    return (
      <section className="section">
        <div className="container-px">
          <div className="mx-auto max-w-md rounded-4xl border border-line bg-[#111B2D] p-10 text-center shadow-card">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-primary-50 text-4xl">🧺</div>
            <h1 className="mt-6 font-display text-2xl font-semibold text-ink">{t("cart.empty")}</h1>
            <p className="mt-3 text-muted">{t("cart.emptyHint")}</p>
            <div className="mt-8 flex justify-center gap-3">
              <Link href="/services" className="btn btn-primary btn-md">{t("nav.services")}</Link>
              <Link href="/shop" className="btn btn-outline btn-md">{t("nav.shop")}</Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container-px">
        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{t("cart.title")}</h1>
        <p className="mt-2 text-muted">{count} {t("cart.items")}</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-4">
            {items.map((it) => {
              const tn = toneStyles[it.tone] ?? toneStyles.violet;
              return (
                <div key={it.kind + it.slug} className="flex flex-wrap items-center gap-4 rounded-3xl border border-line bg-[#111B2D] p-4 sm:flex-nowrap">
                  <div className={cx("grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-2xl text-white", tn.grad)}>{it.glyph}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-muted">{t("kind." + it.kind)}</p>
                    <p className="truncate font-semibold text-ink">{tr(it.title)}</p>
                    <p className="text-sm text-muted">{formatMNT(it.price)}</p>
                  </div>
                  <div className="inline-flex items-center rounded-full border border-line">
                    <button onClick={() => setQty(it.kind, it.slug, it.qty - 1)} className="grid h-9 w-9 place-items-center text-ink/70 hover:text-ink">−</button>
                    <span className="w-8 text-center font-semibold">{it.qty}</span>
                    <button onClick={() => setQty(it.kind, it.slug, it.qty + 1)} className="grid h-9 w-9 place-items-center text-ink/70 hover:text-ink">+</button>
                  </div>
                  <div className="w-24 text-right font-semibold text-ink">{formatMNT(it.price * it.qty)}</div>
                  <button onClick={() => remove(it.kind, it.slug)} className="text-ink/40 transition hover:text-rose-500" aria-label="Remove">✕</button>
                </div>
              );
            })}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <h2 className="font-display text-lg font-semibold text-ink">{t("cart.summary")}</h2>
              <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
                <div className="flex justify-between"><span className="text-muted">{t("cart.subtotalItems")} ({count})</span><span className="font-medium text-ink">{formatMNT(total)}</span></div>
                <div className="flex justify-between"><span className="text-muted">{t("cart.shipping")}</span><span className="font-medium text-ink">{t("cart.shippingVal")}</span></div>
              </div>
              <div className="mt-4 flex justify-between border-t border-line pt-4">
                <span className="font-semibold text-ink">{t("cart.total")}</span>
                <span className="font-display text-xl font-semibold text-ink">{formatMNT(total)}</span>
              </div>
              <Link href="/checkout" className="btn btn-primary btn-lg mt-6 w-full">{t("cart.checkout")}</Link>
              <Link href="/services" className="btn btn-ghost btn-sm mt-2 w-full">{t("common.continue")}</Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
