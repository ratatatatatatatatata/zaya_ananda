"use client";

import { useState } from "react";
import { CmsCard } from "./CmsCard";
import { cx } from "@/lib/format";
import type { CmsItem } from "@/lib/types";

export function CmsFilterGrid({ items, categories, emptyText }: { items: CmsItem[]; categories: string[]; emptyText: string }) {
  const [cat, setCat] = useState("Бүгд");
  const tabs = ["Бүгд", ...categories];
  const shown = cat === "Бүгд" ? items : items.filter((i) => (i.category || "") === cat);
  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        {tabs.map((tb) => (
          <button key={tb} onClick={() => setCat(tb)} className={cx("rounded-full px-5 py-2 text-sm font-semibold transition", cat === tb ? "bg-primary-grad text-white shadow-glow" : "border border-line bg-white text-ink/70 hover:border-primary-300")}>{tb}</button>
        ))}
      </div>
      {shown.length === 0
        ? <p className="rounded-2xl border border-dashed border-line bg-white/60 px-5 py-14 text-center text-muted">{emptyText}</p>
        : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{shown.map((i) => <CmsCard key={i.id} item={i} />)}</div>}
    </>
  );
}
