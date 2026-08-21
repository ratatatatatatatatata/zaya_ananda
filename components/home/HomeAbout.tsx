import Link from "next/link";
import { Reveal } from "../Reveal";
import { T, Tr } from "../T";
import { AboutFacts } from "./AboutFacts";
import { aboutContent, team, faqs } from "@/data/content";
import { getSettingsCached } from "@/lib/repo";
import { signedDownloadUrl } from "@/lib/supabase";

/** Нүүр хуудасны «Бидний тухай» — Бидний тухай цэсний бүх мэдээллийг нэг дор харуулна. */
export async function HomeAbout() {
  const settings = await getSettingsCached();

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
      {(settings.aboutTitle || settings.aboutBody || aboutVideoUrl) && (
        <Reveal>
          <div className="panel mx-auto max-w-3xl p-8 sm:p-10">
            {settings.aboutTitle && (
              <h3 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{settings.aboutTitle}</h3>
            )}
            {settings.aboutBody && (
              <div className="mt-4 whitespace-pre-line leading-relaxed text-muted">{settings.aboutBody}</div>
            )}
            {aboutVideoUrl && <video controls playsInline className="mt-6 w-full rounded-2xl bg-black" src={aboutVideoUrl} />}
          </div>
        </Reveal>
      )}

      {/* Эрхэм зорилго ба түүх */}
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow-line"><T k="about.missionEyebrow" /></p>
          <h3 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl"><T k="about.missionTitle" /></h3>
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

      {/* Үнэт зүйлс */}
      <div>
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow-line justify-center"><T k="about.valuesEyebrow" /></p>
          <h3 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl"><T k="about.valuesTitle" /></h3>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {aboutContent.values.map((v, i) => (
            <Reveal key={v.title.mn} delay={i * 70}>
              <div className="card h-full p-6">
                <div className="text-3xl">{v.glyph}</div>
                <h4 className="mt-3 font-display text-lg font-semibold text-ink"><Tr v={v.title} /></h4>
                <p className="mt-2 text-sm leading-relaxed text-muted"><Tr v={v.text} /></p>
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
          {faqs.map((f) => (
            <details key={f.q.mn} className="group rounded-2xl border border-line bg-surface-1 p-5 [&_summary]:cursor-pointer">
              <summary className="flex items-center justify-between gap-4 font-semibold text-ink marker:content-['']">
                <Tr v={f.q} />
                <span aria-hidden className="text-primary-600 transition group-open:rotate-45">＋</span>
              </summary>
              <p className="mt-3 leading-relaxed text-muted"><Tr v={f.a} /></p>
            </details>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/about" className="btn btn-outline btn-md">Бидний тухай бүтэн хуудас →</Link>
        </div>
      </div>
    </div>
  );
}
