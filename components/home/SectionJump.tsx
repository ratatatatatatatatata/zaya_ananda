"use client";

import { useI18n } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

const Lx = (mn: string, en: string, ko: string, ja: string, zh: string): Record<Locale, string> => ({ mn, en, ko, ja, zh });

const ITEMS: { href: string; icon: string; label: Record<Locale, string> }[] = [
  { href: "#zurhai", icon: "🔮", label: Lx("Өдрийн зурхай", "Daily reading", "오늘의 운세", "今日の運勢", "每日运势") },
  { href: "#services", icon: "✨", label: Lx("Энергийн засал", "Healing", "힐링", "ヒーリング", "能量疗愈") },
  { href: "#courses", icon: "🧘", label: Lx("Сургалт", "Courses", "강좌", "講座", "课程") },
  { href: "/ayalal", icon: "🕊", label: Lx("Сүнслэг аялал", "Journeys", "영적 여행", "聖地の旅", "心灵之旅") },
  { href: "#shop", icon: "🛡", label: Lx("Хамгаалалт", "Protection", "보호", "プロテクション", "守护") },
  { href: "#gift", icon: "🎁", label: Lx("Гэгээн бэлэг", "Free gift", "무료 선물", "無料の贈り物", "免费礼物") },
];

/** Нүүр хуудасны хурдан шилжих зурвас — товч дарахад тухайн хэсэг рүү очно. */
export function SectionJump() {
  const { tr } = useI18n();

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="sticky top-16 z-30 border-y border-line bg-surface-2/85 backdrop-blur lg:top-[72px]">
      <div className="container-px py-4 sm:py-5">
        <div className="flex flex-wrap justify-center gap-2.5">
          {ITEMS.map((it) => (
            <a
              key={it.href}
              href={it.href}
              onClick={(e) => go(e, it.href)}
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-line bg-surface-1 px-3.5 py-2 text-[0.9rem] font-semibold text-ink transition hover:-translate-y-0.5 hover:border-primary-500/45 hover:text-primary-700 hover:shadow-sm"
            >
              <span aria-hidden>{it.icon}</span>
              {tr(it.label)}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
