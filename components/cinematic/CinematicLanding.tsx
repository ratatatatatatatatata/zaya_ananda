"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LazyMotion, domAnimation, m, useReducedMotion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import type { HeroMedia } from "@/lib/hero-video";
import { cinematicPaths, discoveryLinks } from "@/data/cinematic";
import { FadingVideo } from "./FadingVideo";

export function ArrowUpRight() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m7 17 10-10M7 7h10v10"/></svg>;
}
function ScrollStory() {
  const { t, lang } = useI18n();
  const english = lang !== "mn";
  const reduced = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  useEffect(() => {
    const desktop = matchMedia("(min-width: 1024px) and (min-height: 650px) and (pointer: fine)");
    const update = () => setEnhanced(desktop.matches && !reduced);
    update(); desktop.addEventListener("change", update);
    return () => desktop.removeEventListener("change", update);
  }, [reduced]);
  useMotionValueEvent(scrollYProgress, "change", value => {
    if (enhanced) setActive(Math.min(cinematicPaths.length - 1, Math.floor(value * cinematicPaths.length)));
  });
  function select(index: number) {
    if (!section.current) return;
    setActive(index);
    const distance = section.current.offsetHeight - window.innerHeight;
    const start = section.current.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: start + distance * (index + .2) / cinematicPaths.length, behavior: "smooth" });
  }
  return <section ref={section} id="capabilities" className="discovery-story" data-pinned={enhanced || undefined} aria-labelledby="discovery-title">
    <div className="discovery-stage">
      <div className="discovery-heading"><div><p className="discovery-kicker">{english ? "A PATH THAT FEELS LIKE YOU" : "ӨӨРТӨӨ ЗОРИУЛАХ ЦАГ"}</p><h2 id="discovery-title">{english ? "Your journey. Your rhythm." : "Таны аялал. Таны хэмнэл."}</h2></div><span className="discovery-count" aria-hidden="true">0{active + 1} / 03</span></div>
      {enhanced && <div className="discovery-tabs" role="group" aria-label={english ? "Explore experiences" : "Танилцуулга сонгох"}>{cinematicPaths.map((item,i)=><button key={item.href} type="button" aria-pressed={active === i} onClick={()=>select(i)}><span>0{i + 1}</span>{t(item.titleKey)}</button>)}</div>}
      <div className="discovery-panels">{cinematicPaths.map((item,i)=><article key={item.href} className="discovery-panel" hidden={enhanced && active !== i}>
        <div className="discovery-photo"><img src={item.image} alt="" loading="lazy"/><span className="discovery-photo-label">ZAYA’S ANANDA / 0{i + 1}</span></div>
        <div className="discovery-copy"><span className="discovery-step">0{i + 1}</span><p className="discovery-kicker">{english ? item.captionEn : item.caption}</p><h3>{t(item.titleKey)}</h3><p>{english ? item.en : item.description}</p><div className="discovery-tags">{(english ? item.tagsEn : item.tags).map(tag=><span key={tag}>{tag}</span>)}</div><Link href={item.href} className="discovery-link">{english ? "Explore" : "Дэлгэрэнгүй үзэх"}<ArrowUpRight/></Link></div>
      </article>)}</div>
      {enhanced && <div className="discovery-progress" aria-hidden="true"><m.div style={{ scaleX: scrollYProgress }}/></div>}
    </div>
  </section>;
}
export function CinematicLanding({ media }: { media?: HeroMedia }) {
  const { t, lang } = useI18n();
  const english = lang !== "mn";
  const reduced = useReducedMotion();
  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0,.8], [1,.94]);
  const radius = useTransform(scrollYProgress, [0,.6], [0,40]);
  const entrance = { initial: false as const, whileInView: reduced ? undefined : { opacity: [0,1], y: [30,0] }, viewport: { once: true, amount: .2 }, transition: { duration: .8, ease: "easeOut" as const } };
  return <LazyMotion features={domAnimation}>
    <section ref={hero} className="discovery-hero" aria-labelledby="discovery-home-heading">
      <m.div className="discovery-hero-frame" style={reduced ? undefined : { scale, borderRadius: radius }}>
        <FadingVideo src={media?.kind === "video" ? media.url : "/video/meditation.mp4"} poster="/video/meditation.jpg" image={media?.kind === "image" ? media.url : undefined} hero/>
        <div className="discovery-hero-wash" aria-hidden="true"/>
        <div className="discovery-hero-copy"><m.p className="discovery-kicker" {...entrance}>ZAYA’S ANANDA CENTER</m.p>
          <h1 id="discovery-home-heading">{[t("home.heroTitleLine1"),t("home.heroTitleLine2")].map((line,i)=><m.span key={i} {...entrance} transition={{ duration: .9, delay: i*.15 }}>{line}</m.span>)}</h1>
          <m.p className="discovery-intro" {...entrance}>{t("home.heroDescription")}</m.p>
          <m.div className="discovery-actions" {...entrance}><Link href="/services" className="btn btn-primary">{english ? "Explore services" : "Засал сонгох"}<ArrowUpRight/></Link><a href="#discover">{english ? "Discover more" : "Танилцах"}<span aria-hidden="true">↓</span></a></m.div>
        </div>
        <div className="discovery-hero-foot"><span>{english ? "A little closer to yourself." : "Өөртэйгөө ойртох нэг алхам."}</span><a href="#discover" aria-label={english ? "Scroll to explore" : "Доош гүйлгэж танилцах"}>↓</a><span>INNER BALANCE</span></div>
      </m.div>
    </section>
    <nav className="discovery-quicknav" aria-label={english ? "Page sections" : "Нүүр хуудасны хэсгүүд"}>{discoveryLinks.map(item=><a key={item.target} href={item.target}>{t(item.titleKey)}</a>)}</nav>
    <section id="discover" className="discovery-overview" aria-labelledby="discovery-overview-heading">
      <m.div className="discovery-overview-title" {...entrance}><p className="discovery-kicker">{english ? "DISCOVER YOUR OWN PATH" : "ӨӨРИЙН ЗАМАА НЭЭГЭЭРЭЙ"}</p><h2 id="discovery-overview-heading">{english ? <>A quieter mind.<br/><span>A brighter everyday.</span></> : <>Дотоод амар амгалан.<br/><span>Илүү гэрэлтэй өдөр бүр.</span></>}</h2><p>{english ? "Learning, meaningful journeys and time for yourself. Begin wherever feels right." : "Суралцах, аялах, өөртөө цаг гаргах. Өөрийн хэмнэлээр, өөрт тохирох алхмаас эхлээрэй."}</p></m.div>
      <div className="discovery-grid">{discoveryLinks.map((item,i)=><m.a key={item.target} href={item.target} className={`discovery-card discovery-card-${i}`} {...entrance}><img src={item.image} alt="" loading="lazy"/><div><span>0{i+1}</span><h3>{t(item.titleKey)}</h3><p>{english ? item.en : item.description}</p></div><span className="discovery-card-arrow"><ArrowUpRight/></span></m.a>)}</div>
    </section>
    <ScrollStory/>
    <div className="discovery-catalog"><p className="discovery-kicker">{english ? "EXPLORE ZAYA’S ANANDA" : "ZAYA’S ANANDA-ТАЙ ХАМТ"}</p><h2>{english ? "Find what speaks to you." : "Өөрт тохирохоо олоорой."}</h2><a href="#services">{english ? "Browse services" : "Үйлчилгээнүүд үзэх"} ↓</a></div>
  </LazyMotion>;
}
