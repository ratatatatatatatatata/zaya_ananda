import type { Journey } from "@/data/journeys";
import { AboutGallery } from "@/components/home/AboutGallery";

export function JourneyGallery({ journey, headingLevel = 2 }: { journey: Journey; headingLevel?: 2 | 3 }) {
  const seen = new Set<string>();
  const images = [
    { image: journey.image, caption: journey.name },
    ...(journey.itinerary || []).map(day => ({ image: day.image, caption: day.title })),
    ...(journey.destination || []).map(place => ({ image: place.image, caption: place.title })),
  ].flatMap(photo => {
    const image = photo.image?.trim();
    if (!image || seen.has(image)) return [];
    seen.add(image);
    return [{ image, caption: photo.caption }];
  });
  if (!images.length) return null;
  const Heading = headingLevel === 3 ? "h3" : "h2";
  return <section aria-label="Аяллын зургууд" className="min-w-0">
    <Heading className="font-display text-3xl font-semibold text-ink sm:text-4xl">Аяллын зургууд</Heading>
    <div className="mt-6"><AboutGallery images={images} layout="landscape" label="Аяллын зургийн цомог" /></div>
  </section>;
}
