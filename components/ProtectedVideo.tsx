"use client";

import { useEffect, useRef, useState } from "react";

/** Хамгаалалттай видео тоглуулагч (гэрээний 3-р зүйл: усан тэмдэг, татахаас хамгаалах).
 *  - Хэрэглэгчийн таних тэмдэг + цагийг харуулсан хөдөлгөөнт усан тэмдэг (дэлгэц бичихэд ул мөр үлдэнэ)
 *  - Татах цэс, баруун товчны цэс, зураг-дотор-зураг, хурд солих боломжийг хаана
 *  - Гарын товчлолоор татахыг хязгаарлана */
export function ProtectedVideo({ src, mark, poster }: { src: string; mark: string; poster?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 8, y: 10 });
  const [stamp, setStamp] = useState("");

  // Усан тэмдэг 7 секунд тутам байрлалаа солино — таслах, халхлахад хэцүү
  useEffect(() => {
    const tick = () => {
      setPos({ x: 6 + Math.random() * 66, y: 8 + Math.random() * 74 });
      setStamp(new Date().toLocaleString("mn-MN", { dateStyle: "short", timeStyle: "short" }));
    };
    tick();
    const t = setInterval(tick, 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      ref={wrap}
      className="relative overflow-hidden rounded-2xl bg-black"
      onContextMenu={(e) => e.preventDefault()}
    >
      <video
        className="h-full w-full"
        src={src}
        poster={poster}
        controls
        controlsList="nodownload noplaybackrate noremoteplayback"
        disablePictureInPicture
        playsInline
        onContextMenu={(e) => e.preventDefault()}
      />
      {/* Усан тэмдэг — хэрэглэгчийн ул мөр */}
      <div
        aria-hidden
        className="pointer-events-none absolute select-none transition-all duration-1000"
        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      >
        <span className="rounded bg-black/20 px-2 py-1 text-[11px] font-semibold tracking-wide text-white/45 backdrop-blur-[1px]">
          {mark} · {stamp}
        </span>
      </div>
    </div>
  );
}
