export type ZurhaiCard = {
  emoji: string;
  title: string;
  desc: string;
  href: string;
  image?: string;
};

/** Homepage fallback cards when the admin has not saved custom astrology cards yet. */
export const DEFAULT_ZURHAI: ZurhaiCard[] = [
  { emoji: "🌅", title: "Өдрийн зурхай", desc: "Төрсөн огноогоороо өнөөдрийн сэтгэл санаа, ажил хэрэг, харилцаа, эрүүл мэндийн урьдчилсан тайллыг аваарай.", href: "#zurhai-daily" },
  { emoji: "🔢", title: "Тоон зурхайн матрикс", desc: "Хувь тавилангийн матриксаар үндсэн эрчим, сүнсний түвшин, далд чадамжаа тайлж үзнэ.", href: "/matrix" },
  { emoji: "🔮", title: "Бүтэн зурхай", desc: "Астрологи, тоон судлал, матрикс, Human Design — дөрвөн системийг нэгтгэсэн гүнзгий тайлал.", href: "/merge" },
];

export const NATAL_HREF = "#zurhai-natal";
export const NATAL_CARD: ZurhaiCard = {
  emoji: "🪐",
  title: "Натал зурхай",
  desc: "Төрсөн огноо, цаг, газраараа төрөх агшны Нар, Сар, гарагуудын ордыг тооцоолж, натал дугуй зургаа гаргаарай.",
  href: NATAL_HREF,
};
