import { cx, toneStyles } from "@/lib/format";

const sizes = {
  sm: "h-12 w-12 rounded-xl text-xl",
  md: "h-16 w-16 rounded-2xl text-2xl",
  lg: "h-20 w-20 rounded-3xl text-3xl",
  xl: "h-28 w-28 rounded-4xl text-5xl",
};

export function GlyphTile({
  glyph,
  tone,
  size = "md",
  className,
}: {
  glyph: string;
  tone: string;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const t = toneStyles[tone] ?? toneStyles.violet;
  return (
    <div
      className={cx(
        "relative grid shrink-0 place-items-center overflow-hidden bg-gradient-to-br text-white shadow-soft",
        t.grad,
        sizes[size],
        className
      )}
    >
      <span className="pointer-events-none absolute -right-3 -top-3 h-12 w-12 rounded-full bg-white/20" />
      <span className="pointer-events-none absolute -bottom-4 -left-2 h-10 w-10 rounded-full bg-black/10" />
      <span className="relative drop-shadow-sm">{glyph}</span>
    </div>
  );
}
