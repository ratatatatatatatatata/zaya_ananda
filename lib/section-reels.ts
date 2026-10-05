export const REEL_SECTIONS = {
  services: "Энергийн засал",
  shop: "Энергийн хамгаалалт",
  ayalal: "Сүнслэг аялал",
} as const;
export type ReelSection = keyof typeof REEL_SECTIONS;
export const reelCategory = (section: ReelSection) => `reel:${section}`;
export const isSectionReel = (item: { category?: string }) => Object.keys(REEL_SECTIONS).some(section => item.category === `reel:${section}`);
