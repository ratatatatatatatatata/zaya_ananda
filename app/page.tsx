import { HomeHero } from "@/components/home/HomeHero";
import { HomeSections } from "@/components/HomeSections";
import { heroMediaFor } from "@/lib/hero-video";
import { getSettingsCached, listCmsCached } from "@/lib/repo";
import { publicTeam } from "@/lib/public-team";
import { itemTeachers } from "@/lib/item-teachers";

// Router cache-аас болж шинэ аялал/агуулга хуучирсан хэвээр харагдахаас сэргийлж, хүсэлт болгонд шинэчилнэ
// (доод давхаргын unstable_cache 5 минут тул серверийн ачаалал өсөхгүй).
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [heroMedia, settings, courses, services] = await Promise.all([
    heroMediaFor("home"), getSettingsCached(), listCmsCached("course"), listCmsCached("service"),
  ]);
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
  return (
    <>
      <HomeHero media={heroMedia} stats={heroStats} />
      <HomeSections />
    </>
  );
}
