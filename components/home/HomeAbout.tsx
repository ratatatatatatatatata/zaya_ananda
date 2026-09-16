import Link from "next/link";
import { Reveal } from "../Reveal";
import { T, Tr } from "../T";
import { AboutFacts } from "./AboutFacts";
import { aboutContent, team, faqs } from "@/data/content";
import { getSettingsCached } from "@/lib/repo";
import { ContactSection } from "@/components/ContactSection";
import { signedDownloadUrl } from "@/lib/supabase";
import { AboutGallery } from "./AboutGallery";
import { AboutMilestones } from "./AboutMilestones";
import type { L } from "@/lib/types";

// Админ энгийн (нэг хэлтэй) текст оруулсан бол шууд, эсрэг тохиолдолд өгөгдмөл олон хэлтэй
// агуулгыг <Tr> ашиглан харуулна.
const localeText = (v: string | L) => (typeof v === "string" ? v : <Tr v={v} />);

/** Нүүр хуудасны «Бидний тухай» — Бидний тухай цэсний бүх мэдээллийг нэг дор харуулна. */
export async function HomeAbout() {
  const settings = await getSettingsCached();
  // Suppress only observed draft/test copy; retain real future admin edits.
  const drafts = new Set(["rw45524iuop'", "ewrtuerotipow", "wertjelkl;'", "eruhjl;dl;'", "ewra", "afdasd", "adfasdfas", "asdfasdfasdf"]);
  const published = (text?: string) => !!text?.trim() && !drafts.has(text.trim()) && !/lorem ipsum/i.test(text);
  const aboutTitle = published(settings.aboutTitle) ? settings.aboutTitle : "";
  const aboutBody = published(settings.aboutBody) ? settings.aboutBody : "";
  const mission = published(settings.aboutMission) ? settings.aboutMission : "";
  const story = published(settings.aboutStory) ? settings.aboutStory : "";
  const values = (settings.aboutValues || []).filter(v => published(v.title) && published(v.text));
  const questions = (settings.aboutFaqs || []).filter(f => published(f.q) && published(f.a));
  const milestones = (settings.aboutMilestones || []).filter(m => published(m.text) && !/^(3janjfkakldfkavskmm|avhdbfasjdnfvasnlvasnvksdn)/.test(m.text));

  // Танилцуулга видео — хадгалалтын замыг гарын үсэгтэй хаяг руу хөрвүүлнэ
  let aboutVideoUrl = "";
  if (settings.aboutVideo) {
    if (/^https?:\/\//.test(settings.aboutVideo)) aboutVideoUrl = settings.aboutVideo;
    else { try { aboutVideoUrl = await signedDownloadUrl("lesson-videos", settings.aboutVideo); } catch { aboutVideoUrl = ""; } }
  }

  const mergedTeam = [
    ...(settings.teachers || []),
    ...(settings.team || []).filter((m) => !(settings.teachers || []).some((t) => t.name === m.name)),
  ];

  return (
    <div className="space-y-16">
      {/* Тоо, баримт */}
      <AboutFacts />

      {/* Админаас оруулсан танилцуулга */}
      {(aboutTitle || aboutBody || aboutVideoUrl) && (
        <Reveal>
          <div className="panel mx-auto max-w-3xl p-8 sm:p-10">
            {aboutTitle && (
              <h3 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{aboutTitle}</h3>
            )}
            {aboutBody && (
              <div className="mt-4 whitespace-pre-line leading-relaxed text-muted">{aboutBody}</div>
            )}
            {aboutVideoUrl && <video controls playsInline className="mt-6 w-full rounded-2xl bg-black" src={aboutVideoUrl} />}
          </div>
        </Reveal>
      )}

      {(mission || story) && <div className="mx-auto max-w-3xl space-y-4 leading-relaxed text-muted">{mission && <p>{mission}</p>}{story && <p className="whitespace-pre-line">{story}</p>}</div>}
      {milestones.length > 0 && <AboutMilestones milestones={milestones.map(m => ({year:m.year,text:m.text}))}/>}
      {settings.aboutGallery && settings.aboutGallery.length > 0 && <AboutGallery images={settings.aboutGallery} />}

      {/* Үнэт зүйлс */}
      <div>
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow-line justify-center"><T k="about.valuesEyebrow" /></p>
          <h3 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl"><T k="about.valuesTitle" /></h3>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(values.length ? values : aboutContent.values).map((v, i) => (
            <Reveal key={i} delay={i * 70}>
              <div className="card h-full p-6">
                <div className="text-3xl">{v.glyph}</div>
                <h4 className="mt-3 font-display text-lg font-semibold text-ink">{localeText(v.title)}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted">{localeText(v.text)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Хамт олон */}
      <div>
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow-line justify-center"><T k="about.teamEyebrow" /></p>
          <h3 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl"><T k="about.teamTitle" /></h3>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mergedTeam.length > 0
            ? mergedTeam.map((m, i) => (
                <Reveal key={m.name + i} delay={i * 80}>
                  <div className="card flex h-full flex-col items-center p-8 text-center">
                    {m.image
                      ? <img src={m.image} alt="" className="h-28 w-28 rounded-full object-cover shadow-card" style={{ objectPosition: "50% " + (m.focus ?? 50) + "%" }} />
                      : <div className="grid h-28 w-28 place-items-center rounded-full bg-primary-50 text-3xl">👤</div>}
                    <h4 className="mt-5 font-display text-xl font-semibold text-ink">{m.name}</h4>
                    {m.role && <p className="mt-1 text-sm font-medium text-primary-600">{m.role}</p>}
                    {m.info && <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">{m.info}</p>}
                  </div>
                </Reveal>
              ))
            : team.map((m, i) => (
                <Reveal key={m.id} delay={i * 80}>
                  <div className="card flex h-full flex-col items-center p-8 text-center">
                    <div className="grid h-28 w-28 place-items-center rounded-full bg-primary-50 text-3xl">{m.glyph}</div>
                    <h4 className="mt-5 font-display text-xl font-semibold text-ink">{m.name}</h4>
                    <p className="mt-1 text-sm font-medium text-primary-600"><Tr v={m.role} /></p>
                    <p className="mt-3 text-sm leading-relaxed text-muted"><Tr v={m.bio} /></p>
                  </div>
                </Reveal>
              ))}
        </div>
      </div>

      {/* Түгээмэл асуултууд */}
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="eyebrow-line justify-center"><T k="about.faqEyebrow" /></p>
          <h3 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl"><T k="about.faqTitle" /></h3>
        </div>
        <div className="mt-8 space-y-3">
          {(questions.length ? questions : faqs).map((f, i) => (
            <details key={i} className="group rounded-2xl border border-line bg-surface-1 p-5 [&_summary]:cursor-pointer">
              <summary className="flex items-center justify-between gap-4 font-semibold text-ink marker:content-['']">
                {localeText(f.q)}
                <span aria-hidden className="text-primary-600 transition group-open:rotate-45">＋</span>
              </summary>
              <p className="mt-3 leading-relaxed text-muted">{localeText(f.a)}</p>
            </details>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/about" className="btn btn-outline btn-md">Бидний тухай бүтэн хуудас →</Link>
        </div>
      </div>

      {/* Холбоо барих мэдээлэл */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8">
        <ContactSection />
      </div>
    </div>
  );
}
