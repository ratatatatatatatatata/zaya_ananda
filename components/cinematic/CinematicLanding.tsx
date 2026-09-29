"use client";

import Link from "next/link";
import { useRef } from "react";
import { LazyMotion, domAnimation, m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import type { HeroMedia } from "@/lib/hero-video";
import { FadingVideo } from "./FadingVideo";
import type { Locale } from "@/lib/types";

const statLabels: Record<Locale, string>[] = [
  { mn: "Ажилласан жил", en: "Years of experience", ko: "활동 연수", ja: "活動年数", zh: "从业年数" },
  { mn: "Манай хамт олон", en: "Our team", ko: "우리 팀", ja: "私たちのチーム", zh: "我们的团队" },
  { mn: "Манайхтай нэгдсэн хүмүүс", en: "People we've welcomed", ko: "함께한 사람들", ja: "共に歩んだ方々", zh: "与我们同行的人" },
];

export function ArrowUpRight() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m7 17 10-10M7 7h10v10"/></svg>;
}

export function CinematicLanding({ media, stats }: { media?: HeroMedia; stats: string[] }) {
  const { t, tl, lang } = useI18n();
  const reduced = useReducedMotion();
  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0,1], [0,95]);
  const titleY = useTransform(scrollYProgress, [0,.8], [0,-38]);
  return <LazyMotion features={domAnimation}>
    <section ref={hero} className="discovery-hero" aria-labelledby="discovery-home-heading">
      <div className="discovery-hero-frame">
        <m.div className="discovery-hero-copy" style={reduced ? undefined : { y: titleY }}><p className="discovery-kicker">ZAYA’S ANANDA CENTER</p><h1 id="discovery-home-heading">{[t("home.heroTitleLine1"),t("home.heroTitleLine2")].map((line,i) => <span key={i}>{line}</span>)}</h1><div className="discovery-hero-summary"><p className="discovery-intro">{t("home.heroDescription")}</p><div className="discovery-actions"><Link href="#gift" className="btn btn-primary">{t("nav.gift")}<ArrowUpRight/></Link><Link href="#zurhai">{t("nav.merge")}<span aria-hidden="true">↗</span></Link></div></div>
          <div className="discovery-hero-stats" aria-label={tl("Манай төвийн тухай тоон мэдээлэл")}>
            {statLabels.map((label, i) => <div key={i} className="discovery-hero-stat"><strong>{stats[i]}</strong><span>{label[lang]}</span></div>)}
          </div>
        </m.div>
        <m.div className="discovery-hero-visual"><m.div className="discovery-hero-parallax" style={reduced ? undefined : { y: imageY }}><FadingVideo src={media?.kind === "video" ? media.url : "/video/meditation.mp4"} poster="/video/meditation.jpg" image={media?.kind === "image" ? media.url : undefined} hero/></m.div><div className="discovery-hero-wash" aria-hidden="true"/><div className="discovery-hero-foot"><span>{tl("Өөртэйгөө ойртох нэг алхам.")}</span><a href="#gift" aria-label={tl("Доош гүйлгэж танилцах")}>↓</a><span>INNER BALANCE</span></div></m.div>
      </div>
    </section>
  </LazyMotion>;
}
