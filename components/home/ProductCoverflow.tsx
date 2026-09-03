"use client";

import { Coverflow3D } from "./Coverflow3D";
import { CmsCard } from "../CmsCard";
import { TiltCard } from "../motion/TiltCard";
import type { CmsItem } from "@/lib/types";

/** Энергийн хамгаалалтын бүтээгдэхүүн — Энергийн заслын карттай адилхан 3D coverflow систем ашиглана. */
export function ProductCoverflow({ items }: { items: CmsItem[] }) {
  // "Чулуунууд" ангилал доор нь тусдаа (StoneReading) харагддаг тул энд давхардуулахгүй.
  const shown = items.filter((i) => i.category !== "Чулуунууд");
  if (shown.length === 0) return null;
  return (
    <Coverflow3D
      items={shown}
      getKey={(it) => it.id}
      renderItem={(it) => <TiltCard max={6} className="h-full"><CmsCard item={it} /></TiltCard>}
      cardWidthClassName="w-[16rem] sm:w-[18rem]"
      flat
    />
  );
}
