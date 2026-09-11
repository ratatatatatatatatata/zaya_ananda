"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { LazyMotion, domAnimation, m, useReducedMotion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import type { HeroMedia } from "@/lib/hero-video";
import { cinematicPaths, discoveryLinks } from "@/data/cinematic";
import { FadingVideo } from "./FadingVideo";

export function ArrowUpRight() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m7 17 10-10M7 7h10v10"/></svg>;
}

/** One timeline drives the image and copy, including reverse scrolling. */
function StoryPanel({ index, progress, enhanced, active }: { index: number; progress: MotionValue<number>; enhanced: boolean; active: number }) {
  const { t, lang } = useI18n();
  const item = cinematicPaths[index];
  const start = index / cinematicPaths.length;
  const end = (index + 1) / cinematicPaths.length;
  const opacity = useTransform(progress, [start - .055, start + .055, end - .055, end + .055], [index === 0 ? 1 : 0, 1, 1, index === cinematicPaths.length - 1 ? 1 : 0]);
  const y = useTransform(progress, [start - .055, start + .08, end - .055, end + .055], [32, 0, 0, -32]);
  const scale = useTransform(progress, [start, end], [1.08, 1]);
  const isActive = !enhanced || active === index;
  return <m.article className="discovery-panel" aria-hidden={!isActive} style={enhanced ? { opacity, pointerEvents: isActive ? "auto" : "none", zIndex: isActive ? 2 : 1 } : undefined}>
    <div className="discovery-photo"><m.div className="discovery-photo-inner" style={enhanced ? { scale } : undefined}><Image src={item.image} alt="" fill sizes="(max-width: 767px) 100vw, 65vw" /></m.div><span className="discovery-photo-label">ZAYA’S ANANDA · 0{index + 1}</span></div>
    <m.div className="discovery-copy" style={enhanced ? { y } : undefined}>
      <p className="discovery-kicker"><span>0{index + 1}</span> {lang === "mn" ? item.caption : item.captionEn}</p>
      <h3>{t(item.titleKey)}</h3><p>{lang === "mn" ? item.description : item.en}</p>
      <div className="discovery-tags">{(lang === "mn" ? item.tags : item.tagsEn).map(tag => <span key={tag}>{tag}</span>)}</div>
      <Link href={item.href} tabIndex={isActive ? undefined : -1} className="discovery-link">{lang === "mn" ? "Дэлгэрэнгүй үзэх" : "Explore"}<ArrowUpRight/></Link>
    </m.div>
  </m.article>;
}

function ScrollStory() {
  const { t, lang } = useI18n();
  const reduced = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  useEffect(() => {
    const desktop = matchMedia("(min-width: 1024px) and (min-height: 720px) and (pointer: fine)");
    const update = () => setEnhanced(desktop.matches && !reduced);
    update(); desktop.addEventListener("change", update);
    return () => desktop.removeEventListener("change", update);
  }, [reduced]);
  useMotionValueEvent(scrollYProgress, "change", value => {
    if (enhanced) setActive(Math.min(cinematicPaths.length - 1, Math.floor(value * cinematicPaths.length)));
  });
  function select(index: number) {
    if (!section.current) return;
    const distance = section.current.offsetHeight - window.innerHeight;
    const start = section.current.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: start + distance * (index + .35) / cinematicPaths.length, behavior: reduced ? "instant" : "smooth" });
  }
  return <section ref={section} id="capabilities" className="discovery-story" data-pinned={enhanced || undefined} aria-labelledby="discovery-title">
    <div className="discovery-stage">
      <div className="discovery-heading"><div><p className="discovery-kicker">{lang === "mn" ? "ӨӨРТӨӨ ЗОРИУЛАХ ЦАГ" : "TIME FOR YOURSELF"}</p><h2 id="discovery-title">{lang === "mn" ? "Таны аялал. Таны хэмнэл." : "Your journey. Your rhythm."}</h2></div><span className="discovery-count" aria-hidden="true">0{active + 1}<span> / 03</span></span></div>
      <div className="discovery-panels">{cinematicPaths.map((item, index) => <StoryPanel key={item.href} index={index} progress={scrollYProgress} enhanced={enhanced} active={active}/>)}</div>
      {enhanced && <div className="discovery-story-controls"><div className="discovery-tabs" role="group" aria-label={lang === "mn" ? "Танилцуулга сонгох" : "Explore experiences"}>{cinematicPaths.map((item, i) => <button key={item.href} type="button" aria-pressed={active === i} onClick={() => select(i)}><span>0{i + 1}</span>{t(item.titleKey)}</button>)}</div><div className="discovery-progress" aria-hidden="true"><m.div style={{ scaleX: scrollYProgress }}/></div></div>}
    </div>
  </section>;
}

