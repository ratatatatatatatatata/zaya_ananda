"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { locText, type CmsI18n } from "@/lib/cms-i18n";

export type MarqueeItem = { id: string; title: string; image: string; i18n?: CmsI18n };

/** Сайтын өөрийн үйлчилгээ/сургалт/бүтээгдэхүүний зургууд — хоёр мөр, scroll-оор эсрэг чиглэлд гулсана. */
export function HomeMarquee({ items }: { items: MarqueeItem[] }) {
  const { t, lang } = useI18n();
  const section = useRef<HTMLElement>(null);
  const rows = useRef<(HTMLDivElement | null)[]>([]);
  const half = Math.ceil(items.length / 2);
  const sets = [items.slice(0, half), items.slice(half).length ? items.slice(half) : items.slice(0, half)];

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const s = section.current;
      if (!s) return;
      const r = s.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) return;
      const offset = (innerHeight - r.top) * .3;
      rows.current.forEach((row, i) => {
        if (!row) return;
        const setW = row.scrollWidth / 3;
        if (!setW) return;
        const m = ((offset % setW) + setW) % setW;
        row.style.transform = `translate3d(${i === 0 ? m - setW : -m}px, 0, 0)`;
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => { cancelAnimationFrame(raf); removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); };
  }, [items.length]);

  return (
    <section ref={section} className="zh-marquee" aria-labelledby="zh-marquee-title">
      <div className="zh-marquee-head">
        <p className="zh-hero-kicker">{t("home.marqueeEyebrow")}</p>
        <h2 id="zh-marquee-title" className="zh-marquee-title">{t("home.marqueeTitle")}</h2>
      </div>
      {sets.map((set, ri) => (
        <div key={ri} className="zh-marquee-viewport">
          <div ref={el => { rows.current[ri] = el; }} className="zh-marquee-row">
            {[0, 1, 2].flatMap(copy => set.map(item => {
              const title = locText(lang, item.title, item.i18n, "title");
              return (
                <Link key={`${copy}-${item.id}`} href={`/item/${item.id}`} className="zh-marquee-tile"
                  tabIndex={copy === 1 ? 0 : -1} aria-hidden={copy === 1 ? undefined : true}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt="" loading="lazy" decoding="async" />
                  <span>{title}</span>
                </Link>
              );
            }))}
          </div>
        </div>
      ))}
    </section>
  );
}
