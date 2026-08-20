"use client";

import { useState } from "react";
import { CmsCard } from "./CmsCard";
import { Stagger } from "./motion/Stagger";
import { TiltCard } from "./motion/TiltCard";
import type { CmsItem, Locale } from "@/lib/types";
import { cx } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

const Lx = (mn: string, en: string, ko: string, ja: string, zh: string): Record<Locale, string> => ({ mn, en, ko, ja, zh });

/** Ганцхан түвшний ангилал — бүгд / онлайн / танхим */
const TABS: { k: "all" | "online" | "tankhim"; icon: string; label: Record<Locale, string> }[] = [
  { k: "all", icon: "✦", label: Lx("Бүгд", "All", "전체", "すべて", "全部") },
  { k: "online", icon: "💻", label: Lx("Онлайн сургалт", "Online courses", "온라인 강좌", "オンライン講座", "线上课程") },
  { k: "tankhim", icon: "🏛", label: Lx("Танхимын сургалт", "In-studio courses", "오프라인 강좌", "対面講座", "线下课程") },
];

const EMPTY = Lx(
  "Одоохондоо сургалт нэмэгдээгүй байна.",
  "No courses yet.",
  "아직 강좌가 없습니다.",
  "まだ講座がありません。",
  "暂无课程。",
);

export function CmsCoursesFilter({ items }: { items: CmsItem[] }) {
  const { tr } = useI18n();
  const [mode, setMode] = useState<"all" | "online" | "tankhim">("all");

  const shown = mode === "all" ? items : items.filter((i) => i.mode === mode || i.mode === "both");

  return (
    <div>
      <div className="mx-auto mb-8 flex w-full max-w-2xl flex-wrap justify-center gap-2">
        {TABS.map((tb) => (
          <button
            key={tb.k}
            onClick={() => setMode(tb.k)}
            className={cx(
              "focus-ring inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[1rem] font-semibold transition",
              mode === tb.k ? "bg-primary-grad text-white shadow-glow" : "border border-line bg-surface-1 text-ink/70 hover:border-primary-400 hover:text-primary-700",
            )}
          >
            <span aria-hidden>{tb.icon}</span>
            {tr(tb.label)}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line bg-white/5 px-5 py-12 text-center text-muted">{tr(EMPTY)}</p>
      ) : (
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((i) => <TiltCard key={i.id} className="h-full"><CmsCard item={i} /></TiltCard>)}
        </Stagger>
      )}
    </div>
  );
}
