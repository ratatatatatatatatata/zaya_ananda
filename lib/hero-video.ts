import { getSettingsCached } from "@/lib/repo";
import { signedDownloadUrl } from "@/lib/supabase";
import type { HeroSlot } from "@/lib/hero-slots";

export { HERO_SLOTS } from "@/lib/hero-slots";
export type { HeroSlot } from "@/lib/hero-slots";

export type HeroMedia = { kind: "video" | "image"; url: string };

async function resolve(src: string): Promise<string | undefined> {
  if (!src) return undefined;
  if (/^https?:\/\//.test(src) || src.startsWith("data:") || src.startsWith("/")) return src;
  try {
    return await signedDownloadUrl("lesson-videos", src);
  } catch {
    return undefined;
  }
}

/** Админаас тохируулсан толгойн дэвсгэр — бичлэг эсвэл зураг.
 *  Тохируулаагүй бол undefined буцаана; өгөгдмөл клип ажиллана. */
export async function heroMediaFor(slot: HeroSlot): Promise<HeroMedia | undefined> {
  try {
    const s = await getSettingsCached();
    const m = s.heroMedia?.[slot];
    if (m?.src) {
      const url = await resolve(m.src);
      return url ? { kind: m.kind === "image" ? "image" : "video", url } : undefined;
    }
    // Хуучин тохиргоо — зөвхөн бичлэг
    const legacy = s.heroVideos?.[slot];
    if (legacy) {
      const url = await resolve(legacy);
      return url ? { kind: "video", url } : undefined;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

/** Хуучин дуудлагуудтай нийцтэй байлгах — зөвхөн бичлэгийн хаяг буцаана. */
export async function heroVideoSrc(slot: HeroSlot): Promise<string | undefined> {
  const m = await heroMediaFor(slot);
  return m?.kind === "video" ? m.url : undefined;
}
