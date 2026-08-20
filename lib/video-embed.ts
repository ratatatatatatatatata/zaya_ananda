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
  return { type: "video", src: url };
}

/** YouTube-ийн урьдчилсан зураг (thumbnail) */
export function youtubeThumb(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
