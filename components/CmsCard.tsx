import { formatMNT } from "@/lib/format";
import type { CmsItem } from "@/lib/types";

const modeLabel: Record<string, string> = { online: "Онлайн сургалт", tankhim: "Танхимын сургалт", both: "Онлайн + Танхим" };

export function CmsCard({ item }: { item: CmsItem }) {
  return (
    <div className="card flex flex-col p-6">
      {item.category && <span className="chip mb-3 self-start">{item.category}</span>}
      <h3 className="font-display text-xl font-semibold leading-snug text-ink">{item.title}</h3>
      {item.summary && <p className="mt-2.5 text-[1.04rem] leading-relaxed text-muted">{item.summary}</p>}
      {item.body && <p className="mt-2 whitespace-pre-line text-[0.98rem] leading-relaxed text-ink/70">{item.body}</p>}
      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        {item.mode ? <span className="text-sm font-semibold text-primary-700">{modeLabel[item.mode]}</span> : <span />}
        {typeof item.price === "number" && <span className="price">{formatMNT(item.price)}</span>}
      </div>
    </div>
  );
}
