import type { Destination, Scene } from "@/data/journeys";
import { JourneyImage } from "./SceneArt";
import styles from "./DestinationGallery.module.css";

export function DestinationGallery({ places, scene }: { places: Destination[]; scene: Scene }) {
  return (
    <div className={styles.grid}>
      {places.map((place, index) => (
        <details key={`${place.title}-${index}`} className={styles.card}>
          <summary className={styles.preview}>
            <JourneyImage src={place.image} scene={scene} alt="" className={styles.image} />
            <span className={styles.caption}>
              <strong className={styles.title}>{place.title || `Очих газар ${index + 1}`}</strong>
              <span className={styles.action}>
                <span className={styles.closedLabel}>Дэлгэрэнгүй үзэх</span>
                <span className={styles.openLabel}>Хураах</span>
                <span className={styles.icon} aria-hidden>+</span>
              </span>
            </span>
          </summary>
          <div className={styles.description}>
            <p>{place.desc?.trim() || "Энэ газрын дэлгэрэнгүй мэдээлэл удахгүй нэмэгдэнэ."}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
