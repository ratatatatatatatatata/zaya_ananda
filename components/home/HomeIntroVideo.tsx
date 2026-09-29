"use client";

import { T } from "@/components/T";
import { useI18n } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

const statLabels: Record<Locale, string>[] = [
  { mn: "Ажилласан жил", en: "Years of experience", ko: "활동 연수", ja: "活動年数", zh: "从业年数" },
  { mn: "Манай хамт олон", en: "Our team", ko: "우리 팀", ja: "私たちのチーム", zh: "我们的团队" },
  { mn: "Манайхтай нэгдсэн хүмүүс", en: "People we've welcomed", ko: "함께한 사람들", ja: "共に歩んだ方々", zh: "与我们同行的人" },
];

export function HomeIntroVideo({ src, stats }: { src?: string; stats: string[] }) {
  const { lang, tl } = useI18n();
  return (
    <section className="home-intro-video bg-[#f7f8f2] px-[var(--page-gutter)] pb-[clamp(56px,7vw,110px)]" aria-labelledby="home-intro-video-title">
      <div className="mx-auto max-w-[1600px]">
        <div className="discovery-hero-stats" aria-label={tl("Манай төвийн тухай тоон мэдээлэл")}>
          {statLabels.map((label, i) => <div key={i} className="discovery-hero-stat"><strong>{stats[i]}</strong><span>{label[lang]}</span></div>)}
        </div>
        <div className="mb-5 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#668174]">
              <T k="home.introVideoEyebrow" />
            </p>
            <h2 id="home-intro-video-title" className="mt-2 font-display text-2xl font-medium text-[#173d2e] sm:text-3xl">
              <T k="home.introVideoTitle" />
            </h2>
          </div>
        </div>

        <div className="relative aspect-video overflow-hidden rounded-[clamp(16px,2vw,28px)] bg-[#173d2e] shadow-[0_24px_70px_rgba(22,61,46,0.16)]">
          {src ? (
            <video
              className="h-full w-full object-contain"
              src={src}
              controls
              playsInline
              preload="metadata"
            >
              <T k="home.introVideoUnsupported" />
            </video>
          ) : (
            <div className="grid h-full place-items-center px-6 text-center text-[#dce8df]">
              <div>
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full border border-white/35 text-2xl">▶</div>
                <p className="text-sm tracking-wide"><T k="home.introVideoPlaceholder" /></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
