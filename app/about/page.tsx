import { publicTeam } from "@/lib/public-team";
import { Tr } from "@/components/T";
import { aboutContent, faqs, siteConfig } from "@/data/content";
import { getSettings } from "@/lib/repo";
import { signedDownloadUrl } from "@/lib/supabase";
import { AboutGallery } from "@/components/home/AboutGallery";
import { FaqContact } from "@/components/about/FaqContact";
import { PremiumAbout } from "@/components/about/PremiumAbout";
import { sampleStory, sampleTeam, programSteps } from "@/data/about-editorial";
import styles from "@/components/about/PremiumAbout.module.css";
import type { L } from "@/lib/types";

const localeText = (v: string | L) => typeof v === "string" ? v : <Tr v={v} />;
export const metadata = { title: "Бидний тухай", description: "Zaya’s Ananda — өөрийгөө таних, суралцах, дотоод тэнцвэрээ олох аялалд хамтдаа.", alternates: { canonical: "/about" } };
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const settings = await getSettings();
  let video = "";
  if (settings.aboutVideo) {
    if (/^https?:\/\//.test(settings.aboutVideo)) video = settings.aboutVideo;
    else { try { video = await signedDownloadUrl("lesson-videos", settings.aboutVideo); } catch { /* Preserve the rest of the page. */ } }
  }
  const members = publicTeam(settings.teachers || [], settings.team || []);
  const story = settings.aboutMilestones?.length ? settings.aboutMilestones : sampleStory;
  const programs = settings.aboutProgramMilestones?.length ? settings.aboutProgramMilestones : programSteps;
  return <PremiumAbout
    logo="/brand/zaya-ananda-logo-clean.png"
    intro={settings.aboutBody || <Tr v={siteConfig.description} />}
    mission={settings.aboutMission || <Tr v={aboutContent.mission} />}
    storyIntro={settings.aboutStory || <Tr v={aboutContent.story} />}
    story={story.map(m => ({ year:m.year, text:localeText(m.text) }))}
    sample={!settings.aboutMilestones?.length}
    members={members.length ? members.map(m => ({ name:m.name, image:m.image, role:m.role, info:m.info, focus:m.focus })) : sampleTeam}
    sampleMembers={!members.length}
    programs={programs.map(m => ({title:localeText(m.title),text:localeText(m.text)}))}
    partners={settings.aboutPartners || []}
    media={<div className={styles.media}>
      {settings.aboutTitle && <h3>{settings.aboutTitle}</h3>}
      {video && <video controls playsInline preload="none" src={video} />}
      {!!settings.aboutGallery?.length && <details><summary>Манай орчин — зургийн цомог</summary><AboutGallery images={settings.aboutGallery} /></details>}
    </div>}
    extra={<><div className={styles.extras}>
      {!!settings.aboutValues?.length && <details><summary>Бидний үнэт зүйлс</summary>{settings.aboutValues.map((v,i)=><div key={i}><h3>{localeText(v.title)}</h3><p>{localeText(v.text)}</p></div>)}</details>}

    </div><FaqContact questions={settings.aboutFaqs?.length ? settings.aboutFaqs : faqs} mapQuery={settings.contact?.mapQuery} /></>}
  />;
}
