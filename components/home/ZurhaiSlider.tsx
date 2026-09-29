"use client";

import { useId, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { DEFAULT_ZURHAI, NATAL_CARD, NATAL_HREF, type ZurhaiCard } from "@/lib/zurhai-cards";
import styles from "./ZurhaiSlider.module.css";
import type { Locale } from "@/lib/types";

const Lx = (mn: string, en: string, ko: string, ja: string, zh: string): Record<Locale, string> => ({ mn, en, ko, ja, zh });

const EYEBROW = Lx("Зурхай", "Astrology", "점성술", "占い", "占星");
const LEAD = Lx(
  "Зурхайн төрлөө дарж мэдээлэл, тайллаа үзээрэй.",
  "Choose an astrology type to view its information and reading.",
  "유형을 선택하여 설명과 해석을 확인하세요.",
  "種類を選んで説明と鑑定をご覧ください。",
  "选择占星类型，查看介绍与解读。",
);

/** Circular selectors; an admin image becomes the background while the title stays readable. */
export function ZurhaiSlider({ cards, daily, matrix, natal }: {
  cards?: ZurhaiCard[];
  daily?: ReactNode;
  matrix?: ReactNode;
  natal?: ReactNode;
}) {
  const { tr, tl } = useI18n();
  const hasNatal = !!natal;
  const list = useMemo(() => {
    const base = cards && cards.length ? cards : DEFAULT_ZURHAI;
    return hasNatal && !base.some((c) => c.href === NATAL_HREF) ? [...base, NATAL_CARD] : base;
  }, [cards, hasNatal]);
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
        className={`${styles.circle} ${card.image ? styles.withImage : ""}`} aria-expanded={selected === index} aria-controls={panelId}
        onClick={() => setSelected(current => current === index ? null : index)}>
        {card.image && <Image src={card.image} alt="" fill unoptimized sizes="(max-width: 480px) 45vw, 230px" className={styles.circleImage} />}
        {card.image && <span className={styles.circleOverlay} aria-hidden="true" />}
        <span className={styles.circleTitle}>{tl(card.title)}</span>
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
          {active.href === NATAL_HREF
            ? natal
            : (active.href === "/matrix" || active.title.toLocaleLowerCase().includes("матри")) ? matrix : daily}
        </div>
      </section>}
    </div>
  </div>;
}
