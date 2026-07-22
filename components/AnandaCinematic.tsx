"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

const SCRUB_SRC = "/ananda_scrub.mp4";
const POSTER = "/poster_night.jpg";
const POSTER_MED = "/poster_meditation.jpg";

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const Lx = (mn: string, en: string, ko: string, ja: string, zh: string) => ({ mn, en, ko, ja, zh });

const HERO_SUB = Lx(
  "Бясалгал, энергийн тэнцвэр, хувь хүний хөгжил болон мэргэжлийн сургалтаар дамжуулан дотоод ертөнцөө нээгээрэй.",
  "Open your inner world through meditation, energy balance, personal growth and professional training.",
  "명상, 에너지 균형, 자기계발, 전문 교육을 통해 내면의 세계를 열어보세요.",
  "瞑想・エネルギーの調和・自己成長・専門講座を通じて、内なる世界を開きましょう。",
  "通过冥想、能量平衡、个人成长与专业培训，开启你的内在世界。"
);
const TOOROG = Lx("Төөрөг үзэх", "View your fortune", "오늘의 운세", "今日の運勢", "查看运势");
const AYALAL = Lx("Сүнслэг аялал", "Spiritual Journey", "영적 여행", "スピリチュアルな旅", "灵性之旅");

export function AnandaCinematic() {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pRef = useRef(0);
  const [p, setP] = useState(0);
  const [mode, setMode] = useState<"scrub" | "loop" | "static">("scrub");
  const { t, tr } = useI18n();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const wide = window.matchMedia("(min-width: 768px)").matches;
    setMode(reduce ? "static" : fine && wide ? "scrub" : "loop");
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current; if (!el) return;
        const total = el.offsetHeight - window.innerHeight;
        const passed = Math.min(Math.max(-el.getBoundingClientRect().top, 0), Math.max(total, 1));
        const v = total > 0 ? passed / total : 0;
        pRef.current = v; setP(v);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    if (mode !== "scrub") return;
    const v = videoRef.current; if (!v) return;
    let raf = 0, cur = 0, dur = 0;
    const onMeta = () => { dur = v.duration || 0; };
    v.addEventListener("loadedmetadata", onMeta);
    if (v.readyState >= 1) dur = v.duration || 0;
    try { v.pause(); } catch { /* noop */ }
    const tick = () => {
      if (dur > 0) {
        const target = pRef.current * dur;
        cur += (target - cur) * 0.12;
        if (Math.abs(target - cur) < 0.004) cur = target;
        try { v.currentTime = cur; } catch { /* seeking */ }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); v.removeEventListener("loadedmetadata", onMeta); };
  }, [mode]);

  useEffect(() => {
    if (mode !== "loop") return;
    const v = videoRef.current; if (!v) return;
    v.loop = true; v.muted = true;
    v.play().catch(() => { /* autoplay blocked */ });
  }, [mode]);

  useEffect(() => {
    if (mode === "static") return;
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext("2d"); if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const N = mobile ? 22 : 60;
    let w = 0, h = 0, raf = 0;
    const mouse = { x: -1, y: -1 };
    const parts = Array.from({ length: N }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 2 + 0.6, s: Math.random() * 0.03 + 0.01, o: Math.random() * 0.5 + 0.22, tw: Math.random() * Math.PI * 2 }));
    const resize = () => { w = cv.clientWidth; h = cv.clientHeight; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize();
    const onMove = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); mouse.x = (e.clientX - r.left) / w; mouse.y = (e.clientY - r.top) / h; };
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const pr = pRef.current;
      const col = pr < 0.33 ? [212, 222, 255] : pr < 0.6 ? [255, 224, 168] : [176, 240, 228];
      for (const a of parts) {
        a.y -= a.s / 100; if (a.y < -0.03) { a.y = 1.03; a.x = Math.random(); }
        let px = a.x * w, py = a.y * h;
        if (mouse.x >= 0) { const dx = a.x - mouse.x, dy = a.y - mouse.y; if (dx * dx + dy * dy < 0.009) { px += dx * 42; py += dy * 42; } }
        a.tw += 0.03; const tw = 0.6 + Math.sin(a.tw) * 0.4;
        ctx.beginPath(); ctx.arc(px, py, a.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${(a.o * tw).toFixed(3)})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", onMove); };
  }, [mode]);

  const stat = mode === "static";
  const heroO = stat ? 1 : seg(p, 0.72, 0.93);
  const auraO = heroO * 0.6;

  return (
    <section ref={ref} className="relative" style={{ height: stat ? "110vh" : "440vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-[#0b1020]">
        {stat ? (
          <img src={POSTER_MED} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: "center 42%" }} />
        ) : (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "center 42%" }}
            src={SCRUB_SRC}
            poster={POSTER}
            muted
            playsInline
            preload="auto"
            tabIndex={-1}
            aria-hidden
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
          />
        )}

        <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,14,30,0.66) 0%, rgba(8,14,30,0.12) 46%, rgba(8,14,30,0) 66%)", opacity: 0.5 + heroO * 0.5 }} />
        <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />
        <div className="pointer-events-none absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: "48vmin", height: "48vmin", opacity: auraO, background: "radial-gradient(circle, rgba(120,230,210,0.4), rgba(120,230,210,0) 68%)", filter: "blur(6px)" }} aria-hidden />

        {/* HERO TEXT — revealed when the video reaches the meditation ending */}
        <div className="absolute inset-x-0 bottom-[9vh] px-6" style={{ opacity: heroO, transform: `translateY(${(1 - heroO) * 28}px)`, pointerEvents: heroO > 0.3 ? "auto" : "none" }}>
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-display text-balance text-[2.15rem] font-semibold leading-[1.12] text-white sm:text-5xl lg:text-[3.6rem]" style={{ textShadow: "0 2px 24px rgba(0,0,0,0.6)" }}>
              {t("hero2.title")}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl" style={{ textShadow: "0 1px 14px rgba(0,0,0,0.6)" }}>
              {tr(HERO_SUB)}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/services" className="btn btn-magic btn-lg animate-gradientShift">{t("hero2.cta1")}</Link>
              <Link href="/courses" className="btn btn-lg border-2 border-white/70 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20">{t("hero2.cta2")}</Link>
              <Link href="/ayalal" className="btn btn-lg text-white shadow-[0_16px_40px_-14px_rgba(155,110,240,0.6)] hover:brightness-110 hover:-translate-y-0.5" style={{ backgroundImage: "linear-gradient(120deg,#9B6EF0,#5E8DE0)" }}>🕊 {tr(AYALAL)}</Link>
              <Link href="/toorog" className="btn btn-gold btn-lg">✦ {tr(TOOROG)}</Link>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-4 flex flex-col items-center gap-1" style={{ opacity: clamp01(0.75 - p * 3) }} aria-hidden>
          <span className="animate-floaty text-2xl text-white/80">⌄</span>
        </div>
      </div>
    </section>
  );
}
