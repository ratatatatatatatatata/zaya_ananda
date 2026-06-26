export function formatMNT(n: number): string {
  const s = Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return s + "₮";
}

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const toneStyles: Record<
  string,
  { grad: string; soft: string; text: string; ring: string }
> = {
  violet: {
    grad: "from-primary-500 to-primary-700",
    soft: "bg-primary-50 text-primary-700",
    text: "text-primary-700",
    ring: "ring-primary-200",
  },
  gold: {
    grad: "from-accent-300 to-accent-600",
    soft: "bg-accent-50 text-accent-700",
    text: "text-accent-700",
    ring: "ring-accent-200",
  },
  jade: {
    grad: "from-jade-400 to-jade-600",
    soft: "bg-jade-400/10 text-jade-600",
    text: "text-jade-600",
    ring: "ring-jade-400/30",
  },
  rose: {
    grad: "from-rose-400 to-rose-600",
    soft: "bg-rose-50 text-rose-600",
    text: "text-rose-600",
    ring: "ring-rose-200",
  },
  sky: {
    grad: "from-sky-400 to-sky-600",
    soft: "bg-sky-50 text-sky-600",
    text: "text-sky-600",
    ring: "ring-sky-200",
  },
};
