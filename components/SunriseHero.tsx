"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { T } from "./T";

/* scattered, clustered night-sky stars */
const stars = (() => {
  let seed = 20260630 >>> 0;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const out: { x: number; y: number; sz: number; o: number; d: number; tw: boolean }[] = [];
  const push = (x: number, y: number, sz: number, o: number, tw: boolean) => {
    if (x >= -1 && x <= 101 && y >= 0 && y <= 82) out.push({ x: +x.toFixed(2), y: +y.toFixed(2), sz: +sz.toFixed(1), o: +o.toFixed(2), d: +(rnd() * 5).toFixed(2), tw });
  };
  for (let c = 0; c < 7; c++) {
    const cx = rnd() * 100, cy = rnd() * 56;
    const n = 4 + Math.floor(rnd() * 9);
    for (let i = 0; i < n; i++) { const a = rnd() * Math.PI * 2, rad = rnd() * rnd() * 13; push(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad * 0.7, rnd() * 1.5 + 0.7, rnd() * 0.5 + 0.3, rnd() > 0.5); }
  }
  for (let i = 0; i < 46; i++) push(rnd() * 100, rnd() * 72, rnd() * 2.2 + 0.6, rnd() * 0.55 + 0.22, rnd() > 0.45);
  for (let i = 0; i < 6; i++) push(rnd() * 100, rnd() * 50, rnd() * 1.8 + 2.6, rnd() * 0.25 + 0.72, true);
  return out;
})();
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/* chakra glow overlay positions (% of figure image height), root → crown */
const chakraStops = [
  { t: 78, c: "#E5454C" }, // root
  { t: 67, c: "#F2922F" }, // sacral
  { t: 56, c: "#F2C633" }, // solar plexus
  { t: 45, c: "#46BE6E" }, // heart
  { t: 33, c: "#37A7DE" }, // throat
  { t: 17, c: "#3D5BD0" }, // third eye
  { t: 7, c: "#9B57D8" },  // crown
];

