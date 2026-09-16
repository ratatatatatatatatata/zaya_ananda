"use client";

import { Coverflow3D } from "./Coverflow3D";
import { ServiceCard } from "./ServiceCard";
import type { CmsItem } from "@/lib/types";

/** Энергийн заслын жагсаалт — шууд удирдлагатай, тэгш байрлалтай картууд. */
export function ServiceCoverflow({ items }: { items: CmsItem[] }) {
  return (
    <Coverflow3D
      items={items}
      getKey={(it) => it.id}
      renderItem={(it) => <ServiceCard item={it} />}
      cardWidthClassName="w-[18rem] sm:w-[21rem]"
      flat
      autoPlay={false}
    />
  );
}
