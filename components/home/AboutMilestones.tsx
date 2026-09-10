"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Milestone = { year: string; text: ReactNode };

const STEP = 108; // жилийн мөр бүрийн өндөр (px)

/** Он жилийн шилжилт — гүйлгэхэд "наалдаж" зогсоод, том оны тоонууд аажим шилжиж, баруун
 *  талын текст оноор солигддог interaction (лавлагаа: PROSION About Us). Сэдэлт багасгах
 *  тохиргоотой үед (prefers-reduced-motion) энгийн, эхний оноор л зогсонги харагдана.
 *  Тайлбар: энэ бол client компонент бөгөөд эцэг нь (about/page.tsx, HomeAbout.tsx) async server
 *  компонент тул localeText функцийг өөрийг нь prop-оор дамжуулж болохгүй (server→client хилээр
 *  зөвхөн сериализацлагдах утга/JSX дамжина, функц дамжихгүй — "Application error" гарах шалтгаан
 *  яг энэ байсан). Тиймээс text талбарыг server талд аль хэдийн resolve хийж, ReactNode болгож
 *  дамжуулдаг. */
export function AboutMilestones({ milestones }: { milestones: Milestone[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (milestones.length === 0) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = wrapRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const scrolled = -rect.top;
        const p = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0;
        setProgress(p * (milestones.length - 1));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [milestones.length]);

  if (milestones.length === 0) return null;
  const activeIndex = Math.min(milestones.length - 1, Math.round(progress));

  return (
    <div ref={wrapRef} className="relative" style={{ height: `${Math.max(1, milestones.length - 1) * 60 + 70}vh` }}>
      <div className="sticky top-20 flex min-h-[62vh] items-center overflow-hidden">
        <div className="container-px grid w-full items-center gap-8 lg:grid-cols-[1fr_2px_1.2fr] lg:gap-14">
          {/* Оны багана — гүйлгэхэд аажим шилжинэ */}
          <div className="relative h-[7.5rem] overflow-hidden sm:h-[9rem]">
            <div
              className="absolute inset-x-0 transition-transform duration-100 ease-out"
              style={{ transform: `translateY(calc(50% - ${(progress + 0.5) * STEP}px))` }}
            >
              {milestones.map((m, i) => (
                <p
                  key={i}
                  style={{ height: STEP }}
                  className={
                    "font-display font-semibold leading-none transition-colors duration-300 " +
                    (i === activeIndex ? "text-6xl text-ink sm:text-7xl" : "text-6xl text-ink/15 sm:text-7xl")
                  }
                >
                  {m.year}
                </p>
              ))}
            </div>
          </div>

          {/* Дундах явцын зурвас */}
          <div className="relative hidden h-40 w-[2px] overflow-hidden rounded-full bg-line lg:block">
            <div
              className="absolute inset-x-0 bottom-0 w-full rounded-full bg-gradient-to-t from-primary-600 to-accent-400 transition-[height] duration-200"
              style={{ height: `${((activeIndex + 1) / milestones.length) * 100}%` }}
            />
          </div>

          {/* Баруун талын тайлбар текст — он солигдох бүрд шинэчлэгдэнэ */}
          <div key={activeIndex} className="animate-fade-rise">
            <p className="eyebrow-line">Манай түүх</p>
            <p className="mt-4 text-lg leading-relaxed text-muted">{milestones[activeIndex]?.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
