import { HomeHero } from "@/components/home/HomeHero";
import { HomeSections } from "@/components/HomeSections";
import { heroMediaFor } from "@/lib/hero-video";

export const revalidate = 300;

export default async function HomePage() {
  const heroMedia = await heroMediaFor("home");
  return (
    <>
      <HomeHero media={heroMedia} />
      <HomeSections />
    </>
  );
}
