import { listCmsCached } from "@/lib/repo";
import { collectPublicMedia } from "@/lib/public-media";
import { reelCategory, REEL_SECTIONS, type ReelSection } from "@/lib/section-reels";
import { SectionReelPlayer } from "./SectionReelPlayer";

export async function SectionReels({ section }: { section: ReelSection }) {
  const items = (await listCmsCached("free")).filter(item => item.category === reelCategory(section));
  const reels = collectPublicMedia(items);
  if (!reels.length) return null;
  return <section className="section bg-surface-2"><div className="container-px">
    <p className="text-sm text-muted">{REEL_SECTIONS[section]}</p>
    <h2 className="mt-2 font-display text-3xl font-semibold text-ink">Reel</h2>
    <SectionReelPlayer reels={reels} />
  </div></section>;
}
