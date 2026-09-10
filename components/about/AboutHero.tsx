"use client";

import type { ReactNode } from "react";
import { AboutSphereHero } from "@/components/three/AboutSphereHero";

/** Бага тал руу хазайсан таван өнцөгт дотор цэгэн тор — гүйлгэх товчинд ашиглана. */
function PentagonIcon() {
  return (
    <svg viewBox="0 0 56 56" className="h-full w-full" fill="none" aria-hidden>
      <path d="M28 4 L52 21.5 L43 50 L13 50 L4 21.5 Z" stroke="currentColor" strokeWidth="1.2" />
      <g fill="currentColor" opacity={0.85}>
        {[21, 28, 35].flatMap((cx) => [22, 29, 36].map((cy) => (
          <circle key={cx + "-" + cy} cx={cx} cy={cy} r="1.1" />
        )))}
      </g>
      <path d="M28 33 L28 41 M23 36.5 L28 41 L33 36.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Бидний тухай — бараг бүтэн дэлгэцийн цайвар hero. Зүүн тал: гарчиг + танилцуулга.
 *  Баруун тал: R3F бөмбөлгийн бүлэг (AboutSphereHero, lazy). Зүүн доод буланд гүйлгэх товч. */
export function AboutHero({
  eyebrow, title, intro, scrollTargetId = "our-story",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  scrollTargetId?: string;
}) {
  const scrollDown = () => {
    const el = document.getElementById(scrollTargetId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollBy({ top: window.innerHeight * 0.9, behavior: "smooth" });
  };

  return (
    <section className="relative isolate overflow-hidden" style={{ minHeight: "92vh" }}>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-aurora" style={{ backgroundSize: "160% 160%" }} />
      <div className="container-px relative grid min-h-[92vh] items-center gap-10 py-24 lg:grid-cols-2 lg:gap-6">
        <div className="max-w-xl">
          {eyebrow && <p className="eyebrow-line">{eyebrow}</p>}
          <h1 className="mt-4 text-balance font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-[4.5rem]">
            {title}
          </h1>
          {intro && <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">{intro}</p>}
        </div>
        <div className="relative h-[24rem] w-full sm:h-[30rem] lg:h-[36rem]">
          <AboutSphereHero />
        </div>
      </div>
      <button
        type="button"
        onClick={scrollDown}
        aria-label="Доош гүйлгэх"
        className="focus-ring absolute bottom-8 left-6 z-10 grid h-14 w-14 place-items-center text-ink/60 transition hover:text-primary-700 sm:left-10"
      >
        <PentagonIcon />
      </button>
    </section>
  );
}
