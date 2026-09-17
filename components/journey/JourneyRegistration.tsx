import type { ReactNode } from "react";
import type { Journey } from "@/data/journeys";
import { JourneyGallery } from "./JourneyGallery";
import { JourneyBooking } from "./JourneyBooking";
import styles from "./JourneyRegistration.module.css";

export function JourneyRegistration({ journey, heading, id, headingLevel = 2 }: {
  journey: Journey; heading?: ReactNode; id?: string; headingLevel?: 2 | 3;
}) {
  const hasPhotos = journey.gallery?.some(photo => photo.image?.trim());
  return <div className={styles.container}>
    <div className={`${styles.layout} ${hasPhotos ? styles.withPhotos : ""}`}>
      {hasPhotos && <JourneyGallery journey={journey} headingLevel={headingLevel} />}
      <div id={id} className={styles.booking}>
        {heading && <div className="mb-8">{heading}</div>}
        <JourneyBooking slug={journey.slug} journeyName={journey.name} prepay={journey.prepay} />
      </div>
    </div>
  </div>;
}
