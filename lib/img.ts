/** Supabase Storage-ийн нийтийн (public) зургийг Next.js-ийн зураг шахагчаар дамжуулна.
 *  Анхны файл хэвээр хадгалагдана — зөвхөн харуулахдаа тухайн өргөнд тааруулж
 *  WebP/AVIF болгож шахаж, CDN-д кэшлэнэ. Бусад эх үүсвэр (data:, /public, гадны URL) өөрчлөгдөхгүй.
 *
 *  Өргөн нь next.config-ийн deviceSizes/imageSizes-д байх ёстой. */
export type ImgWidth = 128 | 256 | 384 | 640 | 828 | 1200 | 1920;

const PUBLIC_STORAGE = /^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\//i;

export function imgSrc(src: string | undefined | null, width: ImgWidth = 828, quality = 75): string {
  if (!src) return "";
  if (!PUBLIC_STORAGE.test(src)) return src;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}
