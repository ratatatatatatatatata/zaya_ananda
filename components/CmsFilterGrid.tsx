"use client";

import { useState } from "react";
import { CmsCard } from "./CmsCard";
import { Stagger } from "./motion/Stagger";
import { TiltCard } from "./motion/TiltCard";
import { cx } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { catLabel, SERVICE_MODES } from "@/data/cms-taxonomy";
import { CATEGORY_THEME, GROUP_THEME } from "@/data/theme-map";
import { CategoryGlyph } from "./CategoryGlyph";
import type { CmsItem } from "@/lib/types";

const ALL = { mn: "Бүгд", en: "All", ko: "전체", ja: "すべて", zh: "全部" };
const HOW = { mn: "Хэрхэн авах:", en: "How:", ko: "방식:", ja: "受け方:", zh: "方式：" };

/**
 * Ангилалтай жагсаалт.
 * - `groups` өгвөл: бүлэг таб + дэд ангиллын chip (үйлчилгээ).
 * - `categories` өгвөл: энгийн таб (зөвлөгөө).
 */
export function CmsFilterGrid({ items, categories, groups, emptyText, modeFilter = false }: {
  items: CmsItem[];
  categories?: string[];
  groups?: { group: string; subs: string[] }[];
  emptyText: string;
  /** Онлайн / Ирж уулзах гэсэн нэмэлт сонголт харуулах эсэх */
  modeFilter?: boolean;
}) {
  const { lang, tr } = useI18n();
  const [tab, setTab] = useState("Бүгд");
  const [sub, setSub] = useState("Бүгд");
  const [mode, setMode] = useState<"all" | "online" | "tankhim">("all");

  const Tab = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button onClick={onClick} className={cx("focus-ring inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition", active ? "bg-primary-grad text-white shadow-glow" : "border border-line bg-white/5 text-ink/70 hover:border-primary-300")}>
      {label !== "Бүгд" && (GROUP_THEME[label] || CATEGORY_THEME[label]) && (() => {
        const g = GROUP_THEME[label] || CATEGORY_THEME[label];
        return <CategoryGlyph glyph={g.glyph} from={active ? "#ffffff" : g.from} to={active ? "#e9fffb" : g.to} className="h-4.5 w-4.5" id={label} />;
      })()}
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

  // Онлайн / Ирж уулзах шүүлт — "both" аль алинд нь орно
  const showModes = modeFilter && items.some((i) => i.mode);
  if (showModes && mode !== "all") shown = shown.filter((i) => i.mode === mode || i.mode === "both");

  const topTabs = ["Бүгд", ...(groups ? groups.map((g) => g.group) : categories || [])];

  return (
    <>
      <div className="mb-5 flex flex-wrap gap-2">
        {topTabs.map((tb) => <Tab key={tb} label={tb} active={tab === tb} onClick={() => { setTab(tb); setSub("Бүгд"); setMode("all"); }} />)}
      </div>
      {subTabs.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {["Бүгд", ...subTabs].map((s) => (
            <button key={s} onClick={() => setSub(s)} className={cx("focus-ring inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition", sub === s ? "bg-primary-100 text-primary-700 ring-1 ring-primary-400" : "bg-aqua text-ink/60 hover:text-primary-700")}>
              {s !== "Бүгд" && CATEGORY_THEME[s] && (
                <CategoryGlyph glyph={CATEGORY_THEME[s].glyph} from={CATEGORY_THEME[s].from} to={CATEGORY_THEME[s].to} className="h-4 w-4" id={s} />
              )}
              {s === "Бүгд" ? tr(ALL) : catLabel(s, lang)}
            </button>
          ))}
        </div>
      )}
      {showModes && (
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-bold uppercase tracking-wide text-muted">{tr(HOW)}</span>
          <button onClick={() => setMode("all")}
            className={cx("focus-ring rounded-full px-4 py-1.5 text-xs font-semibold transition", mode === "all" ? "bg-primary-100 text-primary-700 ring-1 ring-primary-400" : "bg-aqua text-ink/60 hover:text-primary-700")}>
            {tr(ALL)}
          </button>
          {SERVICE_MODES.map((m) => (
            <button key={m.key} onClick={() => setMode(m.key)}
              className={cx("focus-ring inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition", mode === m.key ? "bg-primary-100 text-primary-700 ring-1 ring-primary-400" : "bg-aqua text-ink/60 hover:text-primary-700")}>
              <span aria-hidden>{m.emoji}</span>{tr(m.label)}
            </button>
          ))}
        </div>
      )}
      {shown.length === 0
        ? <p className="rounded-2xl border border-dashed border-line bg-white/5 px-5 py-14 text-center text-muted">{emptyText}</p>
        : <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{shown.map((i) => <TiltCard key={i.id} className="h-full"><CmsCard item={i} /></TiltCard>)}</Stagger>}
    </>
  );
}
