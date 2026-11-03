import type { CmsItem } from "./types";

/** Keep service photos separate from the decorative section background. */
export function serviceImage(item: CmsItem, services: CmsItem[]): string {
  const ownImage = item.image || item.images?.[0];
  if (ownImage) return ownImage;

  const normalize = (title: string) => title.normalize("NFC").trim().replace(/\s+/g, " ").toLowerCase();
  const title = normalize(item.title);
  if (!title) return "";
  const matches = new Set(services
    .filter(service => normalize(service.title) === title)
    .map(service => service.image || service.images?.[0])
    .filter((image): image is string => !!image));

  // Duplicate catalog entries may omit their photo. Reuse only an unambiguous
  // photo of the same named service, never a general landscape photograph.
  return matches.size === 1 ? [...matches][0] : "";
}
