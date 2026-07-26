import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { FooterGate } from "@/components/FooterGate";
import { CosmicBackdrop } from "@/components/CosmicBackdrop";
import { Interactions } from "@/components/Interactions";
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <head>
        {/* Manrope + Lora өөрсдийн сервер дээрээс (public/fonts) — гуравдагч талын
            render-blocking хүсэлтгүй, кирилл бүрэн дэмжинэ. app/fonts.css-ийг үз. */}
        <link rel="preload" as="font" type="font/woff2" href="/fonts/manrope-cyrillic-400-normal.woff2" crossOrigin="anonymous" />
        <link rel="preload" as="font" type="font/woff2" href="/fonts/manrope-cyrillic-600-normal.woff2" crossOrigin="anonymous" />
        <link rel="preload" as="font" type="font/woff2" href="/fonts/lora-cyrillic-600-normal.woff2" crossOrigin="anonymous" />
        <meta name="theme-color" content="#FAF7F0" />
      </head>
      <body className="min-h-screen">
        <Providers>
          <CosmicBackdrop />
          <div className="relative z-10 flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <FooterGate />
            <div className="h-20 lg:hidden" aria-hidden />
          </div>
          <Interactions />
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
