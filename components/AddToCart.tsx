"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import type { CartItem } from "@/lib/types";

export function AddToCart({
  item,
  qty = 1,
  labelKey = "common.addToCart",
  className = "btn btn-primary btn-md",
  soldOut = false,
}: {
  item: Omit<CartItem, "qty">;
  qty?: number;
  labelKey?: string;
  className?: string;
  soldOut?: boolean;
}) {
  const { add } = useCart();
  const { t } = useI18n();
  const [done, setDone] = useState(false);

  if (soldOut) {
    return (
      <button disabled className={className}>
        {t("common.soldOut")}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        add(item, qty);
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
    >
      {done ? t("common.added") : t(labelKey)}
    </button>
  );
}
