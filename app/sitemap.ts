import type { MetadataRoute } from "next";
import { listCmsCached, listPagesCached } from "@/lib/repo";
import { JOURNEYS } from "@/data/journeys";

export const revalidate = 3600;

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://zaya-ananda.vercel.app";

/** Сайтын бүтцийн зураглал — хайлтын систем бүх хуудсыг олох боломжтой болно. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths: { p: string; pr: number; ch: "daily" | "weekly" | "monthly" }[] = [
    { p: "", pr: 1, ch: "daily" },
    { p: "/services", pr: 0.9, ch: "weekly" },
    { p: "/courses", pr: 0.9, ch: "weekly" },
    { p: "/ayalal", pr: 0.9, ch: "weekly" },
    { p: "/shop", pr: 0.9, ch: "weekly" },
    { p: "/resources", pr: 0.8, ch: "weekly" },
    { p: "/teachers", pr: 0.7, ch: "weekly" },
    { p: "/mood", pr: 0.6, ch: "monthly" },
    { p: "/gift", pr: 0.7, ch: "weekly" },
    { p: "/about", pr: 0.7, ch: "monthly" },
    { p: "/matrix", pr: 0.6, ch: "monthly" },
    { p: "/toorog", pr: 0.6, ch: "monthly" },
    { p: "/merge", pr: 0.8, ch: "weekly" },
    { p: "/login", pr: 0.3, ch: "monthly" },
    { p: "/register", pr: 0.3, ch: "monthly" },
  ];

  for (const j of JOURNEYS) staticPaths.push({ p: "/ayalal/" + j.slug, pr: 0.8, ch: "monthly" });

  const now = new Date();
  const out: MetadataRoute.Sitemap = staticPaths.map((s) => ({
    url: BASE + s.p,
    lastModified: now,
    changeFrequency: s.ch,
    priority: s.pr,
  }));

  try {
    const kinds = ["service", "course", "product", "resource", "free"] as const;
    for (const k of kinds) {
      const items = await listCmsCached(k);
      for (const i of items) {
        out.push({
          url: `${BASE}/item/${i.id}`,
          lastModified: i.createdAt ? new Date(i.createdAt) : now,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
    const pages = await listPagesCached();
    for (const pg of pages) {
      out.push({ url: `${BASE}/p/${pg.id}`, lastModified: now, changeFrequency: "monthly", priority: 0.5 });
    }
  } catch {
    // Өгөгдлийн сан унтарсан ч статик хуудсууд буцаана
  }

  return out;
}
