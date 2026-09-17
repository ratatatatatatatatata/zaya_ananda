"use client";

import { useId, useState } from "react";
import { HomeDetailLink } from "@/components/home/HomeDetails";
import { useI18n } from "@/lib/i18n";
import { locText } from "@/lib/cms-i18n";
import { formatMNT } from "@/lib/format";
import { ZODIACS, ALL_ZODIACS_KEY } from "@/data/zodiac";
import type { CmsItem } from "@/lib/types";
import styles from "./ProductHoverCard.module.css";

export function ProductHoverCard({ item }: { item: CmsItem }) {
  const { lang } = useI18n();
  const [open, setOpen] = useState(false);
  const id = useId();
  const title = locText(lang, item.title, item.i18n, "title");
  const description = locText(lang, item.summary, item.i18n, "summary") || locText(lang, item.body, item.i18n, "body");
  const image = item.image || item.images?.[0];
  const zodiacs = item.category === "Чулуунууд" && item.moods?.length
    ? item.moods.includes(ALL_ZODIACS_KEY) ? [{ key: "all", name: "Бүх орд", symbol: "✦" }] : ZODIACS.filter(z => item.moods?.includes(z.key))
    : [];

  return <article className={styles.card} data-product-card data-open={open}
    onPointerEnter={event => { if (event.pointerType === "mouse") setOpen(true); }}
    onPointerLeave={event => { if (event.pointerType === "mouse") setOpen(false); }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
    onKeyDown={event => { if (event.key === "Escape") { event.stopPropagation(); setOpen(false); } }}>
    <div className={styles.visual}>
      {image ? <img src={image} alt="" loading="lazy" /> : <div className={styles.placeholder} aria-hidden="true">◇</div>}
      <button type="button" className={styles.toggle} aria-label={`${title} — мэдээлэл`} aria-expanded={open} aria-controls={id} onClick={() => setOpen(value => !value)}>
        <span className={styles.indicator} aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {zodiacs.length > 0 && <div className={styles.zodiacs}>{zodiacs.map(z => <span key={z.key} title={z.name}>{z.symbol}<span className="sr-only">{z.name}</span></span>)}</div>}
      <div id={id} className={styles.details} hidden={!open}>
        <strong>{title}</strong>
        {zodiacs.length > 0 && <p className={styles.zodiacNames}>{zodiacs.map(z => z.name).join(" · ")}</p>}
        {description && <div className={styles.description} tabIndex={0}>{description}</div>}
        <HomeDetailLink href={`/item/${item.id}`} className={styles.detailLink}>Дэлгэрэнгүй үзэх ↗</HomeDetailLink>
      </div>
    </div>
    <div className={styles.caption}>
      <h3><HomeDetailLink href={`/item/${item.id}`} onFocus={() => setOpen(true)}>{title}</HomeDetailLink></h3>
      {typeof item.price === "number" && <p>{formatMNT(item.price)}</p>}
    </div>
  </article>;
}
