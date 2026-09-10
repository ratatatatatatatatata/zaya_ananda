import { sbSelect, sbInsert, sbDelete } from "@/lib/supabase";

export type MediaFile = {
  id: string;
  filename: string;
  path: string;
  kind: "image" | "video" | "other";
  mime?: string;
  size?: number;
  createdAt: string;
};

/** Бүх байршуулсан зураг, бичлэгийн жагсаалт — сүүлд орсноор нь эрэмбэлнэ. */
export async function listMedia(): Promise<MediaFile[]> {
  return sbSelect<MediaFile>("media_library", "order=created_at.desc&limit=500");
}

export async function createMedia(input: { filename: string; path: string; kind: MediaFile["kind"]; mime?: string; size?: number }): Promise<MediaFile> {
  return sbInsert<MediaFile>("media_library", input);
}

export async function deleteMedia(id: string): Promise<void> {
  return sbDelete("media_library", id);
}
