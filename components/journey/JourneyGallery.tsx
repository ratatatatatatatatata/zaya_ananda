"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Journey } from "@/data/journeys";
import styles from "./JourneyGallery.module.css";

export function JourneyGallery({ journey, headingLevel = 2 }: { journey: Journey; headingLevel?: 2 | 3 }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const rail = useRef<HTMLDivElement>(null);
  const stageId = useId();
  const seen = new Set<string>();
  const images = (journey.gallery || []).flatMap(photo => {
    const image = photo.image?.trim();
    if (!image || seen.has(image)) return [];
    seen.add(image);
    return [{ image, caption: photo.caption }];
  });
  const index = Math.max(0, images.findIndex(photo => photo.image === selectedImage));
  const selected = images[index];

  useEffect(() => {
    const strip = rail.current;
    const button = strip?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!strip || !button) return;
    const offset = button.getBoundingClientRect().left - strip.getBoundingClientRect().left;
    strip.scrollTo({ left: strip.scrollLeft + offset - (strip.clientWidth - button.clientWidth) / 2, behavior: "instant" as ScrollBehavior });
  }, [selected?.image]);

  if (!selected) return null;
  const Heading = headingLevel === 3 ? "h3" : "h2";
  const select = (next: number) => setSelectedImage(images[(next + images.length) % images.length].image);

  return <section aria-label="Аяллын зургууд" className={styles.gallery}>
    <Heading className="font-display text-3xl font-semibold text-ink sm:text-4xl">Аяллын зургууд</Heading>
    <figure id={stageId} className={styles.stage}>
      <img src={selected.image} alt={selected.caption || `Аяллын зураг ${index + 1}`} loading="lazy" />
      <figcaption className={styles.caption} aria-live="polite" aria-atomic="true">
        <span>{selected.caption}</span><span className={styles.count}>{index + 1} / {images.length}</span>
      </figcaption>
    </figure>
    {images.length > 1 && <div className={styles.controls}>
      <button type="button" className={styles.arrow} onClick={() => select(index - 1)} aria-label="Өмнөх зураг" aria-controls={stageId}>‹</button>
      <div ref={rail} className={styles.thumbnails} role="group" aria-label="Аяллын зураг сонгох" onKeyDown={event => {
        const next = event.key === "ArrowRight" ? (index + 1) % images.length : event.key === "ArrowLeft" ? (index - 1 + images.length) % images.length : null;
        if (next === null) return;
        event.preventDefault(); select(next);
        rail.current?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus({ preventScroll: true });
      }}>
        {images.map((photo, photoIndex) => <button key={photo.image} type="button" className={styles.thumbnail}
          onClick={() => select(photoIndex)} aria-pressed={photoIndex === index} aria-controls={stageId}
          aria-label={`Аяллын зураг ${photoIndex + 1} сонгох`} title={photo.caption}>
          <img src={photo.image} alt="" loading="lazy" />
        </button>)}
      </div>
      <button type="button" className={styles.arrow} onClick={() => select(index + 1)} aria-label="Дараах зураг" aria-controls={stageId}>›</button>
    </div>}
  </section>;
}
