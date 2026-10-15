import { uploadReelMedia } from "./reel-upload";

/** Store the original public CMS image: no resizing, cropping or format conversion. */
export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Зургийн файл сонгоно уу.");
  return uploadReelMedia(file, () => {});
}
