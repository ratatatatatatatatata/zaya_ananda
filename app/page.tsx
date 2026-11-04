import { HomeHero } from "@/components/home/HomeHero";
import { HomeSections } from "@/components/HomeSections";
import { heroMediaFor } from "@/lib/hero-video";
import { getSettingsCached, listCmsCached } from "@/lib/repo";
import { publicTeam } from "@/lib/public-team";
import { itemTeachers } from "@/lib/item-teachers";
import { signedDownloadUrl } from "@/lib/supabase";
import { HomeIntroVideo } from "@/components/home/HomeIntroVideo";
import { HomeManifesto } from "@/components/home/HomeManifesto";
import { HomeMarquee, type MarqueeItem } from "@/components/home/HomeMarquee";
import { LanternCursor } from "@/components/home/LanternCursor";

// Router cache-аас болж шинэ аялал/агуулга хуучирсан хэвээр харагдахаас сэргийлж, хүсэлт болгонд шинэчилнэ
// (доод давхаргын unstable_cache 5 минут тул серверийн ачаалал өсөхгүй).
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [heroMedia, settings, courses, services, products] = await Promise.all([
    heroMediaFor("home"), getSettingsCached(), listCmsCached("course"), listCmsCached("service"), listCmsCached("product"),
  ]);
  // Scroll-marquee: сайтын өөрийн зурагтай контентоос ээлжлэн 16 хүртэл
  const pools = [services, courses, products].map(list => list.filter(i => i.image || i.images?.[0]));
  const marquee: MarqueeItem[] = [];
  for (let i = 0; marquee.length < 16 && pools.some(p => p[i]); i++)
    for (const p of pools) if (p[i] && marquee.length < 16) marquee.push({ id: p[i].id, title: p[i].title, image: (p[i].image || p[i].images?.[0])!, i18n: p[i].i18n });
  const stat = (label: RegExp) => settings.aboutStats?.find(s => label.test(s.label) && s.value.trim())?.value;
  const publishedTeamCount = publicTeam(
    settings.teachers || [], settings.team || [],
    [...courses, ...services].flatMap(item => itemTeachers(item)),
  ).length;
  const heroStats = [
    stat(/жил|туршлаг|year|experience/i) || "—",
    stat(/хамт олон|багш|team|teacher/i) || (publishedTeamCount ? String(publishedTeamCount) : "—"),
    stat(/нэгд|үйлчлүүлэгч|хэрэглэгч|joined|client|member/i) || "—",
  ];
  let introVideoUrl = "";
  if (settings.aboutVideo) {
    if (/^https?:\/\//.test(settings.aboutVideo)) introVideoUrl = settings.aboutVideo;
    else {
      try { introVideoUrl = await signedDownloadUrl("lesson-videos", settings.aboutVideo); }
      catch { introVideoUrl = ""; }
    }
  }
  return (
    <>
      <LanternCursor />
      <HomeHero media={heroMedia} />
      <HomeManifesto />
      {marquee.length >= 4 && <HomeMarquee items={marquee} />}
      <HomeIntroVideo src={introVideoUrl} stats={heroStats} />
      <HomeSections />
    </>
  );
}
