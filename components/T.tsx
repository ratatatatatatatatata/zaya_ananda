"use client";

import { useI18n } from "@/lib/i18n";
import type { L } from "@/lib/types";

export function T({ k }: { k: string }) {
  const { t } = useI18n();
  return <>{t(k)}</>;
}

export function Tr({ v }: { v: L | undefined }) {
  const { tr } = useI18n();
  return <>{tr(v)}</>;
}
