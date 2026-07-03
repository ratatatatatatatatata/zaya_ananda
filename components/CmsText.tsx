"use client";

import { useI18n } from "@/lib/i18n";
import { locText, type CmsI18n } from "@/lib/cms-i18n";
import { catLabel } from "@/data/cms-taxonomy";

/** Админы оруулсан контентын текстийг идэвхтэй хэлээр харуулна (орчуулга байхгүй бол монгол). */
export function CmsText({ mn, i18n, field = "title" }: { mn?: string; i18n?: CmsI18n; field?: "title" | "summary" | "navLabel" }) {
  const { lang } = useI18n();
  return <>{locText(lang, mn, i18n, field)}</>;
}

/** Ангиллын нэрийг идэвхтэй хэлээр харуулна. */
export function CatLabel({ cat }: { cat?: string }) {
  const { lang } = useI18n();
  return <>{catLabel(cat, lang)}</>;
}
