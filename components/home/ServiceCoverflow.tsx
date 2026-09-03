"use client";

import { Coverflow3D } from "./Coverflow3D";
import { ServiceCard } from "./ServiceCard";
import type { CmsItem } from "@/lib/types";

/** Энергийн заслын жагсаалт — төвийн карт тод, хоёр тал нь гүн рүү орсон 3D coverflow. */
export function ServiceCoverflow({ items }: { items: CmsItem[] }) {
  return (
    <Coverflow3D
      items={items}
      getKey={(it) => it.id}
      renderItem={(it) => <ServiceCard item={it} />}
      cardWidthClassName="w-[18rem] sm:w-[21rem]"
      cinematic
    />
  );
}
