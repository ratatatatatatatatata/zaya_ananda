"use client";

import Link from "next/link";
import { formatMNT } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { locText } from "@/lib/cms-i18n";
import { catLabel } from "@/data/cms-taxonomy";
import { themeFor } from "@/data/theme-map";
import { CategoryGlyph } from "./CategoryGlyph";
import type { CmsItem } from "@/lib/types";

const modeLabel: Record<string, string> = { online: "Онлайн сургалт", tankhim: "Танхимын сургалт", both: "Онлайн + Танхим" };

export function CmsCard({ item }: { item: CmsItem }) {
  const { lang } = useI18n();
  const isCourse = item.kind === "course";
  const isProduct = item.kind === "product";
  const hasCounts = typeof item.videoLessons === "number" || typeof item.students === "number" || typeof item.views === "number";
  const title = locText(lang, item.title, item.i18n, "title");
  const summary = locText(lang, item.summary, item.i18n, "summary");
  const cat = catLabel(item.category, lang);
  // Агуулгад тохирсон бэлгэдэл, өнгө
  const th = themeFor(item.kind, item.category);

  // Бүтээгдэхүүн: зураг → нэр → үнэ гэсэн энгийн байрлал
  if (isProduct) {
    return (
      <Link href={"/item/" + item.id} className="panel group flex flex-col">
        {item.image && (
          <div className="relative h-60 w-full overflow-hidden">
            <img src={item.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          </div>
        )}
        <div className="flex flex-1 flex-col items-center p-5 text-center">
          <h3 className="font-display text-lg font-semibold leading-snug text-ink transition group-hover:text-primary-700">{title}</h3>
          {typeof item.price === "number" && <span className="price mt-2 text-lg">{formatMNT(item.price)}</span>}
        </div>
      </Link>
    );
  }

  return (
    <Link href={"/item/" + item.id} className="panel group flex flex-col">
      {item.image && (
        <div className="relative h-56 w-full overflow-hidden">
          <img src={item.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          {cat && <span className="absolute left-3 top-3 rounded-full bg-[#15302C]/80 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">{cat}</span>}
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        {!item.image && (
          <div className="mb-3 flex items-center gap-2.5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border"
              style={{ borderColor: th.from + "40", background: `linear-gradient(135deg, ${th.from}12, ${th.to}12)` }}>
              <CategoryGlyph glyph={th.glyph} from={th.from} to={th.to} className="h-6 w-6" id={item.id} />
            </span>
            {cat && <span className="chip">{cat}</span>}
          </div>
        )}
        <h3 className="font-display text-xl font-semibold leading-snug text-ink transition group-hover:text-primary-700">{title}</h3>
        {summary && <p className="mt-2 line-clamp-2 text-[1.02rem] leading-relaxed text-muted">{summary}</p>}
        {isCourse && hasCounts && (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
            {typeof item.videoLessons === "number" && <span>🎬 {item.videoLessons} видео хичээл</span>}
            {typeof item.students === "number" && <span>👤 {item.students} суралцагч</span>}
            {typeof item.views === "number" && <span>👁 {item.views.toLocaleString()} үзсэн</span>}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          {item.mode ? <span className="text-sm font-semibold text-primary-700">{modeLabel[item.mode]}</span> : <span />}
          {typeof item.price === "number" && <span className="price">{formatMNT(item.price)}</span>}
        </div>
      </div>
    </Link>
  );
}
