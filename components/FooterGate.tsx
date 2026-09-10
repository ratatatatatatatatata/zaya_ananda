"use client";
import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export function FooterGate() {
  const pathname = usePathname();
  if (pathname === "/about") return null;
  return <Footer />;
}
