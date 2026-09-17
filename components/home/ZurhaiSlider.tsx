"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { useI18n } from "@/lib/i18n";
import styles from "./ZurhaiSlider.module.css";
import type { Locale } from "@/lib/types";

const Lx = (mn: string, en: string, ko: string, ja: string, zh: string): Record<Locale, string> => ({ mn, en, ko, ja, zh });

export type ZurhaiCard = { emoji: string; title: string; desc: string; href: string; image?: string };

/** Админ юу ч нэмээгүй үед харагдах өгөгдмөл 3 төрөл */
export const DEFAULT_ZURHAI: ZurhaiCard[] = [
  { emoji: "🌅", title: "Өдрийн зурхай", desc: "Төрсөн огноогоороо өнөөдрийн сэтгэл санаа, ажил хэрэг, харилцаа, эрүүл мэндийн урьдчилсан тайллыг аваарай.", href: "#zurhai-daily" },
  { emoji: "🔢", title: "Тоон зурхайн матрикс", desc: "Хувь тавилангийн матриксаар үндсэн эрчим, сүнсний түвшин, далд чадамжаа тайлж үзнэ.", href: "/matrix" },
  { emoji: "🔮", title: "Бүтэн зурхай", desc: "Астрологи, тоон судлал, матрикс, Human Design — дөрвөн системийг нэгтгэсэн гүнзгий тайлал.", href: "/merge" },
];

const EYEBROW = Lx("Зурхай", "Astrology", "점성술", "占い", "占星");
const LEAD = Lx(
  "Зурхайн төрлөө дарж мэдээлэл, тайллаа үзээрэй.",
  "Choose an astrology type to view its information and reading.",
  "유형을 선택하여 설명과 해석을 확인하세요.",
  "種類を選んで説明と鑑定をご覧ください。",
  "选择占星类型，查看介绍与解读。",
);

/** Name-only circular selectors; details open only after an explicit choice. */
export function ZurhaiSlider({ cards, daily, matrix }: {
  cards?: ZurhaiCard[];
  daily?: ReactNode;
  matrix?: ReactNode;
}) {
  const { tr, tl } = useI18n();
  const list = cards && cards.length ? cards : DEFAULT_ZURHAI;
  const [selected, setSelected] = useState<number | null>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const panelId = useId();
  const titleId = useId();
  const active = selected === null ? undefined : list[selected];

  return <div className={styles.root}>
    <div className={styles.heading}>
      <h2 className="eyebrow-line justify-center">{tr(EYEBROW)}</h2>
      <p className="mt-3 leading-relaxed text-muted">{tr(LEAD)}</p>
    </div>
    <div className={styles.choices} role="group" aria-label={tr(EYEBROW)}>
      {list.map((card, index) => <button key={card.title + index} type="button"
        ref={element => { buttons.current[index] = element; }}
        className={styles.circle} aria-expanded={selected === index} aria-controls={panelId}
        onClick={() => setSelected(current => current === index ? null : index)}>
        <span>{tl(card.title)}</span>
      </button>)}
    </div>
    <div id={panelId} hidden={!active}>
      {active && <section className={styles.panel} aria-labelledby={titleId}>
        <div className={styles.intro}>
          <div>
            <h3 id={titleId}>{tl(active.title)}</h3>
            {active.desc && <p>{tl(active.desc)}</p>}
          </div>
          <button type="button" className={styles.close} aria-label={tl("Дэлгэрэнгүйг хаах")} onClick={() => {
            buttons.current[selected ?? 0]?.focus({ preventScroll: true });
            setSelected(null);
          }}>✕</button>
        </div>
        <div className={styles.reading}>
          {(active.href === "/matrix" || active.title.toLocaleLowerCase().includes("матри")) ? matrix : daily}
        </div>
      </section>}
    </div>
  </div>;
}