export function SunriseHero() {
  const ref = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const glowEl = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [personOk, setPersonOk] = useState(false);
  const [treeOk, setTreeOk] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setP(1); return; }
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current; if (!el) return;
        const total = el.offsetHeight - window.innerHeight;
        const passed = Math.min(Math.max(-el.getBoundingClientRect().top, 0), Math.max(total, 1));
        setP(total > 0 ? passed / total : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    const el = sceneRef.current; if (!el) return;
    const move = (e: PointerEvent) => { if (glowEl.current) { glowEl.current.style.opacity = "1"; glowEl.current.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; } };
    const leave = () => { if (glowEl.current) glowEl.current.style.opacity = "0"; };
    el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, []);

  // scene timeline (p: 0 = night → 1 = full day)
  const starsO = clamp01(1 - p * 1.7);
  const nightO = clamp01(1 - p * 1.5);
  const dawnO = clamp01(1 - Math.abs(p - 0.46) * 2.4);
  const dayO = clamp01((p - 0.4) / 0.42);
  const treeImgO = clamp01((p - 0.46) / 0.4);          // painterly sunrise-tree scene reveal
  const sunUp = clamp01((p - 0.26) / 0.6);
  const sunO = clamp01((p - 0.28) / 0.26) * clamp01(1 - (p - 0.52) / 0.22); // rises, then hands off to the painting's sun
  const figO = clamp01((p - 0.44) / 0.32);             // meditating figure arrives at the sunrise peak
  const textO = clamp01((p - 0.5) / 0.28) * clamp01(1 - (p - 0.92) / 0.08);
  const cueO = clamp01(0.7 - p * 2.2);
  const figScale = 0.92 + figO * 0.06 + clamp01((p - 0.46) / 0.5) * 0.22;

  return (
    <section ref={ref} className="relative h-[170vh] sm:h-[195vh]">
      <div ref={sceneRef} className="sticky top-0 h-screen overflow-hidden">
        {/* sky layers */}
        <div className="absolute inset-0" style={{ opacity: nightO, background: "linear-gradient(180deg,#0b1238 0%,#172253 52%,#2c3672 100%)" }} />
        <div className="absolute inset-0" style={{ opacity: dawnO, background: "linear-gradient(180deg,#2e2a68 0%,#7a4a86 44%,#d98a86 78%,#f2b67c 100%)" }} />
        <div className="absolute inset-0" style={{ opacity: dayO, background: "linear-gradient(180deg,#c6e6ff 0%,#ffeccb 58%,#ffdca2 100%)" }} />

        {/* stars */}
        <div className="absolute inset-0" style={{ opacity: starsO, transform: `translateY(${(-p * 26).toFixed(0)}px)` }}>
          {stars.map((st, i) => (<span key={i} className={"absolute rounded-full bg-white" + (st.tw ? " animate-twinkle" : "")} style={{ left: st.x + "%", top: st.y + "%", width: st.sz, height: st.sz, opacity: st.o, boxShadow: `0 0 ${(st.sz * 1.7).toFixed(1)}px #ffffff`, animationDelay: st.d + "s" }} />))}
        </div>

        {/* moon (fades early) */}
        <div className="absolute" style={{ left: "14%", top: "15%", opacity: clamp01(1 - p * 2.2) }}>
          <div className="h-16 w-16 rounded-full bg-[#f4f1e4] shadow-[0_0_40px_12px_rgba(244,241,228,0.45)]" />
        </div>

        {/* rising sun — hands off to the painting's own sun */}
        <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: `${(-16 + sunUp * 42).toFixed(1)}vh`, opacity: sunO }}>
          <div className="relative grid place-items-center">
            <div className="absolute rounded-full" style={{ width: "48rem", height: "48rem", background: "radial-gradient(circle, rgba(255,221,150,0.6), rgba(255,221,150,0) 62%)", transform: `scale(${(0.7 + sunUp * 0.6).toFixed(2)})` }} />
            <div className="h-56 w-56 rounded-full" style={{ background: "radial-gradient(circle at 50% 45%, #fff7e0, #ffce72 60%, #ffb84d)", boxShadow: "0 0 90px 30px rgba(255,200,110,0.5)" }} />
          </div>
        </div>

        {/* painterly sunrise-tree scene (mod.jpg) revealed at the climax */}
        <img src="/mod.jpg" alt="" className="hidden" onLoad={() => setTreeOk(true)} onError={() => setTreeOk(false)} />
        {treeOk && (
          <div className="absolute inset-0" style={{ opacity: treeImgO }}>
            <img src="/mod.jpg" alt="" draggable={false} className="h-full w-full select-none object-cover object-bottom" style={{ transform: `scale(${(1.08 - treeImgO * 0.08).toFixed(3)})` }} />
            {/* gentle warm wash + grounding gradient to seat the figure */}
            <div className="absolute inset-0" style={{ background: "radial-gradient(120% 80% at 50% 30%, rgba(255,228,170,0.18), transparent 60%)" }} />
            <div className="absolute inset-x-0 bottom-0 h-[34%]" style={{ background: "linear-gradient(180deg, rgba(20,40,20,0) 0%, rgba(18,34,16,0.45) 100%)" }} />
          </div>
        )}

        {/* pointer-follow sparkle glow */}
        <div ref={glowEl} className="pointer-events-none absolute left-0 top-0 -ml-44 -mt-44 rounded-full opacity-0 transition-opacity duration-300" style={{ width: "22rem", height: "22rem", background: "radial-gradient(circle, rgba(255,255,255,0.22), transparent 68%)", mixBlendMode: "screen" }} />

        {/* meditating figure (hun.jpg) — already carries the 7 chakras; overlay glows light them up in sequence */}
        <img src="/hun.jpg" alt="" className="hidden" onLoad={() => setPersonOk(true)} onError={() => setPersonOk(false)} />
        {personOk && (
          <div className="absolute bottom-[2vh] left-1/2" style={{ opacity: figO, transformOrigin: "50% 100%", transform: `translateX(-50%) scale(${figScale.toFixed(3)})` }}>
            <div className="relative">
              <span className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[64%] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(ellipse at center, rgba(255,240,205,0.5), transparent 70%)" }} />
              <img
                src="/hun.jpg"
                alt=""
                draggable={false}
                className="relative h-[52vh] w-auto select-none sm:h-[64vh]"
                style={{
                  WebkitMaskImage: "radial-gradient(ellipse 42% 84% at 50% 54%, #000 58%, transparent 88%)",
                  maskImage: "radial-gradient(ellipse 42% 84% at 50% 54%, #000 58%, transparent 88%)",
                }}
              />
              {/* sequential chakra brighten aligned to the painted chakras */}
              <div className="pointer-events-none absolute inset-0">
                {chakraStops.map((ch, i) => {
                  const o = clamp01((p - (0.56 + i * 0.045)) / 0.16);
                  return (
                    <span key={i} className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: "50%", top: ch.t + "%", width: 22, height: 22, opacity: o, background: `radial-gradient(circle, #ffffff 14%, ${ch.c} 42%, ${ch.c}00 72%)`, boxShadow: `0 0 16px ${ch.c}` }} />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* headline */}
        <div className="absolute inset-x-0 top-[12%] sm:top-[15%]" style={{ opacity: textO, transform: `translateY(${((1 - textO) * 18).toFixed(0)}px)` }}>
          <div className="container-px text-center">
            <div className="pointer-events-none absolute inset-0 -z-10 mx-auto h-full max-w-3xl bg-[radial-gradient(closest-side,rgba(255,255,255,0.55),transparent)]" />
            <h1 className="mx-auto max-w-3xl text-balance font-display text-[2rem] font-semibold leading-[1.14] text-ink sm:text-5xl lg:text-[3.4rem]"><span className="text-gradient"><T k="hero2.title" /></span></h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink/80"><T k="hero2.sub" /></p>
            <div className="pointer-events-auto mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/services" className="btn btn-magic btn-lg animate-gradientShift"><T k="hero2.cta1" /></Link>
              <Link href="/courses" className="btn btn-outline btn-lg bg-white/85"><T k="hero2.cta2" /></Link>
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <div className="absolute inset-x-0 bottom-7 flex flex-col items-center text-white" style={{ opacity: cueO }}><span className="mt-1 animate-floaty text-2xl">⌄</span></div>
      </div>
    </section>
  );
}
