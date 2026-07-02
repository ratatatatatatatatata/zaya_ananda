"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { formatMNT } from "@/lib/format";
import type { L } from "@/lib/types";

const same = (s: string): L => ({ mn: s, en: s, ko: s, ja: s, zh: s });

/** Бүтээгдэхүүний худалдан авалт — тоо ширхэг сонгож сагсанд нэмэх эсвэл шууд худалдаж авах. */
export function ProductBuyBox({ id, title, price }: { id: string; title: string; price?: number }) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const cartItem = { kind: "product" as const, slug: id, title: same(title), price: price ?? 0, tone: "jade" as const, glyph: "🛍" };

  function addToCart() {
    add(cartItem, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }
  function buyNow() {
    add(cartItem, qty);
    router.push("/checkout");
  }

  return (
    <div className="card p-6">
      {typeof price === "number" && <p className="price mb-4 text-center text-3xl">{formatMNT(price)}</p>}

      <div className="mb-4 flex items-center justify-center gap-3">
        <span className="text-sm font-medium text-muted">Тоо ширхэг:</span>
        <div className="flex items-center rounded-full border border-line">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-10 w-10 place-items-center rounded-l-full text-lg text-ink/70 hover:bg-primary-50" aria-label="Хасах">−</button>
          <span className="w-10 text-center font-display text-lg font-semibold text-ink">{qty}</span>
          <button type="button" onClick={() => setQty((q) => Math.min(20, q + 1))} className="grid h-10 w-10 place-items-center rounded-r-full text-lg text-ink/70 hover:bg-primary-50" aria-label="Нэмэх">+</button>
        </div>
      </div>

      {typeof price === "number" && qty > 1 && (
        <p className="mb-4 text-center text-sm text-muted">Нийт: <span className="font-semibold text-ink">{formatMNT(price * qty)}</span></p>
      )}

      <div className="space-y-2.5">
        <button type="button" onClick={addToCart} className="btn btn-outline btn-lg w-full">{added ? "✓ Сагсанд нэмэгдлээ" : "🛒 Сагсанд нэмэх"}</button>
        <button type="button" onClick={buyNow} className="btn btn-primary btn-lg w-full">Худалдаж авах</button>
      </div>
    </div>
  );
}
