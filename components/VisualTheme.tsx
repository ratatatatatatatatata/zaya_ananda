"use client";

import { usePathname } from "next/navigation";

/** SSR-visible theme marker. Portalled dialogs inherit the same body tokens. */
export function VisualTheme() {
  const pathname = usePathname();
  return pathname.startsWith("/admin") ? null : <span hidden data-cinematic-theme aria-hidden="true" />;
}