function SectionNavigation() {
  const { t, lang } = useI18n();
  const [active, setActive] = useState("");
  useEffect(() => {
    const targets = discoveryLinks.map(item => document.querySelector(item.target));
    let frame = 0;
    function update() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const current = targets.filter((el): el is Element => !!el && el.getBoundingClientRect().top <= 220).sort((a,b) => b.getBoundingClientRect().top - a.getBoundingClientRect().top)[0];
        setActive(current ? `#${current.id}` : "");
      });
    }
    update(); window.addEventListener("scroll", update, { passive: true }); window.addEventListener("resize", update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  return <nav className="discovery-quicknav" aria-label={lang === "mn" ? "Нүүр хуудасны хэсгүүд" : "Page sections"}><span className="discovery-nav-brand">Zaya’s Ananda</span><div>{discoveryLinks.map(item => <a key={item.target} href={item.target} aria-current={active === item.target ? "location" : undefined}>{t(item.titleKey)}</a>)}</div><Link className="discovery-nav-cta" href="/services">{lang === "mn" ? "Цаг захиалах" : "Book a session"}<ArrowUpRight/></Link></nav>;
}

export function CinematicLanding({ media }: { media?: HeroMedia }) {
  const { t, lang } = useI18n();
  const reduced = useReducedMotion();
  const hero = useRef<HTMLElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const { scrollYProgress: introProgress } = useScroll({ target: intro, offset: ["start .9", "end .45"] });
  const inset = useTransform(scrollYProgress, [0,.65], ["inset(0% 3.5% 0% 3.5% round 24px)", "inset(0% 0% 0% 0% round 0px)"]);
  const imageY = useTransform(scrollYProgress, [0,1], [0,95]);
  const titleY = useTransform(scrollYProgress, [0,.8], [0,-38]);
  const highlight = useTransform(introProgress, [0,.8], ["#bac5c0", "#173b33"]);
  const entrance = { initial: false as const, whileInView: reduced ? undefined : { opacity: [0,1], y: [22,0] }, viewport: { once: true, amount: .15 }, transition: { duration: .7, ease: "easeOut" as const } };
  return <LazyMotion features={domAnimation}>
    <section ref={hero} className="discovery-hero" aria-labelledby="discovery-home-heading">
      <div className="discovery-hero-frame">
        <m.div className="discovery-hero-copy" style={reduced ? undefined : { y: titleY }}><p className="discovery-kicker">ZAYA’S ANANDA CENTER</p><h1 id="discovery-home-heading">{[t("home.heroTitleLine1"),t("home.heroTitleLine2")].map((line,i) => <span key={i}>{line}</span>)}</h1><div className="discovery-hero-summary"><p className="discovery-intro">{t("home.heroDescription")}</p><div className="discovery-actions"><Link href="/services" className="btn btn-primary">{lang === "mn" ? "Засал сонгох" : "Explore services"}<ArrowUpRight/></Link><a href="#discover">{lang === "mn" ? "Танилцах" : "Discover"}<span aria-hidden="true">↓</span></a></div></div></m.div>
        <m.div className="discovery-hero-visual" style={reduced ? undefined : { clipPath: inset }}><m.div className="discovery-hero-parallax" style={reduced ? undefined : { y: imageY }}><FadingVideo src={media?.kind === "video" ? media.url : "/video/meditation.mp4"} poster="/video/meditation.jpg" image={media?.kind === "image" ? media.url : undefined} hero/></m.div><div className="discovery-hero-wash" aria-hidden="true"/><div className="discovery-hero-foot"><span>{lang === "mn" ? "Өөртэйгөө ойртох нэг алхам." : "A little closer to yourself."}</span><a href="#discover" aria-label={lang === "mn" ? "Доош гүйлгэж танилцах" : "Scroll to explore"}>↓</a><span>INNER BALANCE</span></div></m.div>
      </div>
    </section>
    <SectionNavigation/>
    <section id="discover" className="discovery-overview" aria-labelledby="discovery-overview-heading">
      <div ref={intro} className="discovery-overview-title"><p className="discovery-kicker">{lang === "mn" ? "ӨӨРИЙН ЗАМАА НЭЭГЭЭРЭЙ" : "DISCOVER YOUR OWN PATH"}</p><h2 id="discovery-overview-heading">{lang === "mn" ? "Дотоод амар амгалан." : "A quieter mind."}<br/><m.span style={reduced ? undefined : { color: highlight }}>{lang === "mn" ? "Илүү гэрэлтэй өдөр бүр." : "A brighter everyday."}</m.span></h2><p>{lang === "mn" ? "Суралцах, аялах, өөртөө цаг гаргах. Өөрийн хэмнэлээр, өөрт тохирох алхмаас эхлээрэй." : "Learning, meaningful journeys and time for yourself. Begin wherever feels right."}</p></div>
      <div className="discovery-grid">{discoveryLinks.map((item,i) => <m.a key={item.target} href={item.target} className={`discovery-card discovery-card-${i}`} {...entrance}><Image src={item.image} alt="" fill sizes="(max-width: 600px) 100vw, (max-width: 1023px) 50vw, 40vw"/><div><span>0{i+1} / ZAYA’S ANANDA</span><h3>{t(item.titleKey)}</h3><p>{lang === "mn" ? item.description : item.en}</p></div><span className="discovery-card-arrow"><ArrowUpRight/></span></m.a>)}</div>
    </section>
    <ScrollStory/>
  </LazyMotion>;
}
