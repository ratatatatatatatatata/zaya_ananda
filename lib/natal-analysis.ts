import { type NatalChart, signOf } from "./astro";
import { ASPECT_THEMES } from "../data/natal-interpretations";

export const angleDistance = (a: number, b: number) => Math.abs(((a - b + 540) % 360) - 180);

export function natalAspects(chart: NatalChart) {
  const aspects = [];
  for (let i = 0; i < chart.planets.length; i++) {
    for (let j = i + 1; j < chart.planets.length; j++) {
      const a = chart.planets[i], b = chart.planets[j];
      // Unknown birth time makes lunar aspects particularly uncertain.
      if (!chart.timeKnown && (a.key === "moon" || b.key === "moon")) continue;
      const separation = angleDistance(a.lon, b.lon);
      const aspect = ASPECT_THEMES.find(item => Math.abs(separation - item.angle) <= item.orb);
      if (aspect) aspects.push({ a, b, ...aspect, separation, deviation: Math.abs(separation - aspect.angle) });
    }
  }
  return aspects.sort((a, b) => a.deviation - b.deviation);
}

export function chartClusters(chart: NatalChart) {
  return Array.from({ length: 12 }, (_, i) => ({
    sign: signOf(i * 30), planets: chart.planets.filter(p => Math.floor(p.lon / 30) === i && (chart.timeKnown || p.key !== "moon")),
  })).filter(group => group.planets.length >= 3);
}
