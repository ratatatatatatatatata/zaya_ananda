import type { JourneyPhoto } from "@/data/journeys";

export function parseJourneyGallery(raw: unknown): JourneyPhoto[] {
  if (!Array.isArray(raw)) throw new Error("Нэмэлт зургуудын жагсаалт буруу байна.");
  if (raw.length > 30) throw new Error("Нэг аялалд 30 хүртэл нэмэлт зураг оруулна уу.");
  if (JSON.stringify(raw).length > 2000000) throw new Error("Нэмэлт зургуудын нийт хэмжээ хэт их байна. Цөөн зураг сонгоно уу.");
  return raw.map(photo => {
    if (!photo || typeof photo !== "object" || !("image" in photo) || typeof photo.image !== "string") throw new Error("Зургийн мэдээлэл буруу байна.");
    const image = photo.image.trim();
    if (!/^(https:\/\/|\/(?!\/)|data:image\/(jpeg|png|webp|gif);base64,)/i.test(image)) throw new Error("Зургийн холбоос буруу байна.");
    if (image.length > 1500000) throw new Error("Зургийн хэмжээ хэт их байна.");
    const caption = "caption" in photo && typeof photo.caption === "string" ? photo.caption.trim().slice(0, 200) : "";
    return { image, caption };
  });
}
