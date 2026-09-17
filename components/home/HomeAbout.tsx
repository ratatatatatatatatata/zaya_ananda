import { publicTeam } from "@/lib/public-team";
import { Reveal } from "../Reveal";
import { T, Tr } from "../T";
import { TeamGallery } from "@/components/about/TeamGallery";
import { FaqContact } from "@/components/about/FaqContact";
import { AboutFacts } from "./AboutFacts";
import { aboutContent, team, faqs } from "@/data/content";
import { getSettingsCached } from "@/lib/repo";
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

  const mergedTeam = publicTeam(settings.teachers || [], settings.team || []);

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
        <div className="mt-10 adaptive-cards">
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
        <TeamGallery members={mergedTeam.length ? mergedTeam : team.map(member => ({
          name: member.name, role: <Tr v={member.role} />, info: <Tr v={member.bio} />,
        }))} />
      </div>

      {/* Түгээмэл асуултууд */}
      <FaqContact questions={questions.length ? questions : faqs} mapQuery={settings.contact?.mapQuery} />


    </div>
  );
}
