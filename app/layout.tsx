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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=Lora:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Manrope:wght@400;500;600;700;800&family=Noto+Sans+KR:wght@400;500;700&family=Noto+Sans+JP:wght@400;500;700&family=Noto+Sans+SC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
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
