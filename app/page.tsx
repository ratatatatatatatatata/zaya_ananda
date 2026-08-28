import { HomeHero } from "@/components/home/HomeHero";
import { HomeSections } from "@/components/HomeSections";
import { heroMediaFor } from "@/lib/hero-video";

// Router cache-аас болж шинэ аялал/агуулга хуучирсан хэвээр харагдахаас сэргийлж, хүсэлт болгонд шинэчилнэ
// (доод давхаргын unstable_cache 5 минут тул серверийн ачаалал өсөхгүй).
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const heroMedia = await heroMediaFor("home");
  return (
    <>
      <HomeHero media={heroMedia} />
      <HomeSections />
    </>
  );
}
