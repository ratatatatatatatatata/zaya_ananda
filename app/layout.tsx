import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import "./cinematic.css";
import { VisualTheme } from "@/components/VisualTheme";
import { Providers } from "@/components/Providers";
import { getSettingsCached } from "@/lib/repo";
import { DEFAULT_LOGO_SRC } from "@/components/Logo";
import { Header } from "@/components/Header";
import { FooterGate } from "@/components/FooterGate";
import { CosmicBackdrop } from "@/components/CosmicBackdrop";
import { Interactions } from "@/components/Interactions";
import { PromoModal } from "@/components/PromoModal";
import { BottomNav } from "@/components/BottomNav";
import { siteConfig } from "@/data/content";
import { pick } from "@/lib/i18n-core";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name + " — " + pick(siteConfig.tagline, "mn"),
    template: "%s — " + siteConfig.name,
  },
  description: pick(siteConfig.description, "mn"),
  keywords: ["далд ухамсар", "энерги", "медитаци", "meditation", "энерги засал", "명상", "瞑想", "冥想"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://zaya-ananda.vercel.app"),
  alternates: { canonical: "/" },
  // Олон нийтийн сүлжээнд хуваалцахад харагдах карт (OpenGraph / Twitter)
  openGraph: {
    type: "website",
    locale: "mn_MN",
    siteName: siteConfig.name,
    title: siteConfig.name + " — " + pick(siteConfig.tagline, "mn"),
    description: pick(siteConfig.description, "mn"),
    images: [{ url: "/video/meditation.jpg", width: 1280, height: 720, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: pick(siteConfig.description, "mn"),
    images: ["/video/meditation.jpg"],
  },
  robots: { index: true, follow: true },
};

/** Байгууллагын бүтэцлэгдсэн өгөгдөл — Google-ийн мэдээллийн самбарт зориулав */
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "HealthAndBeautyBusiness"],
  name: siteConfig.name,
  description: pick(siteConfig.description, "mn"),
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://zaya-ananda.vercel.app",
  telephone: "+976-7202-2002",
  email: "zayasanandacentre@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Хан-Уул дүүрэг, 15-р хороо, Махатма Ганди гудамж",
    addressLocality: "Улаанбаатар",
    postalCode: "17010",
    addressCountry: "MN",
  },
  openingHours: "Mo-Sa 09:00-19:00",
  areaServed: "MN",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettingsCached();
  const logoSrc = settings.logo?.trim() || DEFAULT_LOGO_SRC;
  return (
    <html lang="mn">
      <head>
        {!logoSrc.startsWith("data:") && <link rel="preload" as="image" href={logoSrc} fetchPriority="high" />}
        <Script id="chatling-config" strategy="beforeInteractive">
          {`window.chtlConfig = { chatbotId: "4876436798" };`}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {/* Manrope + Lora өөрсдийн сервер дээрээс (public/fonts) — гуравдагч талын
            render-blocking хүсэлтгүй, кирилл бүрэн дэмжинэ. app/fonts.css-ийг үз. */}
        <link rel="preload" as="font" type="font/woff2" href="/fonts/manrope-cyrillic-400-normal.woff2" crossOrigin="anonymous" />
        <link rel="preload" as="font" type="font/woff2" href="/fonts/manrope-cyrillic-600-normal.woff2" crossOrigin="anonymous" />
        <link rel="preload" as="font" type="font/woff2" href="/fonts/lora-cyrillic-600-normal.woff2" crossOrigin="anonymous" />
        <meta name="theme-color" content="#FAF7F0" />
      </head>
      <body className="min-h-screen">
        <Script
          id="chtl-script"
          src="https://chatling.ai/js/embed.js"
          data-id="4876436798"
          strategy="afterInteractive"
        />
        <Providers>
          <VisualTheme />
          <CosmicBackdrop />
          <div className="relative z-10 flex min-h-screen flex-col">
            <Header logoSrc={logoSrc} />
            <main className="flex-1">{children}</main>
            <FooterGate />
            <div className="about-layout-spacer h-20 lg:hidden" aria-hidden />
          </div>
          <PromoModal />
          <Interactions />
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
