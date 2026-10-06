export const REEL_BUCKET = "reel-media";
export const REEL_MAX_BYTES = 500 * 1024 * 1024;
export const REEL_MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif",
  "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov", "video/x-m4v": "m4v",
};
export function reelUploadError(mime: string, size: number): string | null {
  if (!REEL_MIME_EXT[mime]) return "JPG, PNG, WebP, GIF зураг эсвэл MP4, WebM, MOV видео сонгоно уу.";
  const limit = mime.startsWith("image/") ? 10 * 1024 * 1024 : REEL_MAX_BYTES;
  if (!Number.isFinite(size) || size <= 0 || size > limit) return `Файлын хэмжээ 0-ээс их, ${limit / 1024 / 1024} MB хүртэл байна.`;
  return null;
}

/** Only intentionally public Reel/Gift assets use this uploader. Paid lessons stay private. */
export async function uploadReelMedia(file: File, onProgress: (percent: number) => void): Promise<string> {
  const error = reelUploadError(file.type, file.size);
  if (error) throw new Error(error);
  const response = await fetch("/api/admin/reel-upload-url", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mime: file.type, size: file.size }) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Upload эхлүүлж чадсангүй.");
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", data.uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.setRequestHeader("Cache-Control", "max-age=31536000");
    xhr.timeout = 30 * 60 * 1000;
    xhr.upload.onprogress = event => { if (event.lengthComputable) onProgress(Math.round(event.loaded / event.total * 100)); };
    xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload амжилтгүй (${xhr.status}). Файлын хэмжээ, төрлийг шалгаад дахин оролдоно уу.`));
    xhr.onerror = xhr.ontimeout = () => reject(new Error("Upload тасарлаа. Сүлжээгээ шалгаад дахин сонгоно уу."));
    xhr.send(file);
  });
  return data.url;
}
