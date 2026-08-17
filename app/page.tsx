import { HomeHero } from "@/components/home/HomeHero";
import { HomeSections } from "@/components/HomeSections";
import { heroVideoSrc } from "@/lib/hero-video";

export const revalidate = 300;

export default async function HomePage() {
  const heroSrc = await heroVideoSrc("home");
  return (
    <>
      <HomeHero src={heroSrc} />
      <HomeSections />
    </>
  );
}
