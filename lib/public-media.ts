import { embedSrc, youtubeThumb } from "./video-embed";
import type { CmsItem } from "./types";

export type PublicEpisode = { id:string; title:string; url:string; poster:string; kind:"reel"|"podcast" };
/** Only public media records are passed here; paid course lessons are never included. */
export function collectPublicMedia(items:CmsItem[]):PublicEpisode[] {
  const seen = new Set<string>();
  const videos:PublicEpisode[] = [];
  for(const item of items) {
    if(item.kind !== "free" && item.kind !== "resource") continue;
    const sources = [{title:item.title,url:item.link}, ...(item.lessons || [])];
    for(const source of sources) {
      if(!source.url || !/^https:\/\//i.test(source.url)) continue;
      const embed = embedSrc(source.url);
      if(embed.type !== "iframe" && !/\.(mp4|webm|m4v)(\?|$)/i.test(source.url)) continue;
      const key=embed.youtubeId || embed.src;
      if(seen.has(key)) continue;
      seen.add(key);
      const title=source.title || item.title;
      const podcast=/podcast|подкаст|season\s*\d|episode\s*\d/i.test(`${title} ${item.title} ${item.category || ""}`);
      videos.push({id:`${item.id}-${videos.length}`,title,url:source.url,poster:item.image || item.images?.[0] || (embed.youtubeId ? youtubeThumb(embed.youtubeId) : "/video/meditation.jpg"),kind:podcast?"podcast":"reel"});
    }
  }
  return videos;
}
