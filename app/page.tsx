import { VideoHero } from "@/components/video/VideoHero";
import { HomeSections } from "@/components/HomeSections";

export const revalidate = 300;

export default function HomePage() {
  return (
    <>
      <VideoHero
        clip="meditation"
        eyebrow="Zaya's Ananda"
        title={<>Дотоод чимээгүй байдал<br className="hidden sm:block" /> руу хийх аялал</>}
        desc="Урсгал усны хажууд, ойн гүнд — далд ухамсар, энерги-мэдээллийн судалгааны төв. Йог, бясалгал, эдгэрлийн засал, ариун газрын аялал."
        cta={[{ href: "/courses", label: "Сургалт эхлүүлэх" }, { href: "/ayalal", label: "Сүнслэг аялал" }]}
      />
      <HomeSections />
    </>
  );
}
