"use client";

import { Coverflow3D } from "./Coverflow3D";
import { ServiceCard } from "./ServiceCard";
import type { CmsItem } from "@/lib/types";

/** Энергийн заслын жагсаалт — 3D coverflow систем ашиглана. */
export function ServiceCoverflow({ items }: { items: CmsItem[] }) {
  return (
    <Coverflow3D
      items={items}
      getKey={(it) => it.id}
      renderItem={(it) => <ServiceCard item={it} />}
      cardWidthClassName="w-[19rem] sm:w-[21rem]"
    />
  );
}
