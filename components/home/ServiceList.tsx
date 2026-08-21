"use client";

import { useState } from "react";
import { ServiceBooking } from "@/components/ServiceBooking";
import type { CmsItem } from "@/lib/types";

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

/** Нэг үйлчилгээний мөр — зүүн талд зураг, баруун талд бүх мэдээлэл, доор нь цаг захиалга. */
function ServiceRow({ item, index }: { item: CmsItem; index: number }) {
  const cover = item.image || item.images?.[0];
  const paragraphs = (item.body || "").split("\n").map((p) => p.trim()).filter(Boolean);
  const [booking, setBooking] = useState(false);

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

        {/* Цаг захиалга — энэ заслын дотроо нээгдэнэ */}
        <button
          type="button"
          onClick={() => setBooking((v) => !v)}
          aria-expanded={booking}
          className="btn btn-primary btn-md mt-6"
        >
          🗓 {booking ? "Захиалгыг хаах" : "Цаг захиалах"}
          <span aria-hidden className={"ml-1.5 inline-block transition-transform " + (booking ? "rotate-180" : "")}>⌄</span>
        </button>

        <div
          className="overflow-hidden transition-[max-height,opacity] duration-500 ease-out"
          style={{ maxHeight: booking ? "500rem" : 0, opacity: booking ? 1 : 0 }}
        >
          <div className="mt-5">
            {booking && <ServiceBooking itemId={item.id} serviceName={item.title} />}
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Энергийн заслын жагсаалт — мэдээлэл бүр доошоо бүтнээрээ харагдаж,
 * засал тус бүр дээрээ өөрийн цаг захиалгын товчтой.
 */
export function ServiceList({ items }: { items: CmsItem[] }) {
  if (items.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-line px-5 py-14 text-center text-muted">
        Одоохондоо үйлчилгээ нэмэгдээгүй байна.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {items.map((it, i) => <ServiceRow key={it.id} item={it} index={i} />)}
    </div>
  );
}
