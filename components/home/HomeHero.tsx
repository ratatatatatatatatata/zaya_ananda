"use client";

import { VideoHero } from "@/components/video/VideoHero";
import { useI18n } from "@/lib/i18n";

export function HomeHero() {
  const { t } = useI18n();

  return (
    <VideoHero
      clip="meditation"
      eyebrow="Zaya's Ananda"
      title={
        <>
          {t("home.heroTitleLine1")}
          <br className="hidden sm:block" /> {t("home.heroTitleLine2")}
        </>
      }
      desc={t("home.heroDescription")}
      cta={[
        { href: "/courses", label: t("home.heroStart") },
        { href: "/ayalal", label: t("home.heroJourney") },
        { href: "/merge", label: `🔮 ${t("home.heroOracle")}`, variant: "gold" as const },
      ]}
    />
  );
}
