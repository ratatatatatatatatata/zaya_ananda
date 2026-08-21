"use client";

import { useState } from "react";
import { ServiceBooking } from "@/components/ServiceBooking";
import type { CmsItem } from "@/lib/types";

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

/** Нэг үйлчилгээний мөр — зүүн талд зураг, баруун талд бүх мэдээлэл. */
function ServiceRow({ item, index }: { item: CmsItem; index: number }) {
  const cover = item.image || item.images?.[0];
  const paragraphs = (item.body || "").split("\n").map((p) => p.trim()).filter(Boolean);

  return (
    <article id={"service-" + item.id} className="card grid gap-0 overflow-hidden scroll-mt-32 lg:grid-cols-[minmax(0,24rem)_1fr]">
      {/* Зураг */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-3 lg:aspect-auto lg:h-full">
        {cover ? (
          <img src={cover} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full" style={{ backgroundImage: "linear-gradient(150deg,#0F2B26,#1E2A1C)" }} />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-[#0B1714]/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-accent-300 backdrop-blur">
          {item.category || String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Бүх мэдээлэл — нуухгүй, шууд харагдана */}
      <div className="p-6 sm:p-8">
        <h3 className="font-display text-2xl font-semibold text-ink">{item.title}</h3>
        {item.summary && <p className="mt-3 leading-relaxed text-muted">{item.summary}</p>}

        {paragraphs.length > 0 && (
          <div className="mt-5 space-y-3 leading-relaxed text-ink/85">
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        )}

        {(item.mode || typeof item.price === "number") && (
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {item.mode && (
              <span className="text-muted">
                📍 {item.mode === "online" ? "Онлайн" : item.mode === "tankhim" ? "Танхим" : "Онлайн ба танхим"}
              </span>
            )}
            {typeof item.price === "number" && item.price > 0 && (
              <span className="font-semibold text-primary-700">💠 {item.price.toLocaleString("mn-MN")}₮</span>
            )}
          </div>
        )}

        {item.teacherName && (
          <div className="mt-6 flex items-center gap-4 border-t border-line pt-5">
            <span className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-surface-3">
              {item.teacherImage ? (
                <img src={item.teacherImage} alt={item.teacherName} className="h-full w-full object-cover" />
              ) : (
                <span className="grid h-full w-full place-items-center font-display font-semibold text-[#14231F]"
                  style={{ backgroundImage: "linear-gradient(150deg,#FFE7A8,#E8B75F 55%,#B98A3C)" }}>
                  {initials(item.teacherName)}
                </span>
              )}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Заах багш</p>
              <p className="font-display font-semibold text-ink">{item.teacherName}</p>
              {item.teacherInfo && <p className="text-sm text-muted">{item.teacherInfo.split("\n")[0]}</p>}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

/**
 * Энергийн заслын жагсаалт — мэдээлэл бүр доошоо бүтнээрээ харагдаж,
 * хамгийн сүүлд нь цаг захиалгын систем гарна.
 */
export function ServiceList({ items }: { items: CmsItem[] }) {
  const [sel, setSel] = useState(0);

  if (items.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-line px-5 py-14 text-center text-muted">
        Одоохондоо үйлчилгээ нэмэгдээгүй байна.
      </p>
    );
  }

  const active = items[Math.min(sel, items.length - 1)];

  return (
    <div>
      <div className="space-y-8">
        {items.map((it, i) => <ServiceRow key={it.id} item={it} index={i} />)}
      </div>

      {/* Хамгийн ард — цаг захиалга */}
      <div id="service-booking" className="mt-14 scroll-mt-32 rounded-4xl border border-line bg-surface-2 p-6 sm:p-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow-line justify-center"><span>🗓</span></p>
          <h3 className="mt-3 font-display text-3xl font-semibold text-ink">Цаг захиалах</h3>
          <p className="mt-3 leading-relaxed text-muted">
            Дээрх заслуудаас сонгоод, өдөр цагаа тохируулан захиалгаа өгнө үү.
          </p>
        </div>

        {/* Аль засалд цаг авахаа сонгоно */}
        {items.length > 1 && (
          <div className="mt-8">
            <p className="text-center text-xs font-bold uppercase tracking-wide text-muted">Ямар засал вэ?</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2.5">
              {items.map((it, i) => (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => setSel(i)}
                  aria-pressed={i === sel}
                  className={
                    "focus-ring rounded-full px-4 py-2 text-sm font-semibold transition " +
                    (i === sel
                      ? "bg-primary-grad text-white shadow-soft"
                      : "border border-line bg-surface-1 text-ink/75 hover:border-primary-400 hover:text-primary-700")
                  }
                >
                  {it.title}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mx-auto mt-8 max-w-xl">
          {/* key — засал солиход маягт цэвэр эхэлнэ */}
          <ServiceBooking key={active.id} itemId={active.id} serviceName={active.title} />
        </div>
      </div>
    </div>
  );
}
