"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { ServiceCard } from "./Cards";
import type { Service } from "@/lib/types";
import { cx } from "@/lib/format";

const filters = ["all", "onoshilgoo", "zovlogoo", "zasal", "byasalgal", "online", "tankhim"];

export function ServicesShowcase({ services }: { services: Service[] }) {
  const { t } = useI18n();
  const [active, setActive] = useState("all");
  const shown = active === "all" ? services : services.filter((s) => (s.tags ?? []).includes(active));

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button key={f} onClick={() => setActive(f)}
            className={cx("rounded-full px-4 py-2 text-sm font-semibold transition", active === f ? "bg-primary-grad text-white shadow-soft" : "border border-line bg-[#111B2D] text-ink/70 hover:border-primary-300 hover:text-primary-700")}>
            {t("filter." + f)}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((s) => <ServiceCard key={s.id} s={s} />)}
      </div>
    </div>
  );
}
