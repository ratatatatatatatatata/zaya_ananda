"use client";

import { useState } from "react";
import { CourseCatalogCard } from "./CourseCatalogCard";
import styles from "./CourseCatalogCard.module.css";
import { Stagger } from "./motion/Stagger";
import type { CmsItem, Locale } from "@/lib/types";
import { cx } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { COURSE_LEVELS } from "@/data/cms-taxonomy";

const Lx = (mn: string, en: string, ko: string, ja: string, zh: string): Record<Locale, string> => ({ mn, en, ko, ja, zh });

const EMPTY = Lx(
  "Одоохондоо сургалт нэмэгдээгүй байна.",
  "No courses yet.",
  "아직 강좌가 없습니다.",
  "まだ講座がありません。",
  "暂无课程。",
);

export function CmsCoursesFilter({ items }: { items: CmsItem[] }) {
  const { tr } = useI18n();
  const [level, setLevel] = useState("anhan");

  // Same level field and fallback as the homepage; delivery mode stays on the card.
  const shown = items.filter((item) => (item.level || "anhan") === level);

  return (
    <div>
      <div className="mx-auto mb-8 flex w-full max-w-2xl flex-wrap justify-center gap-2">
        {COURSE_LEVELS.map((tb) => (
          <button
            key={tb.key}
            type="button"
            aria-pressed={level === tb.key}
            onClick={() => setLevel(tb.key)}
            className={cx(
              "focus-ring inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[1rem] font-semibold transition",
              level === tb.key ? "bg-primary-grad text-white shadow-glow" : "border border-line bg-surface-1 text-ink/70 hover:border-primary-400 hover:text-primary-700",
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
        <Stagger className={styles.grid}>
          {shown.map((i) => <CourseCatalogCard key={i.id} item={i} />)}
        </Stagger>
      )}
    </div>
  );
}
