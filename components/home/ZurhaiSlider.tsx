"use client";

import { useState, type ReactNode } from "react";
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
  "Хажуу тийш гүйлгэн төрлөө сонгоно уу. «Эхлэх» дарвал доор нь төрсөн огноогоо оруулах хэсэг гарна.",
  "Slide sideways to choose a type. Tap Start and the birth-date form opens below.",
  "옆으로 밀어 유형을 고르세요. 누르면 아래에 단계가 나타납니다.",
  "横にスライドして種類を選び、押すと下に手順が表示されます。",
  "左右滑动选择类型，点击后下方会显示步骤。",
);
const OPEN = Lx("Эхлэх", "Start", "시작", "はじめる", "开始");
const PREV = Lx("Өмнөх", "Previous", "이전", "前へ", "上一个");
const NEXT = Lx("Дараах", "Next", "다음", "次へ", "下一个");

const TONES = [
  { from: "#3B2450", via: "#7A3B2E", to: "#D9762F" },
  { from: "#0F2B26", via: "#155248", to: "#2BC8BB" },
  { from: "#1B2350", via: "#3F3A7A", to: "#8B6EC4" },
  { from: "#2C1E3D", via: "#7C4A46", to: "#E0995A" },
];

/** Нүүр хуудасны зурхайн төрлүүд — гулсдаг баннер. Дарахад доор нь алхмууд нээгдэнэ. */
export function ZurhaiSlider({ cards, daily }: {
  cards?: ZurhaiCard[];
  /** «Өдрийн зурхай» карт сонгогдоход задаргаанд гарах тайлал */
  daily?: ReactNode;
}) {
  const { tr } = useI18n();
  const list = cards && cards.length ? cards : DEFAULT_ZURHAI;
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);

  const go = (dir: 1 | -1) => {
    setOpen(false);
    setI((v) => (v + dir + list.length) % list.length);
  };

  const c = list[i];
  const isDaily = c.href.startsWith("#");

  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow-line justify-center"><span>🔮</span> <span className="ml-1">{tr(EYEBROW)}</span></p>
        <p className="mt-3 leading-relaxed text-muted">{tr(LEAD)}</p>
      </div>

      {/* Баннер + хажуугийн сумнууд */}
      <div className="relative mt-8">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label={tr(PREV)}
          className="focus-ring absolute left-0 top-1/2 z-20 grid h-11 w-11 -translate-x-1/3 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface-1 text-lg text-ink shadow-sm transition hover:border-primary-500/45 hover:text-primary-700 sm:h-12 sm:w-12"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label={tr(NEXT)}
          className="focus-ring absolute right-0 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 translate-x-1/3 place-items-center rounded-full border border-line bg-surface-1 text-lg text-ink shadow-sm transition hover:border-primary-500/45 hover:text-primary-700 sm:h-12 sm:w-12"
        >
          ›
        </button>

        {/* Гулсах зурвас */}
        <div className="overflow-hidden rounded-[1.75rem] shadow-card">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${i * 100}%)` }}
          >
            {list.map((card, k) => {
              const t = TONES[k % TONES.length];
              return (
                <div key={card.title + k} className="w-full shrink-0">
                  <div
                    className="night relative flex min-h-[16rem] flex-col justify-center overflow-hidden p-8 sm:min-h-[18rem] sm:p-12"
                    style={{ backgroundImage: `linear-gradient(115deg, ${t.from} 0%, ${t.via} 52%, ${t.to} 100%)` }}
                  >
                    <div aria-hidden className="pointer-events-none absolute -right-16 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full"
                      style={{ background: "radial-gradient(circle, rgba(255,255,255,0.3), transparent 70%)", filter: "blur(14px)" }} />
                    <div aria-hidden className="pointer-events-none absolute -bottom-16 left-1/3 h-56 w-56 rounded-full"
                      style={{ background: "radial-gradient(circle, rgba(255,255,255,0.18), transparent 70%)", filter: "blur(18px)" }} />

                    <div className="relative z-10 max-w-xl">
                      <span className="text-4xl sm:text-5xl">{card.emoji}</span>
                      <h3 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">{card.title}</h3>
                      <p className="mt-3 leading-relaxed text-white/85">{card.desc}</p>
                      <button
                        type="button"
                        onClick={() => setOpen((v) => (k === i ? !v : true))}
                        aria-expanded={k === i && open}
                        className="btn btn-gold btn-md mt-6"
                      >
                        {tr(OPEN)}
                        <span aria-hidden className={"ml-1.5 inline-block transition-transform " + (k === i && open ? "rotate-180" : "")}>⌄</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Цэгүүд */}
        <div className="mt-5 flex justify-center gap-2.5">
          {list.map((_, k) => (
            <button
              key={k}
              type="button"
              onClick={() => { setOpen(false); setI(k); }}
              aria-label={`${k + 1}`}
              aria-current={k === i}
              className={
                "h-2.5 rounded-full transition-all " +
                (k === i ? "w-7 bg-primary-600" : "w-2.5 bg-line hover:bg-primary-300")
              }
            />
          ))}
        </div>
      </div>

      {/* Дарахад доор нь гарч ирэх алхмууд — хуудас үсрэхгүй */}
      <div
        className="overflow-hidden transition-[max-height,opacity] duration-500 ease-out"
        style={{ maxHeight: open ? "500rem" : 0, opacity: open ? 1 : 0 }}
      >
        {/* Төрсөн он, сар, өдрөө оруулах хэсэг — үргэлж эндээ гарна */}
        {daily && <div className="mt-2">{daily}</div>}

        {/* Тухайн зурхайн бүтэн хувилбар руу очих */}
        {!isDaily && (
          <div className="mt-6 text-center">
            <Link href={c.href} className="btn btn-primary btn-md">
              {c.emoji} {c.title} →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
