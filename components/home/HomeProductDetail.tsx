"use client";

import { useState } from "react";
import type { CmsItem } from "@/lib/types";
import { itemTeachers } from "@/lib/item-teachers";
import { useI18n } from "@/lib/i18n";
import { locText } from "@/lib/cms-i18n";
import { ItemTeachers } from "@/components/ItemTeachers";
import { ItemVideos } from "@/components/ItemVideos";
import { RichBody } from "@/components/RichBody";
import { ProductBuyBox } from "@/components/ProductBuyBox";
import styles from "./HomeProductDetail.module.css";

export function HomeProductDetail({ item }: { item: CmsItem }) {
  const { lang } = useI18n();
  const images = Array.from(new Set([item.image, ...(item.images || [])].filter((src): src is string => !!src?.trim())));
  const [selected, setSelected] = useState(0);
  const active = Math.min(selected, images.length - 1);
  const summary = locText(lang, item.summary, item.i18n, "summary");
  const body = locText(lang, item.body, item.i18n, "body");
  // Word list indentation contains repeated nonbreaking spaces; keep the actual text.
  const readableBody = /mso-list/i.test(body) ? body.replace(/(?:&nbsp;|\u00a0)(?:(?:\s|&nbsp;|\u00a0))*/gi, " ") : body;
  return <div className={styles.product}>
    <div className={`${styles.overview} ${images.length ? styles.withImages : ""}`}>
      {images.length > 0 && <section className={styles.gallery} aria-label="Бүтээгдэхүүний зургууд">
        <div className={styles.mainImage}><img src={images[active]} alt={`${item.title} — зураг ${active + 1}`} /></div>
        {images.length > 1 && <>
          <p className={styles.imageCount} aria-live="polite">{active + 1} / {images.length}</p>
          <div className={styles.thumbnails} aria-label="Зураг сонгох">
            {images.map((src, index) => <button key={src} type="button" aria-label={`${index + 1}-р зургийг үзэх`} aria-pressed={index === active} onClick={() => setSelected(index)}><img src={src} alt="" loading="lazy" /></button>)}
          </div>
        </>}
      </section>}
      <div className={styles.purchase}>
        {item.category && <span className={styles.category}>{item.category}</span>}
        {summary && <section className={styles.summary}><h3>Товч танилцуулга</h3><p>{summary}</p></section>}
        <section aria-label="Үнэ, захиалга"><h3>Үнэ, захиалга</h3><ProductBuyBox id={item.id} title={item.title} price={item.price} /></section>
      </div>
    </div>
    {body && <section className={styles.section}><h3>Дэлгэрэнгүй мэдээлэл</h3><RichBody html={readableBody} className={styles.text} /></section>}
    {item.link && <section className={styles.section}><h3>Танилцуулга бичлэг</h3><ItemVideos videos={[{ title: item.title, url: item.link }]} /></section>}
    {itemTeachers(item).length > 0 && <section className={styles.section}><h3>Холбогдох багш</h3><ItemTeachers item={item} /></section>}
  </div>;
}
