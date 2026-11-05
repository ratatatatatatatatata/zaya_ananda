"use client";

import dynamic from "next/dynamic";

/** Зурхайн самбарууд зөвхөн хэрэглэгч тухайн тойргийг дарахад л хэрэгтэй тул
 *  тэдгээрийн кодыг (≈75KB эх код + astro тооцоолол) нүүр хуудасны анхны ачаалалд оруулахгүй. */
const loading = () => <p className="py-10 text-center text-muted" aria-live="polite">…</p>;

export const LazyMergeToorog = dynamic(() => import("@/components/MergeToorog").then(m => m.MergeToorog), { ssr: false, loading });
export const LazyNatalChart = dynamic(() => import("@/components/zurhai/NatalChart").then(m => m.NatalChart), { ssr: false, loading });
export const LazyInlineDestinyMatrix = dynamic(() => import("@/components/matrix/InlineDestinyMatrix").then(m => m.InlineDestinyMatrix), { ssr: false, loading });
