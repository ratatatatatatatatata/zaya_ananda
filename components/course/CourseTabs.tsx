"use client";

import { useState, type ReactNode } from "react";

type TabId = "overview" | "practice" | "resources" | "comments";

/** Хичээлийн дэлгэрэнгүй хуудасны Overview/Practice/Additional resources/Comments таб. */
export function CourseTabs({ practiceCount, overview, practice, resources, comments }: {
  practiceCount: number;
  overview: ReactNode;
  practice: ReactNode;
  resources: ReactNode;
  comments: ReactNode;
}) {
  const [tab, setTab] = useState<TabId>("overview");
  const tabs: { id: TabId; label: string }[] = [
    { id: "overview", label: "Тойм" },
    { id: "practice", label: `Хичээлүүд (${practiceCount})` },
    { id: "resources", label: "Нэмэлт материал (0)" },
    { id: "comments", label: "Сэтгэгдэл" },
  ];
  return (
    <div className="mt-8">
      <div className="flex gap-6 overflow-x-auto border-b border-line">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            type="button"
            onClick={() => setTab(tb.id)}
            className={
              "shrink-0 whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-semibold transition " +
              (tab === tb.id ? "border-primary-600 text-primary-700" : "border-transparent text-muted hover:text-ink")
            }
          >
            {tb.label}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {tab === "overview" && overview}
        {tab === "practice" && practice}
        {tab === "resources" && resources}
        {tab === "comments" && comments}
      </div>
    </div>
  );
}
