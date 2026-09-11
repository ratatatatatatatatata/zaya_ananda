"use client";

import { CinematicLanding } from "@/components/cinematic/CinematicLanding";

export function HomeHero({ media }: { media?: { kind: "video" | "image"; url: string } }) {
  return <CinematicLanding media={media} />;
}
