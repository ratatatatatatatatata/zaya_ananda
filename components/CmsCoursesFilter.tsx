"use client";

import { useState } from "react";
import { CmsCard } from "./CmsCard";
import type { CmsItem } from "@/lib/types";
import { cx } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { catLabel, COURSE_CATS } from "@/data/cms-taxonomy";

const TABS = [
  { k: "online" as const, l: "Онлайн сургалт" },
  { k: "tankhim" as const, l: "Танхимын сургалт" },
];
const ALL = { mn: "Бүгд", en: "All", ko: "전체", ja: "すべて", zh: "全部" };

export function CmsCoursesFilter({ items }: { items: CmsItem[] }) {
  const { lang, tr } = useI18n();
  const [mode, setMode] = useState<"online" | "tankhim">("online");
  const [cat, setCat] = useState("Бүгд");
  const byMode = items.filter((i) => i.mode === mode || i.mode === "both");
  const shown = cat === "Бүгд" ? byMode : byMode.filter((i) => (i.category || "") === cat);
  return (
    <div>
      <div className="mx-auto mb-6 flex w-full max-w-md rounded-full border border-line bg-white/5 p-1 shadow-sm">
        {TABS.map((tb) => (
          <button key={tb.k} onClick={() => setMode(tb.k)} className={cx("flex-1 rounded-full px-5 py-3 text-[1.02rem] font-semibold transition", mode === tb.k ? "bg-primary-grad text-white shadow-soft" : "text-ink/70 hover:text-primary-700")}>{tb.l}</button>
        ))}
      </div>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {["Бүгд", ...COURSE_CATS].map((c) => (
          <button key={c} onClick={() => setCat(c)} className={cx("rounded-full px-5 py-2 text-sm font-semibold transition", cat === c ? "bg-primary-grad text-white shadow-glow" : "border border-line bg-white/5 text-ink/70 hover:border-primary-300")}>
            {c === "Бүгд" ? tr(ALL) : catLabel(c, lang)}
          </button>
        ))}
      </div>
      {shown.length === 0
        ? <p className="rounded-2xl border border-dashed border-line bg-white/5 px-5 py-12 text-center text-muted">Одоохондоо сургалт нэмэгдээгүй байна.</p>
        : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{shown.map((i) => <CmsCard key={i.id} item={i} />)}</div>}
    </div>
  );
}
