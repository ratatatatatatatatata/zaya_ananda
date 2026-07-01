import Link from "next/link";
import { formatMNT } from "@/lib/format";
import type { CmsItem } from "@/lib/types";

const modeLabel: Record<string, string> = { online: "Онлайн сургалт", tankhim: "Танхимын сургалт", both: "Онлайн + Танхим" };

export function CmsCard({ item }: { item: CmsItem }) {
  const isCourse = item.kind === "course";
  const hasCounts = typeof item.videoLessons === "number" || typeof item.students === "number" || typeof item.views === "number";
  return (
    <Link href={"/item/" + item.id} className="card group flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-glow">
      {item.image && (
        <div className="relative h-44 w-full overflow-hidden">
          <img src={item.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          {item.category && <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary-700 shadow-sm">{item.category}</span>}
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        {!item.image && item.category && <span className="chip mb-2 self-start">{item.category}</span>}
        <h3 className="font-display text-xl font-semibold leading-snug text-ink transition group-hover:text-primary-700">{item.title}</h3>
        {item.summary && <p className="mt-2 line-clamp-2 text-[1.02rem] leading-relaxed text-muted">{item.summary}</p>}
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
