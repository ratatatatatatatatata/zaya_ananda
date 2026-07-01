"use client";

import { useState } from "react";
import { CmsCard } from "./CmsCard";
import type { CmsItem } from "@/lib/types";
import { cx } from "@/lib/format";

const TABS = [
  { k: "online" as const, l: "Онлайн сургалт" },
  { k: "tankhim" as const, l: "Танхимын сургалт" },
];

export function CmsCoursesFilter({ items }: { items: CmsItem[] }) {
  const [mode, setMode] = useState<"online" | "tankhim">("online");
  const shown = items.filter((i) => i.mode === mode || i.mode === "both");
  return (
    <div>
      <div className="mx-auto mb-9 flex w-full max-w-md rounded-full border border-line bg-white p-1 shadow-sm">
        {TABS.map((tb) => (
          <button key={tb.k} onClick={() => setMode(tb.k)} className={cx("flex-1 rounded-full px-5 py-3 text-[1.02rem] font-semibold transition", mode === tb.k ? "bg-primary-grad text-white shadow-soft" : "text-ink/70 hover:text-primary-700")}>{tb.l}</button>
        ))}
      </div>
      {shown.length === 0
        ? <p className="rounded-2xl border border-dashed border-line bg-white/60 px-5 py-12 text-center text-muted">Одоохондоо сургалт нэмэгдээгүй байна.</p>
        : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{shown.map((i) => <CmsCard key={i.id} item={i} />)}</div>}
    </div>
  );
}
