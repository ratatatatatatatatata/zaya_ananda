"use client";

import { useId, useState } from "react";
import type { JourneyDay } from "@/data/journeys";
import { useI18n } from "@/lib/i18n";
import { JourneyImage } from "./SceneArt";
import styles from "./JourneyItinerary.module.css";

export function JourneyItinerary({ days }: { days: JourneyDay[] }) {
  const { tl } = useI18n();
  const [selected, setSelected] = useState(0);
  const id = useId();
  const trainingDays = days.slice(0, 5);
  const travelDays = days.slice(5);
  const day = trainingDays[selected];
  if (!day) return null;

  return <div className={styles.itinerary}>
    <div className={styles.choices} role="group" aria-label={tl("Өдөр өдрийн хөтөлбөр")}>
      {trainingDays.map((item, index) => <button key={index} type="button"
        className={styles.choice} aria-pressed={selected === index}
        aria-controls={`${id}-detail`} onClick={() => setSelected(index)}>
        <JourneyImage src={item.image} scene={item.scene} alt="" className={styles.cover} />
        <span className={styles.shade} aria-hidden />
        <span className={styles.choiceText}>
          <span className={styles.label}>{item.label || `${tl("Өдөр")} ${index + 1}`}</span>
          <strong>{item.title}</strong>
        </span>
      </button>)}
    </div>
    <DayDetail day={day} id={`${id}-detail`} titleId={`${id}-title`} />
    {!!travelDays.length && <div className={styles.travel}>
      <h3 className="font-display text-3xl font-semibold text-ink">{tl("Дияан аялал")}</h3>
      {travelDays.map((item, index) => <DayDetail key={index} day={item} titleId={`${id}-travel-${index}`} />)}
    </div>}
  </div>;
}

function DayDetail({ day, id, titleId }: { day: JourneyDay; id?: string; titleId: string }) {
  const { tl } = useI18n();
  return <article id={id} className={styles.detail} aria-labelledby={titleId}>
    <div className={styles.frame}>
      <JourneyImage src={day.image} scene={day.scene} alt={day.title} className={styles.detailImage} />
    </div>
    <div className={styles.copy}>
      <p className={styles.detailLabel}>{day.label}</p>
      <h3 id={titleId}>{day.title}</h3>
      <p className={styles.text}>{day.text}</p>
      {!!day.bullets?.length && <><h4>{tl("Үзэх, хийх зүйлс")}</h4>
        <ul>{day.bullets.map((bullet, index) => <li key={index}>{bullet}</li>)}</ul>
      </>}
    </div>
  </article>;
}
