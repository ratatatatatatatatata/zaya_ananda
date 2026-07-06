"use client";

import { useState } from "react";
import { CmsCard } from "./CmsCard";
import { cx } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { catLabel } from "@/data/cms-taxonomy";
import type { CmsItem } from "@/lib/types";

const ALL = { mn: "Бүгд", en: "All", ko: "전체", ja: "すべて", zh: "全部" };

/**
 * Ангилалтай жагсаалт.
 * - `groups` өгвөл: бүлэг таб + дэд ангиллын chip (үйлчилгээ).
 * - `categories` өгвөл: энгийн таб (зөвлөгөө).
 */
export function CmsFilterGrid({ items, categories, groups, emptyText }: {
  items: CmsItem[];
  categories?: string[];
  groups?: { group: string; subs: string[] }[];
  emptyText: string;
}) {
  const { lang, tr } = useI18n();
  const [tab, setTab] = useState("Бүгд");
  const [sub, setSub] = useState("Бүгд");

  const Tab = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button onClick={onClick} className={cx("rounded-full px-5 py-2 text-sm font-semibold transition", active ? "bg-primary-grad text-white shadow-glow" : "border border-line bg-white/5 text-ink/70 hover:border-primary-300")}>
      {label === "Бүгд" ? tr(ALL) : catLabel(label, lang)}
    </button>
  );

  let shown = items;
  let subTabs: string[] = [];
  if (groups) {
    const g = groups.find((x) => x.group === tab);
    if (g) {
      subTabs = g.subs;
      shown = sub === "Бүгд" ? items.filter((i) => g.subs.includes(i.category || "") || (i.category || "") === g.group) : items.filter((i) => (i.category || "") === sub);
    }
  } else if (categories && tab !== "Бүгд") {
    shown = items.filter((i) => (i.category || "") === tab);
  }

  const topTabs = ["Бүгд", ...(groups ? groups.map((g) => g.group) : categories || [])];

  return (
    <>
      <div className="mb-5 flex flex-wrap gap-2">
        {topTabs.map((tb) => <Tab key={tb} label={tb} active={tab === tb} onClick={() => { setTab(tb); setSub("Бүгд"); }} />)}
      </div>
      {subTabs.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {["Бүгд", ...subTabs].map((s) => (
            <button key={s} onClick={() => setSub(s)} className={cx("rounded-full px-4 py-1.5 text-xs font-semibold transition", sub === s ? "bg-primary-100 text-primary-700 ring-1 ring-primary-400" : "bg-aqua text-ink/60 hover:text-primary-700")}>
              {s === "Бүгд" ? tr(ALL) : catLabel(s, lang)}
            </button>
          ))}
        </div>
      )}
      {shown.length === 0
        ? <p className="rounded-2xl border border-dashed border-line bg-white/5 px-5 py-14 text-center text-muted">{emptyText}</p>
        : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{shown.map((i) => <CmsCard key={i.id} item={i} />)}</div>}
    </>
  );
}
