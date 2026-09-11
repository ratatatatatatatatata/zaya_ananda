"use client";

import Link from "next/link";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import type { HeroMedia } from "@/lib/hero-video";
import { cinematicMedia, cinematicPaths } from "@/data/cinematic";
import { FadingVideo } from "./FadingVideo";

export function ArrowUpRight() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m7 17 10-10M7 7h10v10" /></svg>;
}
function PathIcon({ kind }: { kind: string }) {
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">{kind === "learn" ? <><path d="m4 11 12-6 12 6-12 6Zm5 3v9q7 6 14 0v-9M28 11v12" /></> : kind === "orbit" ? <><circle cx="16" cy="16" r="4"/><ellipse cx="16" cy="16" rx="14" ry="7" transform="rotate(-45 16 16)"/><ellipse cx="16" cy="16" rx="14" ry="7" transform="rotate(45 16 16)"/></> : <><circle cx="16" cy="16" r="12"/><path d="m21 11-3 7-7 3 3-7Z"/></>}</svg>;
}
function BlurHeading({ text }: { text: string }) {
  const reduced = useReducedMotion();
  return <h1 id="cinema-home-heading" className="cinema-title" aria-label={text}>{text.split(/\s+/).map((word, i) => <m.span key={`${word}-${i}`} aria-hidden="true" initial={false} whileInView={reduced ? undefined : { filter: ["blur(10px)", "blur(5px)", "blur(0px)"], opacity: [0, .5, 1], y: [30, -5, 0] }} viewport={{ once: true, amount: .1 }} transition={{ duration: .7, times: [0, .5, 1], delay: i * .1, ease: "easeOut" }}>{word}</m.span>)}</h1>;
}

export function CinematicLanding({ media }: { media?: HeroMedia }) {
  const { t, lang } = useI18n();
  const reduced = useReducedMotion();
  const english = lang !== "mn";
  const entrance = (delay: number) => ({ initial: false as const, whileInView: reduced ? undefined : { opacity: [0, 1], filter: ["blur(10px)", "blur(0px)"], y: [20, 0] }, viewport: { once: true }, transition: { duration: .7, delay, ease: "easeOut" as const } });
  return <LazyMotion features={domAnimation}>
    <section className="cinema-hero" aria-labelledby="cinema-home-heading">
      <FadingVideo {...cinematicMedia.hero} src={media?.kind === "video" ? media.url : cinematicMedia.hero.src} image={media?.kind === "image" ? media.url : undefined} hero />
      <div className="cinema-hero-content">
        <m.a href="/gift" className="cinema-badge liquid-glass" {...entrance(.2)}><span>{english ? "Explore" : "Нээлттэй"}</span>{english ? "A gift for your inner journey" : "Өөрийгөө таних аяллын эхний алхам"}<ArrowUpRight /></m.a>
        <BlurHeading text={`${t("home.heroTitleLine1")} ${t("home.heroTitleLine2")}`} />
        <m.p className="cinema-description" {...entrance(.5)}>{t("home.heroDescription")}</m.p>
        <m.div className="cinema-ctas" {...entrance(.7)}><Link href="/services" className="liquid-glass liquid-glass-strong cinema-primary">{english ? "Explore services" : "Засал сонгох"}<ArrowUpRight /></Link><Link href="/courses" className="cinema-secondary"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m7 4 14 8L7 20Z"/></svg>{t("home.heroStart")}</Link></m.div>
        <m.div className="cinema-highlights" {...entrance(.9)}>
          <Link href="/courses" className="liquid-glass"><PathIcon kind="learn"/><strong>04</strong><span>{english ? "Levels of learning" : "Суралцах дөрвөн түвшин"}<ArrowUpRight /></span></Link>
          <Link href="/gift" className="liquid-glass"><PathIcon kind="orbit"/><strong>{english ? "Free" : "Үнэгүй"}</strong><span>{english ? "Free lessons to begin" : "Үнэгүй хичээлээр эхлээрэй"}<ArrowUpRight /></span></Link>
        </m.div>
      </div>
      <m.div className="cinema-explore" {...entrance(1)}><span className="liquid-glass">{english ? "Discover your own path" : "Өөрийн замаа нээгээрэй"}</span><div>{[["/courses","nav.courses"],["/ayalal","nav.journey"],["/shop","nav.shop"],["/gift","nav.gift"]].map(([href,key])=><Link key={href} href={href}>{t(key)}</Link>)}</div><a href="#capabilities" className="cinema-scroll" aria-label="Дараагийн хэсэг">↓</a></m.div>
    </section>

    <section id="capabilities" className="cinema-capabilities" aria-labelledby="capability-title">
      <FadingVideo {...cinematicMedia.capabilities} />
      <div className="cinema-capability-content">
        <m.div {...entrance(0)}><p className="cinema-kicker">// {english ? "Your possibilities" : "Таны боломжууд"}</p><h2 id="capability-title">{english ? "Your journey." : "Таны аялал."}<br/>{english ? "Your rhythm." : "Таны хэмнэл."}</h2></m.div>
        <div className="cinema-path-grid">{cinematicPaths.map((path,i)=><m.article key={path.href} className="liquid-glass cinema-path" {...entrance(i * .12)}><div className="cinema-path-top"><div className="liquid-glass cinema-path-icon"><PathIcon kind={path.icon}/></div><div className="cinema-tags">{(english ? ["Explore", "Discover", "Connect"] : path.tags).map(tag=><span className="liquid-glass" key={tag}>{tag}</span>)}</div></div><div className="cinema-path-bottom"><h3><Link href={path.href}>{t(path.titleKey)}<ArrowUpRight/></Link></h3><p>{english ? path.en : path.description}</p></div></m.article>)}</div>
      </div>
    </section>
    <div className="cinema-catalog-heading"><span>// {english ? "Explore Zaya’s Ananda" : "Zaya’s Ananda-тай хамт"}</span><h2>{english ? "Find what speaks to you." : "Өөрт тохирохоо олоорой."}</h2><a href="#services">{english ? "Browse services" : "Үйлчилгээнүүд үзэх"} ↓</a></div>
  </LazyMotion>;
}
