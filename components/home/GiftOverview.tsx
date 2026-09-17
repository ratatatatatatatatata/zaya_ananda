import type { CmsItem } from "@/lib/types";
import { MediaLibrary } from "./MediaLibrary";

export function GiftOverview({ items }: { items: CmsItem[] }) {
  return <MediaLibrary items={items} categorized />;
}
