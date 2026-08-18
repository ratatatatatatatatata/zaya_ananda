import type { HeroSlot } from "@/lib/hero-slots";

/** Сайтын үндсэн цэс — Header болон админы «Цэс» хэсэгт хамтад нь ашиглана.
 *  `slot` нь тухайн хуудасны толгойн дэвсгэрийн түлхүүр (байхгүй бол дэвсгэргүй хуудас). */
export const NAV_LINKS: { href: string; key: string; slot?: HeroSlot }[] = [
  { href: "/", key: "nav.home", slot: "home" },
  { href: "/services", key: "nav.services", slot: "services" },
  { href: "/courses", key: "nav.courses", slot: "courses" },
  { href: "/ayalal", key: "nav.journey", slot: "ayalal" },
  { href: "/merge", key: "nav.merge", slot: "merge" },
  { href: "/shop", key: "nav.shop", slot: "shop" },
  { href: "/gift", key: "nav.gift", slot: "gift" },
  { href: "/about", key: "nav.about", slot: "about" },
];

/** Цэсэнд байхгүй ч дэвсгэртэй хэсгүүд */
export const EXTRA_HERO_SLOTS: { slot: HeroSlot; label: string }[] = [
  { slot: "item", label: "Дэлгэрэнгүй хуудас (бүтээгдэхүүн, сургалт)" },
  { slot: "band", label: "Нүүр хуудасны дундах ишлэлийн зурвас" },
  { slot: "resources", label: "Гэгээрлийн зам" },
  { slot: "account", label: "Хувийн булан (профайл)" },
];
