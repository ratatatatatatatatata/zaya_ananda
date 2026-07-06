"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { cx, formatMNT, toneStyles } from "@/lib/format";

export function CartDrawer() {
  const { items, isOpen, close, total, count, remove, setQty } = useCart();
  const { t, tr } = useI18n();

  return (
    <>
      <div onClick={close} aria-hidden
        className={cx("fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300", isOpen ? "opacity-100" : "pointer-events-none opacity-0")} />
      <aside
        className={cx("fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-300 ease-out", isOpen ? "translate-x-0" : "translate-x-full")}
        aria-label={t("cart.title")}>
        <header className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-ink">{t("cart.title")}</h2>
            <p className="text-sm text-muted">{count} {t("cart.items")}</p>
          </div>
          <button onClick={close} className="grid h-10 w-10 place-items-center rounded-full text-ink/60 transition hover:bg-ink/5 hover:text-ink" aria-label="Close">✕</button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-primary-50 text-3xl">🧺</div>
            <p className="text-muted">{t("cart.empty")}</p>
            <Link href="/services" onClick={close} className="btn btn-outline btn-sm">{t("hero.ctaServices")}</Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
              {items.map((it) => {
                const tn = toneStyles[it.tone] ?? toneStyles.violet;
                return (
                  <div key={it.kind + it.slug} className="flex gap-3 rounded-2xl border border-line bg-[#1A2742] p-3">
                    <div className={cx("grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-xl text-white", tn.grad)}>{it.glyph}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-muted">{t("kind." + it.kind)}</p>
                      <p className="truncate text-sm font-semibold text-ink">{tr(it.title)}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-full border border-line">
                          <button onClick={() => setQty(it.kind, it.slug, it.qty - 1)} className="grid h-7 w-7 place-items-center text-ink/70 hover:text-ink" aria-label="-">−</button>
                          <span className="w-6 text-center text-sm font-semibold">{it.qty}</span>
                          <button onClick={() => setQty(it.kind, it.slug, it.qty + 1)} className="grid h-7 w-7 place-items-center text-ink/70 hover:text-ink" aria-label="+">+</button>
                        </div>
                        <span className="text-sm font-semibold text-ink">{formatMNT(it.price * it.qty)}</span>
                      </div>
                    </div>
                    <button onClick={() => remove(it.kind, it.slug)} className="self-start text-ink/40 transition hover:text-rose-500" aria-label="Remove">✕</button>
                  </div>
                );
              })}
            </div>

            <footer className="border-t border-line bg-[#1A2742] px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-muted">{t("cart.total")}</span>
                <span className="text-xl font-semibold text-ink">{formatMNT(total)}</span>
              </div>
              <Link href="/checkout" onClick={close} className="btn btn-primary btn-lg w-full">{t("cart.go")}</Link>
              <button onClick={close} className="btn btn-ghost btn-sm mt-2 w-full">{t("common.continue")}</button>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
