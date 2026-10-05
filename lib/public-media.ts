import { embedSrc, youtubeThumb, isVideoLink } from "./video-embed";
import { isSectionReel } from "./section-reels";
import type { CmsItem } from "./types";

export type GiftCategory = "podcast" | "meditation" | "advice";
export function giftCategory(item: Pick<CmsItem, "title" | "category">): GiftCategory {
  const text = `${item.category || ""} ${item.title}`;
  if (/podcast|подкаст|season\s*\d|episode\s*\d/i.test(text)) return "podcast";
  if (/бясалгал|дасгал|meditation|exercise|practice/i.test(item.category || item.title)) return "meditation";
  return "advice";
}

export type PublicEpisode = { id:string; title:string; url:string; poster:string; kind:"reel"|"podcast"; category:GiftCategory; mediaType?:"image"; summary?:string };
/** Only public media records are passed here; paid course lessons are never included. */
export function collectPublicMedia(items:CmsItem[]):PublicEpisode[] {
  const seen = new Set<string>();
  const videos:PublicEpisode[] = [];
  for(const item of items) {
    if(item.kind !== "free" && item.kind !== "resource") continue;
    if (Number(item.price || 0) > 0) continue;
    const sources = [{title:item.title,url:item.link,uploaded:false}, ...(item.lessons || []).map((lesson,index) => ({...lesson, uploaded:!!lesson.path, url:lesson.path ? `/api/public-media?itemId=${encodeURIComponent(item.id)}&index=${index}` : lesson.url}))];
    const startLength = videos.length;
    for(const source of sources) {
      if(!source.url || (!source.uploaded && !isVideoLink(source.url))) continue;
      const embed = embedSrc(source.url);
      const key=embed.youtubeId || embed.src;
      if(seen.has(key)) continue;
      seen.add(key);
      const title=source.title || item.title;
      const podcast=/podcast|подкаст|season\s*\d|episode\s*\d/i.test(`${title} ${item.title} ${item.category || ""}`);
      videos.push({id:`${item.id}-${videos.length}`,title,url:source.url,poster:item.image || item.images?.[0] || (embed.youtubeId ? youtubeThumb(embed.youtubeId) : "/video/meditation.jpg"),kind:podcast?"podcast":"reel",category:podcast ? "podcast" : giftCategory(item),summary:item.summary});
    }
    if (isSectionReel(item) && startLength === videos.length && item.image) videos.push({id:item.id,title:item.title,url:"",poster:item.image,kind:"reel",category:"advice",mediaType:"image",summary:item.summary});
  }
  return videos;
}
