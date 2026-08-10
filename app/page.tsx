import { HomeHero } from "@/components/home/HomeHero";
import { HomeSections } from "@/components/HomeSections";

export const revalidate = 300;

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeSections />
    </>
  );
}
