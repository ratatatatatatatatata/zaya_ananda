"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import type { HeroMedia } from "@/lib/hero-video";
import { FadingVideo } from "./FadingVideo";

/** Нүүр хуудасны hero — desktop дээр текст/зураг хоёр багана, mobile дээр текстийн дараа зураг.
 *  Өнгө нь app/tokens.css доторх `--hero-*` токеноор, загвар нь app/home-hero.css-д. */
export function CinematicLanding({ media }: { media?: HeroMedia }) {
  const { t, tl } = useI18n();
  return (
    <section className="zh-hero" aria-labelledby="discovery-home-heading">
      <div className="zh-hero-inner">
        <div className="zh-hero-copy">
          <p className="zh-hero-kicker">ZAYA’S ANANDA CENTER</p>
          <h1 id="discovery-home-heading" className="zh-hero-title">
            <span>{t("home.heroTitleLine1")}</span>
            <span>{t("home.heroTitleLine2")}</span>
          </h1>
          <p className="zh-hero-lead">{t("home.heroDescription")}</p>
          <div className="zh-hero-actions">
            <Link href="/courses" className="zh-hero-cta zh-hero-cta--primary">{t("home.heroStart")}</Link>
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
          <figcaption className="zh-hero-caption">{tl("Өөртэйгөө ойртох нэг алхам.")}</figcaption>
        </figure>
      </div>
    </section>
  );
}
