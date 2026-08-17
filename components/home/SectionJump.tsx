"use client";

import { useI18n } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

const Lx = (mn: string, en: string, ko: string, ja: string, zh: string): Record<Locale, string> => ({ mn, en, ko, ja, zh });

const LEAD = Lx(
  "Хаанаас эхлэхээ мэдэхгүй байна уу? Доорх товчнуудаас сонгоход тухайн хэсэг рүү шууд аваачна.",
  "Not sure where to start? Tap a button below to jump straight to that section.",
  "어디서 시작할지 모르시겠나요? 아래 버튼을 누르면 해당 섹션으로 바로 이동합니다.",
  "どこから始めるか迷ったら、下のボタンでその項目へ直接移動できます。",
  "不知从何开始？点击下方按钮直接跳到相应板块。",
);

const ITEMS: { href: string; icon: string; label: Record<Locale, string> }[] = [
  { href: "#zurhai", icon: "🔮", label: Lx("Өдрийн зурхай", "Daily reading", "오늘의 운세", "今日の運勢", "每日运势") },
  { href: "#services", icon: "✨", label: Lx("Энергийн засал", "Healing", "힐링", "ヒーリング", "能量疗愈") },
  { href: "#courses", icon: "🧘", label: Lx("Сургалт", "Courses", "강좌", "講座", "课程") },
  { href: "/ayalal", icon: "🕊", label: Lx("Сүнслэг аялал", "Journeys", "영적 여행", "聖地の旅", "心灵之旅") },
  { href: "#shop", icon: "🛡", label: Lx("Хамгаалалт", "Protection", "보호", "プロテクション", "守护") },
  { href: "#gift", icon: "🎁", label: Lx("Гэгээн бэлэг", "Free gift", "무료 선물", "無料の贈り物", "免费礼物") },
  { href: "#mood", icon: "🌅", label: Lx("Сэтгэлийн туяа", "Soul rays", "마음의 빛", "心の光", "心灵之光") },
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
    <section className="border-b border-line bg-surface-2/60">
      <div className="container-px py-8 sm:py-10">
        <p className="mx-auto max-w-2xl text-center text-[0.98rem] leading-relaxed text-muted">{tr(LEAD)}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2.5">
          {ITEMS.map((it) => (
            <a
              key={it.href}
              href={it.href}
              onClick={(e) => go(e, it.href)}
              className="focus-ring tap-target inline-flex items-center gap-2 rounded-full border border-line bg-surface-1 px-4 py-2.5 text-[0.95rem] font-semibold text-ink transition hover:-translate-y-0.5 hover:border-primary-500/45 hover:text-primary-700 hover:shadow-sm"
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
