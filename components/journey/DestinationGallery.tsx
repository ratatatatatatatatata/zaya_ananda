"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Destination, Scene } from "@/data/journeys";
import { JourneyImage } from "./SceneArt";
import { useI18n } from "@/lib/i18n";
import styles from "./DestinationGallery.module.css";

export function DestinationGallery({ places, scene }: { places: Destination[]; scene: Scene }) {
  const { tl } = useI18n();
  const [selected, setSelected] = useState<number | null>(null);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const grid = useRef<HTMLDivElement>(null);
  const active = useRef<HTMLDivElement | null>(null);
  const id = useId();
  const open = (index: number, entry: HTMLDivElement) => {
    if (!grid.current) return;
    const bounds = grid.current.getBoundingClientRect();
    const card = entry.getBoundingClientRect();
    const width = Math.min(640, bounds.width);
    setPosition({
      left: Math.max(0, Math.min(card.left - bounds.left + (card.width - width) / 2, bounds.width - width)),
      top: card.top - bounds.top,
    });
    active.current = entry;
    setSelected(index);
  };

  useEffect(() => {
    if (selected === null) return;
    const dismissOutside = (event: PointerEvent) => {
      if (!active.current?.contains(event.target as Node)) setSelected(null);
    };
    const dismissResize = () => setSelected(null);
    document.addEventListener("pointerdown", dismissOutside);
    window.addEventListener("resize", dismissResize);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      window.removeEventListener("resize", dismissResize);
    };
  }, [selected]);

  return <div ref={grid} className={styles.grid} onKeyDown={event => {
    if (event.key === "Escape") { event.stopPropagation(); setSelected(null); }
  }}>
    {places.map((place, index) => <div key={index} className={styles.entry}
      onPointerEnter={event => { if (event.pointerType === "mouse") open(index, event.currentTarget); }}
      onPointerLeave={event => { if (event.pointerType === "mouse") setSelected(current => current === index ? null : current); }}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setSelected(current => current === index ? null : current); }}>
      <button type="button" className={styles.preview} aria-expanded={selected === index}
        aria-controls={id + "-" + index}
        onClick={event => { if (selected === index) setSelected(null); else open(index, event.currentTarget.parentElement as HTMLDivElement); }}>
        <JourneyImage src={place.image} scene={scene} alt="" className={styles.image} />
        <span className={styles.caption}>
          <strong className={styles.title}>{place.title || tl("Очих газар") + " " + (index + 1)}</strong>
          <span className={styles.action}>{tl("Дэлгэрэнгүй үзэх")}<span className={styles.icon} aria-hidden>↗</span></span>
        </span>
      </button>
      {selected === index && <section id={id + "-" + index} className={styles.detail} style={position}
        aria-labelledby={id + "-" + index + "-title"} tabIndex={0}>
        <div className={styles.detailFrame}>
          <JourneyImage src={place.image} scene={scene} alt={place.title || ""} className={styles.detailImage} />
        </div>
        <div className={styles.description}>
          <h3 id={id + "-" + index + "-title"}>{place.title || tl("Очих газар") + " " + (index + 1)}</h3>
          <p className={styles.text}>{place.desc?.trim() || tl("Энэ газрын дэлгэрэнгүй мэдээлэл удахгүй нэмэгдэнэ.")}</p>
        </div>
      </section>}
    </div>)}
  </div>;
}
