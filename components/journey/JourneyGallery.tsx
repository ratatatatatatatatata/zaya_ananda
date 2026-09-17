import type { Journey } from "@/data/journeys";
import styles from "./JourneyGallery.module.css";

export function JourneyGallery({ journey, headingLevel = 2 }: { journey: Journey; headingLevel?: 2 | 3 }) {
  const seen = new Set<string>();
  const images = (journey.gallery || []).flatMap(photo => {
    const image = photo.image?.trim();
    if (!image || seen.has(image)) return [];
    seen.add(image);
    return [{ image, caption: photo.caption }];
  });
  if (!images.length) return null;
  const Heading = headingLevel === 3 ? "h3" : "h2";
  return <section aria-label="Аяллын зургууд" className={styles.gallery}>
    <Heading className="font-display text-3xl font-semibold text-ink sm:text-4xl">Аяллын зургууд</Heading>
    <div className={styles.collage} data-remainder={images.length % 6}>
      {images.map((photo, index) => <figure key={photo.image} className={styles.photo}>
        <img src={photo.image} alt={photo.caption || `Аяллын зураг ${index + 1}`} loading="lazy" />
        {photo.caption && <figcaption>{photo.caption}</figcaption>}
      </figure>)}
    </div>
  </section>;
}
