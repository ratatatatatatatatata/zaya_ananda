import { ZODIAC_STONES } from "@/data/zodiac-stones";

/** 12 ордын ээлтэй чулуунууд — бүгд нэг дор харагдана. */
export function ZodiacStoneGrid() {
  return (
    <div>
      <p className="mx-auto max-w-2xl text-center text-muted">
        Орд бүрд ээлтэй эрдэнийн чулуунууд. Өөрийн ордоо олж, чулуугаа таниад — тохирох бүтээгдэхүүнээ бүтээгдэхүүн хэсгээс сонгоорой.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ZODIAC_STONES.map((z) => (
          <div key={z.key} className="group relative overflow-hidden rounded-4xl border border-accent-300/25 bg-[#1B2038] p-6 transition hover:border-accent-400/60 hover:shadow-[0_0_40px_-12px_rgba(227,190,98,0.35)]">
            <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full opacity-70 transition group-hover:scale-110" style={{ background: "radial-gradient(circle, rgba(227,190,98,0.18), transparent 70%)", filter: "blur(6px)" }} />
            <div className="relative z-10">
              <div className="flex items-center gap-3.5">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-accent-400/40 bg-accent-300/10 text-3xl text-accent-300">{z.symbol}</span>
                <div>
                  <p className="font-display text-xl font-semibold text-ink">{z.name}</p>
                  <p className="text-xs font-semibold tracking-wide text-muted">{z.range}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {z.stones.map((s) => (
                  <span key={s} className="rounded-full border border-accent-400/30 bg-accent-300/10 px-2.5 py-1 text-xs font-semibold text-accent-300">💎 {s}</span>
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink/75">{z.meaning}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
