"use client";

import { useRef } from "react";
import { LazyMotion, domAnimation, m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import type { HeroMedia } from "@/lib/hero-video";
import { FadingVideo } from "./FadingVideo";

export function CinematicLanding({ media }: { media?: HeroMedia }) {
  const { t, tl } = useI18n();
  const reduced = useReducedMotion();
  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0,1], [0,95]);
  const titleY = useTransform(scrollYProgress, [0,.8], [0,-38]);
  return <LazyMotion features={domAnimation}>
    <section ref={hero} id="top" className="discovery-hero" aria-labelledby="discovery-home-heading">
      <div className="discovery-hero-frame">
        <m.div className="discovery-hero-copy" style={reduced ? undefined : { y: titleY }}><p className="discovery-kicker">ZAYA’S ANANDA CENTER</p><h1 id="discovery-home-heading">{[t("home.heroTitleLine1"),t("home.heroTitleLine2")].map((line,i) => <span key={i}>{line}</span>)}</h1><div className="discovery-hero-summary"><p className="discovery-intro">{t("home.heroDescription")}</p></div>
          <div className="editorial-hero-actions"><a href="#services" className="btn btn-primary">{t("nav.services")}</a><a href="#gift" className="btn btn-outline">{t("nav.gift")}</a></div>
          <div className="editorial-hero-paths"><a href="#courses"><span>01</span>{t("nav.courses")}</a><a href="#ayalal"><span>02</span>{t("nav.journey")}</a><a href="#about"><span>03</span>{t("nav.about")}</a></div>
        </m.div>
        <m.div className="discovery-hero-visual"><m.div className="discovery-hero-parallax" style={reduced ? undefined : { y: imageY }}><FadingVideo src={media?.kind === "video" ? media.url : "/video/meditation.mp4"} poster="/backgrounds/meditation-dawn.webp" image={media?.kind === "image" ? media.url : media ? undefined : "/backgrounds/meditation-dawn.webp"} hero showToggle={false}/></m.div><div className="discovery-hero-wash" aria-hidden="true"/><div className="discovery-hero-foot"><span>{tl("Өөртэйгөө ойртох нэг алхам.")}</span><span>INNER BALANCE</span></div></m.div>
      </div>
    </section>
  </LazyMotion>;
}
