"use client";

import { CinematicLanding } from "@/components/cinematic/CinematicLanding";

export function HomeHero({ media, stats }: { media?: { kind: "video" | "image"; url: string }; stats: string[] }) {
  return <CinematicLanding media={media} stats={stats} />;
}
