import type { Journey } from "@/data/journeys";
import { AboutGallery } from "@/components/home/AboutGallery";

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
  return <section aria-label="Аяллын зургууд" className="min-w-0 py-6">
    <Heading className="font-display text-2xl font-semibold text-ink sm:text-3xl">Аяллын зургууд</Heading>
    <div className="mt-6"><AboutGallery images={images} layout="scattered" label="Аяллын зургийн цомог" /></div>
  </section>;
}
