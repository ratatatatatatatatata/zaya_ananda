import { MergeToorog } from "@/components/MergeToorog";
import { VideoHero } from "@/components/video/VideoHero";
import { heroMediaFor } from "@/lib/hero-video";

export const revalidate = 300;

export const metadata = {
  title: "Зурхай — төрсөн огноогоор тайлагдах хувь заяа",
  description:
    "Астрологи, тоон судлал, хувь тавилангийн матрикс, Human Design — дөрвөн системийг нэгтгэсэн зурхай. Төрсөн он, сар, өдрөө оруулаад өдөр тутмын тайлал, сар, жилийн зураглалаа аваарай.",
};

export default async function MergePage() {
  const heroMedia = await heroMediaFor("merge");
  return (
    <>
      <VideoHero
        clip="stones"
        media={heroMedia}
        height="short"
        align="center"
        eyebrow="Zaya's Ananda"
        title="Зурхай"
        desc="Төрсөн огноогоороо өөрийн зан чанар, авьяас, амьдралын урсгалыг энгийн үгээр тайлж аваарай."
      />
      <div className="container-px py-12 sm:py-16">
        <MergeToorog />
      </div>
    </>
  );
}
