"use client";
import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { ContactSection } from "./ContactSection";

export function FooterGate() {
  const pathname = usePathname();
  const publicPage = !/^\/(admin|account|login|register|reset|cart|checkout|learn)(\/|$)/.test(pathname);
  return <>{publicPage && <ContactSection key={pathname} />}<Footer /></>;
}
