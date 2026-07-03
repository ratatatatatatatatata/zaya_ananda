import { PageHeader } from "@/components/PageHeader";
import { CtaBand } from "@/components/CtaBand";
import { CalmBand } from "@/components/CalmBand";
import { SectionHeading } from "@/components/ui";
import { GlyphTile } from "@/components/GlyphTile";
import { Reveal } from "@/components/Reveal";
import { T, Tr } from "@/components/T";
import { aboutContent, team, faqs, siteConfig } from "@/data/content";
import { getSettingsCached } from "@/lib/repo";
import { signedDownloadUrl } from "@/lib/supabase";
import { ContactSection } from "@/components/ContactSection";

export const metadata = { title: "Бидний тухай" };
export const revalidate = 300;

export default async function AboutPage() {
  const settings = await getSettingsCached();
  let aboutVideoUrl = "";
  if (settings.aboutVideo) {
    if (/^https?:\/\//.test(settings.aboutVideo)) aboutVideoUrl = settings.aboutVideo;
    else { try { aboutVideoUrl = await signedDownloadUrl("lesson-videos", settings.aboutVideo); } catch { aboutVideoUrl = ""; } }
  }
  const dynamicTeam = settings.team && settings.team.length > 0 ? settings.team : null;
  return (
    <>
      <PageHeader title={<T k="about.title" />} crumb={<T k="about.title" />} desc={<Tr v={siteConfig.tagline} />} />

      {(settings.aboutTitle || settings.aboutBody || aboutVideoUrl) && (
        <section className="section"><div className="container-px max-w-3xl">
          {settings.aboutTitle && <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{settings.aboutTitle}</h2>}
          {settings.aboutBody && <div className="mt-4 whitespace-pre-line leading-relaxed text-muted">{settings.aboutBody}</div>}
          {aboutVideoUrl && <video controls playsInline className="mt-6 w-full rounded-3xl bg-black" src={aboutVideoUrl} />}
        </div></section>
      )}

      <section className="section">
        <div className="container-px grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading eyebrow={<T k="about.missionEyebrow" />} title={<T k="about.missionTitle" />} />
            <p className="mt-4 leading-relaxed text-muted"><Tr v={aboutContent.mission} /></p>
            <p className="mt-4 leading-relaxed text-muted"><Tr v={aboutContent.story} /></p>
          </Reveal>
          <Reveal delay={120}>
            <div className="grid grid-cols-2 gap-4">
              {aboutContent.stats.map((s) => (
                <div key={s.value} className="rounded-3xl bg-gradient-to-br from-primary-50 to-accent-50 p-6 text-center">
                  <div className="font-display text-3xl font-semibold text-primary-700">{s.value}</div>
                  <div className="mt-1 text-sm text-muted"><Tr v={s.label} /></div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-px">
          <SectionHeading center eyebrow={<T k="about.valuesEyebrow" />} title={<T k="about.valuesTitle" />} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {aboutContent.values.map((v, i) => (
              <Reveal key={v.title.mn} delay={i * 70}>
                <div className="card h-full p-6">
                  <div className="text-3xl">{v.glyph}</div>
                  <h3 className="mt-3 font-display text-lg font-semibold text-ink"><Tr v={v.title} /></h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted"><Tr v={v.text} /></p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-px">
          <SectionHeading center eyebrow={<T k="about.teamEyebrow" />} title={<T k="about.teamTitle" />} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dynamicTeam
              ? dynamicTeam.map((m, i) => (
                  <Reveal key={m.name + i} delay={i * 80}>
                    <div className="card flex h-full flex-col items-center p-8 text-center">
                      {m.image
                        ? <img src={m.image} alt="" className="h-28 w-28 rounded-full object-cover shadow-card" />
                        : <div className="grid h-28 w-28 place-items-center rounded-full bg-primary-50 text-3xl">👤</div>}
                      <h3 className="mt-5 font-display text-xl font-semibold text-ink">{m.name}</h3>
                      {m.role && <p className="mt-1 text-sm font-medium text-primary-600">{m.role}</p>}
                      {m.info && <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">{m.info}</p>}
                    </div>
                  </Reveal>
                ))
              : team.map((m, i) => (
                  <Reveal key={m.id} delay={i * 80}>
                    <div className="card flex h-full flex-col items-center p-8 text-center">
                      <GlyphTile glyph={m.glyph} tone={m.tone} size="lg" />
                      <h3 className="mt-5 font-display text-xl font-semibold text-ink">{m.name}</h3>
                      <p className="mt-1 text-sm font-medium text-primary-600"><Tr v={m.role} /></p>
                      <p className="mt-3 text-sm leading-relaxed text-muted"><Tr v={m.bio} /></p>
                    </div>
                  </Reveal>
                ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-px max-w-3xl">
          <SectionHeading center eyebrow={<T k="about.faqEyebrow" />} title={<T k="about.faqTitle" />} />
          <div className="mt-10 space-y-3">
            {faqs.map((f) => (
              <details key={f.q.mn} className="group rounded-2xl border border-line bg-cream p-5 [&_summary]:cursor-pointer">
                <summary className="flex items-center justify-between font-semibold text-ink marker:content-['']">
                  <Tr v={f.q} />
                  <span className="text-primary-600 transition group-open:rotate-45">＋</span>
                </summary>
                <p className="mt-3 leading-relaxed text-muted"><Tr v={f.a} /></p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />

      <CalmBand />
      <CtaBand />
    </>
  );
}
