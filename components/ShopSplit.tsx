"use client";

import { useState, type ReactNode } from "react";
import { cx } from "@/lib/format";

/** Энергийн хамгаалалт — 2 хэсэг: Бүтээгдэхүүн | Ордуудын ээлтэй чулуу. */
export function ShopSplit({ products, stones }: { products: ReactNode; stones: ReactNode }) {
  const [tab, setTab] = useState<"products" | "stones">("products");
  const btn = (active: boolean) =>
    cx(
      "flex-1 rounded-2xl px-5 py-3.5 font-display text-base font-semibold transition sm:text-lg",
      active
        ? "bg-primary-grad text-white shadow-[0_0_30px_-8px_rgba(76,200,189,0.55)]"
        : "text-muted hover:text-ink"
    );
  return (
    <div>
      <div className="mx-auto mb-10 flex max-w-2xl gap-1.5 rounded-3xl border border-line bg-[#121D33] p-1.5">
        <button type="button" className={btn(tab === "products")} onClick={() => setTab("products")}>
          🛍 Бүтээгдэхүүн
        </button>
        <button
          type="button"
          className={cx(
            "flex-1 rounded-2xl px-5 py-3.5 font-display text-base font-semibold transition sm:text-lg",
            tab === "stones"
              ? "text-[#1B1B2E] shadow-[0_0_30px_-8px_rgba(227,190,98,0.6)]"
              : "text-muted hover:text-ink"
          )}
          style={tab === "stones" ? { backgroundImage: "linear-gradient(120deg,#E3BE62,#F0D48A)" } : undefined}
          onClick={() => setTab("stones")}
        >
          💎 Ордуудын ээлтэй чулуу
        </button>
      </div>
      <div className={tab === "products" ? "" : "hidden"}>{products}</div>
      <div className={tab === "stones" ? "" : "hidden"}>{stones}</div>
    </div>
  );
}
