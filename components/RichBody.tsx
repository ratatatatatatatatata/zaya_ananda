"use client";

import { useI18n } from "@/lib/i18n";
import { locText, type CmsI18n } from "@/lib/cms-i18n";

/** Rich text (HTML) эсвэл энгийн текстийг идэвхтэй хэлээр зөв харуулна. */
export function RichBody({ html, i18n, className = "" }: { html: string; i18n?: CmsI18n; className?: string }) {
  const { lang } = useI18n();
  const text = locText(lang, html, i18n, "body");
  const isHtml = /<[a-z][\s\S]*>/i.test(text);
  if (isHtml) return <div className={"rich-body " + className} dangerouslySetInnerHTML={{ __html: text }} />;
  return <div className={"whitespace-pre-line " + className}>{text}</div>;
}
