export const NATAL_HREF = "#zurhai-natal";

export function isWealthReading(card: { title: string; href: string }): boolean {
  return /баял[а-яөүё]*\s*(?:зурхай)?|wealth|bayalag|baylag/iu.test(`${card.title} ${card.href}`);
}

export function isNatalReading(card: { title: string; href: string }): boolean {
  return card.href === NATAL_HREF || /астрологи|одон\s*орон|натал|natal|birth.chart/iu.test(card.title);
}
