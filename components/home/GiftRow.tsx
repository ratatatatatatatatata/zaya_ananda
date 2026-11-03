"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import wall from "./GiftWall.module.css";

const wrap = (value: number, period: number) => ((value % period) + period) % period;

/** Keep the original compositor-driven transform drift. Manual input seeks the
 * same animation, so pausing, dragging and resuming never switch coordinates. */
export function GiftRow({ children, paused, browsing, moving, reverse, duration, label, onManual }: {
  children: ReactNode; paused: boolean; browsing: boolean; moving: boolean;
  reverse: boolean; duration: number; label: string; onManual: () => void;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const animation = useRef<Animation | null>(null);
  const drag = useRef<{ id: number; x: number; y: number; left: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(true);
  const manual = useRef(onManual);
  manual.current = onManual;
  const stopped = useRef(true);
  stopped.current = paused || focused || reduced;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update(); query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const element = track.current;
    if (!element || browsing || reduced || !moving) return;
    const drift = element.animate([
      { transform: "translate3d(0, 0, 0)" },
      { transform: "translate3d(-50%, 0, 0)" },
    ], { duration: duration * 1000, iterations: Infinity, easing: "linear", direction: reverse ? "reverse" : "normal" });
    animation.current = drift;
    if (stopped.current) drift.pause();
    return () => { drift.cancel(); animation.current = null; };
  }, [browsing, reduced, moving, reverse, duration]);

  useEffect(() => {
    const drift = animation.current;
    if (!drift) return;
    if (paused || focused || reduced) drift.pause(); else drift.play();
  }, [paused, focused, reduced, browsing, moving, reverse, duration]);

  function position() {
    const drift = animation.current;
    const period = track.current ? track.current.getBoundingClientRect().width / 2 : 0;
    if (!drift || !period) return viewport.current?.scrollLeft || 0;
    const progress = wrap(Number(drift.currentTime || 0), duration * 1000) / (duration * 1000);
    return (reverse ? 1 - progress : progress) * period;
  }

  function seek(left: number) {
    const drift = animation.current;
    const period = track.current ? track.current.getBoundingClientRect().width / 2 : 0;
    if (!drift || !period) { if (viewport.current) viewport.current.scrollLeft = left; return; }
    drift.pause();
    const progress = wrap(left, period) / period;
    drift.currentTime = (reverse ? 1 - progress : progress) * duration * 1000;
  }

  useEffect(() => {
    const element = viewport.current;
    if (!element || browsing) return;
    const wheel = (event: WheelEvent) => {
      // Leave ordinary vertical page scrolling alone.
      const delta = event.deltaX || (event.shiftKey ? event.deltaY : 0);
      if (!delta) return;
      event.preventDefault(); manual.current();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientWidth : 1;
      seek(position() + delta * unit);
    };
    element.addEventListener("wheel", wheel, { passive: false });
    return () => element.removeEventListener("wheel", wheel);
  }, [browsing, reverse, duration]);

  return <div ref={viewport} className={wall.viewport} data-moving={moving} data-animated={moving && !browsing && !reduced}
    role="region" aria-label={label} tabIndex={browsing ? -1 : 0}
    onFocusCapture={event => {
      setFocused(true);
      animation.current?.pause();
      // Keyboard focus should reveal an original card even after the loop moved it.
      const card = event.target as HTMLElement;
      if (animation.current && card.matches("button:focus-visible")) {
        const bounds = card.getBoundingClientRect(), frame = event.currentTarget.getBoundingClientRect();
        if (bounds.left < frame.left || bounds.right > frame.right) seek(card.offsetLeft);
      }
      if (animation.current) event.currentTarget.scrollLeft = 0;
    }}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}
    onPointerDown={event => {
      suppressClick.current = false;
      if (browsing || (event.pointerType === "mouse" && event.button !== 0)) return;
      if (!animation.current && event.pointerType !== "mouse") return;
      animation.current?.pause();
      drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, left: position(), moved: false };
    }}
    onPointerMove={event => {
      const current = drag.current;
      if (!current || current.id !== event.pointerId) return;
      const distance = event.clientX - current.x;
      if (!current.moved) {
        if (Math.abs(distance) < 6) return;
        if (event.pointerType !== "mouse" && Math.abs(event.clientY - current.y) > Math.abs(distance)) return;
        current.moved = true; onManual();
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.dataset.dragging = "true";
      }
      suppressClick.current = true;
      event.preventDefault(); seek(current.left - distance);
    }}
    onPointerUp={event => {
      drag.current = null;
      delete event.currentTarget.dataset.dragging;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
      if (!stopped.current) animation.current?.play();
    }}
    onPointerCancel={event => {
      drag.current = null; delete event.currentTarget.dataset.dragging;
      if (!stopped.current) animation.current?.play();
    }}
    onLostPointerCapture={event => { drag.current = null; delete event.currentTarget.dataset.dragging; }}
    onClickCapture={event => {
      if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; }
    }}
    onKeyDown={event => {
      if (browsing || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
      event.preventDefault(); onManual();
      seek(position() + (event.key === "ArrowLeft" ? -1 : 1) * event.currentTarget.clientWidth * .65);
    }}>
    <div ref={track} className={wall.track}>{children}</div>
  </div>;
}
