"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { ProductBuyBox } from "./ProductBuyBox";
import { useI18n } from "@/lib/i18n";
import { locText } from "@/lib/cms-i18n";
import { formatMNT } from "@/lib/format";
import { ZODIACS, ALL_ZODIACS_KEY } from "@/data/zodiac";
import type { CmsItem } from "@/lib/types";
import styles from "./ProductHoverCard.module.css";

// Compact previews show readable text even when the CMS body contains Word HTML.
function previewText(value: string) {
  const entities: Record<string, string> = { nbsp: " ", amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", ndash: "–", mdash: "—", hellip: "…" };
  return value.replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<br\s*\/?\s*>|<\/(p|div|li|h[1-6])\s*>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, code: string) => {
      if (code[0] !== "#") return entities[code.toLowerCase()] ?? entity;
      const point = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : Number(code.slice(1));
      return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : "";
    }).replace(/[\t \u00a0]+/g, " ").replace(/ *\n */g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function ProductHoverCard({ item }: { item: CmsItem }) {
  const { lang } = useI18n();
  const [open, setOpen] = useState(false);
  const id = useId();
  const card = useRef<HTMLElement>(null);
  const [position, setPosition] = useState<CSSProperties>({});
  const show = () => {
    const rect = card.current?.getBoundingClientRect();
    if (!rect) return;
    const width = Math.min(760, window.innerWidth - 32);
    const maxHeight = Math.min(720, window.innerHeight - 120);
    setPosition({ width, height: maxHeight, maxHeight, left: Math.max(16, Math.min(rect.left - (width - rect.width) / 2, window.innerWidth - width - 16)), top: Math.max(88, Math.min(rect.top - 32, window.innerHeight - maxHeight - 16)) });
    setOpen(true);
  };
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, [open]);
  const title = locText(lang, item.title, item.i18n, "title");
  const description = [...new Set([locText(lang, item.summary, item.i18n, "summary"), locText(lang, item.body, item.i18n, "body")].map(previewText).filter(Boolean))].join("\n\n");
  const image = item.image || item.images?.[0];
  const zodiacs = item.category === "Чулуунууд" && item.moods?.length
    ? item.moods.includes(ALL_ZODIACS_KEY) ? [{ key: "all", name: "Бүх орд", symbol: "✦" }] : ZODIACS.filter(z => item.moods?.includes(z.key))
    : [];

  return <article ref={card} className={styles.card} data-product-card data-open={open}
    onPointerEnter={event => { if (event.pointerType === "mouse") show(); }}
    onPointerLeave={event => { if (event.pointerType === "mouse") setOpen(false); }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
    onKeyDown={event => { if (event.key === "Escape") { event.stopPropagation(); setOpen(false); } }}>
    <div className={styles.surface} style={open ? position : undefined}>
      <div className={styles.visual}>
        {image ? <img src={image} alt="" loading="lazy" /> : <div className={styles.placeholder} aria-hidden="true">◇</div>}
        <button type="button" className={styles.toggle} aria-label={`${title} — мэдээлэл`} aria-expanded={open} aria-controls={id} onClick={() => open ? setOpen(false) : show()}>
          <span className={styles.indicator} aria-hidden="true">{open ? "−" : "+"}</span>
        </button>
        {zodiacs.length > 0 && <div className={styles.zodiacs}>{zodiacs.map(z => <span key={z.key} title={z.name}>{z.symbol}<span className="sr-only">{z.name}</span></span>)}</div>}
      </div>
      <div className={styles.caption} hidden={open}>
        <h3><button type="button" onClick={show}>{title}</button></h3>
        {typeof item.price === "number" && <p>{formatMNT(item.price)}</p>}
      </div>
      <div id={id} className={styles.details} hidden={!open}>
        <div className={styles.heading}><h3>{title}</h3><button type="button" onClick={() => setOpen(false)} aria-label="Мэдээллийг хаах">×</button></div>
        {zodiacs.length > 0 && <p className={styles.zodiacNames}>{zodiacs.map(z => z.name).join(" · ")}</p>}
        {description && <div className={styles.description} tabIndex={0}>{description}</div>}
        {open && <ProductBuyBox id={item.id} title={title} price={item.price} compact />}
      </div>
    </div>
  </article>;
}
