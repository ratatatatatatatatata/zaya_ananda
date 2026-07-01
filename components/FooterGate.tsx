"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export function FooterGate() {
  const pathname = usePathname();
  if (pathname === "/") return null;   // homepage = pure cinematic hero, no footer
  return <Footer />;
}
