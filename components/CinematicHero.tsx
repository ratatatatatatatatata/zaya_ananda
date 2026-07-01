"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4";

export function CinematicHero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Custom fade-in / fade-out manual loop (no native loop attribute).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      v.style.opacity = "1";
      v.removeAttribute("autoplay");
      try { v.pause(); } catch { /* noop */ }
      return;
    }

    const FADE = 0.5;
    let raf = 0;

    const tick = () => {
      const d = v.duration;
      if (d && !Number.isNaN(d)) {
        const t = v.currentTime;
        let o = 1;
        if (t < FADE) o = t / FADE;
        else if (t > d - FADE) o = (d - t) / FADE;
        v.style.opacity = String(Math.max(0, Math.min(1, o)));
      }
      raf = requestAnimationFrame(tick);
    };

    const onEnded = () => {
      v.style.opacity = "0";
      window.setTimeout(() => {
        v.currentTime = 0;
        v.play().catch(() => { /* autoplay may be blocked */ });
      }, 100);
    };

    v.addEventListener("ended", onEnded);
    v.play().catch(() => { /* autoplay may be blocked */ });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      v.removeEventListener("ended", onEnded);
    };
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-white">
      {/* full-bleed video background (z-0) */}
      <video
        ref={videoRef}
        className="absolute z-0 h-full w-full select-none object-cover"
        style={{ inset: 0, opacity: 0 }}
        src={VIDEO_URL}
        muted
        playsInline
        autoPlay
        preload="auto"
        aria-hidden
      />

      {/* soft white fade at the very top only (blends under the header); NO white at the bottom */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0) 20%, rgba(255,255,255,0) 100%)" }}
      />

      {/* hero content (z-10) */}
      <div
        className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 text-center"
        style={{ paddingTop: "calc(8rem - 75px)", paddingBottom: "8rem" }}
      >
        <h1
          className="font-instrument max-w-7xl animate-fade-rise font-normal text-5xl sm:text-7xl md:text-8xl"
          style={{ lineHeight: 0.95, letterSpacing: "-2.46px", color: "#000000", textShadow: "0 2px 22px rgba(255,255,255,0.92), 0 1px 2px rgba(255,255,255,0.96)" }}
        >
          <span style={{ color: "#6F6F6F", fontStyle: "italic" }}>Чимээгүйн</span> цаана, бид{" "}
          <span style={{ color: "#6F6F6F", fontStyle: "italic" }}>мөнхийг</span> цогцлооно.
        </h1>

        <p
          className="font-inter mt-8 max-w-2xl animate-fade-rise-delay text-base leading-relaxed sm:text-lg"
          style={{ color: "#5A5A5A", textShadow: "0 1px 16px rgba(255,255,255,0.95)" }}
        >
          Гялалзсан оюун, зоригт бүтээгчид, гүн гүнзгий сэтгэлт хүмүүст зориулсан орон зайг бид босгож
          байна. Шуугианыг нэвт — гүн ажил, цэвэр урсгалд зориулсан дижитал амгаланг цогцлооно.
        </p>

        <Link
          href="/services"
          className="font-inter mt-12 inline-block animate-fade-rise-delay-2 rounded-full px-14 py-5 text-base font-medium shadow-xl transition-transform duration-200 hover:scale-[1.03]"
          style={{ backgroundColor: "#000000", color: "#FFFFFF" }}
        >
          Аялалаа эхлүүлэх
        </Link>
      </div>
    </section>
  );
}
