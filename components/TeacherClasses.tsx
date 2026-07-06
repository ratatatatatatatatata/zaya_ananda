"use client";

import { useState } from "react";
import Link from "next/link";
import { formatMNT, cx } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { locText, type CmsI18n } from "@/lib/cms-i18n";

export type TeacherClass = {
  id: string;
  kind: string;
  title: string;
  summary?: string;
  image?: string;
  price?: number;
  lessonsCount?: number;
  i18n?: CmsI18n;
};

const kindLabel: Record<string, { mn: string; en: string; ko: string; ja: string; zh: string }> = {
  course: { mn: "Сургалт", en: "Course", ko: "강좌", ja: "講座", zh: "课程" },
  service: { mn: "Үйлчилгээ", en: "Service", ko: "서비스", ja: "サービス", zh: "服务" },
};

/** Багшийн хөтөлдөг хичээлүүд — эхлээд зөвхөн гарчиг, сонгоход дэлгэрэнгүй нь дэлгэгдэнэ. */
export function TeacherClasses({ classes }: { classes: TeacherClass[] }) {
  const { lang, tr } = useI18n();
  const [open, setOpen] = useState<string | null>(null);

  if (classes.length === 0)
    return <p className="mt-6 rounded-2xl border border-dashed border-line bg-white/5 px-5 py-12 text-center text-muted">Одоогоор бүртгэгдсэн хичээл алга. Удахгүй нэмэгдэнэ.</p>;

  return (
    <div className="mt-8 space-y-3">
      {classes.map((c, i) => {
        const isOpen = open === c.id;
        const title = locText(lang, c.title, c.i18n, "title");
        const summary = locText(lang, c.summary, c.i18n, "summary");
        return (
          <div key={c.id} className={cx("overflow-hidden rounded-2xl border bg-[#1A2742] transition-shadow", isOpen ? "border-primary-300 shadow-glow" : "border-line hover:border-primary-300")}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : c.id)}
              className="flex w-full items-center gap-4 px-5 py-4 text-left"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-50 text-sm font-bold text-primary-700">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-lg font-semibold text-ink">{title}</span>
                <span className="mt-0.5 block text-xs font-semibold uppercase tracking-wide text-primary-600">{kindLabel[c.kind] ? tr(kindLabel[c.kind]) : ""}</span>
              </span>
              <span className={cx("shrink-0 text-xl text-primary-500 transition-transform duration-300", isOpen && "rotate-180")}>⌄</span>
            </button>

            <div className={cx("grid transition-all duration-300", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
              <div className="overflow-hidden">
                <div className="flex flex-col gap-4 border-t border-line px-5 py-5 sm:flex-row">
                  {c.image && <img src={c.image} alt="" className="h-36 w-full rounded-xl object-cover sm:w-56" />}
                  <div className="min-w-0 flex-1">
                    {summary && <p className="leading-relaxed text-muted">{summary}</p>}
                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
                      {typeof c.lessonsCount === "number" && c.lessonsCount > 0 && <span>🎬 {c.lessonsCount} видео хичээл</span>}
                      {typeof c.price === "number" && <span className="price text-base">{formatMNT(c.price)}</span>}
                    </div>
                    <Link href={"/item/" + c.id} className="btn btn-primary btn-md mt-4">Дэлгэрэнгүй үзэх →</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
