import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://zaya-ananda.vercel.app";

/** Хайлтын роботын дүрэм — хувийн болон админ хэсгийг индексжүүлэхгүй. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/account", "/checkout", "/cart", "/reset", "/learn/"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
