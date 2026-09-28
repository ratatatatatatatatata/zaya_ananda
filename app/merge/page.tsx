import { NatalChart } from "@/components/zurhai/NatalChart";
import { ZurhaiSlider } from "@/components/home/ZurhaiSlider";
import { InlineDestinyMatrix } from "@/components/matrix/InlineDestinyMatrix";
import { getSettingsCached } from "@/lib/repo";
import { MergeToorog } from "@/components/MergeToorog";
import { VideoHero } from "@/components/video/VideoHero";
import { heroMediaFor } from "@/lib/hero-video";

export const revalidate = 300;

export const metadata = {
  title: "Зурхай — төрсөн үеийн зураглал, дэлгэрэнгүй шинжилгээ",
  description:
    "Төрсөн огноо, цаг, газраар нар, сар, мандах орд, гаригуудын байрлал болон хоорондын холбоог тооцож, тайллыг үзээрэй. Тоон зурхай, матрикс мөн нээлттэй.",
};

export default async function MergePage() {
  const [heroMedia, settings] = await Promise.all([heroMediaFor("merge"), getSettingsCached()]);
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
        <ZurhaiSlider cards={settings.zurhaiCards} daily={<MergeToorog />} matrix={<InlineDestinyMatrix />} natal={<NatalChart />} initialNatal />
      </div>
    </>
  );
}
