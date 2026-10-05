/** Видео линкийг хуудсан дотор тоглох хаяг руу хөрвүүлнэ.
 *  YouTube-ийг nocookie домэйнээр, холбоотой видео/брэндийг багасгаж оруулна —
 *  ингэснээр хэрэглэгч YouTube рүү шилжихгүйгээр эндээ үзнэ. */

export type Embed = { type: "iframe" | "video"; src: string; youtubeId?: string };

const YT = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtube\.com\/live\/)([\w-]{11})/;
const VIMEO = /vimeo\.com\/(?:video\/)?(\d+)/;

export function embedSrc(url: string, autoplay = false): Embed {
  const yt = url.match(YT);
  if (yt) {
    const q = new URLSearchParams({
      rel: "0",              // холбоотой видео зөвхөн энэ сувгаас
      modestbranding: "1",   // YouTube лого багасгах
      playsinline: "1",      // утсан дээр бүтэн дэлгэц рүү үсрэхгүй
      iv_load_policy: "3",   // тайлбар/annotation унтраах
      color: "white",
    });
    if (autoplay) q.set("autoplay", "1");
    return { type: "iframe", src: `https://www.youtube-nocookie.com/embed/${yt[1]}?${q}`, youtubeId: yt[1] };
  }
  const vm = url.match(VIMEO);
  if (vm) return { type: "iframe", src: `https://player.vimeo.com/video/${vm[1]}${autoplay ? "?autoplay=1" : ""}` };
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "https:" && /^(www\.|m\.)?facebook\.com$/.test(parsed.hostname) && /^\/(reel\/|watch\/?|[^/]+\/videos\/|share\/r\/)/.test(parsed.pathname)) {
      return { type: "iframe", src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=${autoplay ? "true" : "false"}` };
    }
    const instagram = parsed.pathname.match(/^\/(?:reel|p)\/([\w-]+)\/?$/);
    if (parsed.protocol === "https:" && /^(www\.)?instagram\.com$/.test(parsed.hostname) && instagram) return { type: "iframe", src: `https://www.instagram.com/p/${instagram[1]}/embed/` };
  } catch { /* Native video and internal public-media endpoint. */ }
  return { type: "video", src: url };
}

export function isVideoLink(url: string): boolean {
  return /^https:\/\//i.test(url) && (embedSrc(url).type === "iframe" || /\.(mp4|webm|m4v|mov)(\?|$)/i.test(url));
}

/** YouTube-ийн урьдчилсан зураг (thumbnail) */
export function youtubeThumb(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
