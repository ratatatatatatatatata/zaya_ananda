"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Destination, Scene } from "@/data/journeys";
import { JourneyImage } from "./SceneArt";
import { useI18n } from "@/lib/i18n";
import styles from "./DestinationGallery.module.css";

export function DestinationGallery({ places, scene }: { places: Destination[]; scene: Scene }) {
  const { tl } = useI18n();
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const dismissedHover = useRef<number | null>(null);
  const titleId = useId();
  const dialogId = useId();
  const place = selected === null ? undefined : places[selected];
  const cancelHover = () => { clearTimeout(timer.current); };
  const open = (index: number, button: HTMLButtonElement) => {
    cancelHover();
    trigger.current = button;
    setSelected(index);
  };
  const close = () => { cancelHover(); dismissedHover.current = selected; setSelected(null); };

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    const element = dialog.current;
    if (!place || !element) return;
    const overflow = document.body.style.overflow;
    const ownsScrollLock = overflow !== "hidden";
    const scroll = { left: window.scrollX, top: window.scrollY, behavior: "instant" as ScrollBehavior };
    element.showModal();
    if (ownsScrollLock) document.body.style.overflow = "hidden";
    window.scrollTo(scroll);
    return () => {
      element.close();
      if (ownsScrollLock) document.body.style.overflow = overflow;
      trigger.current?.focus({ preventScroll: true });
      window.scrollTo(scroll);
    };
  }, [place]);

  return <>
    <div className={styles.grid}>
      {places.map((destination, index) => <button key={`${destination.title}-${index}`} type="button"
        className={styles.preview} aria-haspopup="dialog" aria-controls={dialogId} aria-expanded={selected === index}
        onClick={event => open(index, event.currentTarget)}
        onPointerEnter={event => {
          if (event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches || selected !== null || dismissedHover.current === index) return;
          cancelHover();
          const button = event.currentTarget;
          timer.current = setTimeout(() => open(index, button), 250);
        }}
        onPointerLeave={() => { cancelHover(); if (selected === null) dismissedHover.current = null; }} onPointerDown={cancelHover}>
        <JourneyImage src={destination.image} scene={scene} alt="" className={styles.image} />
        <span className={styles.caption}>
          <strong className={styles.title}>{destination.title || `${tl("Очих газар")} ${index + 1}`}</strong>
          <span className={styles.action}>{tl("Дэлгэрэнгүй үзэх")}<span className={styles.icon} aria-hidden>↗</span></span>
        </span>
      </button>)}
    </div>
    <dialog id={dialogId} ref={dialog} className={styles.dialog} aria-labelledby={titleId}
      onCancel={event => { event.preventDefault(); event.stopPropagation(); close(); }}
      onClick={event => { if (event.target === event.currentTarget) close(); }}>
      {place && <div className={styles.detail}>
        <button type="button" className={styles.close} autoFocus onClick={close} aria-label={tl("Дэлгэрэнгүйг хаах")}>✕</button>
        <JourneyImage src={place.image} scene={scene} alt={place.title || ""} className={styles.detailImage} />
        <div className={styles.description}>
          <p className={styles.eyebrow}>{tl("Очих газрууд")}</p>
          <h3 id={titleId}>{place.title || `${tl("Очих газар")} ${(selected ?? 0) + 1}`}</h3>
          <p className={styles.text}>{place.desc?.trim() || tl("Энэ газрын дэлгэрэнгүй мэдээлэл удахгүй нэмэгдэнэ.")}</p>
        </div>
      </div>}
    </dialog>
  </>;
}
