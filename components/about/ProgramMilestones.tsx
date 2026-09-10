"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Milestone = { glyph?: ReactNode; title: ReactNode; text: ReactNode };

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function Block({ m, index }: { m: Milestone; index: number }) {
  return (
    <div
      className="flex w-[19rem] shrink-0 flex-col gap-4 sm:w-[22rem]"
      style={{ marginTop: index % 2 === 1 ? "3rem" : 0 }}
    >
      <p className="font-display text-7xl font-thin leading-none text-white/20 sm:text-8xl">{pad2(index + 1)}</p>
      {m.glyph && <div aria-hidden className="text-2xl text-primary-300">{m.glyph}</div>}
      <h3 className="font-display text-xl font-semibold text-white">{m.title}</h3>
      <p className="text-sm leading-relaxed text-white/60">{m.text}</p>
    </div>
  );
}

/** Хөтөлбөрийн зорилтууд — 01, 02... дугаартай блокуудыг том дэлгэц дээр "наалдуулж"
 *  (sticky/pinned), доош гүйлгэхэд хэвтээгээр шилжүүлнэ; доор нь нимгэн явцын зурвас.
 *  Жижиг дэлгэц/утсан дээр scroll-trap-гүй, энгийн босоо жагсаалт болно. */
export function ProgramMilestones({ eyebrow, title, milestones }: {
  eyebrow?: ReactNode;
  title: ReactNode;
  milestones: Milestone[];
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0);
  const [progressPct, setProgressPct] = useState(0);

  useEffect(() => {
    if (milestones.length === 0) return;
    if (typeof window === "undefined") return;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isDesktop || reduced) return; // жижиг дэлгэц/сэдэлт багасгах горимд pin идэвхгүй

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const outer = outerRef.current, viewport = viewportRef.current, track = trackRef.current;
        if (!outer || !viewport || !track) return;
        const rect = outer.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
        const maxX = Math.max(0, track.scrollWidth - viewport.clientWidth);
        setX(-p * maxX);
        setProgressPct(p * 100);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [milestones.length]);

  if (milestones.length === 0) return null;

  return (
    <section className="night relative overflow-hidden py-24 sm:py-28" style={{ background: "linear-gradient(180deg,#0B1714 0%,#0E1E1A 55%,#0B1714 100%)" }}>
      <div className="container-px">
        {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary-300">{eyebrow}</p>}
        <h2 className="mt-5 max-w-2xl text-balance font-display text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
      </div>

      {/* Том дэлгэц — pinned, гүйлгэхэд хэвтээ шилждэг */}
      <div ref={outerRef} className="relative mt-14 hidden lg:block" style={{ height: `${milestones.length * 55 + 45}vh` }}>
        <div ref={viewportRef} className="sticky top-24 overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-10 pl-[4vw]"
            style={{ transform: `translateX(${x}px)`, transition: "transform 0.1s ease-out", width: "max-content" }}
          >
            {milestones.map((m, i) => <Block key={i} m={m} index={i} />)}
          </div>
          <div className="container-px mt-16">
            <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-400"
                style={{ width: `${Math.max(6, progressPct)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Жижиг/дунд дэлгэц — энгийн босоо жагсаалт, scroll-trap байхгүй */}
      <div className="container-px mt-12 grid gap-12 sm:grid-cols-2 lg:hidden">
        {milestones.map((m, i) => <Block key={i} m={m} index={i} />)}
      </div>
    </section>
  );
}
