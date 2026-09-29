import { T } from "@/components/T";

export function HomeIntroVideo({ src }: { src?: string }) {
  return (
    <section className="bg-[#f7f8f2] px-[var(--page-gutter)] pb-[clamp(56px,7vw,110px)]" aria-labelledby="home-intro-video-title">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-5 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#668174]">
              <T k="home.introVideoEyebrow" />
            </p>
            <h2 id="home-intro-video-title" className="mt-2 font-display text-2xl font-medium text-[#173d2e] sm:text-3xl">
              <T k="home.introVideoTitle" />
            </h2>
          </div>
        </div>

        <div className="relative aspect-video overflow-hidden rounded-[clamp(16px,2vw,28px)] bg-[#173d2e] shadow-[0_24px_70px_rgba(22,61,46,0.16)]">
          {src ? (
            <video
              className="h-full w-full object-contain"
              src={src}
              controls
              playsInline
              preload="metadata"
            >
              <T k="home.introVideoUnsupported" />
            </video>
          ) : (
            <div className="grid h-full place-items-center px-6 text-center text-[#dce8df]">
              <div>
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full border border-white/35 text-2xl">▶</div>
                <p className="text-sm tracking-wide"><T k="home.introVideoPlaceholder" /></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
