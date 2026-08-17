import { getSettingsCached } from "@/lib/repo";
import { signedDownloadUrl } from "@/lib/supabase";
import type { HeroSlot } from "@/lib/hero-slots";

export { HERO_SLOTS } from "@/lib/hero-slots";
export type { HeroSlot } from "@/lib/hero-slots";

/** Админаас байршуулсан толгойн бичлэгийн хаяг.
 *  Байхгүй бол undefined буцаана — өгөгдмөл клип ажиллана. */
export async function heroVideoSrc(slot: HeroSlot): Promise<string | undefined> {
  try {
    const s = await getSettingsCached();
    const v = s.heroVideos?.[slot];
    if (!v) return undefined;
    if (/^https?:\/\//.test(v)) return v;
    return await signedDownloadUrl("lesson-videos", v);
  } catch {
    return undefined;
  }
}
