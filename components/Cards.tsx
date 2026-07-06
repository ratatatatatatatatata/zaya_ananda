import Link from "next/link";
import { GlyphTile } from "./GlyphTile";
import { AddToCart } from "./AddToCart";
import { T, Tr } from "./T";
import { formatMNT } from "@/lib/format";
import type { Service, Course, Product } from "@/lib/types";

export function ServiceCard({ s }: { s: Service }) {
  return (
    <div data-tilt className="card group flex flex-col p-5 transition-shadow duration-300 hover:shadow-glow">
      <div className="flex items-start gap-4">
        <GlyphTile glyph={s.glyph} tone={s.tone} size="md" />
        <div className="min-w-0">
          <span className="chip mb-2"><Tr v={s.category} /></span>
          <h3 className="font-display text-xl font-semibold leading-snug text-ink">
            <Link href={"/services/" + s.slug} className="transition hover:text-primary-700"><Tr v={s.title} /></Link>
          </h3>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 text-[1.02rem] leading-relaxed text-muted"><Tr v={s.short} /></p>
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[0.92rem] font-medium text-muted">
        <span>⏱ <Tr v={s.duration} /></span>
        {s.deliveryType && <span>· <Tr v={s.deliveryType} /></span>}
        {s.instructor && <span>· 👤 {s.instructor}</span>}
      </div>
      <div className="mt-auto border-t border-line pt-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="price">{formatMNT(s.price)}</span>
          <Link href={"/services/" + s.slug} className="btn btn-outline btn-sm shrink-0"><T k="common.details" /></Link>
        </div>
        <AddToCart className="btn btn-primary btn-md w-full" labelKey="common.book"
          item={{ kind: "service", slug: s.slug, title: s.title, price: s.price, tone: s.tone, glyph: s.glyph }} />
      </div>
    </div>
  );
}

export function CourseCard({ c }: { c: Course }) {
  return (
    <div data-tilt className="glass group flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-glow-grape">
      <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-primary-100/70 via-lavender-200/60 to-blush-200/60">
        <GlyphTile glyph={c.glyph} tone={c.tone} size="lg" className="animate-floaty" />
        <span className="absolute left-4 top-4 chip bg-[#1A2742]"><Tr v={c.level} /></span>
        {c.certificate && <span className="absolute right-4 top-4 rounded-full bg-accent-500 px-2.5 py-1 text-[0.7rem] font-bold text-white">🏅 <T k="common.certificate" /></span>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-[0.82rem] font-bold uppercase tracking-wide text-primary-600"><Tr v={c.category} /></span>
        <h3 className="mt-1.5 font-display text-xl font-semibold leading-snug text-ink">
          <Link href={"/courses/" + c.slug} className="transition hover:text-primary-700"><Tr v={c.title} /></Link>
        </h3>
        <p className="mt-2.5 line-clamp-2 text-[1.02rem] leading-relaxed text-muted"><Tr v={c.short} /></p>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[0.92rem] font-medium text-muted">
          <span>📚 {c.lessons} <T k="common.lessons" /></span>
          {c.instructor && <span>· 👤 {c.instructor}</span>}
          {typeof c.students === "number" && <span>· 👥 {c.students.toLocaleString()}</span>}
        </div>
        <div className="mt-auto border-t border-line pt-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="price">{formatMNT(c.price)}</span>
            <Link href={"/courses/" + c.slug} className="btn btn-outline btn-sm shrink-0"><T k="common.view" /></Link>
          </div>
          <AddToCart className="btn btn-primary btn-md w-full" labelKey="common.enroll"
            item={{ kind: "course", slug: c.slug, title: c.title, price: c.price, tone: c.tone, glyph: c.glyph }} />
        </div>
      </div>
    </div>
  );
}

export function ProductCard({ p }: { p: Product }) {
  return (
    <div data-tilt className="card group flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-glow">
      <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-aqua via-lavender-200/50 to-blush-200/50">
        <GlyphTile glyph={p.glyph} tone={p.tone} size="xl" className="animate-floaty transition duration-500 group-hover:-translate-y-1.5 group-hover:scale-105" />
        {p.badge && <span className="absolute left-4 top-4 rounded-full bg-deep px-3 py-1 text-[0.72rem] font-bold text-white"><Tr v={p.badge} /></span>}
        {!p.inStock && <span className="absolute right-4 top-4 rounded-full bg-[#16233E]/90 px-3 py-1 text-[0.72rem] font-bold text-rose-500"><T k="common.soldOut" /></span>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-[0.82rem] font-bold uppercase tracking-wide text-primary-600"><Tr v={p.category} /></span>
        <h3 className="mt-1.5 font-display text-lg font-semibold leading-snug text-ink">
          <Link href={"/shop/" + p.slug} className="transition hover:text-primary-700"><Tr v={p.title} /></Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-[1.02rem] leading-relaxed text-muted"><Tr v={p.short} /></p>
        <div className="mt-auto border-t border-line pt-4">
          <div className="mb-3 flex items-baseline gap-2">
            <span className="price">{formatMNT(p.price)}</span>
            {p.oldPrice && <span className="text-sm text-muted line-through">{formatMNT(p.oldPrice)}</span>}
          </div>
          <AddToCart className="btn btn-primary btn-md w-full" labelKey="common.cartShort" soldOut={!p.inStock}
            item={{ kind: "product", slug: p.slug, title: p.title, price: p.price, tone: p.tone, glyph: p.glyph }} />
        </div>
      </div>
    </div>
  );
}
