"use client";
import { HomeDetailLink as Link } from "@/components/home/HomeDetails";
import { formatMNT } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { locText } from "@/lib/cms-i18n";
import { catLabel } from "@/data/cms-taxonomy";
import { CategoryGlyph } from "./CategoryGlyph";
import { themeFor } from "@/data/theme-map";
import type { CmsItem } from "@/lib/types";
import styles from "./CourseCatalogCard.module.css";

export function CourseCatalogCard({ item }: { item: CmsItem }) {
  const { lang, tl } = useI18n();
  const title = locText(lang, item.title, item.i18n, "title");
  const summary = locText(lang, item.summary, item.i18n, "summary");
  const theme = themeFor(item.kind, item.category);
  const modes: Record<string, string> = { online: "Онлайн сургалт", tankhim: "Танхимын сургалт", both: "Онлайн + Танхим" };
  return <Link href={`/item/${item.id}`} className={styles.card}>
    <div className={styles.media}>
      {item.image ? <img src={item.image} alt="" loading="lazy" /> : <div className={styles.placeholder}>
        <CategoryGlyph glyph={theme.glyph} from={theme.from} to={theme.to} className="h-16 w-16" id={`catalog-${item.id}`} />
      </div>}
    </div>
    <div className={styles.body}>
      <p className={styles.category}>{catLabel(item.category, lang) || tl("Сургалт")}</p>
      <h3>{title}</h3>
      {summary && <p className={styles.summary}>{summary}</p>}
      {typeof item.videoLessons === "number" && <p className={styles.count}>{item.videoLessons} {tl("видео хичээл")}</p>}
      <div className={styles.footer}>
        <span>{item.mode && tl(modes[item.mode] || item.mode)}</span>
        {typeof item.price === "number" && <strong>{formatMNT(item.price)}</strong>}
      </div>
    </div>
  </Link>;
}
