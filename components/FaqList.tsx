"use client";

import { useState } from "react";
import { Tr } from "./T";
import type { Faq } from "@/lib/types";

export function FaqList({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl divide-y divide-line overflow-hidden rounded-3xl border border-line bg-[#1A2742] shadow-card">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-[1.08rem] font-semibold text-ink transition hover:bg-primary-50/50"
            >
              <span><Tr v={f.q} /></span>
              <span className="shrink-0 text-2xl leading-none text-primary-600">{isOpen ? "−" : "+"}</span>
            </button>
            <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: isOpen ? 420 : 0 }}>
              <p className="px-6 pb-5 text-[1.04rem] leading-relaxed text-muted"><Tr v={f.a} /></p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
