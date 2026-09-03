"use client";

import { MouseParallax } from "./MouseParallax";

/* Зөөлөн, тансаг дэвсгэр — бүдэг градиент ба аура, хулганын мичлэлээр гүнзгий
   гурван давхарга болж хөдөлнэ (ойрхон давхарга хурдан, хол давхарга удаан —
   жинхэнэ гүн мэдрэмж, 3D сан ашиглалгүйгээр). */
export function CosmicBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* soft moving gradient wash */}
      <div className="absolute inset-0 bg-aurora opacity-80" style={{ backgroundSize: "180% 180%" }} />

      {/* aura blobs — бүгд inset сөрөг талдаа, гарчиг бүхий агуулгыг бүрхэхгүй.
          Гүн давхарга: хамгийн бага хөдөлгөөнтэй, том, бүдэг. */}
      <MouseParallax strength={10} className="absolute -left-24 top-10 h-[34rem] w-[34rem]">
        <div className="h-full w-full rounded-full bg-primary-200/35 blur-3xl animate-glowPulse" />
      </MouseParallax>
      <MouseParallax strength={18} className="absolute -right-24 top-1/3 h-[30rem] w-[30rem]">
        <div className="h-full w-full rounded-full bg-lavender-300/35 blur-3xl animate-glowPulse" style={{ animationDelay: "2s" }} />
      </MouseParallax>
      <MouseParallax strength={26} className="absolute -bottom-32 left-1/4 h-[32rem] w-[32rem]">
        <div className="h-full w-full rounded-full bg-accent-100/45 blur-3xl animate-glowPulse" style={{ animationDelay: "4s" }} />
      </MouseParallax>

      {/* Нарийн цэгэн тор — орчин үеийн, "хэвлэсэн цаас" гадаргууг нэмнэ */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(rgb(var(--c-p600) / 0.16) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(70% 60% at 50% 0%, #000 0%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(70% 60% at 50% 0%, #000 0%, transparent 75%)",
        }}
      />
    </div>
  );
}
