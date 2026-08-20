"use client";

import { useRef } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

const Lx = (mn: string, en: string, ko: string, ja: string, zh: string): Record<Locale, string> => ({ mn, en, ko, ja, zh });

export type ZurhaiCard = { emoji: string; title: string; desc: string; href: string };

/** Админ юу ч нэмээгүй үед харагдах өгөгдмөл 3 төрөл */
export const DEFAULT_ZURHAI: ZurhaiCard[] = [
  { emoji: "🌅", title: "Өдрийн зурхай", desc: "Төрсөн огноогоороо өнөөдрийн сэтгэл санаа, ажил хэрэг, харилцаа, эрүүл мэндийн урьдчилсан тайллыг аваарай.", href: "#zurhai-daily" },
  { emoji: "🔢", title: "Тоон зурхайн матрикс", desc: "Хувь тавилангийн матриксаар үндсэн эрчим, сүнсний түвшин, далд чадамжаа тайлж үзнэ.", href: "/matrix" },
  { emoji: "🔮", title: "Бүтэн зурхай", desc: "Астрологи, тоон судлал, матрикс, Human Design — дөрвөн системийг нэгтгэсэн гүнзгий тайлал.", href: "/merge" },
];

const EYEBROW = Lx("Зурхай", "Astrology", "점성술", "占い", "占星");
const LEAD = Lx(
  "Хажуу тийш гүйлгэн төрлөө сонгоод, төрсөн огноогоороо тайллаа аваарай.",
  "Slide sideways to pick a reading, then enter your birth date.",
  "옆으로 밀어 원하는 유형을 고르고 생년월일을 입력하세요.",
  "横にスライドして種類を選び、生年月日を入力してください。",
  "左右滑动选择类型，然后输入出生日期。",
);
const OPEN = Lx("Үзэх", "Open", "보기", "見る", "查看");
const PREV = Lx("Өмнөх", "Previous", "이전", "前へ", "上一个");
const NEXT = Lx("Дараах", "Next", "다음", "次へ", "下一个");

/** Нүүр хуудасны зурхайн төрлүүд — хажуу тийш гүйдэг слайдер. */
export function ZurhaiSlider({ cards }: { cards?: ZurhaiCard[] }) {
  const { tr } = useI18n();
  const list = cards && cards.length ? cards : DEFAULT_ZURHAI;
  const rail = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.85, 420), behavior: "smooth" });
  };

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="eyebrow-line"><span>🔮</span> <span className="ml-1">{tr(EYEBROW)}</span></p>
          <p className="mt-3 leading-relaxed text-muted">{tr(LEAD)}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => scroll(-1)} aria-label={tr(PREV)}
            className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-line bg-surface-1 text-ink transition hover:border-primary-500/45 hover:text-primary-700">‹</button>
          <button type="button" onClick={() => scroll(1)} aria-label={tr(NEXT)}
            className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-line bg-surface-1 text-ink transition hover:border-primary-500/45 hover:text-primary-700">›</button>
        </div>
      </div>

      <div
        ref={rail}
        className="mt-7 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {list.map((c, i) => (
          <article
            key={c.title + i}
            className="panel relative flex min-w-[19rem] max-w-[22rem] flex-1 shrink-0 snap-start flex-col overflow-hidden p-7"
          >
            <div aria-hidden className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full"
              style={{ background: "radial-gradient(circle, rgb(var(--c-p400) / 0.2), transparent 70%)" }} />
            <span className="relative z-10 grid h-14 w-14 place-items-center rounded-2xl bg-primary-500/12 text-3xl">{c.emoji}</span>
            <h3 className="relative z-10 mt-5 font-display text-xl font-semibold text-ink">{c.title}</h3>
            <p className="relative z-10 mt-2.5 flex-1 text-[0.98rem] leading-relaxed text-muted">{c.desc}</p>
            <div className="relative z-10 mt-6">
              <Link href={c.href} onClick={(e) => go(e, c.href)} className="btn btn-primary btn-sm">
                {tr(OPEN)} →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
