"use client";

import { type ReactNode, useState } from "react";
import { useI18n } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { Coverflow3D } from "./Coverflow3D";

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

const TONES = [
  { from: "#3B2450", via: "#7A3B2E", to: "#D9762F" },
  { from: "#0F2B26", via: "#155248", to: "#2BC8BB" },
  { from: "#1B2350", via: "#3F3A7A", to: "#8B6EC4" },
  { from: "#2C1E3D", via: "#7C4A46", to: "#E0995A" },
];

/** Нүүр хуудасны зурхайн төрлүүд — Энергийн засал зэрэгтэй адилхан хажуу тийш гулддаг 3D coverflow. Дарахад доор нь алхмууд нээгдэнэ. */
export function ZurhaiSlider({ cards, daily }: {
  cards?: ZurhaiCard[];
  /** «Өдрийн зурхай» карт сонгогдоход задаргаанд гарах тайлал */
  daily?: ReactNode;
}) {
  const { tr } = useI18n();
  const list = cards && cards.length ? cards : DEFAULT_ZURHAI;
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow-line justify-center"><span>🔮</span> <span className="ml-1">{tr(EYEBROW)}</span></p>
        <p className="mt-3 leading-relaxed text-muted">{tr(LEAD)}</p>
      </div>

      <div className="mt-8">
        <Coverflow3D
          items={list}
          getKey={(card, k) => card.title + k}
          cardWidthClassName="w-[19rem] sm:w-[22rem]"
          renderItem={(card, k) => {
            const t = TONES[k % TONES.length];
            const isOpen = openIdx === k;
            return (
              <div
                className="night relative flex min-h-[14rem] flex-col justify-center overflow-hidden rounded-[1.75rem] p-7 shadow-card sm:min-h-[15rem] sm:p-8"
                style={{ backgroundImage: `linear-gradient(115deg, ${t.from} 0%, ${t.via} 52%, ${t.to} 100%)` }}
              >
                <div aria-hidden className="pointer-events-none absolute -right-16 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full"
                  style={{ background: "radial-gradient(circle, rgba(255,255,255,0.3), transparent 70%)", filter: "blur(14px)" }} />
                <div aria-hidden className="pointer-events-none absolute -bottom-16 left-1/3 h-56 w-56 rounded-full"
                  style={{ background: "radial-gradient(circle, rgba(255,255,255,0.18), transparent 70%)", filter: "blur(18px)" }} />

                <div className="relative z-10">
                  <span className="text-3xl sm:text-4xl">{card.emoji}</span>
                  <h3 className="mt-3 font-display text-xl font-semibold text-white sm:text-2xl">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/85">{card.desc}</p>
                  <button
                    type="button"
                    onClick={() => setOpenIdx((v) => (v === k ? null : k))}
                    aria-expanded={isOpen}
                    className="btn btn-gold btn-md mt-5"
                  >
                    {tr(OPEN)}
                    <span aria-hidden className={"ml-1.5 inline-block transition-transform " + (isOpen ? "rotate-180" : "")}>⌄</span>
                  </button>
                </div>
              </div>
            );
          }}
        />
      </div>

      {/* Дарахад доор нь гарч ирэх алхмууд — хуудас үсрэхгүй */}
      <div
        className="overflow-hidden transition-[max-height,opacity] duration-500 ease-out"
        style={{ maxHeight: openIdx !== null ? "500rem" : 0, opacity: openIdx !== null ? 1 : 0 }}
      >
        {/* Төрсөн он, сар, өдрөө оруулах хэсэг — үргэлж эндээ гарна */}
        {daily && <div className="mt-6">{daily}</div>}
      </div>
    </div>
  );
}
