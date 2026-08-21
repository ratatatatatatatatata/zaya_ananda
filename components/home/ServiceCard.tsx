"use client";

import { useEffect, useState } from "react";
import { ServiceBooking } from "@/components/ServiceBooking";
import type { CmsItem } from "@/lib/types";

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

/** Энергийн заслын карт — дэлгэрэнгүй хуудас руу шилжихгүй, энд дээрээ дэлгэгдэж цаг захиална. */
export function ServiceCard({ item }: { item: CmsItem }) {
  const cover = item.image || item.images?.[0];
  const hasTeacher = Boolean(item.teacherName);
  const [open, setOpen] = useState(false);

  // Нээлттэй үед арын хуудас гүйхийг зогсооно
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="card group flex h-full w-full flex-col overflow-hidden text-left transition hover:-translate-y-1 hover:shadow-glow"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-3">
          {cover ? (
            <img src={cover} alt={item.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          ) : (
            <div className="h-full w-full" style={{ backgroundImage: "linear-gradient(150deg,#0F2B26,#1E2A1C)" }} />
          )}
          {item.category && (
            <span className="absolute left-4 top-4 rounded-full bg-[#0B1714]/75 px-3 py-1 text-xs font-semibold text-accent-300 backdrop-blur">
              {item.category}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-lg font-semibold text-ink">{item.title}</h3>
          {item.summary && <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{item.summary}</p>}

          {hasTeacher && (
            <div className="mt-5 flex items-center gap-3 border-t border-line pt-4">
              <span className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-surface-3">
                {item.teacherImage ? (
                  <img src={item.teacherImage} alt={item.teacherName} className="h-full w-full object-cover" />
                ) : (
                  <span
                    className="grid h-full w-full place-items-center font-display text-sm font-semibold text-[#14231F]"
                    style={{ backgroundImage: "linear-gradient(150deg,#FFE7A8,#E8B75F 55%,#B98A3C)" }}
                  >
                    {initials(item.teacherName || "")}
                  </span>
                )}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-display text-sm font-semibold text-ink">{item.teacherName}</span>
                {item.teacherInfo && <span className="block truncate text-xs text-muted">{item.teacherInfo.split("\n")[0]}</span>}
              </span>
            </div>
          )}

          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary-700">
            Цаг захиалах <span aria-hidden>→</span>
          </span>
        </div>
      </button>

      {/* Дэлгэрэнгүй ба цаг захиалга — хуудас солихгүйгээр энд нээгдэнэ */}
      {open && (
        <div role="dialog" aria-modal="true" aria-label={item.title}
          className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-[#0B1714]/70 p-4 backdrop-blur-sm sm:p-8">
          <div aria-hidden className="fixed inset-0" onClick={() => setOpen(false)} />
          <div className="relative z-10 my-auto w-full max-w-3xl rounded-4xl border border-line bg-surface-1 shadow-glow">
            <button type="button" onClick={() => setOpen(false)} aria-label="Хаах"
              className="focus-ring absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-[#0B1714]/60 text-lg text-white backdrop-blur transition hover:bg-[#0B1714]/80">
              ✕
            </button>

            {cover && (
              <div className="relative aspect-[21/9] w-full overflow-hidden rounded-t-4xl">
                <img src={cover} alt={item.title} className="h-full w-full object-cover" />
                <div aria-hidden className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(8,20,17,0.85) 0%, transparent 60%)" }} />
                <h3 className="absolute inset-x-0 bottom-0 p-6 font-display text-2xl font-semibold text-white sm:text-3xl">{item.title}</h3>
              </div>
            )}

            <div className="p-6 sm:p-8">
              {!cover && <h3 className="font-display text-2xl font-semibold text-ink">{item.title}</h3>}
              {item.summary && <p className="mt-2 leading-relaxed text-muted">{item.summary}</p>}
              {item.body && (
                <div className="mt-5 space-y-3 leading-relaxed text-ink/85">
                  {item.body.split("\n").filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
                </div>
              )}

              {hasTeacher && (
                <div className="mt-6 flex items-center gap-4 rounded-3xl border border-line bg-surface-2 p-4">
                  <span className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-surface-3">
                    {item.teacherImage ? (
                      <img src={item.teacherImage} alt={item.teacherName} className="h-full w-full object-cover" />
                    ) : (
                      <span className="grid h-full w-full place-items-center font-display font-semibold text-[#14231F]"
                        style={{ backgroundImage: "linear-gradient(150deg,#FFE7A8,#E8B75F 55%,#B98A3C)" }}>
                        {initials(item.teacherName || "")}
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

              <div className="mt-6">
                <ServiceBooking itemId={item.id} serviceName={item.title} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
