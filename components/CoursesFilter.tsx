"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { CourseCard } from "./Cards";
import type { Course, L } from "@/lib/types";
import { cx } from "@/lib/format";

const Lx = (mn: string, en: string, ko: string, ja: string, zh: string): L => ({ mn, en, ko, ja, zh });
const TABS: { key: "online" | "tankhim"; label: L }[] = [
  { key: "online", label: Lx("Онлайн сургалт", "Online courses", "온라인 강좌", "オンライン講座", "在线课程") },
  { key: "tankhim", label: Lx("Танхимын сургалт", "In-person courses", "오프라인 강좌", "対面講座", "线下课程") },
];

export function CoursesFilter({ courses }: { courses: Course[] }) {
  const { tr } = useI18n();
  const [mode, setMode] = useState<"online" | "tankhim">("online");
  const shown = courses.filter((c) => c.mode === mode || c.mode === "both" || !c.mode && mode === "online");

  return (
    <div>
      <div className="mx-auto mb-9 flex w-full max-w-md rounded-full border border-line bg-[#1A2742] p-1 shadow-sm">
        {TABS.map((tb) => (
          <button key={tb.key} onClick={() => setMode(tb.key)}
            className={cx("flex-1 rounded-full px-5 py-3 text-[1.02rem] font-semibold transition", mode === tb.key ? "bg-primary-grad text-white shadow-soft" : "text-ink/70 hover:text-primary-700")}>
            {tr(tb.label)}
          </button>
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((c) => <CourseCard key={c.id} c={c} />)}
      </div>
    </div>
  );
}
