import { SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { T, Tr } from "@/components/T";
import { aboutContent, team, faqs, siteConfig } from "@/data/content";
import { getSettings } from "@/lib/repo";
import { signedDownloadUrl } from "@/lib/supabase";
import { ContactSection } from "@/components/ContactSection";
import { AboutGallery } from "@/components/home/AboutGallery";
import { AboutMilestones } from "@/components/home/AboutMilestones";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutTeamRow } from "@/components/about/AboutTeamRow";
import { ProgramMilestones } from "@/components/about/ProgramMilestones";
import { PartnersGrid } from "@/components/about/PartnersGrid";
import type { L } from "@/lib/types";

// Админ энгийн (нэг хэлтэй) текст оруулсан бол шууд, эсрэг тохиолдолд өгөгдмөл олон хэлтэй
// агуулгыг <Tr> ашиглан харуулна.
const localeText = (v: string | L) => (typeof v === "string" ? v : <Tr v={v} />);

export const metadata = { title: "Бидний тухай" };
// Тохиргоо/Хамт олонд хийсэн өөрчлөлт шууд харагдана.
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const settings = await getSettings();
  let aboutVideoUrl = "";
  if (settings.aboutVideo) {
    if (/^https?:\/\//.test(settings.aboutVideo)) aboutVideoUrl = settings.aboutVideo;
    else { try { aboutVideoUrl = await signedDownloadUrl("lesson-videos", settings.aboutVideo); } catch { aboutVideoUrl = ""; } }
  }
  const mergedTeam = [
    ...(settings.teachers || []),
    ...(settings.team || []).filter((m) => !(settings.teachers || []).some((t) => t.name === m.name)),
  ];
  const dynamicTeam = mergedTeam.length > 0 ? mergedTeam : null;
  // Хамт олны хэсэгт нэгдсэн бүтэц дамжуулна — admin өгөгдөл байхгүй бол өгөгдмөл багийг ашиглана.
  const teamForRow = dynamicTeam
    ? dynamicTeam.map((m) => ({ name: m.name, image: m.image, role: m.role, info: m.info, focus: m.focus }))
    : team.map((m) => ({ name: m.name, role: <Tr v={m.role} />, info: <Tr v={m.bio} /> }));

  return (
    <>
      {/* Бараг бүтэн дэлгэцийн цайвар hero — гарчиг/танилцуулга зүүн тал, R3F бөмбөлгийн бүлэг баруун тал */}
      <AboutHero
        eyebrow="Нэг гэрлээс Ananda"
        title={<T k="about.title" />}
        intro={settings.aboutBody ? settings.aboutBody : <T k="about.heroIntro" />}
      />

      {(settings.aboutTitle || aboutVideoUrl) && (
        <section className="section pb-0"><div className="container-px max-w-3xl">
          {settings.aboutTitle && <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{settings.aboutTitle}</h2>}
          {aboutVideoUrl && <video controls playsInline className="mt-6 w-full rounded-3xl bg-black" src={aboutVideoUrl} />}
        </div></section>
      )}

      <section className="section">
        <div className="container-px grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading eyebrow={<T k="about.missionEyebrow" />} title={<T k="about.missionTitle" />} />
            <p className="mt-4 leading-relaxed text-muted">{settings.aboutMission ? settings.aboutMission : <Tr v={aboutContent.mission} />}</p>
            <p className="mt-4 leading-relaxed text-muted">{settings.aboutStory ? settings.aboutStory : <Tr v={aboutContent.story} />}</p>
          </Reveal>
          <Reveal delay={120}>
            <div className="grid grid-cols-2 gap-4">
              {(settings.aboutStats && settings.aboutStats.length > 0 ? settings.aboutStats : aboutContent.stats).map((s, i) => (
                <div key={i} className="rounded-3xl bg-gradient-to-br from-primary-50 to-accent-50 p-6 text-center">
                  <div className="font-display text-3xl font-semibold text-primary-700">{s.value}</div>
                  <div className="mt-1 text-sm text-muted">{localeText(s.label)}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="our-story" className="section scroll-mt-24 pb-0">
        <div className="container-px max-w-3xl">
          <SectionHeading center eyebrow={<T k="about.milestonesEyebrow" />} title={<T k="about.milestonesTitle" />} />
        </div>
        <AboutMilestones
          milestones={(settings.aboutMilestones && settings.aboutMilestones.length > 0 ? settings.aboutMilestones : aboutContent.milestones).map((m) => ({ year: m.year, text: localeText(m.text) }))}
        />
        {settings.aboutGallery && settings.aboutGallery.length > 0 && (
          <div className="container-px pb-20 pt-4">
            <AboutGallery images={settings.aboutGallery} />
          </div>
        )}
      </section>

      <section className="section bg-surface-2">
        <div className="container-px">
          <SectionHeading center eyebrow={<T k="about.valuesEyebrow" />} title={<T k="about.valuesTitle" />} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(settings.aboutValues && settings.aboutValues.length > 0 ? settings.aboutValues : aboutContent.values).map((v, i) => (
              <Reveal key={i} delay={i * 70}>
                <div className="card h-full p-6">
                  <div className="text-3xl">{v.glyph}</div>
                  <h3 className="mt-3 font-display text-lg font-semibold text-ink">{localeText(v.title)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{localeText(v.text)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Хамт олон — гүн дэвсгэртэй, хэвтээ гүйдэг зургийн эгнээ, дарахад биографи modal */}
      <AboutTeamRow
        eyebrow={<T k="about.teamEyebrow" />}
        statement={<T k="about.teamTitle" />}
        members={teamForRow}
      />

      {/* Хөтөлбөрийн зорилтууд — том дэлгэц дээр pinned хэвтээ шилжилт */}
      <ProgramMilestones
        eyebrow={<T k="about.programEyebrow" />}
        title={<T k="about.programTitle" />}
        milestones={(settings.aboutProgramMilestones && settings.aboutProgramMilestones.length > 0
          ? settings.aboutProgramMilestones
          : aboutContent.programMilestones
        ).map((m) => ({ glyph: m.glyph, title: localeText(m.title), text: localeText(m.text) }))}
      />

      {/* Дэмжлэг ба хүлээн зөвшөөрөл — хамтрагч байгууллагын лого */}
      <PartnersGrid
        eyebrow={<T k="about.partnersEyebrow" />}
        title={<T k="about.partnersTitle" />}
        partners={settings.aboutPartners || []}
      />

      <section className="section bg-surface-2">
        <div className="container-px max-w-3xl">
          <SectionHeading center eyebrow={<T k="about.faqEyebrow" />} title={<T k="about.faqTitle" />} />
          <div className="mt-10 space-y-3">
            {(settings.aboutFaqs && settings.aboutFaqs.length > 0 ? settings.aboutFaqs : faqs).map((f, i) => (
              <details key={i} className="group rounded-2xl border border-line bg-cream p-5 [&_summary]:cursor-pointer">
                <summary className="flex items-center justify-between font-semibold text-ink marker:content-['']">
                  {localeText(f.q)}
                  <span className="text-primary-600 transition group-open:rotate-45">＋</span>
                </summary>
                <p className="mt-3 leading-relaxed text-muted">{localeText(f.a)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
