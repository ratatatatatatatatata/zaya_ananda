import type { ReactNode } from "react";

/** Both sections stay visible: zodiac stones first, then the product catalogue. */
export function ShopSplit({ products, stones }: { products: ReactNode; stones: ReactNode }) {
  return <div className="space-y-14">
    <section aria-label="Ордуудын ээлтэй чулуу">
      <h3 className="mb-6 font-display text-2xl font-semibold text-ink sm:text-3xl">Ордуудын ээлтэй чулуу</h3>
      {stones}
    </section>
    <section aria-label="Бүтээгдэхүүн">
      <h3 className="mb-6 font-display text-2xl font-semibold text-ink sm:text-3xl">Бүтээгдэхүүн</h3>
      {products}
    </section>
  </div>;
}
