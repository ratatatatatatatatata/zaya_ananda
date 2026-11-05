"use client";

import Link from "next/link";
import { Fragment } from "react";
import { useI18n } from "@/lib/i18n";
import type { HeroMedia } from "@/lib/hero-video";
import { FadingVideo } from "./FadingVideo";
import { HeroMotes } from "@/components/home/HeroMotes";
import { Magnet } from "@/components/motion/Magnet";

/** Мөрийг үгээр нь хувааж, үг бүрийг маскнаас доороос дээш гаргана (CSS animation). */
function RiseLine({ text, start }: { text: string; start: number }) {
  return <span aria-hidden="true">{text.split(/\s+/).filter(Boolean).map((w, i) => (
    <Fragment key={i}>{i > 0 && " "}<span className="zh-word"><span style={{ animationDelay: `${(start + i) * 90 + 200}ms` }}>{w}</span></span></Fragment>
  ))}</span>;
}

/** Нүүр хуудасны hero — desktop дээр текст/зураг хоёр багана, mobile дээр текстийн дараа зураг.
 *  Өнгө нь app/tokens.css доторх `--hero-*` токеноор, загвар нь app/home-hero.css-д. */
export function CinematicLanding({ media }: { media?: HeroMedia }) {
  const { t, tl } = useI18n();
  return (
    <section className="zh-hero" aria-labelledby="discovery-home-heading">
      <div className="zh-hero-inner">
        <div className="zh-hero-copy">
          <p className="zh-hero-kicker">ZAYA’S ANANDA CENTER</p>
          <h1 id="discovery-home-heading" className="zh-hero-title" aria-label={`${t("home.heroTitleLine1")} ${t("home.heroTitleLine2")}`}>
            <RiseLine text={t("home.heroTitleLine1")} start={0} />
            <RiseLine text={t("home.heroTitleLine2")} start={t("home.heroTitleLine1").split(/\s+/).length} />
          </h1>
          <p className="zh-hero-lead">{t("home.heroDescription")}</p>
          <div className="zh-hero-actions">
            <Magnet><Link href="/courses" className="zh-hero-cta zh-hero-cta--primary">{t("home.heroStart")}</Link></Magnet>
            <Link href="/ayalal" className="zh-hero-cta zh-hero-cta--ghost">
              {t("home.heroJourney")}
              <svg aria-hidden="true" viewBox="0 0 20 20" width="16" height="16"><path d="M4 10h11m-4-4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          </div>
        </div>
        <figure className="zh-hero-visual">
          <FadingVideo
            src={media?.kind === "video" ? media.url : "/video/meditation.mp4"}
            poster="/video/meditation.jpg"
            image={media?.kind === "image" ? media.url : undefined}
            hero
            showToggle={false}
          />
          <HeroMotes />
          <figcaption className="zh-hero-caption">{tl("Өөртэйгөө ойртох нэг алхам.")}</figcaption>
        </figure>
      </div>
    </section>
  );
}
