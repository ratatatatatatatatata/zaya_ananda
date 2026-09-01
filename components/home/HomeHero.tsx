"use client";

import { VideoHero } from "@/components/video/VideoHero";
import { useI18n } from "@/lib/i18n";

export function HomeHero({ media }: { media?: { kind: "video" | "image"; url: string } }) {
  const { t } = useI18n();

  return (
    <VideoHero
      clip="meditation"
      media={media}
      eyebrow="Zaya's Ananda"
      title={
        <>
          {t("home.heroTitleLine1")}
          <br className="hidden sm:block" /> {t("home.heroTitleLine2")}
        </>
      }
      desc={t("home.heroDescription")}
      cta={[
        { href: "/services", label: "Засал сонгох" },
        { href: "/courses", label: "Сургалт үзэх", variant: "gold" },
      ]}
    />
  );
}
