import type { ReactNode } from "react";
import Link from "next/link";
import { T } from "./T";
import { MeditationFigure } from "./MeditationFigure";
import { Atmosphere } from "./motion/Atmosphere";

/** Хуудасны толгой — кино маягийн, амьсгалдаг уур амьсгалтай.
 *  Гэрлийн тоос, ариун геометрийн цагираг, гэрлийн урсгал, зөөлөн орох хөдөлгөөн. */
export function PageHeader({ title, desc, crumb }: { title: ReactNode; desc?: ReactNode; crumb?: ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden bg-[#131D3B]">
      {/* Аура туяанууд — ногоон, ягаан, цэнхэр */}
      <div
        aria-hidden
        className="anim-breathe pointer-events-none absolute -top-32 left-1/3 h-[440px] w-[700px] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(43,200,187,0.42), rgba(43,200,187,0) 70%)", filter: "blur(12px)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 right-0 h-[360px] w-[480px] rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(155,110,240,0.30), rgba(155,110,240,0) 70%)", filter: "blur(14px)", animation: "zaBreathe 9s ease-in-out 1.5s infinite" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(160deg, rgba(17,27,54,0) 30%, rgba(16,54,65,0.45) 70%, rgba(36,30,78,0.4) 100%)" }}
      />

      {/* Гэрлийн тоос */}
      <Atmosphere className="pointer-events-none absolute inset-0 h-full w-full" density={0.9} />

      {/* Ариун геометр — аажуу эргэх цагираг */}
      <svg
        aria-hidden
        viewBox="0 0 200 200"
        className="anim-spin-slow pointer-events-none absolute -right-16 -top-16 hidden h-72 w-72 opacity-[0.13] md:block"
        fill="none"
        stroke="#7CDCD2"
        strokeWidth="0.6"
      >
        <circle cx="100" cy="100" r="96" />
        <circle cx="100" cy="100" r="72" />
        <circle cx="100" cy="60" r="40" />
        <circle cx="100" cy="140" r="40" />
        <circle cx="65" cy="80" r="40" />
        <circle cx="135" cy="80" r="40" />
        <circle cx="65" cy="120" r="40" />
        <circle cx="135" cy="120" r="40" />
      </svg>

      <MeditationFigure tone="jade" showAura={false} className="anim-float pointer-events-none absolute -right-2 bottom-0 hidden w-44 opacity-25 lg:block" />

      <div className="relative z-10 container-px py-16 sm:py-20">
        <nav className="animate-fade-rise mb-4 flex items-center gap-2 text-sm text-white/55">
          <Link href="/" className="transition hover:text-white"><T k="nav.home" /></Link>
          <span>/</span>
          <span className="font-medium text-white/90">{crumb ?? title}</span>
        </nav>
        <div className="relative max-w-3xl overflow-hidden">
          <h1 className="animate-fade-rise-delay text-balance text-4xl font-semibold text-white sm:text-5xl">{title}</h1>
          {/* Гэрлийн урсгал — гарчгийн дээгүүр нэг удаа зөөлөн урсана */}
          <div
            aria-hidden
            className="ph-sweep pointer-events-none absolute inset-y-0 w-1/3"
            style={{ background: "linear-gradient(100deg, transparent, rgba(240,247,245,0.10), transparent)" }}
          />
        </div>
        {desc && <p className="animate-fade-rise-delay-2 mt-4 max-w-2xl text-lg leading-relaxed text-white/70">{desc}</p>}
      </div>

      {/* Доод зөөлөн шилжилт — дараагийн хэсэг рүү уусна */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16" style={{ background: "linear-gradient(to bottom, rgba(17,27,54,0), rgba(17,27,54,0.75))" }} />
    </section>
  );
}
