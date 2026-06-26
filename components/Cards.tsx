import Link from "next/link";
import { GlyphTile } from "./GlyphTile";
import { AddToCart } from "./AddToCart";
import { T, Tr } from "./T";
import { formatMNT } from "@/lib/format";
import type { Service, Course, Product } from "@/lib/types";

export function ServiceCard({ s }: { s: Service }) {
  return (
    <div className="card group flex flex-col p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="flex items-start gap-4">
        <GlyphTile glyph={s.glyph} tone={s.tone} size="md" />
        <div className="min-w-0">
          <span className="chip mb-2"><Tr v={s.category} /></span>
          <h3 className="font-display text-lg font-semibold leading-snug text-ink">
            <Link href={"/services/" + s.slug} className="transition hover:text-primary-700"><Tr v={s.title} /></Link>
          </h3>
        </div>
      </div>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted"><Tr v={s.short} /></p>
      <p className="mt-3 text-xs font-medium text-muted">⏱ <Tr v={s.duration} /></p>
      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <span className="text-lg font-semibold text-ink">{formatMNT(s.price)}</span>
        <div className="flex gap-2">
          <Link href={"/services/" + s.slug} className="btn btn-outline btn-sm"><T k="common.details" /></Link>
          <AddToCart className="btn btn-primary btn-sm" labelKey="common.cartShort"
            item={{ kind: "service", slug: s.slug, title: s.title, price: s.price, tone: s.tone, glyph: s.glyph }} />
        </div>
      </div>
    </div>
  );
}

export function CourseCard({ c }: { c: Course }) {
  return (
    <div className="card group flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50">
        <GlyphTile glyph={c.glyph} tone={c.tone} size="lg" className="animate-floaty" />
        <span className="absolute left-4 top-4 chip bg-white"><Tr v={c.level} /></span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-bold uppercase tracking-wide text-primary-600"><Tr v={c.category} /></span>
        <h3 className="mt-1.5 font-display text-lg font-semibold leading-snug text-ink">
          <Link href={"/courses/" + c.slug} className="transition hover:text-primary-700"><Tr v={c.title} /></Link>
        </h3>
        <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-muted"><Tr v={c.short} /></p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-muted">
          <span>📚 {c.lessons} <T k="common.lessons" /></span>
          <span>🗓 <Tr v={c.duration} /></span>
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
          <span className="text-lg font-semibold text-ink">{formatMNT(c.price)}</span>
          <div className="flex gap-2">
            <Link href={"/courses/" + c.slug} className="btn btn-outline btn-sm"><T k="common.view" /></Link>
            <AddToCart className="btn btn-primary btn-sm" labelKey="common.enroll"
              item={{ kind: "course", slug: c.slug, title: c.title, price: c.price, tone: c.tone, glyph: c.glyph }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductCard({ p }: { p: Product }) {
  return (
    <div className="card group flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-cream to-primary-50">
        <GlyphTile glyph={p.glyph} tone={p.tone} size="xl" className="transition duration-500 group-hover:scale-105" />
        {p.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-ink px-3 py-1 text-[11px] font-bold text-white"><Tr v={p.badge} /></span>
        )}
        {!p.inStock && (
          <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-rose-500"><T k="common.soldOut" /></span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-bold uppercase tracking-wide text-primary-600"><Tr v={p.category} /></span>
        <h3 className="mt-1.5 font-display text-base font-semibold leading-snug text-ink">
          <Link href={"/shop/" + p.slug} className="transition hover:text-primary-700"><Tr v={p.title} /></Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted"><Tr v={p.short} /></p>
        <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-ink">{formatMNT(p.price)}</span>
            {p.oldPrice && <span className="text-sm text-muted line-through">{formatMNT(p.oldPrice)}</span>}
          </div>
          <AddToCart className="btn btn-primary btn-sm" labelKey="common.cartShort" soldOut={!p.inStock}
            item={{ kind: "product", slug: p.slug, title: p.title, price: p.price, tone: p.tone, glyph: p.glyph }} />
        </div>
      </div>
    </div>
  );
}
