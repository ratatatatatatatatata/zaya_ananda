"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import wall from "./GiftWall.module.css";

/** Use native scroll for both animation and manual browsing, so pausing never
 * resets the visible cards or leaves translated cards outside the scroll area. */
export function GiftRow({ children, paused, browsing, moving, reverse, duration, label, onManual }: {
  children: ReactNode; paused: boolean; browsing: boolean; moving: boolean;
  reverse: boolean; duration: number; label: string; onManual: () => void;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; x: number; left: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update(); query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const element = viewport.current;
    if (!element || paused || browsing || focused || reduced || !moving) return;
    let frame = 0, previous = 0;
    const tick = (now: number) => {
      const period = (track.current?.firstElementChild as HTMLElement | null)?.offsetWidth || 0;
      if (previous && period > 0) {
        const delta = Math.min(now - previous, 50) * period / (duration * 1000);
        const next = element.scrollLeft + (reverse ? -delta : delta);
        element.scrollLeft = ((next % period) + period) % period;
      }
      previous = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [paused, browsing, focused, reduced, moving, reverse, duration]);

  return <div ref={viewport} className={wall.viewport} data-moving={moving}
    role="region" aria-label={label} tabIndex={browsing ? -1 : 0}
    onFocusCapture={() => setFocused(true)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}
    onPointerDown={event => {
      suppressClick.current = false;
      if (browsing) return;
      if (event.pointerType !== "mouse") { onManual(); return; }
      if (event.button !== 0) return;
      drag.current = { id: event.pointerId, x: event.clientX, left: event.currentTarget.scrollLeft, moved: false };
    }}
    onPointerMove={event => {
      const current = drag.current;
      if (!current || current.id !== event.pointerId) return;
      const distance = event.clientX - current.x;
      if (!current.moved && Math.abs(distance) < 6) return;
      if (!current.moved) {
        current.moved = true; onManual();
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.dataset.dragging = "true";
      }
      suppressClick.current = true;
      event.preventDefault();
      event.currentTarget.scrollLeft = current.left - distance;
    }}
    onPointerUp={event => {
      drag.current = null;
      delete event.currentTarget.dataset.dragging;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    }}
    onPointerCancel={event => { drag.current = null; delete event.currentTarget.dataset.dragging; }}
    onLostPointerCapture={event => { drag.current = null; delete event.currentTarget.dataset.dragging; }}
    onClickCapture={event => {
      if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; }
    }}
    onKeyDown={event => {
      if (browsing || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
      event.preventDefault(); onManual();
      event.currentTarget.scrollBy({ left: (event.key === "ArrowLeft" ? -1 : 1) * event.currentTarget.clientWidth * .65, behavior: reduced ? "auto" : "smooth" });
    }}>
    <div ref={track} className={wall.track}>{children}</div>
  </div>;
}
