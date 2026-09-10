"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type Member = { name: string; image?: string; role?: ReactNode; info?: ReactNode; focus?: number };

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

/** Хамт олны нэг зураг — дарахад биографийн modal нээгдэнэ. */
function TeamCard({ m, onOpen }: { m: Member; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group w-[13.5rem] shrink-0 text-left focus-ring sm:w-[15.5rem]"
      aria-haspopup="dialog"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-white/12 bg-white/5">
        {m.image ? (
          <img
            src={m.image}
            alt=""
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            style={{ objectPosition: "50% " + (m.focus ?? 50) + "%" }}
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-4xl font-display font-semibold text-white/50"
            style={{ backgroundImage: "linear-gradient(150deg,#123028,#0B1714)" }}>
            {initials(m.name)}
          </div>
        )}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div aria-hidden className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/0 transition group-hover:ring-primary-400/50" />
      </div>
      <p className="mt-4 font-display text-lg font-semibold text-white">{m.name}</p>
      {m.role && <p className="mt-0.5 text-sm text-white/55">{m.role}</p>}
    </button>
  );
}

/** Биографийн modal — document.body руу portal хийнэ (эцэг элемент .night хэсэг тул
 *  transform/scroll-container дотор "fixed" гажигтай харагдахаас урьдчилан сэргийлнэ). */
function BioModal({ m, onClose }: { m: Member; onClose: () => void }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={m.name}
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-[#0B1714]/75 p-4 backdrop-blur-sm sm:p-8">
      <div aria-hidden className="fixed inset-0" onClick={onClose} />
      <div className="relative z-10 my-auto grid w-full max-w-2xl gap-0 overflow-hidden rounded-4xl border border-line bg-surface-1 shadow-glow sm:grid-cols-[13rem_1fr]">
        <button type="button" onClick={onClose} aria-label="Хаах"
          className="focus-ring absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-[#0B1714]/60 text-lg text-white backdrop-blur transition hover:bg-[#0B1714]/80">
          ✕
        </button>
        <div className="relative aspect-[3/4] w-full overflow-hidden sm:aspect-auto sm:h-full">
          {m.image ? (
            <img src={m.image} alt="" className="h-full w-full object-cover" style={{ objectPosition: "50% " + (m.focus ?? 50) + "%" }} />
          ) : (
            <div className="grid h-full w-full place-items-center text-5xl font-display font-semibold text-ink/40"
              style={{ backgroundImage: "linear-gradient(150deg,#0F2B26,#1E2A1C)" }}>
              {initials(m.name)}
            </div>
          )}
        </div>
        <div className="p-6 sm:p-8">
          <h3 className="font-display text-2xl font-semibold text-ink">{m.name}</h3>
          {m.role && <p className="mt-1 text-sm font-medium text-primary-700">{m.role}</p>}
          {m.info && <p className="mt-4 whitespace-pre-line leading-relaxed text-muted">{m.info}</p>}
        </div>
      </div>
    </div>,
    document.body
  );
}

/** Хамт олон — гүн дэвсгэртэй (.night), хажуу тийш аяндаа аажим гулсдаг зургийн эгнээ
 *  (AboutGallery-тэй адил rAF/scrollLeft техник), hover дээр зогсоно, гар/хуруугаар
 *  чирж болно, дарахад биографийн modal нээгдэнэ. */
export function AboutTeamRow({ eyebrow, statement, members }: {
  eyebrow?: ReactNode;
  statement?: ReactNode;
  members: Member[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const hoveringRef = useRef(false);

  useEffect(() => {
    if (members.length === 0) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const step = () => {
      const track = trackRef.current;
      if (track && !hoveringRef.current) {
        if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 1) track.scrollLeft = 0;
        else track.scrollLeft += 0.35;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [members.length]);

  if (members.length === 0) return null;
  // Гурав дахин давхарлаж эгнээг сунгана — хажуу тийш үргэлжлүүлж гүйхэд төгсгөлд
  // хүрэлгүй, эргүүлж эхнээс нь аяндаа үргэлжилдэг мэт харагдана.
  const loop = [...members, ...members, ...members];

  return (
    <section className="night relative overflow-hidden py-24 sm:py-28" style={{ background: "radial-gradient(120% 90% at 15% 0%, #163a32 0%, #0B1714 55%, #060f0d 100%)" }}>
      {/* Зөөлөн бүдгэрсэн glow толбо */}
      <div aria-hidden className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-primary-500/20 blur-[110px]" />
      <div aria-hidden className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-accent-400/14 blur-[110px]" />

      <div className="container-px relative">
        {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary-300">{eyebrow}</p>}
        {statement && (
          <p className="mt-5 max-w-3xl text-balance font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
            {statement}
          </p>
        )}
      </div>

      <div
        className="container-px relative mt-14"
        onMouseEnter={() => { hoveringRef.current = true; }}
        onMouseLeave={() => { hoveringRef.current = false; }}
      >
        <div ref={trackRef} className="flex gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {loop.map((m, i) => (
            <TeamCard key={m.name + i} m={m} onOpen={() => setOpenIndex(i % members.length)} />
          ))}
        </div>
      </div>

      {openIndex !== null && (
        <BioModal m={members[openIndex]} onClose={() => setOpenIndex(null)} />
      )}
    </section>
  );
}
