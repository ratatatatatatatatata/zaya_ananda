import { PageHeader } from "@/components/PageHeader";
import { StoneOracle } from "@/components/StoneOracle";

export const metadata = { title: "Ордуудын ээлтэй чулуу" };

export default function StonesPage() {
  return (
    <>
      <PageHeader
        title="Ордуудын ээлтэй чулуу"
        crumb="Ордуудын ээлтэй чулуу"
        desc="Төрсөн огноо эсвэл ордоороо өөрийн эрдэнийн чулууг тайлж, түүнд тохирсон энергийн хамгаалалтын бүтээгдэхүүнээ олоорой."
      />
      <section className="section"><div className="container-px max-w-5xl">
        <StoneOracle />
      </div></section>
    </>
  );
}
