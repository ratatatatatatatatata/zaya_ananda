"use client";

import { useEffect, useState } from "react";
import { cx } from "@/lib/format";
import type { CmsItem } from "@/lib/types";

export function PromoBanner({ items }: { items: CmsItem[] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [items.length]);
  if (items.length === 0) return null;
  const p = items[Math.min(idx, items.length - 1)];
  const inner = (
    <div className="relative w-full overflow-hidden rounded-3xl border border-line bg-primary-50 shadow-card">
      {p.image
        ? <img src={p.image} alt={p.title} className="max-h-[340px] w-full object-cover" />
        : <div className="grid h-40 w-full place-items-center bg-primary-grad px-6 text-center text-2xl font-display font-semibold text-white">{p.title}</div>}
      {p.image && (p.title || p.summary) && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-5 sm:p-7">
          {p.title && <p className="font-display text-xl font-semibold text-white sm:text-3xl">{p.title}</p>}
          {p.summary && <p className="mt-1 max-w-2xl text-sm text-white/90 sm:text-base">{p.summary}</p>}
        </div>
      )}
    </div>
  );
  return (
    <div className="container-px pt-6">
      {p.link ? <a href={p.link} target={p.link.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="block">{inner}</a> : inner}
      {items.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {items.map((_, i) => <button key={i} aria-label={"banner " + (i + 1)} onClick={() => setIdx(i)} className={cx("h-2 rounded-full transition-all", i === idx ? "w-6 bg-primary-600" : "w-2 bg-line hover:bg-primary-300")} />)}
        </div>
      )}
    </div>
  );
}
