"use client";

import { CategoryGlyph } from "@/components/CategoryGlyph";
import type { GlyphKey } from "@/data/theme-map";

type Token = { glyph: GlyphKey; from: string; to: string; top: string; left?: string; right?: string; size: number; delay: number; slow?: boolean; rev?: boolean };

/** Хэсгийн ард хөвж буй гурван хэмжээст бэлгэдлүүд — контентийн ард (z-0),
 *  секц бүрт гүн, "амьд" мэдрэмж өгнө. Зөвхөн чимэглэл тул aria-hidden. */
export function FloatingGlyphs({ tokens }: { tokens: Token[] }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {tokens.map((t, i) => (
        <div
          key={i}
          className={"float-token" + (t.slow ? " float-token--slow" : "") + (t.rev ? " float-token--rev" : "")}
          style={{ top: t.top, left: t.left, right: t.right, animationDelay: t.delay + "s" }}
        >
          <div
            className="grid place-items-center rounded-[1.4rem] border border-line/70 bg-surface-1/60 shadow-soft backdrop-blur-sm"
            style={{ width: t.size, height: t.size, transform: "perspective(600px) rotateX(8deg) rotateY(-10deg)" }}
          >
            <CategoryGlyph glyph={t.glyph} from={t.from} to={t.to} className="h-[55%] w-[55%] opacity-70" />
          </div>
        </div>
      ))}
    </div>
  );
}
